"use client";
import FAQ from "@/components/faqs";
import { useEffect, useState } from "react";
import { getFAQs } from "@/lib/sanity/client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Partners() {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    const fetchSanityFAQs = async () => {
      const data = await getFAQs(); // Obtener FAQs desde Sanity
      setFaqs(data);
    };

    fetchSanityFAQs();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("Enviando datos de contacto: ", contactInfo);
    closeModal();
  };

  const fadeInUp = {
    hidden: { opacity: 0, x: 150 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0 }
  };

  const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-[#305832]">
            Dani
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={contactInfo.name}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700">
                Mensaje
              </label>
              <textarea
                name="message"
                value={contactInfo.message}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded bg-[#305832] px-4 py-2 text-white hover:bg-green-700">
                Enviar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-4 text-gray-500">
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-12 overflow-x-hidden bg-white">
      {/* Encabezado de la Sección */}
      <section className="bg-white p-2 py-16 text-center">
        <p className="text-s mb-4 text-center font-bold text-gray-700">
          Socios y Afiliados
        </p>
        <h2 className="mb-4 text-4xl font-bold text-[#305832] sm:text-6xl">
          Potenciá tu negocio
        </h2>
        <h2 className="mb-12 text-2xl font-bold text-black sm:text-4xl">
          con nuestro programa de socios
        </h2>
        <p className="text-sm text-gray-600 sm:text-base">
          Ofrecemos servicios de creación y cumplimiento de empresas
          para ampliar tus ingresos
        </p>
        <p className="mb-12 text-sm text-gray-600 sm:text-base">
          y agilizar operaciones internas.
        </p>
      </section>

      {/* Main Content Section */}
      <div className="py-8 text-center ">
        <h2 className="mb-4 text-3xl font-bold text-[#305832] sm:text-4xl">
          Tus clientes. Tu marca
        </h2>
        <p className="mb-4 text-sm text-gray-500 sm:text-base">
          Centrate en lo que mejor sabés hacer mientras JRC se encarga
          del resto. <br />
          Con un gestor de cuentas dedicado, podés maximizar tus
          ingresos y el valor de tus clientes.
        </p>
      </div>

      {/* Cards Section */}
      <motion.section
        className="w-full bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInLeft}>
        <div className="m-4 flex flex-col items-center justify-center space-y-4 py-8 lg:flex-row lg:space-x-8 lg:space-y-0">
          <div className="group relative h-auto w-full rounded-[20px] border-2 border-[#c3c6ce] bg-white p-6 transition duration-500 ease-out hover:border-[#305832] hover:shadow-lg lg:w-1/3">
            <div className="place-content-left h-full gap-4 text-[#305832]">
              <p className="mb-6 text-3xl font-bold sm:text-4xl">
                Afiliados
              </p>
              <p className="mb-4 text-sm text-[#305832] sm:text-base">
                Recomienda y ganá, así de sencillo. Los pagos
                comienzan en 5% por referencia, pagados mensualmente.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <Image
                src="/referral.svg"
                alt="Afiliados"
                width={300}
                height={200}
                className="h-auto w-3/4 object-contain sm:w-1/2"
              />
            </div>
            <button
              onClick={openModal}
              className="absolute bottom-0 left-1/2 w-[70%] translate-x-[-50%] translate-y-[125%] transform  rounded-lg bg-[#305832] px-4 py-[0.5rem] text-center text-base text-white opacity-0 transition duration-300 group-hover:translate-y-[50%] group-hover:opacity-100">
              Contáctanos
            </button>
          </div>

          <div className="group relative h-auto w-full rounded-[20px] border-2 border-[#c3c6ce] bg-[#305832] p-6 transition duration-500 ease-out hover:border-white hover:shadow-lg lg:w-1/3">
            <div className="flex h-full flex-col justify-between gap-4 text-white">
              <div>
                <p className="mb-6 text-3xl font-bold sm:text-4xl">
                  Marca blanca
                </p>
                <p className="mb-4 text-sm text-white sm:text-base">
                  Servicios privados de marca blanca: nunca nos
                  pondremos en contacto con sus clientes. Obtené
                  precios al por mayor con descuento.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end">
              <Image
                src="/clients.svg"
                alt="Afiliados"
                width={300}
                height={200}
                className="h-auto w-3/4 object-contain sm:w-1/2"
              />
            </div>
            <button
              onClick={openModal}
              className="absolute bottom-0 left-1/2 w-[70%] translate-x-[-50%] translate-y-[125%] transform  rounded-lg border border-[#305832] bg-white px-4 py-[0.5rem] text-center text-base text-[#305832] opacity-0 transition duration-300 group-hover:translate-y-[50%] group-hover:opacity-100">
              Contáctanos
            </button>
          </div>
        </div>
      </motion.section>

      <ContactModal isOpen={isModalOpen} onClose={closeModal} />

      <motion.section
        className="w-full bg-white py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}>
        <h2 className="mb-8 text-center text-3xl font-semibold">
          <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#305832]">
            <span className="relative text-white">
              Preguntas Frequentes
            </span>
          </span>
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
          Todo lo que ocupas saber sobre nuestros servicios.
        </p>
        <FAQ faqs={faqs} />
      </motion.section>

      <div className="my-8"></div>
    </div>
  );
}
