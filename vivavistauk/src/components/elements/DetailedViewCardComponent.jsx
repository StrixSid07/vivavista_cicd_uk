import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, Typography, Checkbox } from "@material-tailwind/react";
import { FaChartArea, FaBed, FaBath, FaSquare } from "react-icons/fa";
import Map from "./Map";
import FloorplanAccordion from "./FloorplanAccordion";

const DetailedViewCardComponent = () => {
  const data = [
    {
      imgelink:
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1476988186444-a7189cf07b3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const floorplansData = [
    {
      title: "First Floor",
      size: "460 sq ft",
      imageUrl:
        "https://images.unsplash.com/photo-1556156653-e5a7c69cc263?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description:
        "Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Nam mi. Proin viverra leo ut odio. Curabitur malesuada.",
    },
    {
      title: "Second Floor",
      size: "440 sq ft",
      imageUrl: "https://source.unsplash.com/random/800x600/?architecture",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.",
    },
    {
      title: "Garage",
      size: "140 sq ft",
      imageUrl: "https://source.unsplash.com/random/800x600/?garage",
      description:
        "Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris.",
    },
  ];

  const [active, setActive] = React.useState(data[0].imgelink);
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <Card className="w-full max-w-screen-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <CardBody className="flex flex-col space-y-6">
        <div className="p-4 bg-blue-gray-100 rounded-md">
          <Typography variant="h5" color="blue-gray">
            Luxury Villa
          </Typography>
          <Typography variant="small" color="gray">
            1234 Elm Street, Beverly Hills, CA
          </Typography>
        </div>

        <div className="w-full flex justify-center items-center">
          <img
            className="h-80 w-full rounded-lg object-cover object-center cursor-pointer"
            src={active}
            alt="active-gallery"
            onClick={handleImageClick}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {data.map(({ imgelink }, index) => (
            <img
              key={index}
              onClick={() => setActive(imgelink)}
              src={imgelink}
              className="h-16 w-full cursor-pointer rounded-lg object-cover object-center"
              alt={`thumbnail-${index}`}
            />
          ))}
        </div>

        <div className="bg-blue-gray-50 p-4 rounded-md">
          <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-16">
            <Typography variant="h6" color="black">
              <FaChartArea className="mb-1 text-blue-600" /> Area
              <br /> 1450 sq ft
            </Typography>
            <Typography variant="h6" color="black">
              <FaSquare className="mb-1 text-blue-600" /> Rooms
              <br /> 2
            </Typography>
            <Typography variant="h6" color="black">
              <FaBed className="mb-1 text-blue-600" /> Bedrooms
              <br /> 4
            </Typography>
            <Typography variant="h6" color="black">
              <FaBath className="mb-1 text-blue-600" /> Bathrooms
              <br /> 1
            </Typography>
          </div>
        </div>

        <div>
          <Typography variant="h4" className="mb-4">
            Property Description
          </Typography>
          <hr className="mb-4 border-2 text-blue-gray-400" />
          <Typography variant="paragraph" className="text-gray-600">
            So, what does a standout listing look like? Here are some real
            estate listing description examples that are memorable for all the
            right reasons: Charm meets convenience in this delightful
            single-family abode! Step into a world of warmth and comfort as you
            enter the open-concept living space, perfect for creating lasting
            memories with loved ones. Embrace the tranquility of the landscaped
            backyard oasis, your own private retreat after a long day. With
            top-notch schools and amenities just a stone’s throw away, this home
            offers the ideal blend of suburban living and urban accessibility.
            Your dream home awaits! Welcome to your urban sanctuary! This
            stylish townhouse boasts sleek modern finishes and an abundance of
            natural light that dances through the generous windows. Take
            pleasure in the gourmet kitchen, a haven for aspiring chefs, and
            savor your morning coffee on the private rooftop terrace, where city
            views unfold before your eyes. Nestled in a vibrant community, this
            townhouse is your gateway to a dynamic lifestyle, complete with
            trendy eateries, parks, and cultural hotspots. Experience city
            living at its finest in this chic condo retreat. Immerse yourself in
            the luxurious ambiance of the building’s amenities, from the rooftop
            infinity pool to the state-of-the-art fitness center. Inside your
            own sanctuary, revel in the seamless blend of modern design and
            comfort. With bustling city life just outside your doorstep, this
            condo offers an unparalleled cosmopolitan lifestyle that’s perfect
            for professionals and urban enthusiasts alike.
          </Typography>
        </div>

        <div>
          <Typography variant="h4" className="mb-4">
            Details
          </Typography>
          <hr className="mb-4 border-2 text-blue-gray-400" />
          <div className="grid grid-cols-2 gap-4">
            <Typography variant="small">
              <strong>Building Age:</strong> 2 Years
            </Typography>
            <Typography variant="small">
              <strong>Parking:</strong> Attached Garage
            </Typography>
            <Typography variant="small">
              <strong>Cooling:</strong> Central Cooling
            </Typography>
            <Typography variant="small">
              <strong>Heating:</strong> Forced Air, Gas
            </Typography>
            <Typography variant="small">
              <strong>Sewer:</strong> Public/City
            </Typography>
            <Typography variant="small">
              <strong>Water:</strong> City
            </Typography>
            <Typography variant="small">
              <strong>Exercise Room:</strong> Yes
            </Typography>
            <Typography variant="small">
              <strong>Storage Room:</strong> Yes
            </Typography>
          </div>
        </div>

        <div>
          <Typography variant="h4" className="mb-4">
            Features
          </Typography>
          <hr className="mb-4 border-2 text-blue-gray-400" />
          <div className="grid grid-cols-2 gap-4">
            <Checkbox label="Air Conditioning" checked readOnly />
            <Checkbox label="Swimming Pool" checked readOnly />
            <Checkbox label="Central Heating" checked readOnly />
            <Checkbox label="Laundry Room" readOnly />
            <Checkbox label="Gym" checked readOnly />
            <Checkbox label="Alarm" readOnly />
            <Checkbox label="Window Covering" checked readOnly />
            <Checkbox label="Internet" readOnly />
          </div>
        </div>

        <div>
          <Typography variant="h4" className="mb-4">
            Floor Plans
          </Typography>
          <hr className="mb-4 border-2 text-blue-gray-400" />
          <FloorplanAccordion floorplans={floorplansData} />
        </div>

        <div>
          <Typography variant="h4" className="mb-4">
            Location
          </Typography>
          <hr className="mb-4 border-2 text-blue-gray-400" />
          <div className="h-96 rounded-lg overflow-hidden">
            <Map
              latitude={22.75249230688784}
              longitude={73.15083361974744}
              title="Title of the property"
            />
          </div>
        </div>
      </CardBody>

      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={active}
              className="max-h-full max-w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              alt="Full-screen view"
            />
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={handleCloseFullScreen}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default DetailedViewCardComponent;
