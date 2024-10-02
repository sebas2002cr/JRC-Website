"use client";
import FAQ from "@/components/faqs";
import { useEffect, useState } from "react";
import { getFAQs } from "@/lib/sanity/client";
import { motion, useAnimation } from "framer-motion";

export default function Partners() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchSanityFAQs = async () => {
      const data = await getFAQs(); // Obtener FAQs desde Sanity
      setFaqs(data);
    };

    fetchSanityFAQs();
  }, []);
  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 150 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-12 bg-white">
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
        {/* Botón */}
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
      <div className="m-4 flex flex-col items-center justify-center space-y-4 py-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        {/* First Card */}
        <div className="group relative h-auto w-full rounded-[20px] border-2 border-[#c3c6ce] bg-white p-6 transition duration-500 ease-out hover:border-[#305832] hover:shadow-lg lg:w-1/3">
          <div className="place-content-left h-full gap-4 text-[#305832]">
            <p className="mb-6 text-xl font-bold sm:text-4xl">
              Afiliados
            </p>
            <p className="mb-4 text-sm text-[#305832] sm:text-base">
              Recomienda y ganá, así de sencillo. Los pagos comienzan
              en 5% por referencia, pagados mensualmente.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <img
              src="/referral.svg"
              alt="Afiliados"
              className="h-auto w-3/4 object-contain sm:w-1/2" // Controlar tamaño
            />
          </div>
          <a
            href="#link"
            className="absolute bottom-0 left-1/2 w-[70%] translate-x-[-50%] translate-y-[125%] transform transform rounded-lg bg-[#305832] px-4 py-[0.5rem] text-center text-base text-white opacity-0 transition duration-300 group-hover:translate-y-[50%] group-hover:opacity-100">
            Contáctanos
          </a>
        </div>

        {/* Second Card */}
        <div className="group relative h-auto w-full rounded-[20px] border-2 border-[#c3c6ce] bg-[#305832] p-6 transition duration-500 ease-out hover:border-white hover:shadow-lg lg:w-1/3">
          <div className="flex h-full flex-col justify-between gap-4 text-white">
            <div>
              <p className="mb-6 text-xl font-bold sm:text-4xl">
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
            <img
              src="/clients.svg"
              alt="Marca Blanca"
              className="h-auto w-3/4 object-contain sm:w-1/2" // Controlar tamaño
            />
          </div>
          <a
            href="#link"
            className="absolute bottom-0 left-1/2 w-[70%] translate-x-[-50%] translate-y-[125%] transform transform rounded-lg border border-[#305832] bg-white px-4 py-[0.5rem] text-center text-base text-[#305832] opacity-0 transition duration-300 group-hover:translate-y-[50%] group-hover:opacity-100">
            Contáctanos
          </a>
        </div>
      </div>

      {/* Sección de socios */}
      <div class="mx-auto my-4 grid max-w-xl items-center gap-10 bg-white p-4 font-[sans-serif] lg:max-w-5xl lg:grid-cols-2">
        <div class="max-lg:text-center">
          <h2 class="mb-6 text-4xl font-extrabold text-[#305832] max-sm:text-2xl">
            ¿Encajas en el programa de socios de JRC?
          </h2>
          <p class="text-sm text-gray-600">
            Trabajamos con una gran variedad de socios de diversos
            sectores.
          </p>
          <button
            type="button"
            class="mt-6 flex items-center rounded-md border border-[#305832] px-4 py-2.5 text-sm tracking-wide text-[#305832] hover:bg-gray-50 max-lg:mx-auto">
            Hazte socio{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              class="ml-2 rotate-90">
              <path
                fill="#305832"
                d="M12.006 1a1 1 0 0 1 .838.463l7 11a1 1 0 0 1-.985 1.527l-3.364-.48a.434.434 0 0 0-.495.43V20c0 1.645-1.355 3-3 3s-3-1.355-3-3v-6.06a.434.434 0 0 0-.495-.43l-3.364.48a1 1 0 0 1-.985-1.527l7-11a1 1 0 0 1 .85-.463z"
                data-original="#000000"
                paint-order="fill markers stroke"></path>
            </svg>
          </button>
        </div>

        <div class="mx-auto grid w-full gap-2 sm:grid-cols-2">
          <div class="w-full rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-12 rounded-full bg-[#E5FAE7] fill-[#305832] p-3"
              viewBox="0 0 32 32">
              <path
                d="M28.068 12h-.128a.934.934 0 0 1-.864-.6.924.924 0 0 1 .2-1.01l.091-.091a2.938 2.938 0 0 0 0-4.147l-1.511-1.51a2.935 2.935 0 0 0-4.146 0l-.091.091A.956.956 0 0 1 20 4.061v-.129A2.935 2.935 0 0 0 17.068 1h-2.136A2.935 2.935 0 0 0 12 3.932v.129a.956.956 0 0 1-1.614.668l-.086-.091a2.935 2.935 0 0 0-4.146 0l-1.516 1.51a2.938 2.938 0 0 0 0 4.147l.091.091a.935.935 0 0 1 .185 1.035.924.924 0 0 1-.854.579h-.128A2.935 2.935 0 0 0 1 14.932v2.136A2.935 2.935 0 0 0 3.932 20h.128a.934.934 0 0 1 .864.6.924.924 0 0 1-.2 1.01l-.091.091a2.938 2.938 0 0 0 0 4.147l1.51 1.509a2.934 2.934 0 0 0 4.147 0l.091-.091a.936.936 0 0 1 1.035-.185.922.922 0 0 1 .579.853v.129A2.935 2.935 0 0 0 14.932 31h2.136A2.935 2.935 0 0 0 20 28.068v-.129a.956.956 0 0 1 1.614-.668l.091.091a2.935 2.935 0 0 0 4.146 0l1.511-1.509a2.938 2.938 0 0 0 0-4.147l-.091-.091a.935.935 0 0 1-.185-1.035.924.924 0 0 1 .854-.58h.128A2.935 2.935 0 0 0 31 17.068v-2.136A2.935 2.935 0 0 0 28.068 12ZM29 17.068a.933.933 0 0 1-.932.932h-.128a2.956 2.956 0 0 0-2.083 5.028l.09.091a.934.934 0 0 1 0 1.319l-1.511 1.509a.932.932 0 0 1-1.318 0l-.09-.091A2.957 2.957 0 0 0 18 27.939v.129a.933.933 0 0 1-.932.932h-2.136a.933.933 0 0 1-.932-.932v-.129a2.951 2.951 0 0 0-5.028-2.082l-.091.091a.934.934 0 0 1-1.318 0l-1.51-1.509a.934.934 0 0 1 0-1.319l.091-.091A2.956 2.956 0 0 0 4.06 18h-.128A.933.933 0 0 1 3 17.068v-2.136A.933.933 0 0 1 3.932 14h.128a2.956 2.956 0 0 0 2.083-5.028l-.09-.091a.933.933 0 0 1 0-1.318l1.51-1.511a.932.932 0 0 1 1.318 0l.09.091A2.957 2.957 0 0 0 14 4.061v-.129A.933.933 0 0 1 14.932 3h2.136a.933.933 0 0 1 .932.932v.129a2.956 2.956 0 0 0 5.028 2.082l.091-.091a.932.932 0 0 1 1.318 0l1.51 1.511a.933.933 0 0 1 0 1.318l-.091.091A2.956 2.956 0 0 0 27.94 14h.128a.933.933 0 0 1 .932.932Z"
                data-original="#000000"
              />
              <path
                d="M16 9a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7Zm0 12a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z"
                data-original="#000000"
              />
            </svg>
            <h3 class="mb-2 mt-4 text-base font-bold text-gray-800">
              Asesor o preparador fiscal
            </h3>
          </div>

          <div class="w-full rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-12 rounded-full bg-[#E5FAE7] p-3"
              viewBox="0 0 682.667 682.667">
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" data-original="#000000" />
                </clipPath>
              </defs>
              <g
                fill="none"
                class="stroke-[#305832]"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width="40"
                clip-path="url(#a)"
                transform="matrix(1.33 0 0 -1.33 0 682.667)">
                <path
                  d="M256 492 60 410.623v-98.925C60 183.674 137.469 68.38 256 20c118.53 48.38 196 163.674 196 291.698v98.925z"
                  data-original="#000000"
                />
                <path
                  d="M178 271.894 233.894 216 334 316.105"
                  data-original="#000000"
                />
              </g>
            </svg>
            <h3 class="mb-2 mt-4 text-base font-bold text-gray-800">
              Consultor de empresas
            </h3>
          </div>

          <div class="w-full rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-12 rounded-full bg-[#E5FAE7] fill-[#305832] p-3"
              viewBox="0 0 512.001 512.001">
              <path
                d="M271.029 0c-33.091 0-61 27.909-61 61s27.909 61 61 61 60-27.909 60-61-26.909-61-60-61zm66.592 122c-16.485 18.279-40.096 30-66.592 30-26.496 0-51.107-11.721-67.592-30-14.392 15.959-23.408 36.866-23.408 60v15c0 8.291 6.709 15 15 15h151c8.291 0 15-6.709 15-15v-15c0-23.134-9.016-44.041-23.408-60zM144.946 460.404 68.505 307.149c-7.381-14.799-25.345-20.834-40.162-13.493l-19.979 9.897c-7.439 3.689-10.466 12.73-6.753 20.156l90 180c3.701 7.423 12.704 10.377 20.083 6.738l19.722-9.771c14.875-7.368 20.938-25.417 13.53-40.272zM499.73 247.7c-12.301-9-29.401-7.2-39.6 3.9l-82 100.8c-5.7 6-16.5 9.6-22.2 9.6h-69.901c-8.401 0-15-6.599-15-15s6.599-15 15-15h60c16.5 0 30-13.5 30-30s-13.5-30-30-30h-78.6c-7.476 0-11.204-4.741-17.1-9.901-23.209-20.885-57.949-30.947-93.119-22.795-19.528 4.526-32.697 12.415-46.053 22.993l-.445-.361-21.696 19.094L174.28 452h171.749c28.2 0 55.201-13.5 72.001-36l87.999-126c9.9-13.201 7.2-32.399-6.299-42.3z"
                data-original="#000000"
              />
            </svg>
            <h3 class="mb-2 mt-4 text-base font-bold text-gray-800">
              Inmobiliario
            </h3>
          </div>

          <div class="w-full rounded-xl p-6 text-center transition-all duration-300 hover:shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline-block w-12 rounded-full bg-[#E5FAE7] fill-[#305832] p-3"
              viewBox="0 0 24 24">
              <g fill-rule="evenodd" clip-rule="evenodd">
                <path
                  d="M17.03 8.97a.75.75 0 0 1 0 1.06l-4.2 4.2a.75.75 0 0 1-1.154-.114l-1.093-1.639L8.03 15.03a.75.75 0 0 1-1.06-1.06l3.2-3.2a.75.75 0 0 1 1.154.114l1.093 1.639L15.97 8.97a.75.75 0 0 1 1.06 0z"
                  data-original="#000000"
                />
                <path
                  d="M13.75 9.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-1.25H14.5a.75.75 0 0 1-.75-.75z"
                  data-original="#000000"
                />
                <path
                  d="M3.095 3.095C4.429 1.76 6.426 1.25 9 1.25h6c2.574 0 4.57.51 5.905 1.845C22.24 4.429 22.75 6.426 22.75 9v6c0 2.574-.51 4.57-1.845 5.905C19.571 22.24 17.574 22.75 15 22.75H9c-2.574 0-4.57-.51-5.905-1.845C1.76 19.571 1.25 17.574 1.25 15V9c0-2.574.51-4.57 1.845-5.905zm1.06 1.06C3.24 5.071 2.75 6.574 2.75 9v6c0 2.426.49 3.93 1.405 4.845.916.915 2.419 1.405 4.845 1.405h6c2.426 0 3.93-.49 4.845-1.405.915-.916 1.405-2.419 1.405-4.845V9c0-2.426-.49-3.93-1.405-4.845C18.929 3.24 17.426 2.75 15 2.75H9c-2.426 0-3.93.49-4.845 1.405z"
                  data-original="#000000"
                />
              </g>
            </svg>
            <h3 class="mb-2 mt-4 text-base font-bold text-gray-800">
              Contable, CPA o tenedor de libros
            </h3>
          </div>
        </div>
      </div>

      {/* Sección de Preguntas Frecuentes */}
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
        <FAQ faqs={faqs} /> {/* Usa el componente FAQ */}
      </motion.section>

      {/* Espacio entre secciones */}
      <div className="my-8"></div>
    </div>
  );
}
