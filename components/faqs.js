"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ({ faqs }) {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const toggleFAQ = index => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Variantes para la animación de apertura/cierre de las respuestas
  const answerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };

  // Variantes para la animación de apertura/cierre de las preguntas adicionales
  const additionalFaqsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" }
  };

  // Controla cuántas preguntas mostrar en función del estado showAll
  const initialFaqs = faqs.slice(0, 5);
  const additionalFaqs = faqs.slice(5);

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      {initialFaqs.map((faq, index) => (
        <div
          key={index}
          className="cursor-pointer border-b border-gray-200 py-4"
          onClick={() => toggleFAQ(index)}>
          <div className="flex items-center justify-between">
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
            className="overflow-hidden">
            <p className="mt-4 text-gray-600">{faq.answer}</p>
          </motion.div>
        </div>
      ))}

      {/* Contenedor animado para las preguntas adicionales */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={additionalFaqsVariants}
            transition={{ duration: 0.5 }}
            className="overflow-hidden">
            {additionalFaqs.map((faq, index) => (
              <div
                key={index + 5} // Offset para diferenciar las keys de las preguntas adicionales
                className="cursor-pointer border-b border-gray-200 py-4"
                onClick={() => toggleFAQ(index + 5)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {faq.question}
                  </h3>
                  <span className="text-gray-400">
                    {openFAQ === index + 5 ? "-" : "+"}
                  </span>
                </div>
                <motion.div
                  initial="hidden"
                  animate={
                    openFAQ === index + 5 ? "visible" : "hidden"
                  }
                  variants={answerVariants}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden">
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para ver más o ver menos */}
      {faqs.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full rounded border border-[#305832] py-2 font-semibold text-[#305832] transition duration-300 hover:bg-[#305832] hover:text-white">
          {showAll ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}
