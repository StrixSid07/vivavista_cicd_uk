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

const HomeSearchComponent = ({ onClose }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedType, setSelectedType] = useState("Any");
  const [selectedBeds, setSelectedBeds] = useState("Beds");
  const [selectedBaths, setSelectedBaths] = useState("Baths");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const toggleMoreOptions = () => setShowMoreOptions((prev) => !prev);

  const renderMenuItems = (options, setter) =>
    options.map((option) => (
      <MenuItem key={option} onClick={() => setter(option)}>
        {option}
      </MenuItem>
    ));

  return (
    <div className="flex justify-center items-center p-3 w-full h-auto">
      <Card
        className={`mt-6 w-full max-w-7xl ${
          showMoreOptions ? "h-auto" : "h-auto"
        } bg-transparent shadow-none`}
      >
        <CardBody className="flex flex-col space-y-3">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-3">
            <Input
              label="Search"
              placeholder="Enter address e.g. street, city and state or zip"
              variant="standard"
              color="amber"
              className="w-full md:w-3/5"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <FaSearch
              size={24}
              className={`mt-3 md:mt-0 text-gray-800 transition-colors duration-500 delay-75 hover:text-amber-500 ${
                isFocused ? "text-yellow-600" : "text-gray-800"
              }`}
            />
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <div className="flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <Menu placement="bottom-start" className="w-full md:w-auto">
              <MenuHandler>
                <Button
                  variant="gradient"
                  color="amber"
                  className="text-white w-full md:w-auto"
                >
                  {selectedType}
                </Button>
              </MenuHandler>
              <MenuList className="w-full md:w-auto">
                {renderMenuItems(typeOptions, setSelectedType)}
              </MenuList>
            </Menu>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <Input
                label="Min Price"
                placeholder="Min Price"
                variant="standard"
                color="amber"
                className="w-full md:w-auto"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                label="Max Price"
                placeholder="Max Price"
                variant="standard"
                color="amber"
                className="w-full md:w-auto"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <Button
              variant="text"
              color="amber"
              className="text-gray-800 hover:text-amber-500 flex items-center w-full md:w-auto"
              onClick={toggleMoreOptions}
            >
              <BsChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  showMoreOptions ? "rotate-180" : "rotate-0"
                }`}
              />
              <span className="ml-2">More</span>
            </Button>
          </div>
          {showMoreOptions && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row flex-wrap justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
                  <Input
                    label="Min Area"
                    placeholder="Min Area"
                    variant="standard"
                    color="amber"
                    className="w-full md:w-auto"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                  />
                  <Input
                    label="Max Area"
                    placeholder="Max Area"
                    variant="standard"
                    color="amber"
                    className="w-full md:w-auto"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
                  <Menu placement="bottom-end" className="w-full md:w-auto">
                    <MenuHandler>
                      <Button
                        variant="gradient"
                        color="amber"
                        className="text-white w-full md:w-auto"
                      >
                        {selectedBeds}
                      </Button>
                    </MenuHandler>
                    <MenuList className="w-full md:w-auto">
                      {renderMenuItems(bedsOptions, setSelectedBeds)}
                    </MenuList>
                  </Menu>
                  <Menu placement="bottom-start" className="w-full md:w-auto">
                    <MenuHandler>
                      <Button
                        variant="gradient"
                        color="amber"
                        className="text-white w-full md:w-auto"
                      >
                        {selectedBaths}
                      </Button>
                    </MenuHandler>
                    <MenuList className="w-full md:w-auto">
                      {renderMenuItems(bathsOptions, setSelectedBaths)}
                    </MenuList>
                  </Menu>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {amenitiesOptions.map((amenity) => (
                  <Checkbox
                    key={amenity}
                    color="amber"
                    label={amenity}
                    className=""
                  />
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomeSearchComponent;
