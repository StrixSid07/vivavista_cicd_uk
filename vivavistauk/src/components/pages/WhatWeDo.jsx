import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const WhatWeDo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-t from-blue-400 to-gray-100"
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-4 md:mt-12 lg:mt-16">
        <Typography
          variant="h2"
          className="text-center font-bold text-gray-800 mb-8"
        >
          WHAT WE DO?
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {["New Home Construction", "Granny Flat Construction", "Duplex Construction"].map((title, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <Card className="shadow-lg">
                <img
                  src={
                    title === "New Home Construction"
                      ? "https://images.unsplash.com/photo-1518695455935-62feccc5f280?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      : title === "Granny Flat Construction"
                      ? "https://plus.unsplash.com/premium_photo-1677483760252-648063393d28?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      : "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?q=80&w=1779&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt={title}
                  className="h-56 w-full object-cover"
                />
                <CardBody className="text-center">
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-700"
                  >
                    {title.toUpperCase()}
                  </Typography>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12"
        >
          <Typography
            variant="h2"
            className="text-center font-bold text-white mb-8"
          >
            Our Team
          </Typography>
          <Typography className="text-white text-lg leading-relaxed">
            Our team of highly skilled professionals includes project managers,
            engineers, architects, and construction experts who work
            collaboratively to ensure every project is a success. With a focus
            on continuous improvement and professional development, we stay at
            the forefront of industry advancements to deliver outstanding
            results.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12"
        >
          <Typography
            variant="h2"
            className="text-center font-bold text-white mb-8"
          >
            Our Commitment
          </Typography>
          <Typography className="text-white text-lg leading-relaxed">
            At PRAMUKH HOMES, we are more than just builders; we are partners in
            your journey. We are committed to delivering exceptional quality,
            maintaining transparent communication, and ensuring that every
            project is completed to the highest standards.
          </Typography>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WhatWeDo;
