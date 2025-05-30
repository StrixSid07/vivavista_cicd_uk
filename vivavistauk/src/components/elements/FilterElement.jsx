import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Select,
  Option,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import {
  FaLock,
  FaMoneyBillWave,
  FaHeadphonesAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import CalendarView from "./CalendarView";
import ConciergeFormCard from "./ConciergeFormCard";
import { LeadContext } from "../../contexts/LeadContext";
const FilterElement = ({
  dealId,
  dealtitle,
  departureDates, // Array of departure dates (strings)
  departureAirports, // Array of departure airports (strings)
  prices, // Full price data array
  setSelectedTrip,
  initialAdultCount = 2, // Changed default to 2
  onBookingSubmit, // Callback function to handle submit
  selectedDate, // Rename here
  selectedAirport, // Rename here
  onDateChange, // setter from parent
  onAirportChange, // setter from parent
  priceMap,
  setLedprice,
}) => {
  // const [adultCount, setAdultCount] = useState(initialAdultCount);
  // const [selectedDate, setSelectedDate] = useState(
  //   departureDates && departureDates.length > 0 ? departureDates[0] : ""
  // );
  // const [selectedAirport, setSelectedAirport] = useState(
  //   departureAirports && departureAirports.length > 0
  //     ? departureAirports[0]
  //     : ""
  // );

  const { leadPrice, setLeadPrice } = useContext(LeadContext);
  const { adultCount, setAdultCount } = useContext(LeadContext);
  const { setTotalPrice, totalPrice, setDealIdForm, setDealtitleForm } =
    useContext(LeadContext);
  setDealIdForm(dealId);
  setDealtitleForm(dealtitle);
  
  // Use ref to track if initial adult count has been set
  const initialAdultCountSet = useRef(false);

  // Set initial adult count to 2 on component mount
  useEffect(() => {
    // Only run once and only if adultCount is less than 2
    if (!initialAdultCountSet.current && adultCount < 2) {
      setAdultCount(2);
      initialAdultCountSet.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  // Flatten the departureAirports (if it's a nested array)
  const flatDepartureAirports = departureAirports.flat();

  // Get unique airports based on `_id`
  const uniqueDepartureAirports = [
    ...new Set(flatDepartureAirports.map((airport) => airport._id)),
  ].map((id) => flatDepartureAirports.find((airport) => airport._id === id));

  console.log("THIS IS UNIQUE", uniqueDepartureAirports);
  const handleDecrement = () => {
    // Prevent reducing below 2
    setAdultCount((prev) => Math.max(2, prev - 1));
  };

  // Increment traveler count
  const handleIncrement = () => {
    setAdultCount((prev) => prev + 1);
  };

  // Calculate total price dynamically
  // const totalPrice = leadPrice * adultCount;
  setTotalPrice(leadPrice * adultCount);

  // Submit booking data to parent component
  // const handleSubmit = () => {
  //   const bookingData = {
  //     selectedDate,
  //     selectedAirport,
  //     adultCount,
  //     totalPrice,
  //   };
  //   if (onBookingSubmit) {
  //     onBookingSubmit(bookingData);
  //   }
  // };
  const handleSubmit = () => {
    setOpenDialog(true); // Show the concierge dialog
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Auto-select first airport if none is selected
  useEffect(() => {
    if (!selectedAirport && uniqueDepartureAirports.length > 0) {
      onAirportChange(uniqueDepartureAirports[0]._id); // Auto-select the first airport
    }
  }, [selectedAirport, uniqueDepartureAirports, onAirportChange]);
  
  // Find and set the cheapest price on component mount (one-time initialization)
  useEffect(() => {
    // Only run if prices are available
    if (prices && prices.length > 0) {
      // Filter out prices with priceswitch=true
      const validPrices = prices.filter(price => !price.priceswitch);
      
      if (validPrices.length > 0) {
        // Find the cheapest price
        const cheapestPrice = validPrices.reduce((cheapest, current) => {
          return current.price < cheapest.price ? current : cheapest;
        }, validPrices[0]);
        
        console.log("Setting initial cheapest price:", cheapestPrice.price);
        
        // Set the lead price to the cheapest price
        setLeadPrice(cheapestPrice.price);
        
        // Also select the corresponding date and airport for consistency
        const cheapestDate = new Date(cheapestPrice.startdate).toLocaleDateString("en-GB");
        onDateChange(cheapestDate);
        
        // Find the first valid airport from the cheapest price
        let airportId;
        if (Array.isArray(cheapestPrice.airport) && cheapestPrice.airport.length > 0) {
          const firstAirport = cheapestPrice.airport[0];
          airportId = typeof firstAirport === 'object' ? firstAirport._id : firstAirport;
        } else if (typeof cheapestPrice.airport === 'object' && cheapestPrice.airport) {
          airportId = cheapestPrice.airport._id;
        } else {
          airportId = cheapestPrice.airport;
        }
        
        if (airportId) {
          onAirportChange(airportId);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]); // Run when prices are loaded

  // Handle price updates when date or airport changes (but prevent flickering)
  useEffect(() => {
    // Skip if prices not loaded yet
    if (!prices || prices.length === 0) return;
    
    // Skip if no date or airport is selected yet (will be handled by initial price setting)
    if (!selectedDate || !selectedAirport) return;
    
    // Function to find the cheapest price for a given airport and date
    const findPriceForAirportAndDate = (airportId, dateStr) => {
      // Find prices matching this airport and date
      const matchingPrices = prices.filter(price => {
        // Match date
        const priceDate = new Date(price.startdate).toLocaleDateString("en-GB");
        if (priceDate !== dateStr) return false;
        
        // Match airport
        let hasSelectedAirport = false;
        if (Array.isArray(price.airport)) {
          hasSelectedAirport = price.airport.some(airport => 
            (typeof airport === 'object' && airport._id === airportId) || airport === airportId
          );
        } else if (typeof price.airport === 'object' && price.airport) {
          hasSelectedAirport = price.airport._id === airportId;
        } else {
          hasSelectedAirport = price.airport === airportId;
        }
        
        // Filter out inactive prices
        return hasSelectedAirport && !price.priceswitch;
      });
      
      // Return the cheapest price from matches
      if (matchingPrices.length > 0) {
        return matchingPrices.reduce((min, price) => 
          price.price < min.price ? price : min, matchingPrices[0]).price;
      }
      
      // If no match for this airport, find cheapest price for this date
      const dateFilteredPrices = prices.filter(price => {
        const priceDate = new Date(price.startdate).toLocaleDateString("en-GB");
        return priceDate === dateStr && !price.priceswitch;
      });
      
      if (dateFilteredPrices.length > 0) {
        return dateFilteredPrices.reduce((min, price) => 
          price.price < min.price ? price : min, dateFilteredPrices[0]).price;
      }
      
      return null;
    };
    
    // Find price for the selected airport and date
    const newPrice = findPriceForAirportAndDate(selectedAirport, selectedDate);
    
    // Update lead price if we found a valid price
    if (newPrice !== null) {
      console.log("Updating price for selected airport/date:", newPrice);
      setLeadPrice(newPrice);
    }
  }, [selectedDate, selectedAirport, prices, setLeadPrice]);
  
  // Custom airport change handler to prevent price flickering
  const handleAirportChange = (value) => {
    // Update the selected airport
    onAirportChange(value);
    
    // Immediately update price for the selected airport if we have a date
    if (selectedDate && prices && prices.length > 0) {
      // Find the prices for this specific airport and date
      const airportPrices = prices.filter(price => {
        // Check if price is for the selected date
        const priceDate = new Date(price.startdate).toLocaleDateString("en-GB");
        if (priceDate !== selectedDate) return false;
        
        // Check if price is for the selected airport
        let hasSelectedAirport = false;
        if (Array.isArray(price.airport)) {
          hasSelectedAirport = price.airport.some(airport => 
            (typeof airport === 'object' && airport._id === value) || airport === value
          );
        } else if (typeof price.airport === 'object' && price.airport) {
          hasSelectedAirport = price.airport._id === value;
        } else {
          hasSelectedAirport = price.airport === value;
        }
        
        // Only include active prices
        return hasSelectedAirport && !price.priceswitch;
      });
      
      if (airportPrices.length > 0) {
        // If we found prices for this airport, use the cheapest one
        const cheapestPrice = airportPrices.reduce((min, price) => 
          price.price < min.price ? price : min, airportPrices[0]);
        
        console.log("Airport change - setting price:", cheapestPrice.price);
        setLeadPrice(cheapestPrice.price);
      }
    }
  };

  return (
    <Card className="w-full max-w-md border border-gray-100 shadow-lg p-1 group">
      {/* Header: Price */}
      <CardHeader
        floated={false}
        className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600"
      >
        <Typography variant="small" className="text-white customfontstitle">
          Price from
        </Typography>
        <Typography
          variant="h3"
          className="font-bold leading-tight text-white customfontstitle"
        >
          £{leadPrice}
        </Typography>
        <Typography variant="small" className="text-white customfontstitle">
          per person
        </Typography>
      </CardHeader>

      {/* Body: Selectors & Price */}
      <CardBody className="p-4 space-y-4">
        {/* Departure Date */}
        {/* <div>
          <Typography
            variant="small"
            className="font-medium text-gray-700 mb-2"
          >
            Departure Date
          </Typography>
          {/* <Select
            label="Select Date"
            size="md"
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
          >
            {departureDates.map((date, idx) => (
              <Option key={idx} value={date}>
                {date}
              </Option>
            ))}
          </Select> */}
        {/* <Select
            label="Select Date"
            size="md"
            value={selectedDate}
            onChange={(value) => onDateChange(value)}
          >
            {departureDates.map((date, idx) => (
              <Option key={idx} value={date}>
                {date}
              </Option>
            ))}
          </Select>
        </div> */}

        {/* Departure Airport */}
        <div>
          <Typography
            variant="small"
            className="font-medium text-gray-700 mb-2 customfontstitle"
          >
            Departure Airport
          </Typography>
          <Select
            label="Select Airport"
            size="md"
            value={selectedAirport}
            className="customfontstitle"
            onChange={handleAirportChange}
          >
            {uniqueDepartureAirports.map((airport, idx) => (
              <Option key={airport._id} value={airport._id}>
                {airport.name} ({airport.code})
              </Option>
            ))}
          </Select>
        </div>

        {/* Number of Travelers (Plus/Minus) */}
        <div>
          <Typography
            variant="small"
            className="font-medium text-gray-700 mb-1 customfontstitle"
          >
            Number of Travelers
          </Typography>
          <div className="flex items-center w-full border border-gray-300 rounded-md p-2">
            <button
              type="button"
              onClick={handleDecrement}
              className="px-3 py-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              -
            </button>
            <span className="flex-1 text-center font-medium customfontstitle">
              {adultCount} Adults
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="px-3 py-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between pt-2">
          <Typography
            variant="small"
            className="font-medium text-gray-700 customfontstitle"
          >
            Total Price:
          </Typography>
          <Typography
            variant="h5"
            className="font-bold tracking-wide bg-transparent bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 customfontstitle"
          >
            £{totalPrice}
          </Typography>
        </div>
      </CardBody>

      {/* Footer: Button & Contact Info */}
      <CardFooter className="p-4 pt-2 space-y-4">
        <Button
          size="lg"
          className="transition-colors duration-500 ease-in-out bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 w-full normal-case text-white font-semibold customfontstitle"
          onClick={handleSubmit}
        >
          Book Now
        </Button>
        {/* <Button
          size="lg"
          className="
    relative overflow-hidden bg-gray-200 w-full normal-case text-white font-semibold transition-all duration-[1000ms] ease-in-out
    hover:text-white group"
          onClick={handleSubmit}
        >
          <span
            className="
      absolute left-0 h-20 w-20 bg-[#e05c00] rounded-full transform -translate-x-1/2 -translate-y-1/2
      transition-all duration-[1000ms] ease-in-out
      group-hover:scale-[20] group-hover:w-full group-hover:h-full group-hover:rounded-none"
          ></span>
          <span className="relative z-10 text-deep-orange-600 transition-all duration-500 ease-in-out group-hover:text-white">
            Book Now
          </span>
        </Button> */}

        {/* <CalendarView
          dealId={dealId}
          dealtitle={dealtitle}
          adultCount={adultCount}
          departureDates={departureDates}
          departureAirports={departureAirports}
          priceMap={priceMap}
          setSelectedTrip={setSelectedTrip} 
          selectedAirport={selectedAirport}
        /> */}

        {/* Phone / Call to Book */}
        <div className="text-center">
          <Typography
            variant="small"
            className="text-gray-600 mb-1 customfontstitle"
          >
            Or call us to book:
          </Typography>
          <div>
            <a
              href="tel:+02045059777"
              className="flex items-center justify-center gap-2"
            >
              <FaPhoneAlt className="text-green-500" />
              <Typography
                variant="large"
                className="font-bold text-black customfontstitle"
              >
                0204 505 9777
              </Typography>
            </a>
          </div>
        </div>

        {/* Icons Row: Secure Booking, Flexible Payment, 24/7 Support */}
        <div className="flex items-center justify-around text-xs text-gray-600 mt-2">
          <div className="flex flex-col items-center">
            <FaLock className="text-gray-800 text-lg mb-1" />
            <span>Secure Booking</span>
          </div>
          <div className="flex flex-col items-center">
            <FaMoneyBillWave className="text-gray-800 text-lg mb-1" />
            <span>Flexible Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <FaHeadphonesAlt className="text-gray-800 text-lg mb-1" />
            <span>24/7 Support</span>
          </div>
        </div>
      </CardFooter>
      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(false)}
        size={isMobile ? "md" : "xs"}
        className="p-0 bg-transparent"
      >
        <DialogBody className="overflow-auto max-h-[90vh] flex justify-center">
          <div className="w-full">
            <ConciergeFormCard
              dealId={dealId}
              dealtitle={dealtitle}
              adultCount={adultCount}
              totalPrice={totalPrice}
              selectedDate={selectedDate}
              airport={selectedAirport}
              handleClose={() => setOpenDialog(false)}
            />
          </div>
        </DialogBody>
      </Dialog>
    </Card>
  );
};

export default FilterElement;
