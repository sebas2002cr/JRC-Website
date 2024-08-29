"use client";
import { useState, useEffect } from "react";
import { getBenefits } from "@/lib/sanity/client";
import { urlForBenefitImage } from "@/lib/sanity/schemas/imageIcon";
import { motion, AnimatePresence } from "framer-motion";

export default function Benefits() {
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  useEffect(() => {
    const fetchSanityBenefits = async () => {
      const data = await getBenefits();
      setBenefits(data);
    };
    fetchSanityBenefits();
  }, []);

  const handleBenefitClick = (benefit) => {
    setSelectedBenefit(benefit);
  };

  const handleCloseModal = () => {
    setSelectedBenefit(null);
  };

  return (
    <div className="">
      {/* Encabezado de la Sección */}
      <section className="py-16 bg-white text-center">
        <p className="mb-4 text-s font-bold text-[#305832] text-center">Beneficios</p>
        <h2 className="text-5xl font-bold text-black mb-4">Más beneficios que ninguna</h2>
        <h2 className="text-5xl font-bold text-black mb-4">otra plataforma</h2>

        <p className="text-gray-600 mb-12">Aprovecha las ventajas que solo nuestros clientes disfrutan.</p>
        
        <div className="bg-green-100 py-8 px-4 rounded-lg max-w-6xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-8">ASOCIADOS CON EMPRESAS EXCEPCIONALES.</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.length > 0 ? (
              benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={urlForBenefitImage(benefit.image)} 
                    alt={benefit.company}
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{benefit.company} | {benefit.tag}</h4>
                    <span
                      onClick={() => handleBenefitClick(benefit)}
                      className="text-green-600 text-sm cursor-pointer hover:underline">
                      Ver beneficio
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron beneficios.</p>
            )}
          </div>
        </div>
      </section>

      {/* Modal para mostrar el beneficio seleccionado */}
      <AnimatePresence>
        {selectedBenefit && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-lg p-8 max-w-lg w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}>
              <h3 className="text-xl font-bold mb-4">{selectedBenefit.company} | {selectedBenefit.tag}</h3>
              <p className="text-gray-700 mb-4">{selectedBenefit.reward}</p>
              <span
                onClick={handleCloseModal}
                className="text-green-600 text-sm cursor-pointer hover:underline">
                Cerrar
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sección de Llamada a la Acción (CTA) */}
      <section className="w-full bg-gradient-to-r from-gray-200 to-white py-16 flex justify-center">
        <div className="bg-gradient-to-b from-[#94AB98] to-white rounded-lg shadow-lg p-8 max-w-xl text-center">
          <div className="mb-6">
            <img src="/Logo-blanco.svg" alt="JRC Logo" className="mx-auto w-12 h-12"/>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-[#305832]">
            Gratis
          </h3>
          <p className="text-gray-600 mb-8">
            Agendá una llamada de 15 min con un asesor para resolver todas tus dudas.
          </p>
          <a href="/schedule">
          <button className="px-8 py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
            Agenda una llamada
          </button>
          </a>
        </div>
      </section>
    </div>
  );
}
