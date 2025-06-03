const Deal = require("../models/Deal");
const mongoose = require("mongoose");
const Airport = require("../models/Airport");
const Hotel = require("../models/Hotel");

// Get all deals with basic info for price management
const getDealsForPriceManagement = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { tag: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const deals = await Deal.find(query)
      .select('title destination destinations tag prices')
      .populate('destination', 'name')
      .populate('destinations', 'name')
      .sort({ createdAt: -1 });

    // Transform the data to include price count
    const dealsWithPriceCount = deals.map(deal => ({
      _id: deal._id,
      title: deal.title,
      tag: deal.tag,
      destination: deal.destination,
      destinations: deal.destinations,
      priceCount: deal.prices.length
    }));

    res.json(dealsWithPriceCount);
  } catch (error) {
    console.error("Error fetching deals for price management:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all prices for a specific deal
const getDealPrices = async (req, res) => {
  try {
    const { dealId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return res.status(400).json({ message: "Invalid deal ID" });
    }

    const deal = await Deal.findById(dealId)
      .select('title destination destinations prices')
      .populate('destination', 'name')
      .populate('destinations', 'name')
      .populate('prices.hotel', 'name')
      .populate('prices.airport', 'name code');

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json({
      dealId: deal._id,
      dealTitle: deal.title,
      destination: deal.destination,
      destinations: deal.destinations,
      prices: deal.prices
    });
  } catch (error) {
    console.error("Error fetching deal prices:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new price for a deal
const createDealPrice = async (req, res) => {
  try {
    const { dealId } = req.params;
    const priceData = req.body;

    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return res.status(400).json({ message: "Invalid deal ID" });
    }

    // Validate required fields
    const { country, startdate, enddate, price, airport, hotel } = priceData;
    
    if (!country || !startdate || !enddate || !price || !airport?.length || !hotel) {
      return res.status(400).json({ 
        message: "Country, dates, price, airport, and hotel are required" 
      });
    }

    // Validate hotel exists
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    // Validate airports exist
    for (const airportId of airport) {
      if (!mongoose.Types.ObjectId.isValid(airportId)) {
        return res.status(400).json({ message: "Invalid airport ID" });
      }
      const airportExists = await Airport.findById(airportId);
      if (!airportExists) {
        return res.status(400).json({ message: "Airport not found" });
      }
    }

    // Create new price object
    const newPrice = {
      country,
      startdate: new Date(startdate),
      enddate: new Date(enddate),
      price: Number(price),
      airport,
      hotel,
      priceswitch: priceData.priceswitch || false,
      flightDetails: priceData.flightDetails || {
        outbound: {
          departureTime: "",
          arrivalTime: "",
          airline: "",
          flightNumber: ""
        },
        returnFlight: {
          departureTime: "",
          arrivalTime: "",
          airline: "",
          flightNumber: ""
        }
      }
    };

    // Add price to deal
    const deal = await Deal.findByIdAndUpdate(
      dealId,
      { $push: { prices: newPrice } },
      { new: true }
    ).populate('prices.hotel', 'name')
     .populate('prices.airport', 'name code');

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // Return the newly created price (last one in the array)
    const createdPrice = deal.prices[deal.prices.length - 1];

    res.status(201).json({
      message: "Price created successfully",
      price: createdPrice
    });
  } catch (error) {
    console.error("Error creating deal price:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a specific price in a deal
const updateDealPrice = async (req, res) => {
  try {
    const { dealId, priceId } = req.params;
    const priceData = req.body;

    if (!mongoose.Types.ObjectId.isValid(dealId) || !mongoose.Types.ObjectId.isValid(priceId)) {
      return res.status(400).json({ message: "Invalid deal ID or price ID" });
    }

    // Validate required fields
    const { country, startdate, enddate, price, airport, hotel } = priceData;
    
    if (!country || !startdate || !enddate || !price || !airport?.length || !hotel) {
      return res.status(400).json({ 
        message: "Country, dates, price, airport, and hotel are required" 
      });
    }

    // Validate hotel exists
    if (!mongoose.Types.ObjectId.isValid(hotel)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    // Validate airports exist
    for (const airportId of airport) {
      if (!mongoose.Types.ObjectId.isValid(airportId)) {
        return res.status(400).json({ message: "Invalid airport ID" });
      }
      const airportExists = await Airport.findById(airportId);
      if (!airportExists) {
        return res.status(400).json({ message: "Airport not found" });
      }
    }

    // Update price
    const deal = await Deal.findOneAndUpdate(
      { _id: dealId, "prices._id": priceId },
      {
        $set: {
          "prices.$.country": country,
          "prices.$.startdate": new Date(startdate),
          "prices.$.enddate": new Date(enddate),
          "prices.$.price": Number(price),
          "prices.$.airport": airport,
          "prices.$.hotel": hotel,
          "prices.$.priceswitch": priceData.priceswitch || false,
          "prices.$.flightDetails": priceData.flightDetails || {
            outbound: {
              departureTime: "",
              arrivalTime: "",
              airline: "",
              flightNumber: ""
            },
            returnFlight: {
              departureTime: "",
              arrivalTime: "",
              airline: "",
              flightNumber: ""
            }
          }
        }
      },
      { new: true }
    ).populate('prices.hotel', 'name')
     .populate('prices.airport', 'name code');

    if (!deal) {
      return res.status(404).json({ message: "Deal or price not found" });
    }

    // Find the updated price
    const updatedPrice = deal.prices.find(p => p._id.toString() === priceId);

    res.json({
      message: "Price updated successfully",
      price: updatedPrice
    });
  } catch (error) {
    console.error("Error updating deal price:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a specific price from a deal
const deleteDealPrice = async (req, res) => {
  try {
    const { dealId, priceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(dealId) || !mongoose.Types.ObjectId.isValid(priceId)) {
      return res.status(400).json({ message: "Invalid deal ID or price ID" });
    }

    const deal = await Deal.findByIdAndUpdate(
      dealId,
      { $pull: { prices: { _id: priceId } } },
      { new: true }
    );

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json({ message: "Price deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal price:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get dropdown data for price form
const getPriceFormData = async (req, res) => {
  try {
    const [hotels, airports] = await Promise.all([
      Hotel.find().select('name').sort({ name: 1 }),
      Airport.find().select('name code').sort({ name: 1 })
    ]);

    res.json({
      hotels,
      airports,
      countries: ["UK", "USA", "Canada"]
    });
  } catch (error) {
    console.error("Error fetching price form data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDealsForPriceManagement,
  getDealPrices,
  createDealPrice,
  updateDealPrice,
  deleteDealPrice,
  getPriceFormData
}; 