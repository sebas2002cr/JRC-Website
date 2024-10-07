"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Courses() {
  return (
    <div className="">
      {/* Encabezado de la Sección */}
      <section className="bg-white p-2 py-16 text-center">
        <p className="text-s mb-4 text-center font-bold text-[#305832]">
          Cursos Online Próximamente
        </p>
        <h2 className="mb-4 text-3xl font-bold text-black sm:text-5xl ">
          ¡Pronto disponibles!
        </h2>
        <h2 className="mb-4 text-3xl font-bold text-black sm:text-5xl">
          Cursos en Contabilidad y Finanzas
        </h2>

        <p className="mb-12 text-gray-600">
          Estamos trabajando en cursos que te ayudarán a mejorar tu
          conocimiento en contabilidad y finanzas. ¡Mantente atento
          para más detalles!
        </p>

        <div className="shadow-m mx-auto max-w-6xl rounded-lg border border-[#305832] px-4 py-8 ">
          <h3 className="mb-8 text-lg font-semibold text-gray-700">
            Los mejores cursos para llevar tu negocio al siguiente
            nivel.
          </h3>
          <p className="text-gray-500">
            Pronto podrás acceder a contenido exclusivo y
            personalizado por expertos.
          </p>
        </div>
      </section>
    </div>
  );
}
