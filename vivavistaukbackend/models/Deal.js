const mongoose = require("mongoose");

const ItineraryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const DealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Image URLs
    availableCountries: [{ type: String, required: true }], // ['UK', 'USA', 'Canada']
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: false,
    },
    destinations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    }],
    holidaycategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Holiday",
      },
    ],
    days: {
      type: Number,
      require: true,
    },
    rooms: { type: Number, require: true },
    guests: {
      type: Number,
      require: true,
    },
    // Airport-based pricing & flight details
    prices: [
      {
        priceswitch: { type: Boolean, default: false },
        country: { type: String, required: true, default: "UK" },
        airport: [{ type: mongoose.Schema.Types.ObjectId, ref: "Airport" }],
        hotel: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hotel",
        },
        startdate: { type: Date, required: true },
        enddate: { type: Date, required: true },
        price: { type: Number, required: true },
        flightDetails: {
          outbound: {
            departureTime: String,
            arrivalTime: String,
            airline: String,
            flightNumber: String,
          },
          returnFlight: {
            departureTime: String,
            arrivalTime: String,
            airline: String,
            flightNumber: String,
          },
        },
      },
    ],

    // Accommodations
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],

    boardBasis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardBasis",
      required: true,
    },
    tag: { type: String },
    LowDeposite: { type: String },
    isTopDeal: { type: Boolean, default: false },
    isHotdeal: { type: Boolean, default: false },
    itinerary: {
      type: [ItineraryItemSchema],
      default: [],
      required: false,
    },
    isFeatured: { type: Boolean, default: false },
    distanceToCenter: { type: String }, // Example: "500m away"
    distanceToBeach: { type: String }, // Example: "300m away"
    whatsIncluded: [{ type: String }], // List of included features
    exclusiveAdditions: [{ type: String }], // List of optional extras or upgrades
    termsAndConditions: [{ type: String }], //  List of T&Cs
  },
  { timestamps: true }
);

// Add a pre-save hook to check for duplicate dates in prices array
DealSchema.pre('save', function(next) {
  // Check if prices array exists and has items
  if (!this.prices || this.prices.length === 0) {
    return next();
  }
  
  // Create a map to track dates
  const dateSeen = new Map();
  const duplicateDates = [];
  
  // Check for duplicate dates
  for (let i = 0; i < this.prices.length; i++) {
    const price = this.prices[i];
    if (!price.startdate) continue;
    
    // Convert to date string for comparison (YYYY-MM-DD)
    const dateStr = new Date(price.startdate).toISOString().split('T')[0];
    
    if (dateSeen.has(dateStr)) {
      // Found a duplicate date
      duplicateDates.push({
        dateStr,
        index: i,
        previousIndex: dateSeen.get(dateStr)
      });
    } else {
      // Mark this date as seen
      dateSeen.set(dateStr, i);
    }
  }
  
  // If duplicates were found, reject the save
  if (duplicateDates.length > 0) {
    return next(new Error(`Duplicate dates found in prices: ${duplicateDates.map(d => d.dateStr).join(', ')}. Each price must have a unique start date.`));
  }
  
  next();
});

module.exports = mongoose.model("Deal", DealSchema);
