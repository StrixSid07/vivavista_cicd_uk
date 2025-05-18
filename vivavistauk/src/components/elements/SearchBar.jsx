// import React, { useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const SearchBar = ({ airports, destinations, roomOptions }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     departure: "",
//     destination: "",
//     checkIn: null,
//     checkOut: null,
//     rooms: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleDateChange = (date, field) => {
//     setFormData({ ...formData, [field]: date });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "https://api.example.com/search",
//         formData
//       );
//       console.log("Search Results:", response.data);
//     } catch (error) {
//       console.error("Error submitting search:", error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="relative bg-[#0078D4]/95 px-8 md:px-24 py-6 md:py-10 rounded-xl md:max-w-7xl w-[300px] md:w-full mx-auto -mt-28 md:-mt-16 shadow-lg"
//     >
//       <div className="flex md:flex-row flex-col justify-center items-center gap-4 md:gap-4">
//         <div className="flex flex-col w-full md:w-48">
//           <label className="text-white text-md mb-1">Departure Airport</label>
//           <select
//             name="departure"
//             value={formData.departure}
//             onChange={handleChange}
//             className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md"
//           >
//             <option value="">Select Airport</option>
//             {airports.map((airport, index) => (
//               <option key={index} value={airport}>
//                 {airport}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex flex-col w-full md:w-48">
//           <label className="text-white text-md mb-1">Destination</label>
//           <select
//             name="destination"
//             value={formData.destination}
//             onChange={handleChange}
//             className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md"
//           >
//             <option value="">Select Destination</option>
//             {destinations.map((destination, index) => (
//               <option key={index} value={destination}>
//                 {destination}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="md:flex hidden flex-col w-full md:w-40">
//           <label className="text-white text-md mb-1">Check-in Date</label>
//           <DatePicker
//             selected={formData.checkIn}
//             onChange={(date) => handleDateChange(date, "checkIn")}
//             className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
//             placeholderText="Select Date"
//             dateFormat="yyyy-MM-dd"
//           />
//         </div>

//         <div className="md:flex hidden flex-col w-full md:w-40">
//           <label className="text-white text-md mb-1">Check-Out Date</label>
//           <DatePicker
//             selected={formData.checkIn}
//             onChange={(date) => handleDateChange(date, "checkIn")}
//             className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
//             placeholderText="Select Date"
//             dateFormat="yyyy-MM-dd"
//           />
//         </div>

//         <div className="flex md:hidden items-center justify-center gap-3">
//           <div className="flex flex-col w-28 md:w-40">
//             <label className="text-white text-md mb-1">Check-in</label>
//             <DatePicker
//               selected={formData.checkIn}
//               onChange={(date) => handleDateChange(date, "checkIn")}
//               className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
//               placeholderText="Select Date"
//               dateFormat="yyyy-MM-dd"
//             />
//           </div>

//           <div className="flex flex-col w-28 md:w-40">
//             <label className="text-white text-md mb-1">Check-Out</label>
//             <DatePicker
//               selected={formData.checkIn}
//               onChange={(date) => handleDateChange(date, "checkIn")}
//               className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
//               placeholderText="Select Date"
//               dateFormat="yyyy-MM-dd"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col w-full md:w-48">
//           <label className="text-white text-md mb-1">Rooms & Guests</label>
//           <select
//             name="rooms"
//             value={formData.rooms}
//             onChange={handleChange}
//             className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md"
//           >
//             <option value="">Select Option</option>
//             {roomOptions.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           onClick={() => navigate(`/search`)}
//           className="flex items-center justify-center md:mt-7 gap-2 bg-deep-orange-500 transition-colors duration-500 ease-in-out hover:bg-deep-orange-700 text-white font-bold px-5 py-2 md:px-6 md:py-3 rounded-md mt-6"
//         >
//           <FaSearch size={16} />
//           <span>Search</span>
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SearchBar;

import React, { useState, useEffect } from "react";
import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaUserFriends,
  FaBed,
  FaPlus,
  FaMinus,
  FaSearch,
} from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../../utils/Api";

