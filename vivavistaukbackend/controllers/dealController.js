const Deal = require("../models/Deal");
const mongoose = require("mongoose");
const Airport = require("../models/Airport");
const Hotel = require("../models/Hotel");
const Destination = require("../models/Destination");
const IMAGE_STORAGE = process.env.IMAGE_STORAGE || "local";
const { uploadToS3, deleteFromS3 } = require("../middleware/imageUpload");

// Maximum number of featured deals allowed
const MAX_FEATURED_DEALS = 21;

// Helper function to manage featured deals count
const manageFeaturedDealsLimit = async (newDealId) => {
  try {
    // Count current featured deals
    const featuredCount = await Deal.countDocuments({ isFeatured: true });
    
    console.log(`Current featured deals count: ${featuredCount}`);
    
    // If we're over the limit, remove the oldest featured deal
    if (featuredCount > MAX_FEATURED_DEALS) {
      console.log(`Exceeded limit of ${MAX_FEATURED_DEALS} featured deals. Removing oldest.`);
      
      // Find the oldest featured deal (excluding the newly added one)
      const oldestFeatured = await Deal.findOne({
        isFeatured: true,
        _id: { $ne: newDealId } // Exclude the new deal
      }).sort({ updatedAt: 1 }); // Sort by oldest first
      
      if (oldestFeatured) {
        console.log(`Removing featured status from deal: ${oldestFeatured._id} (${oldestFeatured.title})`);
        
        // Update the oldest deal to not be featured
        await Deal.findByIdAndUpdate(oldestFeatured._id, {
          isFeatured: false
        });
        
        return {
          success: true,
          removedDeal: oldestFeatured._id,
          message: `Removed featured status from deal: ${oldestFeatured.title}`
        };
      }
    }
    
    return { 
      success: true,
      message: "No need to remove any featured deals"
    };
  } catch (error) {
    console.error("Error managing featured deals limit:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ✅ Create a New Deal with Image Upload
const createDeal = async (req, res) => {
  try {
    const parsedData = JSON.parse(req.body.data);
    const {
      title,
      description,
      availableCountries,
      destination,
      destinations = [],
      prices,
      hotels,
      holidaycategories,
      itinerary = [],
      boardBasis,
      isTopDeal,
      isHotdeal,
      isFeatured,
      distanceToCenter,
      distanceToBeach,
      days,
      whatsIncluded,
      exclusiveAdditions,
      termsAndConditions,
      rooms,
      guests,
      tag,
      LowDeposite,
      priceswitch,
    } = parsedData;

    // Basic validations
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }
    if (!Array.isArray(availableCountries) || !availableCountries.length) {
      return res
        .status(400)
        .json({ message: "At least one country must be selected." });
    }
    if ((!destination || !mongoose.Types.ObjectId.isValid(destination)) && 
        (!Array.isArray(destinations) || destinations.length === 0)) {
      return res
        .status(400)
        .json({ message: "At least one destination must be selected." });
    }
    if (!boardBasis || !mongoose.Types.ObjectId.isValid(boardBasis)) {
      return res
        .status(400)
        .json({ message: "A valid board basis must be selected." });
    }
    if (!Array.isArray(hotels) || !hotels.length) {
      return res
        .status(400)
        .json({ message: "At least one hotel must be added." });
    }
    if (!Array.isArray(prices) || !prices.length) {
      return res
        .status(400)
        .json({ message: "At least one price entry is required." });
    }

    // Validate itinerary items
    const cleanItinerary = itinerary.filter(
      (item) => item.title && item.description
    );

    // Validate price entries
    for (const [index, priceObj] of prices.entries()) {
      const { country, startdate, enddate, hotel, price } = priceObj;
      if (!country) {
        return res
          .status(400)
          .json({ message: `Price #${index + 1}: country is required.` });
      }
      if (!startdate || !enddate) {
        return res.status(400).json({
          message: `Price #${index + 1}: startdate and enddate are required.`,
        });
      }
      if (!hotel || !mongoose.Types.ObjectId.isValid(hotel)) {
        return res.status(400).json({
          message: `Price #${index + 1}: a valid hotel ID is required.`,
        });
      }
      if (!price) {
        return res.status(400).json({
          message: `Price #${index + 1}: price is required.`,
        });
      }
    }

    // Extract image URLs
    let imageUrls = [];
    if (req.files && req.files.length) {
      if (process.env.IMAGE_STORAGE === "s3") {
        imageUrls = await Promise.all(req.files.map((f) => uploadToS3(f)));
      } else {
        imageUrls = req.files.map((f) => `/uploads/${f.filename}`);
      }
    }

    // Create deal
    const newDeal = new Deal({
      title,
      description,
      images: imageUrls,
      availableCountries,
      destination,
      destinations,
      holidaycategories,
      hotels,
      boardBasis,
      rooms,
      guests,
      days,
      distanceToCenter,
      distanceToBeach,
      whatsIncluded,
      exclusiveAdditions,
      termsAndConditions,
      tag,
      LowDeposite,
      priceswitch,
      itinerary: cleanItinerary,
      prices,
      isTopDeal,
      isHotdeal,
      isFeatured,
    });

    await newDeal.save();

    // Link to single destination (legacy support)
    if (destination && mongoose.Types.ObjectId.isValid(destination)) {
      await Destination.findByIdAndUpdate(
        destination,
        { $addToSet: { deals: newDeal._id } },
        { new: true }
      );
    }
    
    // Link to multiple destinations
    if (Array.isArray(destinations) && destinations.length > 0) {
      await Promise.all(
        destinations.map(destId => 
          Destination.findByIdAndUpdate(
            destId,
            { $addToSet: { deals: newDeal._id } },
            { new: true }
          )
        )
      );
    }
    
    // If this is a featured deal, manage the featured deals limit
    let featuredResult = { success: true };
    if (isFeatured) {
      featuredResult = await manageFeaturedDealsLimit(newDeal._id);
    }

    return res
      .status(201)
      .json({ 
        message: "Deal created successfully", 
        deal: newDeal,
        featuredResult
      });
  } catch (error) {
    console.error("CreateDeal Error:", error);
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Deals (Restricted to User's Selected Country)
const getAllDeals = async (req, res) => {
  try {
    const {
      country,
      airport,
      fromdate,
      todate,
      minPrice,
      destination,
      maxPrice,
      boardBasis,
      rating,
      holidayType,
      facilities,
      rooms,
      guests,
      sort,
      search,
    } = req.query;

    let query = {};

    // ✅ Filter by Country
    if (country) query.availableCountries = country;
    if (destination) query["destination"] = destination;
    // ✅ Filter by Airport
if (airport) {
  const airportArray = Array.isArray(airport) ? airport : [airport];

  // Step 1: Find matching airports by code
  const airportDocs = await Airport.find({
    code: { $in: airportArray },
  }).select("_id");

  // Step 2: Extract the _id values
  const airportIds = airportDocs.map((doc) => doc._id);

  // Step 3: Apply filter
  query["prices"] = {
    $elemMatch: {
      airport: {
        $in: airportIds,
      },
    },
  };
}

    // ✅ Filter by Date Range
    if (fromdate && todate) {
      query["prices"] = {
        $elemMatch: {
          startdate: { $gte: new Date(fromdate), $lte: new Date(todate) },
        },
      };
    }
    // ✅ Filter by Price Range
    if (minPrice || maxPrice) {
      query["prices.price"] = {};
      if (minPrice) query["prices.price"].$gte = Number(minPrice);
      if (maxPrice) query["prices.price"].$lte = Number(maxPrice);
    }

    // ✅ Filter by Board Basis
    if (boardBasis) query.boardBasis = boardBasis;

    // ✅ Filter by Rating
    if (rating) query["hotels.tripAdvisorRating"] = { $gte: Number(rating) };

    // ✅ Filter by Holiday Type
    if (holidayType)
      query["hotels.facilities"] = { $in: holidayType.split(",") };

    // ✅ Filter by Facilities
    if (facilities)
      query["hotels.facilities"] = { $all: facilities.split(",") };

    // ✅ Search by Hotel Name
    if (search) query["hotels.name"] = { $regex: search, $options: "i" };

    // ✅ Filter by Rooms & Guests
    if (rooms) query.rooms = Number(rooms);
    if (guests) query.guests = Number(guests);

    // ✅ Apply Sorting
    // let sortOption = {};
    // if (sort === "lowest-price") sortOption["prices.price"] = 1;
    // if (sort === "highest-price") sortOption["prices.price"] = -1;
    // if (sort === "best-rating") sortOption["hotels.tripAdvisorRating"] = -1;
    let sortOption = { "prices.price": 1 };

    if (sort === "highest-price") {
      sortOption = { "prices.price": -1 };
    } else if (sort === "best-rating") {
      sortOption = { "hotels.tripAdvisorRating": -1 };
    }

    // ✅ Fetch Deals with Filters & Sorting
    let deals = await Deal.find(query)
      .populate("destination")
      .populate("boardBasis", "name")
      .populate("hotels", "name tripAdvisorRating facilities location images")
      .populate({
        path: "prices.hotel",
        select: "name tripAdvisorRating tripAdvisorReviews",
      })
      .select(
        "title tag priceswitch boardBasis LowDeposite availableCountries description rooms guests prices distanceToCenter distanceToBeach days images isTopDeal isHotdeal isFeatured holidaycategories itinerary whatsIncluded exclusiveAdditions termsAndConditions"
      )
      .sort(sortOption)
      .limit(50) // Limit to 50 results for performance
      .lean();
   if (!deals.length) {
     deals = await Deal.find({})
       .populate("destination")
       .populate("boardBasis", "name")
       .populate("hotels", "name tripAdvisorRating facilities location images")
       .populate({
         path: "prices.hotel",
         select: "name tripAdvisorRating tripAdvisorReviews",
       })
       .select(
         "title tag priceswitch boardBasis LowDeposite availableCountries description rooms guests prices distanceToCenter distanceToBeach days images isTopDeal isHotdeal isFeatured holidaycategories itinerary whatsIncluded exclusiveAdditions termsAndConditions"
       )
       .sort(sortOption)
       .limit(50)
       .lean();
   }
    console.log("🚀 ~ getAllDeals ~ deals:", deals);
    // ✅ Filter flight details based on the selected airport
    // deals = deals
    //   .map((deal) => {
    //     const relevantPrices = deal.prices.filter((p) => {
    //       const matchAirport = !airport || p.airport === airport;
    //       // const matchDate = (!fromdate || new Date(p.date) >= new Date(fromdate)) &&
    //       //                   (!enddate || new Date(p.date) <= new Date(enddate));
    //       return matchAirport;
    //     });

    //     return relevantPrices.length > 0
    //       ? { ...deal, prices: relevantPrices }
    //       : null;
    //   })
    //   .filter(Boolean);

    // ✅ Sort prices inside each deal
    deals = deals.map((deal) => {
      if (sort === "highest-price") {
        deal.prices.sort((a, b) => b.price - a.price);
      } else {
        deal.prices.sort((a, b) => a.price - b.price);
      }
      return deal;
    });

    console.log("🚀 ~ getAllDeals ~ deals:", deals);
    res.json(deals);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Get All Deals for Admin
const getAllDealsAdmin = async (req, res) => {
  try {
    const deals = await Deal.find()
      .sort({ createdAt: -1 })
      .populate("destination")
      .populate("destinations")
      .populate("hotels")
      .populate("boardBasis")
      .populate("prices.hotel")
      .populate("prices.airport")
      .populate("holidaycategories");

    res.json(deals);
  } catch (error) {
    console.error("Error fetching all deals for admin:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get a Single Deal (Only If Available in User's Selected Country)
const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate("destination")
      .populate("destinations")
      .populate({
        path: "holidaycategories",
        select: "name",
      })
      .populate({
        path: "boardBasis",
        select: "name",
      })
      .populate({
        path: "hotels",
        select: "name stars tripAdvisorRating facilities location images",
      })
      .populate({
        path: "prices.hotel",
        select: "name stars tripAdvisorRating facilities location",
      })
      .populate({
        path: "prices.airport",
        select: "name code",
      });

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    // ✨ Step 1: Expand prices if airport field is an array
    const expandedPrices = [];
    for (const price of deal.prices) {
      if (Array.isArray(price.airport)) {
        for (const airport of price.airport) {
          expandedPrices.push({
            ...price.toObject(), // important to clone the Mongoose document
            airport: airport, // set single airport
          });
        }
      } else {
        expandedPrices.push(price.toObject ? price.toObject() : price);
      }
    }
    deal.prices = expandedPrices; // replace deal.prices with expanded version

    // ✨ Step 2: Now apply country restriction if user is NOT admin
    if (!req.user || req.user.role !== "admin") {
      const userCountry = req.session.country || "UK";
      if (!deal.availableCountries.includes(userCountry)) {
        return res.status(403).json({
          message: "This deal is not available in your selected country.",
        });
      }

      const countryPrices = deal.prices.filter((p) => {
        const startDate = new Date(p.startdate);
        return p.country === userCountry && startDate > threeDaysFromNow;
      });

      deal.prices = countryPrices.length > 0 ? countryPrices : [];
    }

    res.json(deal);
  } catch (error) {
    console.error("Error fetching deal by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a Deal (Admin Only)
const updateDeal = async (req, res) => {
  try {
    const dealId = req.params.id;
    const deal = await Deal.findById(dealId);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    const parsedData = JSON.parse(req.body.data);
    // Validate availableCountries if provided
    if (
      req.body.availableCountries &&
      (!Array.isArray(req.body.availableCountries) ||
        req.body.availableCountries.length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "At least one country must be selected." });
    }

    // Validate destination and destinations if provided
    if (
      (parsedData.destination && !mongoose.Types.ObjectId.isValid(parsedData.destination)) &&
      (!Array.isArray(parsedData.destinations) || parsedData.destinations.length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "At least one valid destination must be selected." });
    }

    // Validate boardBasis if provided
    if (
      parsedData.boardBasis &&
      !mongoose.Types.ObjectId.isValid(parsedData.boardBasis)
    ) {
      return res
        .status(400)
        .json({ message: "A valid board basis must be selected." });
    }

    // Extract image URLs from the request
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      if (IMAGE_STORAGE === "s3") {
        imageUrls = await Promise.all(
          req.files.map((file) => uploadToS3(file))
        );
      } else {
        imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      }
    }

    // Validate itinerary if provided
    let cleanedItinerary = [];
    if (parsedData.itinerary && Array.isArray(parsedData.itinerary)) {
      cleanedItinerary = parsedData.itinerary.filter((item) => {
        // keep only items where both title & description are non-empty strings
        return item.title?.trim() && item.description?.trim();
      });
    }
    // Prepare the updated data
    const updatedData = {
      ...parsedData,
      itinerary: cleanedItinerary,
      images:
        imageUrls.length > 0 ? [...deal.images, ...imageUrls] : deal.images, // Keep existing images if no new images
    };

    // Handle destination change (legacy single destination support)
    if (
      parsedData.destination &&
      parsedData.destination !== deal.destination?.toString()
    ) {
      console.log("Single destination changed. Updating references.");

      // Remove deal from old destination
      if (deal.destination) {
        await Destination.findByIdAndUpdate(deal.destination, {
          $pull: { deals: deal._id },
        });
        console.log("Removed from old destination:", deal.destination);
      }

      // Add deal to new destination
      await Destination.findByIdAndUpdate(parsedData.destination, {
        $addToSet: { deals: deal._id },
      });
      console.log("Added to new destination:", parsedData.destination);
    }
    
    // Handle multiple destinations update
    if (Array.isArray(parsedData.destinations)) {
      console.log("Multiple destinations changed. Updating references.");
      
      // Get existing destinations
      const existingDestinations = deal.destinations || [];
      
      // Find destinations to remove (destinations that were in the deal but not in the updated list)
      const destinationsToRemove = existingDestinations.filter(
        destId => !parsedData.destinations.includes(destId.toString())
      );
      
      // Find destinations to add (destinations that are in the updated list but not in the deal)
      const destinationsToAdd = parsedData.destinations.filter(
        destId => !existingDestinations.some(existing => existing.toString() === destId)
      );
      
      // Remove deal from old destinations
      await Promise.all(
        destinationsToRemove.map(destId =>
          Destination.findByIdAndUpdate(destId, {
            $pull: { deals: deal._id },
          })
        )
      );
      
      // Add deal to new destinations
      await Promise.all(
        destinationsToAdd.map(destId =>
          Destination.findByIdAndUpdate(destId, {
            $addToSet: { deals: deal._id },
          })
        )
      );
      
      console.log("Updated multiple destinations successfully");
    }

    console.log("Updating deal with data:", updatedData);

    // Check if deal is being marked as featured
    let featuredResult = { success: true };
    if (parsedData.isFeatured === true && !deal.isFeatured) {
      console.log(`Deal ${dealId} is being marked as featured. Managing featured deals limit.`);
      featuredResult = await manageFeaturedDealsLimit(dealId);
    }

    // Update the deal with the new data
    const updatedDeal = await Deal.findByIdAndUpdate(dealId, updatedData, {
      new: true,
      runValidators: true,
    });

    res.json({ 
      message: "Deal updated successfully", 
      deal: updatedDeal,
      featuredResult
    });
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDealImage = async (req, res) => {
  const { dealId } = req.params;
  const { imageUrl } = req.body;
  try {
    console.log(imageUrl);
    await deleteFromS3(imageUrl);

    // Remove image URL from MongoDB
    await Deal.findByIdAndUpdate(dealId, {
      $pull: { images: imageUrl },
    });
    console.log("Image deleted successfully !  !");
    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ✅ Delete a Deal (Admin Only)
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }
    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getDealsByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const deals = await Deal.find({ destination: destinationId })
      .populate("destination")
      .populate("hotels");

    res.json(deals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching deals by destination", error });
  }
};

// ✅ Search Deals with Filters (Airport, Destination, Date)
const searchDeals = async (req, res) => {
  try {
    const { airport, destination, date } = req.query;

    let query = {};

    // ✅ Filter by Airport
    if (airport) query["prices.airport"] = airport;

    // ✅ Filter by Destination (if provided)
    if (destination) {
      query["destination.name"] = { $regex: destination, $options: "i" };
    }

    // ✅ If Date is Provided, Ensure Availability (Future Feature)
    if (date) {
      // Placeholder for future availability filter (if dates are stored)
      console.log("Filtering deals for date:", date);
    }

    // ✅ Fetch Deals with Filters
    let deals = await Deal.find(query)
      .populate("destination", "name")
      .populate("hotels", "name tripAdvisorRating facilities location")
      .select("title prices boardBasis distanceToCenter distanceToBeach")
      .limit(50)
      .lean();

    // ✅ Filter Flight Details Based on Selected Airport
    deals = deals
      .map((deal) => {
        const relevantPrices = deal.prices.filter((p) => p.airport === airport);
        return relevantPrices.length > 0
          ? { ...deal, prices: relevantPrices }
          : null;
      })
      .filter(Boolean);

    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createDeal,
  getAllDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  getAllDealsAdmin,
  getDealsByDestination,
  searchDeals,
  deleteDealImage,
};
