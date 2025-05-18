// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { FaChevronDown } from "react-icons/fa";
// import axios from "axios";
// import { Base_Url } from "../../utils/Api";

// const FaqsAccordion = () => {
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [faqs, setFaqs] = useState([]);

//   useEffect(() => {
//     const fetchFaqs = async () => {
//       try {
//         const res = await axios.get(`${Base_Url}/faqs`);
//         setFaqs(res.data);
//       } catch (error) {
//         console.error("Error fetching faqs:", error);
//       }
//     };

//     fetchFaqs();
//   }, []);

//   const toggleAccordion = (index) => {
//     setExpandedIndex(expandedIndex === index ? null : index);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-3xl font-bold text-center mb-8">FAQ’s</h2>
//       {faqs.map((faq, index) => (
//         <div key={index} className="mb-4 border-b border-gray-300">
//           <button
//             onClick={() => toggleAccordion(index)}
//             className="w-full flex justify-between items-center py-4 focus:outline-none"
//           >
//             <span className="text-xl text-start font-bold md:w-full w-64">
//               {faq.question}
//             </span>
//             <FaChevronDown
//               className={`transition-transform duration-300 text-deep-orange-600 ${
//                 expandedIndex === index ? "rotate-180" : ""
//               }`}
//             />
//           </button>
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{
//               height: expandedIndex === index ? "auto" : 0,
//               opacity: expandedIndex === index ? 1 : 0,
//             }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <div className="py-2 font-medium">
//               <p className="mb-2 text-gray-700">{faq.answer}</p>
//               {faq.contactNumber && (
//                 <p className="mb-2 text-gray-700">
//                   <strong>Contact Number:</strong> {faq.contactNumber}
//                 </p>
//               )}
//               {faq.lists && faq.lists.length > 0 && (
//                 <ul className="list-disc ml-5 mb-2 text-gray-700">
//                   {faq.lists.map((item, i) => (
//                     <li key={i}>{item}</li>
//                   ))}
//                 </ul>
//               )}
//               {faq.links && faq.links.length > 0 && faq.linktitle && (
//                 <div className="text-gray-700">
//                   <strong>Links:</strong>
//                   <ul className="list-disc ml-5">
//                     {faq.links.map((link, i) => (
//                       <li key={i}>
//                         <a
//                           href={link}
//                           className="text-deep-orange-600 underline"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           {faq.linktitle[i]}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FaqsAccordion;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { Base_Url } from "../../utils/Api";

const FaqsAccordion = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      // 1) Try to load from localStorage
      const stored = localStorage.getItem("faqs");
      if (stored) {
        setFaqs(JSON.parse(stored));
        return;
      }
      // 2) Otherwise fetch from API
      try {
        const res = await axios.get(`${Base_Url}/faqs`);
        setFaqs(res.data);
        // 3) Save into localStorage for future mounts
        localStorage.setItem("faqs", JSON.stringify(res.data));
      } catch (error) {
        console.error("Error fetching faqs:", error);
      }
    };

    fetchFaqs();
  }, []);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">FAQ’s</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4 border-b border-gray-300">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center py-4 focus:outline-none"
          >
            <span className="text-xl text-start font-bold md:w-full w-64">
              {faq.question}
            </span>
            <FaChevronDown
              className={`transition-transform duration-300 text-deep-orange-600 ${
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
            className="overflow-hidden"
          >
            <div className="py-2 font-medium">
              <p className="mb-2 text-gray-700">{faq.answer}</p>
              {faq.contactNumber && (
                <p className="mb-2 text-gray-700">
                  <strong>Contact Number:</strong> {faq.contactNumber}
                </p>
              )}
              {faq.lists && faq.lists.length > 0 && (
                <ul className="list-disc ml-5 mb-2 text-gray-700">
                  {faq.lists.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {faq.links && faq.links.length > 0 && faq.linktitle && (
                <div className="text-gray-700">
                  <strong>Links:</strong>
                  <ul className="list-disc ml-5">
                    {faq.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link}
                          className="text-deep-orange-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {faq.linktitle[i]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default FaqsAccordion;
