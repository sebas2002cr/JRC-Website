"use client";
import Counter from "@/components/Counter";
import { useState, useEffect } from "react";
import { getReviews, getFAQs } from "@/lib/sanity/client";
import { motion, useAnimation } from "framer-motion";
import FAQ from "@/components/faqs";

export default function Post({ posts }) {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const controls = useAnimation();

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

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  // Duplica los reviews para crear un carrusel continuo
  const duplicatedReviews = [...reviews, ...reviews];

  // Variantes para animaciones
  const fadeInUp = {
    hidden: { opacity: 0, y: 150 },
    visible: { opacity: 1, y: 0 }
  };

  const reviewVariants = {
    animate: {
      x: ["0%", "-70%"], // Desplaza el 100% porque los reviews están duplicados
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20, // Ajusta la duración según tus necesidades
          ease: "linear"
        }
      }
    }
  };

  return (
    <>
      {posts && (
        <div className="bg-white">
          {/* Sección de Hero */}
          <motion.section
            className="w-full bg-white py-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}>
            <h1 className="text-4xl font-bold text-[#305832] md:text-5xl">
              Revolucionando la consultoría
            </h1>
            <h2 className="mt-4 text-2xl font-semibold text-black md:text-3xl">
              Tu éxito, nuestra prioridad
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              La manera más sencilla de iniciar, hacer crecer y
              gestionar tu negocio: constitución, impuestos y
              contabilidad.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="/pricing">
                <button className="mx-auto w-3/4 rounded-lg bg-[#305832] px-6 py-2 text-white shadow-md  duration-700 ease-in-out hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832] sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
                  Empezar
                </button>
              </a>
              <button className="mx-auto w-3/4 rounded-lg border border-[#305832] px-6 py-2 text-[#305832] shadow-md  duration-700 ease-in-out hover:bg-[#305832] hover:text-white sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
                ¿Ya estás incorporado?
              </button>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Estadísticas con animación */}
          <motion.section
            className="relative w-full py-12 text-white md:py-32"
            style={{
              backgroundImage: 'url("img/home-photo-bg.jpeg")',
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}>
            <div className="absolute inset-0 bg-[#305832] opacity-75"></div>
            <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8">
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold">
                  <Counter end={11} duration={2000} />
                </p>
                <p className="mt-2 text-xl">Años de Experiencia</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold">
                  <Counter end={1000} duration={2000} />
                </p>
                <p className="mt-2 text-xl">Clientes</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold">
                  <Counter end={30} duration={2000} />
                </p>
                <p className="mt-2 text-xl">Colaboradores</p>
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de "Cómo funciona" */}
          <motion.section
            className="flex flex-col items-center justify-center gap-12 bg-white px-6 py-16 md:flex-row md:px-12 lg:px-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}>
            <div className="text-left md:w-1/4">
              <h3 className="mb-4 text-xl font-semibold text-[#305832]">
                Cómo funciona
              </h3>
              <h2 className="mb-6 text-3xl font-bold text-black">
                Empezá en cuestión de minutos
              </h2>
              <p className="mb-3 text-gray-600">
                Nosotros nos encargamos del papeleo legal y de los
                quebraderos de cabeza. Dedique unos minutos a rellenar
                algunos datos y nosotros crearemos todos los
                documentos necesarios para constituir su empresa y
                cumplir la normativa.{" "}
              </p>
              <button className="rounded-lg bg-[#305832] px-8 py-3 text-white shadow-md hover:bg-[#234621]">
                Empezar
              </button>
            </div>
            <div className="flex flex-col gap-8 md:w-1/3">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6 text-[#305832]">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">
                    Selecciona tu plan ideal
                  </h4>
                  <p className="text-gray-600">
                    Elije un plan para obtener todo lo que necesita
                    para empezar a operar un negocio en Costa Rica.
                    Sin problemas y con confianza.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6 text-[#305832]">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">
                    Cuéntanos de tus necesidades
                  </h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6 text-[#305832]">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">
                    Iniciamos el proceso.
                  </h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6 text-[#305832]">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-black">
                    Stay compliant
                  </h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          <div class="mx-auto my-4 max-w-5xl font-[sans-serif] max-md:max-w-xl">
            <div class="mx-auto max-w-2xl text-center">
              <h2 class="mb-6 text-center text-4xl font-extrabold text-[#305832]">
                Detalles que nos caracterizan
              </h2>
              <p class="text-sm text-gray-600">
                Desbloquea nuevas oportunidades con nuestras
                características exclusivas. Descubre cómo nuestras
                ofertas únicas pueden transformar tu experiencia y
                ayudarte a alcanzar más metas.
              </p>
            </div>

            <div class="m-4 mt-16">
              <div class="grid items-center gap-16 md:grid-cols-2">
                <div>
                  <img
                    src="/img/tax.png"
                    class="w-full rounded-md object-contain shadow-[0_14px_40px_-11px_rgba(93,96,127,0.2)]"
                  />
                </div>
                <div>
                  <h3 class="mb-4 text-2xl font-bold text-[#305832]">
                    Impuestos y Contabilidad
                  </h3>
                  <p class="text-sm text-gray-600">
                    Qui elit labore in nisi dolore tempor anim laboris
                    ipsum ad ad consequat id. Dolore et sint mollit in
                    nisi tempor culpa consectetur. Qui elit labore in
                    nisi dolore tempor anim laboris ipsum ad ad
                    consequat id.
                  </p>
                </div>
                <div class="max-md:order-1">
                  <h3 class="mb-4 text-2xl font-bold text-[#305832]">
                    Servicio al Cliente con Representante Exclusivo
                  </h3>
                  <p class="text-sm text-gray-600">
                    Qui elit labore in nisi dolore tempor anim laboris
                    ipsum ad ad consequat id. Dolore et sint mollit in
                    nisi tempor culpa consectetur. Qui elit labore in
                    nisi dolore tempor anim laboris ipsum ad ad
                    consequat id.
                  </p>
                </div>
                <div>
                  <img
                    src="/img/team.png"
                    class="w-full rounded-md object-contain shadow-[0_14px_40px_-11px_rgba(93,96,127,0.2)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Testimonios con scroll horizontal y animación infinita */}
          <motion.section
            className="w-full bg-white py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}>
            <h2 className="mb-8 text-center text-3xl font-semibold">
              Opiniones que reflejan nuestro compromiso
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
              Hemos ayudado a cientos de emprendedores con sus
              negocios en Costa Rica con total tranquilidad.
            </p>
            <div className="mx-auto max-w-4xl overflow-hidden p-4">
              <motion.div
                className="flex space-x-4"
                variants={reviewVariants}
                animate={controls}>
                {duplicatedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="w-72 flex-none rounded-lg bg-white p-6 shadow-md">
                    <p className="mb-4 italic text-gray-700">
                      "{review.review}"
                    </p>
                    <p className="text-sm font-semibold">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {review.position}
                    </p>
                    {review.company && (
                      <p className="text-xs text-gray-400">
                        {review.company}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
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

          {/* Sección de Llamada a la Acción (CTA) */}
          <motion.section
            className="flex w-full justify-center bg-gradient-to-r from-gray-200  to-white py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}>
            <div className="m-4 max-w-xl rounded-lg bg-gradient-to-b from-[#94AB98] to-white p-8 text-center shadow-lg">
              <div className="mb-6">
                <img
                  src="/Logo-blanco.svg"
                  alt="JRC Logo"
                  className="mx-auto h-12 w-12"
                />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">
                Empezá con nostros
              </h3>
              <p className="mb-8 text-gray-600">
                Agenda una llamada gratuita con uno de nuestros
                asesores para resolver todas tus dudas.
              </p>
              <a href="/schedule">
                <button className="rounded-lg bg-[#305832] px-8 py-3 text-white shadow-md hover:bg-[#234621]">
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
