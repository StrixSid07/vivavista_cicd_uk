import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const WhyUs = () => {
  const content = [
    {
      title: "Expertise and Experience",
      description:
        "With years of industry experience, our team of skilled professionals brings deep knowledge and technical expertise to every project. We have successfully completed a diverse range of projects, from residential to commercial, ensuring top-notch quality and efficiency.",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1682093294820-095fe23ec9cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Comprehensive Services",
      description:
        "We offer a full spectrum of services, from initial planning and design to construction and post-construction management. Whether you need consulting, engineering, or construction approvals, we handle every aspect under one roof, making the process seamless and hassle-free.",
      imgSrc:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Commitment to Quality",
      description:
        "Quality is at the core of everything we do. We use the highest standards of construction practices, materials, and technology to deliver durable, sustainable, and aesthetically pleasing results that exceed expectations.",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1673468920800-c0bc6e9e674c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Customer-Centric Approach",
      description:
        "Your vision is our priority. We work closely with our clients, maintaining clear communication throughout the project to ensure that your needs are met and your expectations are surpassed. We believe in building lasting relationships based on trust and satisfaction.",
      imgSrc:
        "https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Timely Delivery",
      description:
        "We understand the importance of timelines in construction. Our project management approach is designed to deliver projects on schedule, without compromising on quality, ensuring that your project is completed efficiently and effectively.",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1661410871323-3902f73ccbea?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Safety and Compliance",
      description:
        "Safety is paramount in our operations. We adhere to strict safety protocols and ensure all our projects comply with local regulations and industry standards, providing peace of mind and minimizing risks.",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1677529102407-0d075eb2cbb9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Innovative Solutions",
      description:
        "We stay ahead of industry trends and incorporate the latest technologies and sustainable practices into our projects. Our innovative approach allows us to offer creative and cost-effective solutions tailored to your specific needs.",
      imgSrc:
        "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Proven Track Record",
      description:
        "Our portfolio of completed projects and satisfied clients speaks for itself. We have built a reputation for delivering high-quality construction services that stand the test of time",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1661331613662-98b07dee7882?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="bg-gradient-to-t from-blue-400 to-gray-100 py-16 px-6 md:px-12 mt-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <Typography variant="h2" className="text-gray-800 font-bold">
          WHY US?
        </Typography>
        <Typography variant="paragraph" className="text-gray-600 mt-4">
          Discover what sets us apart and why we are the right choice for your
          next project.
        </Typography>
      </div>

      <div className="space-y-12">
        {content.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              } w-full max-w-6xl mx-auto rounded-lg overflow-hidden shadow-lg`}
            >
              <div className="md:w-1/3 w-full">
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="w-96 h-48 object-cover"
                />
              </div>
              <CardBody className="md:w-2/3 p-6 flex flex-col justify-center">
                <Typography variant="h4" className="mb-4 text-gray-800">
                  {item.title}
                </Typography>
                <Typography variant="paragraph" className="text-gray-700">
                  {item.description}
                </Typography>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;
