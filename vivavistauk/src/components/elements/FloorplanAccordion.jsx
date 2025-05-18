import React, { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { motion } from "framer-motion";

const FloorplanAccordion = ({ floorplans }) => {
  const [open, setOpen] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 select-none">
      <h2 className="text-2xl font-semibold mb-4">Floorplans</h2>
      {floorplans.map((floor, index) => (
        <Accordion
          key={index}
          open={open === index + 1}
          className="mb-4 border border-gray-300 rounded-md p-2"
        >
          <AccordionHeader
            onClick={() => handleOpen(index + 1)}
            className={`flex p-2 rounded-md justify-between items-center ${
              open === index + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            <span className="text-center">{floor.title}</span>
            <span className="ml-4 px-2 py-1 text-sm bg-green-200 rounded">
              {floor.size}
            </span>
          </AccordionHeader>
          <AccordionBody>
            <div
              className="w-full h-64 overflow-hidden rounded-md cursor-pointer"
              onClick={() => openImageModal(floor.imageUrl)}
            >
              <img
                src={floor.imageUrl}
                alt={floor.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <p className="text-gray-700 mt-4">{floor.description}</p>
          </AccordionBody>
        </Accordion>
      ))}

      {isModalOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.img
            src={selectedImage}
            alt="Enlarged view"
            className="max-w-full max-h-full rounded-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default FloorplanAccordion;