const SearchBar = ({ roomOptions }) => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    checkIn: null,
    checkOut: null,
    rooms: 1,
    guests: 1,
  });

  // Fetch Airports and Destinations from API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [airportRes, destinationRes] = await Promise.all([
          axios.get(`${Base_Url}/airport`),
          axios.get(`${Base_Url}/destinations/dropdown-destionation`),
        ]);

        setAirports(airportRes.data);
        setDestinations(destinationRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError("Failed to load dropdown data");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search", { state: formData }); // Pass formData as state
  };

  return (
    // <form
    //   onSubmit={handleSubmit}
    //   className="relative bg-[#0073b4]/95 px-8 md:px-24 py-6 md:py-10 rounded-xl md:max-w-7xl w-[300px] md:w-full mx-auto -mt-28 md:-mt-16 shadow-lg"
    // >
    //   <div className="flex md:flex-row flex-col justify-center items-center gap-4 md:gap-4">
    //     {/* Departure Airport Dropdown */}
    //     <div className="flex flex-col w-full md:w-48">
    //       <label className="text-white text-md mb-1">Departure Airport</label>
    //       <select
    //         name="departure"
    //         value={formData.departure}
    //         onChange={handleChange}
    //         className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md"
    //       >
    //         <option value="">Select Airport</option>
    //         {airports.map((airport) => (
    //           <option key={airport._id} value={airport.code}>
    //             {airport.name}
    //           </option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* Destination Dropdown */}
    //     <div className="flex flex-col w-full md:w-48">
    //       <label className="text-white text-md mb-1">Destination</label>
    //       <select
    //         name="destination"
    //         value={formData.destination}
    //         onChange={handleChange}
    //         className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md"
    //       >
    //         <option value="">Select Destination</option>
    //         {destinations.map((destination) => (
    //           <option key={destination._id} value={destination._id}>
    //             {destination.name}
    //           </option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* Check-in Date */}
    //     <div className="md:flex hidden flex-col w-full md:w-40">
    //       <label className="text-white text-md mb-1">Check-in Date</label>
    //       <DatePicker
    //         selected={formData.checkIn}
    //         onChange={(date) => handleDateChange(date, "checkIn")}
    //         className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
    //         placeholderText="Select Date"
    //         dateFormat="yyyy-MM-dd"
    //         minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
    //         maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
    //       />
    //     </div>

    //     {/* Check-out Date */}
    //     <div className="md:flex hidden flex-col w-full md:w-40">
    //       <label className="text-white text-md mb-1">Check-Out Date</label>
    //       <DatePicker
    //         selected={formData.checkOut}
    //         onChange={(date) => handleDateChange(date, "checkOut")}
    //         className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
    //         placeholderText="Select Date"
    //         dateFormat="yyyy-MM-dd"
    //         minDate={
    //           formData.checkIn
    //             ? new Date(formData.checkIn)
    //             : new Date(new Date().setDate(new Date().getDate() + 1))
    //         }
    //         maxDate={
    //           formData.checkIn
    //             ? new Date(
    //                 new Date(formData.checkIn).setMonth(
    //                   new Date(formData.checkIn).getMonth() + 3
    //                 )
    //               )
    //             : new Date(new Date().setMonth(new Date().getMonth() + 3))
    //         }
    //       />
    //     </div>

    //     <div className="flex md:hidden items-center justify-center gap-3">
    //       <div className="flex flex-col w-28 md:w-40">
    //         {" "}
    //         <label className="text-white text-md mb-1">Check-in</label>
    //         <DatePicker
    //           selected={formData.checkIn}
    //           onChange={(date) => handleDateChange(date, "checkIn")}
    //           className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
    //           placeholderText="Select Date"
    //           dateFormat="yyyy-MM-dd"
    //           minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
    //           maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
    //         />
    //       </div>

    //       <div className="flex flex-col w-28 md:w-40">
    //         <label className="text-white text-md mb-1">Check-Out</label>
    //         <DatePicker
    //           selected={formData.checkOut}
    //           onChange={(date) => handleDateChange(date, "checkOut")}
    //           className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md w-full"
    //           placeholderText="Select Date"
    //           dateFormat="yyyy-MM-dd"
    //           minDate={
    //             formData.checkIn
    //               ? new Date(formData.checkIn)
    //               : new Date(new Date().setDate(new Date().getDate() + 1))
    //           }
    //           maxDate={
    //             formData.checkIn
    //               ? new Date(
    //                   new Date(formData.checkIn).setMonth(
    //                     new Date(formData.checkIn).getMonth() + 3
    //                   )
    //                 )
    //               : new Date(new Date().setMonth(new Date().getMonth() + 3))
    //           }
    //         />
    //       </div>
    //     </div>

    //     {/* Rooms & Guests */}
    //     <div className="flex flex-col w-full md:w-48">
    //       <label className="text-white text-md mb-1">Rooms & Guests</label>
    //       <select
    //         name="rooms"
    //         value={formData.rooms}
    //         onChange={handleChange}
    //         className="px-3 py-2 md:px-4 md:py-3 bg-white border border-deep-orange-500 text-deep-orange-600 rounded-md"
    //       >
    //         <option value="">Select Option</option>
    //         {roomOptions.map((option, index) => (
    //           <option key={index} value={option}>
    //             {option}
    //           </option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* Search Button */}
    //     <button
    //       type="submit"
    //       // onClick={() => navigate(`/search`)}
    //       className="flex items-center justify-center md:mt-7 gap-2 bg-deep-orange-500 transition-colors duration-500 ease-in-out hover:bg-deep-orange-700 text-white font-bold px-5 py-2 md:px-6 md:py-3 rounded-md mt-6"
    //     >
    //       <FaSearch size={16} />
    //       <span>Search</span>
    //     </button>
    //   </div>
    // </form>
    // <form
    //   onSubmit={handleSubmit}
    //   className="w-fit bg-[#0073b4]/95 rounded-xl mx-auto -mt-28 md:-mt-16 shadow-lg flex items-stretch overflow-hidden"
    // >
    //   {/* Departure Airport */}
    //   <div className="flex flex-col justify-center w-48 border-r border-black px-4 py-3">
    //     <label className="flex items-center gap-2 text-md text-white mb-2">
    //       <FaPlaneDeparture /> Departure
    //     </label>
    //     <select
    //       name="departure"
    //       value={formData.departure}
    //       onChange={handleChange}
    //       className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm"
    //     >
    //       <option value="">Select</option>
    //       {airports.map((airport) => (
    //         <option key={airport._id} value={airport.code}>
    //           {airport.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   {/* Destination */}
    //   <div className="flex flex-col justify-center w-48 border-r border-black px-4 py-3">
    //     <label className="flex items-center gap-2 text-md text-white mb-2">
    //       <HiOutlineLocationMarker /> Destination
    //     </label>
    //     <select
    //       name="destination"
    //       value={formData.destination}
    //       onChange={handleChange}
    //       className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm"
    //     >
    //       <option value="">Select</option>
    //       {destinations.map((destination) => (
    //         <option key={destination._id} value={destination._id}>
    //           {destination.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   {/* Check-in Date */}
    //   <div className="hidden md:flex flex-col justify-center w-48 border-r border-black px-4 py-3">
    //     <label className="flex items-center gap-2 text-md text-white mb-2">
    //       <FaCalendarAlt /> Check-in
    //     </label>
    //     <DatePicker
    //       selected={formData.checkIn}
    //       onChange={(date) => handleDateChange(date, "checkIn")}
    //       className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm w-full"
    //       placeholderText="Select Date"
    //       dateFormat="yyyy-MM-dd"
    //       minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
    //       maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
    //     />
    //   </div>

    //   {/* Check-out Date */}
    //   <div className="hidden md:flex flex-col justify-center w-48 border-r border-black px-4 py-3">
    //     <label className="flex items-center gap-2 text-md text-white mb-2">
    //       <FaCalendarAlt /> Check-out
    //     </label>
    //     <DatePicker
    //       selected={formData.checkOut}
    //       onChange={(date) => handleDateChange(date, "checkOut")}
    //       className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm w-full"
    //       placeholderText="Select Date"
    //       dateFormat="yyyy-MM-dd"
    //       minDate={
    //         formData.checkIn
    //           ? new Date(formData.checkIn)
    //           : new Date(new Date().setDate(new Date().getDate() + 1))
    //       }
    //       maxDate={
    //         formData.checkIn
    //           ? new Date(
    //               new Date(formData.checkIn).setMonth(
    //                 new Date(formData.checkIn).getMonth() + 3
    //               )
    //             )
    //           : new Date(new Date().setMonth(new Date().getMonth() + 3))
    //       }
    //     />
    //   </div>

    //   {/* Rooms */}
    //   <div className="flex flex-col justify-center w-40 border-r border-black px-4 py-3">
    //     <label className="flex items-center gap-2 text-md text-white mb-2">
    //       <FaBed /> Rooms
    //     </label>
    //     <div className="flex items-center justify-between bg-white rounded-md px-3 py-2">
    //       <button
    //         type="button"
    //         onClick={() =>
    //           setFormData((prev) => ({
    //             ...prev,
    //             rooms: Math.max(1, prev.rooms - 1),
    //           }))
    //         }
    //         className="text-gray-600 hover:text-black"
    //       >
    //         <FaMinus />
    //       </button>
    //       {/* Show value clearly */}
    //       <span className="text-sm font-medium">{formData.rooms || 1}</span>
    //       <button
    //         type="button"
    //         onClick={() =>
    //           setFormData((prev) => ({
    //             ...prev,
    //             rooms: prev.rooms + 1,
    //           }))
    //         }
    //         className="text-gray-600 hover:text-black"
    //       >
    //         <FaPlus />
    //       </button>
    //     </div>
    //   </div>

    //   {/* Guests */}
    //   <div className="flex flex-col justify-center w-40 border-r border-black px-4 py-3">
    //     <label className="flex items-center gap-2 text-md text-white mb-2">
    //       <FaUserFriends /> Guests
    //     </label>
    //     <div className="flex items-center justify-between bg-white rounded-md px-3 py-2">
    //       <button
    //         type="button"
    //         onClick={() =>
    //           setFormData((prev) => ({
    //             ...prev,
    //             guests: Math.max(1, prev.guests - 1),
    //           }))
    //         }
    //         className="text-gray-600 hover:text-black"
    //       >
    //         <FaMinus />
    //       </button>
    //       {/* Show value clearly */}
    //       <span className="text-sm font-medium">{formData.guests || 1}</span>
    //       <button
    //         type="button"
    //         onClick={() =>
    //           setFormData((prev) => ({
    //             ...prev,
    //             guests: prev.guests + 1,
    //           }))
    //         }
    //         className="text-gray-600 hover:text-black"
    //       >
    //         <FaPlus />
    //       </button>
    //     </div>
    //   </div>

    //   {/* Search Button */}
    //   <div className="flex justify-center items-center w-48 bg-deep-orange-500 hover:bg-deep-orange-700 text-white font-bold transition-all duration-300 px-4 py-3">
    //     <button type="submit" className="flex items-center gap-2 text-md">
    //       <FaSearch size={18} />
    //       <span>Search</span>
    //     </button>
    //   </div>
    // </form>
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-fit bg-[#0073b4]/95 rounded-xl mx-auto -mt-28 md:-mt-16 shadow-lg flex flex-col md:flex-row items-stretch overflow-hidden customfontstitle"
    >
      {/* Departure Airport */}
      <div className="flex flex-col justify-center w-full md:w-48 border-b md:border-b-0 md:border-r border-black px-4 py-6">
        <label className="flex items-center gap-2 text-md text-white mb-2">
          <FaPlaneDeparture /> Departure
        </label>
        <select
          name="departure"
          value={formData.departure}
          onChange={handleChange}
          className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          {airports.map((airport) => (
            <option key={airport._id} value={airport.code}>
              {airport.name}
            </option>
          ))}
        </select>
      </div>

      {/* Destination */}
      <div className="flex flex-col justify-center w-full md:w-48 border-b md:border-b-0 md:border-r border-black px-4 py-3">
        <label className="flex items-center gap-2 text-md text-white mb-2">
          <HiOutlineLocationMarker /> Destination
        </label>
        <select
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          {destinations.map((destination) => (
            <option key={destination._id} value={destination._id}>
              {destination.name}
            </option>
          ))}
        </select>
      </div>

      {/* Check-in Date */}
      <div className="flex flex-col justify-center w-full md:w-48 border-b md:border-b-0 md:border-r border-black px-4 py-3">
        <label className="flex items-center gap-2 text-md text-white mb-2">
          <FaCalendarAlt /> Check-in
        </label>
        <DatePicker
          selected={formData.checkIn}
          onChange={(date) => handleDateChange(date, "checkIn")}
          className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm w-full"
          placeholderText="Select Date"
          dateFormat="yyyy-MM-dd"
          minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
          maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
        />
      </div>

      {/* Check-out Date */}
      <div className="flex flex-col justify-center w-full md:w-48 border-b md:border-b-0 md:border-r border-black px-4 py-3">
        <label className="flex items-center gap-2 text-md text-white mb-2">
          <FaCalendarAlt /> Check-out
        </label>
        <DatePicker
          selected={formData.checkOut}
          onChange={(date) => handleDateChange(date, "checkOut")}
          className="bg-white text-gray-800 border border-black rounded-md px-3 py-2 text-sm w-full"
          placeholderText="Select Date"
          dateFormat="yyyy-MM-dd"
          minDate={
            formData.checkIn
              ? new Date(formData.checkIn)
              : new Date(new Date().setDate(new Date().getDate() + 1))
          }
          maxDate={
            formData.checkIn
              ? new Date(
                  new Date(formData.checkIn).setMonth(
                    new Date(formData.checkIn).getMonth() + 3
                  )
                )
              : new Date(new Date().setMonth(new Date().getMonth() + 3))
          }
        />
      </div>

      {/* Rooms */}
      <div className="flex flex-col justify-center w-full md:w-40 border-b md:border-b-0 md:border-r border-black px-4 py-3">
        <label className="flex items-center gap-2 text-md text-white mb-2">
          <FaBed /> Rooms
        </label>
        <div className="flex items-center justify-between bg-white rounded-md px-3 py-2">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                rooms: Math.max(1, prev.rooms - 1),
              }))
            }
            className="text-gray-600 hover:text-black"
          >
            <FaMinus />
          </button>
          <span className="text-sm font-bold text-black">
            {formData.rooms || 1}
          </span>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                rooms: prev.rooms + 1,
              }))
            }
            className="text-gray-600 hover:text-black"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Guests */}
      <div className="flex flex-col justify-center w-full md:w-40 border-b md:border-b-0 md:border-r border-black px-4 py-3">
        <label className="flex items-center gap-2 text-md text-white mb-2">
          <FaUserFriends /> Guests
        </label>
        <div className="flex items-center justify-between bg-white rounded-md px-3 py-2">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                guests: Math.max(1, prev.guests - 1),
              }))
            }
            className="text-gray-600 hover:text-black"
          >
            <FaMinus />
          </button>
          <span className="text-sm font-bold text-black">
            {formData.guests || 1}
          </span>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                guests: prev.guests + 1,
              }))
            }
            className="text-gray-600 hover:text-black"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Search Button */}
      {/* <div className="flex flex-col justify-center items-center w-full md:w-48 bg-deep-orange-500 hover:bg-deep-orange-700 text-white font-bold transition-all duration-300 px-4 py-3">
        <button type="submit" className="flex items-center gap-2 text-md">
          <FaSearch size={18} />
          <span>Search</span>
        </button>
      </div> */}
      <button
        type="submit"
        className="flex flex-col justify-center items-center w-full md:w-48 bg-deep-orange-500 hover:bg-deep-orange-700 text-white font-bold transition-all duration-300 px-4 py-3 cursor-pointer"
      >
        <div className="flex items-center gap-2 text-md">
          <FaSearch size={18} />
          <span>Search</span>
        </div>
      </button>
    </form>
  );
};

export default SearchBar;
