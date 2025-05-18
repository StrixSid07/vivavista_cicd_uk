import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Input,
} from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";

const typeOptions = [
  "Any",
  "Apartments",
  "Houses",
  "Commercial",
  "Garages",
  "Lots",
];

const bedsOptions = ["Beds", "1", "2", "3", "4", "5"];

const bathsOptions = ["Baths", "1", "2", "3", "4", "5"];

const amenitiesOptions = [
  "Air Conditioning",
  "Swimming Pool",
  "Central Heating",
  "Laundry Room",
  "Gym",
  "Alarm",
  "Window Covering",
];

const NewPropertySearchComponent = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [areaRange, setAreaRange] = useState([0, 1500]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [status, setStatus] = useState("Any Status");
  const [type, setType] = useState("Any Type");
  const [state, setState] = useState("All States");
  const [city, setCity] = useState("All Cities");
  const [beds, setBeds] = useState("Beds");
  const [baths, setBaths] = useState("Baths");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const toggleMoreOptions = () => setShowMoreOptions((prev) => !prev);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const renderMenuItems = (options, setter) =>
    options.map((option) => (
      <MenuItem key={option} onClick={() => setter(option)}>
        {option}
      </MenuItem>
    ));

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardBody>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Find New Home On Rent
        </h2>

        {/* Search Input */}
        <div className="flex items-center mb-6">
          <Input
            label="Search"
            placeholder="Enter address e.g. street, city and state or zip"
            variant="standard"
            color="gray"
            className="group"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <FaSearch
            size={24}
            className={`mt-3 text-gray-800 transition-colors duration-500 delay-75 hover:text-gray-500 ${
              isFocused ? "text-[rgb(158,158,158)]" : "text-gray-800"
            }`}
          />
        </div>

        {/* Status Dropdown */}
        <Menu>
          <MenuHandler>
            <Button
              variant="gradient"
              color="gray"
              className="w-full text-left flex justify-between items-center"
            >
              {status}
              <BsChevronDown size={16} />
            </Button>
          </MenuHandler>
          <MenuList className="z-[10000]">
            {renderMenuItems(typeOptions, setStatus)}
          </MenuList>
        </Menu>

        {/* Type Dropdown */}
        <Menu>
          <MenuHandler>
            <Button
              variant="gradient"
              color="gray"
              className="w-full text-left mt-4 flex justify-between items-center"
            >
              {type}
              <BsChevronDown size={16} />
            </Button>
          </MenuHandler>
          <MenuList className="z-[10000]">
            {renderMenuItems(typeOptions, setType)}
          </MenuList>
        </Menu>

        {/* States Dropdown */}
        <Menu>
          <MenuHandler>
            <Button
              variant="gradient"
              color="gray"
              className="w-full text-left mt-4 flex justify-between items-center"
            >
              {state}
              <BsChevronDown size={16} />
            </Button>
          </MenuHandler>
          <MenuList className="z-[10000]">
            {renderMenuItems(typeOptions, setState)}
          </MenuList>
        </Menu>

        {/* Cities Dropdown */}
        <Menu>
          <MenuHandler>
            <Button
              variant="gradient"
              color="gray"
              className="w-full text-left mt-4 flex justify-between items-center"
            >
              {city}
              <BsChevronDown size={16} />
            </Button>
          </MenuHandler>
          <MenuList className="z-[10000]">
            {renderMenuItems(typeOptions, setCity)}
          </MenuList>
        </Menu>

        {/* Beds and Baths Dropdown */}
        <div className="flex space-x-4 mt-4">
          <Menu className="w-full">
            <MenuHandler>
              <Button
                variant="gradient"
                color="gray"
                className="w-full text-left flex justify-between items-center"
              >
                {beds}
                <BsChevronDown size={16} />
              </Button>
            </MenuHandler>
            <MenuList className="z-[10000]">
              {renderMenuItems(bedsOptions, setBeds)}
            </MenuList>
          </Menu>

          <Menu className="w-full">
            <MenuHandler>
              <Button
                variant="gradient"
                color="gray"
                className="w-full text-left flex justify-between items-center"
              >
                {baths}
                <BsChevronDown size={16} />
              </Button>
            </MenuHandler>
            <MenuList className="z-[10000]">
              {renderMenuItems(bathsOptions, setBaths)}
            </MenuList>
          </Menu>
        </div>

        {/* Area Range Slider */}
        <div className="mt-6">
          <label className="block text-gray-700">Area Range</label>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min={0}
              max={1500}
              value={areaRange[0]}
              onChange={(e) =>
                setAreaRange([Number(e.target.value), areaRange[1]])
              }
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-slider"
            />
            <input
              type="range"
              min={0}
              max={1500}
              value={areaRange[1]}
              onChange={(e) =>
                setAreaRange([areaRange[0], Number(e.target.value)])
              }
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer ml-2 range-slider"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{areaRange[0]} sq ft</span>
            <span>{areaRange[1]} sq ft</span>
          </div>
        </div>

        <style jsx>{`
          .range-slider::-webkit-slider-thumb {
            background-color: gray;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
          }

          .range-slider::-moz-range-thumb {
            background-color: gray;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            cursor: pointer;
          }

          .range-slider::-ms-thumb {
            background-color: gray;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            cursor: pointer;
          }
        `}</style>

        {/* Price Range Slider */}
        <div className="mt-6">
          <label className="block text-gray-700">Price Range</label>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min={0}
              max={1000000}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-slider"
            />
            <input
              type="range"
              min={0}
              max={1000000}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer ml-2 range-slider"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* More Options Toggle */}
        <Button
          variant="text"
          color="gray"
          className="text-gray-800 hover:text-gray-500 mt-6 flex items-center"
          onClick={toggleMoreOptions}
        >
          <BsChevronDown
            size={24}
            className={`transition-transform duration-300 ${
              showMoreOptions ? "rotate-180" : "rotate-0"
            }`}
          />
          <span className="ml-2">Additional Features</span>
        </Button>

        {/* Additional Options */}
        {showMoreOptions && (
          <div className="mt-6">
            <div className="mt-4">
              <div className="flex flex-col mt-2">
                {amenitiesOptions.map((amenity) => (
                  <Checkbox key={amenity} label={amenity} color="gray" />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter className="mt-6">
        <Button
          color="gray"
          className="w-full"
          onClick={() => console.log("Search button clicked")}
        >
          Search
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewPropertySearchComponent;
