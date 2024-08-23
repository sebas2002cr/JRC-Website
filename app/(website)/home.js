"use client";  
import Counter from "@/components/Counter";
import { useState, useEffect } from "react";
import { getReviews, getFAQs } from "@/lib/sanity/client";
import { motion } from "framer-motion";

export default function Post({ posts }) {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchSanityFAQs = async () => {
      const data = await getFAQs(); // Obtener FAQs desde Sanity
      setFaqs(data);
    };

    fetchSanityFAQs();
  }, []);

  useEffect(() => {
    const fetchSanityReviews = async () => {
      const data = await getReviews();
      setReviews(data);
    };

    fetchSanityReviews();
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 250 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {posts && (
        <div className="bg-white">
          {/* Sección de Hero */}
          <motion.section 
            className="w-full text-center py-16 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#305832]">
              Revolucionando la consultoría
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-black mt-4">
              Tu éxito, nuestra prioridad
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              La manera más sencilla de iniciar, hacer crecer y gestionar tu negocio: constitución, impuestos y contabilidad.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <a href="/pricing">
              <button className="px-6 py-2 sm:px-8 sm:py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621] transition-all duration-300 ease-in-out w-3/4 sm:w-auto mx-auto sm:mx-0">
                Empezar
              </button>
              </a>
              <button className="px-6 py-2 sm:px-8 sm:py-3 border border-[#305832] text-[#305832] rounded-lg shadow-md hover:bg-green-50 transition-all duration-300 ease-in-out w-3/4 sm:w-auto mx-auto sm:mx-0">
                ¿Ya estás incorporado?
              </button>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Estadísticas con animación */}
          <motion.section 
            className="w-full relative text-white py-12 md:py-32" 
            style={{ backgroundImage: 'url("img/home-photo-bg.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <div className="absolute inset-0 bg-[#305832] opacity-75"></div>
            <div className="relative flex flex-wrap justify-center items-center gap-8 max-w-6xl mx-auto">
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold"><Counter end={11} duration={2000} /></p>
                <p className="mt-2 text-xl">Años de Experiencia</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold"><Counter end={1000} duration={2000} /></p>
                <p className="mt-2 text-xl">Clientes</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold"><Counter end={30} duration={2000} /></p>
                <p className="mt-2 text-xl">Colaboradores</p>
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de "Cómo funciona" */}
          <motion.section 
            className="py-16 bg-white flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-12 lg:px-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <div className="md:w-1/4 text-left">
              <h3 className="text-xl font-semibold text-[#305832] mb-4">Cómo funciona</h3>
              <h2 className="text-3xl font-bold text-black mb-6">Empieza en cuestión de minutos</h2>
              <p className="text-gray-600 mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at metus nec felis auctor volutpat ac et velit. Sed gravida ex vel nunc luctus, ut luctus nisl eleifend. Curabitur vehicula ante vel leo efficitur imperdiet.
              </p>
              <button className="px-8 py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
                Empezar
              </button>
            </div>
            <div className="md:w-1/3 flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-green-100">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#305832]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">Select your plan</h4>
                  <p className="text-gray-600">Pick a plan to get everything you need to start operating a business smoothly and confidently.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-green-100">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#305832]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">We start the process</h4>
                  <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-green-100">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#305832]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">Get your company's EIN</h4>
                  <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-green-100">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#305832]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">Stay compliant</h4>
                  <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Servicios */}
          <motion.section 
            className="w-full bg-[#f6f6f6] py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-center text-3xl font-semibold mb-8">
              Mientras tú creces, nosotros cuidamos los detalles
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4">
                  {/* Coloca aquí el icono correspondiente */}
                </div>
                <h3 className="text-xl font-semibold mb-2">Start your business from home</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at metus nec felis auctor volutpat ac et velit.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4">
                  {/* Coloca aquí el icono correspondiente */}
                </div>
                <h3 className="text-xl font-semibold mb-2">Tax & Bookkeeping</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at metus nec felis auctor volutpat ac et velit.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4">
                  {/* Coloca aquí el icono correspondiente */}
                </div>
                <h3 className="text-xl font-semibold mb-2">Human customer support</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam at metus nec felis auctor volutpat ac et velit.</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
            <a href="/pricing">
              <button className="px-8 py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
                Empezar
              </button>
              </a>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Testimonios con scroll horizontal */}
          <motion.section 
            className="w-full bg-white py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-center text-3xl font-semibold mb-8">
              Opiniones que reflejan nuestro compromiso   
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Hemos ayudado a cientos de emprendedores con sus negocios en Costa Rica con total tranquilidad.
            </p>
            <div className="flex justify-center">
              <div className="flex overflow-x-auto pb-4 space-x-4 max-w-6xl">
                {reviews.map((review, index) => (
                  <div key={index} className="flex-none bg-white p-6 rounded-lg shadow-md w-72">
                    <p className="text-gray-700 italic mb-4">"{review.review}"</p>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.position}</p>
                    {review.company && (
                      <p className="text-xs text-gray-400">{review.company}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Preguntas Frecuentes */}
          <motion.section 
            className="w-full bg-white py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <h2 className="text-center text-3xl font-semibold mb-8">
            <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-[#305832] relative inline-block">
                  <span className="relative text-white">Preguntas Frequentes</span>
                </span>
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Todo lo que ocupas saber sobre nuestros servicios.
            </p>
            <div className="max-w-3xl mx-auto space-y-4">
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
                  {openFAQ === index && (
                    <p className="mt-4 text-gray-600">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Llamada a la Acción (CTA) */}
          <motion.section 
            className="w-full bg-gradient-to-r from-gray-200 to-white py-16 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <div className="bg-gradient-to-b from-[#94AB98] to-white rounded-lg shadow-lg p-8 max-w-xl text-center">
              <div className="mb-6">
                <img src="/Logo-blanco.svg" alt="JRC Logo" className="mx-auto w-12 h-12"/>
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Empezá con nostros
              </h3>
              <p className="text-gray-600 mb-8">
                Agenda una llamada gratuita con uno de nuestros asesores para resolver todas tus dudas.
              </p>
              <a href="/pricing">
              <button className="px-8 py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
                Comenzar
              </button>
              </a>
            </div>
          </motion.section>
        </div>
      )}
    </>
  );
}
