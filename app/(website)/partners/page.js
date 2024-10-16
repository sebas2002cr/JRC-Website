"use client";
import FAQ from "@/components/faqs";
import { useState, useEffect } from "react";
import { getFAQs } from "@/lib/sanity/client";
import Image from "next/image";
import axios from "axios";

export default function Partners() {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Fetch FAQs from Sanity
  useEffect(() => {
    const fetchSanityFAQs = async () => {
      const data = await getFAQs();
      setFaqs(data);
    };

    fetchSanityFAQs();
  }, []);

  // Open modal
  const openModal = () => setIsModalOpen(true);

  // Close modal and reset fields
  const closeModal = () => {
    setIsModalOpen(false);
    setContactInfo({ name: "", email: "", message: "" });
  };

  // Handle input change
  const handleInputChange = e => {
    const { name, value } = e.target;
    setContactInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4200/api/email/partners",
        contactInfo
      );
      console.log("Enviada la info de contacto");
    } catch (error) {
      console.error("Error al enviar la info:", error);
    }
    console.log("Enviando datos de contacto: ", contactInfo);
    setContactInfo({ name: "", email: "", message: "" });
    closeModal();
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
        <p className="text-sm text-gray-600 sm:text-base">
          Ofrecemos servicios de creación y cumplimiento de empresas
          para ampliar tus ingresos y agilizar operaciones internas.
        </p>
      </section>

      {/* Cards Section */}
      <div className="py-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-[#305832] sm:text-4xl">
          Tus clientes. Tu marca
        </h2>
        <p className="mb-4 text-sm text-gray-500 sm:text-base">
          Centrate en lo que mejor sabés hacer mientras JRC se encarga
          del resto. Con un gestor de cuentas dedicado, podés
          maximizar tus ingresos y el valor de tus clientes.
        </p>
      </div>

      {/* Cards */}
      <div className="m-4 flex flex-col items-center justify-center space-y-4 py-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        <div className="group relative h-auto w-full rounded-[20px] border-2 border-[#c3c6ce] bg-white p-6 transition duration-500 ease-out hover:border-[#305832] hover:shadow-lg lg:w-1/3">
          <div className="place-content-left h-full gap-4 text-[#305832]">
            <p className="mb-6 text-3xl font-bold sm:text-4xl">
              Afiliados
            </p>
            <p className="mb-4 text-sm text-[#305832] sm:text-base">
              Recomienda y ganá, así de sencillo. Los pagos comienzan
              en 5% por referencia, pagados mensualmente.
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
            className="absolute bottom-0 left-1/2 w-[70%] translate-x-[-50%] translate-y-[125%] transform rounded-lg bg-[#305832] px-4 py-[0.5rem] text-center text-base text-white opacity-0 transition duration-300 group-hover:translate-y-[50%] group-hover:opacity-100">
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
                pondremos en contacto con sus clientes. Obtené precios
                al por mayor con descuento.
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
            className="absolute bottom-0 left-1/2 w-[70%] translate-x-[-50%] translate-y-[125%] transform rounded-lg border border-[#305832] bg-white px-4 py-[0.5rem] text-center text-base text-[#305832] opacity-0 transition duration-300 group-hover:translate-y-[50%] group-hover:opacity-100">
            Contáctanos
          </button>
        </div>
      </div>

      {/* Main modal */}
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          isModalOpen ? "flex" : "hidden"
        } fixed left-0 right-0 top-0 z-50 h-[calc(100%-1rem)] max-h-full w-full items-center justify-center md:inset-0`}>
        <div className="relative max-h-full w-full max-w-md p-4">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contáctanos
              </h3>
              <button
                onClick={closeModal}
                type="button"
                className="end-2.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal">
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={contactInfo.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={contactInfo.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900  dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    value={contactInfo.message}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#305832] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Preguntas Frecuentes */}
      <section className="w-full bg-white py-16">
        <h2 className="mb-8 text-center text-3xl font-semibold">
          Preguntas Frequentes
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
          Todo lo que ocupas saber sobre nuestros servicios.
        </p>
        <FAQ faqs={faqs} />
      </section>
    </div>
  );
}
