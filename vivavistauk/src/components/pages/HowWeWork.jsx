import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const steps = [
  {
    title: "1. Project Planning and Feasibility",
    content: [
      "Define Project Scope: Clearly outline the project’s objectives, scope, and deliverables. Determine what is to be built, the required materials, and the expected outcomes.",
      "Conduct Feasibility Study: Assess the viability of the project, considering factors like budget, site conditions, regulatory requirements, and potential risks.",
      "Budgeting: Develop a detailed budget that includes costs for design, construction, permits, and contingencies. Ensure you have sufficient funds to cover the entire project.",
    ],
  },
];

const HowWeWork = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-t from-blue-400 to-gray-100"
    >
      <div className="max-w-4xl mx-auto p-4 mt-4 md:mt-12 lg:mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">HOW WE WORKS?</h2>
        <p className="text-center text-lg font-semibold mb-4">
          CRUCIAL STEPS THAT WE FOLLOW
        </p>
        <div>
          {steps.map((step, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center w-full p-4 bg-gray-200 rounded-md focus:outline-none"
              >
                <span className="font-bold text-xl">{step.title}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedIndex === index ? "auto" : 0,
                  opacity: expandedIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-transparent rounded-md"
              >
                <div className="p-4 text-black">
                  {step.content.map((line, lineIndex) => (
                    <p key={lineIndex} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HowWeWork;
