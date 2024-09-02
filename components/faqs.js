"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQ({ faqs }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Variantes para la animación de las respuestas
  const answerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border-b border-gray-200 py-4 cursor-pointer"
          onClick={() => toggleFAQ(index)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{faq.question}</h3>
            <span className="text-gray-400">
              {openFAQ === index ? "-" : "+"}
            </span>
          </div>
          <motion.div
            initial="hidden"
            animate={openFAQ === index ? "visible" : "hidden"}
            variants={answerVariants}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-4 text-gray-600">{faq.answer}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
