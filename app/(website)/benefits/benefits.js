"use client";
import { useState, useEffect } from "react";
import { getBenefits } from "@/lib/sanity/client";
import { urlForBenefitImage } from "@/lib/sanity/schemas/imageIcon";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

  const handleBenefitClick = benefit => {
    setSelectedBenefit(benefit);
  };

  const handleCloseModal = () => {
    setSelectedBenefit(null);
  };

  return (
    <div className="">
      {/* Encabezado de la Sección */}
      <section className="bg-white p-2 py-16 text-center">
        <p className="text-s mb-4 text-center font-bold text-[#305832]">
          Beneficios
        </p>
        <h2 className="mb-4 text-3xl font-bold text-black sm:text-5xl ">
          Más beneficios que ninguna
        </h2>
        <h2 className="mb-4 text-3xl font-bold text-black sm:text-5xl">
          otra plataforma
        </h2>

        <p className="mb-12 text-gray-600">
          Aprovecha las ventajas que solo nuestros clientes disfrutan.
        </p>

        <div className="shadow-m mx-auto max-w-6xl rounded-lg border border-[#305832] px-4 py-8 ">
          <h3 className="mb-8 text-sm font-semibold text-gray-700">
            ASOCIADOS CON EMPRESAS EXCEPCIONALES.
          </h3>
        </div>
      </section>

      {/* Modal para mostrar el beneficio seleccionado */}
      <AnimatePresence>
        {selectedBenefit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-lg rounded-lg bg-white p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}>
              <h3 className="mb-4 text-xl font-bold">
                {selectedBenefit.company} | {selectedBenefit.tag}
              </h3>
              <p className="mb-4 text-gray-700">
                {selectedBenefit.reward}
              </p>
              <span
                onClick={handleCloseModal}
                className="cursor-pointer text-sm text-green-600 hover:underline">
                Cerrar
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sección de Llamada a la Acción (CTA) */}
      <section className="flex w-full justify-center bg-[#FAFFFB] p-4 py-16">
        <div className="max-w-xl rounded-lg bg-gradient-to-b from-[#94AB98] to-white p-8 text-center shadow-lg">
          <div className="mb-6">
            <Image
              src="/Logo-blanco.svg"
              alt="JRC Logo"
              width={48} // Ajusta según el tamaño que necesites
              height={48} // Ajusta según el tamaño que necesites
              className="mx-auto" // Puedes mantener solo las clases que no se relacionan con el tamaño
            />
          </div>
          <h3 className="mb-4 text-3xl font-bold text-[#305832]">
            Gratis
          </h3>
          <p className="mb-8 text-gray-600">
            Agendá una llamada de 15 min con un asesor para resolver
            todas tus dudas.
          </p>
          <a href="/schedule">
            <button className="rounded-lg bg-[#305832] px-8 py-3 text-white shadow-md hover:bg-[#234621]">
              Agenda una llamada
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
