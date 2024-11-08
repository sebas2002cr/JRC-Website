"use client";
import Counter from "@/components/counter";
import { useState, useEffect } from "react";
import { getReviews, getFAQs } from "@/lib/sanity/client";
import { motion, useAnimation } from "framer-motion";
import FAQ from "@/components/faqs";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export default function Post({ posts }) {
  const { t } = useTranslation();
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
      const randomNumber = Math.floor(Math.random() * 7);

      const reviewName = localStorage.setItem(
        "Review-name",
        data[randomNumber].name
      );
      const reviewPosition = localStorage.setItem(
        "Review-position",
        data[randomNumber].position
      );
      const reviewMessage = localStorage.setItem(
        "Review-message",
        data[randomNumber].review
      );
    };

    fetchSanityReviews();
  }, []);

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  // Duplica los reviews para crear un carrusel continuo
  const duplicatedReviews = [...reviews, ...reviews];

  // Variantes para animaciones
  const fadeInRight = {
    hidden: { opacity: 0, x: 150 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0 }
  };
  const reviewVariants = {
    animate: {
      x: ["0%", "-200%"], // Desplaza el 100% porque los reviews están duplicados
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40, // Ajusta la duración según tus necesidades
          ease: "linear"
        }
      }
    }
  };

  return (
    <>
      {posts && (
        <div className="overflow-x-hidden bg-white">
          {/* Sección de Hero */}
          <motion.section
            className="w-full bg-white  text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInRight}>
            <h1 className="mt-6 text-4xl font-bold text-[#305832] md:text-5xl">
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
                  Empezá a trabajar con nosotros
                </button>
              </a>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Estadísticas con animación */}
          <motion.section
            className="relative w-full py-12 text-white md:py-32"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInLeft}>
            {/* Carga la imagen explícitamente */}
            <Image
              src="/img/home-photo-bg.jpeg"
              alt="Imagen de fondo"
              layout="fill" // Hace que la imagen ocupe todo el contenedor
              objectFit="cover" // Hace que se comporte como un background
              className="absolute inset-0 z-0"
              priority
            />
            <div className="absolute inset-0 z-10 bg-[#305832] opacity-75"></div>
            <div className="relative z-20 mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8">
              {/* Contenido de estadísticas */}
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold">
                  <Counter end={11} duration={2000} />
                </p>
                <p className="mt-2 text-xl">Años de Experiencia</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold">
                  <Counter end={500} duration={2000} />
                </p>
                <p className="mt-2 text-xl">Clientes</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <p className="text-5xl font-bold">
                  <Counter end={20} duration={2000} />
                </p>
                <p className="mt-2 text-xl">Colaboradores</p>
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de "Cómo funciona" */}
          <motion.section
            className="flex flex-col items-center justify-center gap-12 bg-white px-6  md:flex-row md:px-12 lg:px-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInLeft}>
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
              <a href="/pricing">
                <button className="rounded-lg bg-[#305832] px-8 py-3 text-white shadow-md hover:bg-[#234621]">
                  Empezar
                </button>
              </a>
            </div>
            <div className="flex flex-col gap-8 md:w-1/3">
              <div className="my-3 flex items-start gap-4">
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
                    Elegí el plan que se ajuste a vos
                  </h4>
                  <p className="text-gray-600">
                    Explorá nuestras opciones y seleccioná el plan que
                    mejor se adapte a tus necesidades o a las de tu
                    empresa.
                  </p>
                </div>
              </div>
              <div className="my-3 flex items-start gap-4">
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
                    Contanos más sobre tu Negocio
                  </h4>
                  <p className="text-gray-600">
                    Completá el formulario para que podamos entender
                    mejor lo que necesitás y personalizar el plan
                    según tus requerimientos.
                  </p>
                </div>
              </div>
              <div className="my-3 flex items-start gap-4">
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
                  <h4 className=" font-bold text-black">
                    Recibí tu cotización y completá el pago
                  </h4>
                  <p className="text-gray-600">
                    Con base en tus necesidades, recibirás una
                    cotización clara. Una vez confirmado, podrás
                    completar el pago de forma rápida y segura.
                  </p>
                </div>
              </div>
              <div className="my-3 flex items-start gap-4">
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
                    Relajate, Nosotros nos ocupamos del resto
                  </h4>
                  <p className="text-gray-600">
                    Terminá el proceso y dejá todo en nuestras manos.
                    Nos encargamos de implementar tu plan mientras vos
                    te enfocás en hacer crecer tu negocio.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          <motion.section
            className="w-full bg-white "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInRight}>
            <div class="mx-auto my-4 max-w-5xl font-[sans-serif] max-md:max-w-xl">
              <div class="mx-auto max-w-2xl text-center">
                <h2 class="mb-6 text-center text-4xl font-extrabold text-[#305832]">
                  Detalles que nos caracterizan
                </h2>
                <p class="text-sm text-gray-600">
                  En JRC Consulting Group, ofrecemos soluciones
                  integrales y personalizadas para todos tus retos en
                  contabilidad y finanzas. Nuestro equipo experto y
                  enfoque innovador garantizan que tu negocio esté
                  siempre en las mejores manos.
                </p>
                <a href="/blog">
                  <button className="mx-auto mt-6 w-3/4 rounded-lg border border-[#305832] px-6 py-2 text-[#305832] shadow-md  duration-700 ease-in-out hover:bg-[#305832] hover:text-white sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
                    Noticias relevantes para tu negocio
                  </button>
                </a>
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
                      Eficiencia y Eficacia
                    </h3>
                    <p class="text-sm text-gray-600">
                      En JRC Consulting Group, la eficiencia y
                      eficacia nos caracterizan. Nos enfocamos en
                      optimizar recursos y tiempo para gestionar tus
                      procesos financieros y fiscales de forma precisa
                      y puntual, permitiéndote centrarte en el
                      crecimiento de tu negocio.
                    </p>
                  </div>
                  <div class="max-md:order-1">
                    <h3 class="mb-4 text-2xl font-bold text-[#305832]">
                      Excelente servicio al cliente con Representante
                      Exclusivo
                    </h3>
                    <p class="text-sm text-gray-600">
                      En JRC Consulting Group, te ofrecemos un
                      servicio al cliente de excelencia, brindándote
                      la atención personalizada que merecés. Contás
                      con un representante exclusivo que conoce a
                      fondo tu negocio y está siempre disponible para
                      resolver tus necesidades de forma rápida y
                      eficiente.
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
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-20"></div>

          <motion.section
            className="w-full bg-white "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInLeft}>
            <div class="mx-auto my-8 max-w-5xl font-[sans-serif] max-md:max-w-xl">
              <div class="mx-auto max-w-2xl text-center">
                <h2 class="mb-6 text-center text-4xl font-extrabold text-[#305832]">
                  Cumplimiento
                </h2>
                <p class="text-sm text-gray-600">
                  En JRC Consulting Group, sabemos que cumplir con tus
                  obligaciones fiscales es esencial para tu empresa.
                  Por eso, te ofrecemos este timeline con las fechas
                  clave de impuestos y registros, como el IPJ, el ITEC
                  y el RTBF, para que siempre estés al día y nosotros
                  nos encargamos de todo.
                </p>
              </div>
              <section className="my-20 dark:bg-gray-100 dark:text-gray-800">
                <div className="container mx-auto max-w-5xl px-4 py-12">
                  <div className="mx-4 grid gap-4 sm:grid-cols-12">
                    <div className="col-span-12 sm:col-span-3">
                      <div className="mb-14 text-center before:mx-auto before:mb-5 before:block before:h-3 before:w-24 before:rounded-md before:dark:bg-violet-600 sm:text-left sm:before:mx-0">
                        <h3 className="text-3xl font-semibold">
                          Personas Jurídicas
                        </h3>
                        <span className="text-sm font-bold uppercase tracking-wider dark:text-gray-600">
                          Sociedades
                        </span>
                      </div>
                    </div>
                    <div className="relative col-span-12 space-y-6 px-4 sm:col-span-9">
                      <div className="relative col-span-12 space-y-12 px-4 before:dark:bg-gray-300 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:-left-3 sm:before:bottom-0 sm:before:top-2 sm:before:w-0.5">
                        <div className="flex flex-col before:dark:bg-violet-600 sm:relative sm:before:absolute sm:before:left-[-35px] sm:before:top-2 sm:before:z-[1] sm:before:h-4 sm:before:w-4 sm:before:rounded-full">
                          <h3 className="text-xl font-semibold tracking-wide text-[#305832]">
                            Impuesto a las Personas Jurídicas (IPJ)
                          </h3>
                          <time className="text-xs uppercase tracking-wide dark:text-gray-600">
                            Enero 31
                          </time>
                          <p className="mt-3 text-sm text-gray-500">
                            El IPJ es un impuesto anual que deben
                            pagar todas las sociedades inscritas en
                            Costa Rica, ya sean activas o inactivas.
                            Debe pagarse en enero de cada año, con
                            fecha límite el 31 de enero, para evitar
                            multas o recargos. Las sociedades
                            certificadas como PYME ante el MEIC son
                            exoneradas de este impuesto, siempre y
                            cuando su certificación se encuentre al
                            día.
                          </p>
                        </div>
                        <div className="flex flex-col before:dark:bg-violet-600 sm:relative sm:before:absolute sm:before:left-[-35px] sm:before:top-2 sm:before:z-[1] sm:before:h-4 sm:before:w-4 sm:before:rounded-full">
                          <h3 className="text-xl font-semibold tracking-wide text-[#305832]">
                            Impuesto de Timbre Educación y Cultura
                            (ITEC)
                          </h3>
                          <time className="text-xs uppercase tracking-wide dark:text-gray-600">
                            Marzo 31
                          </time>
                          <p className="mt-3 text-sm text-gray-500">
                            El Impuesto de Timbre Educación y Cultura
                            en Costa Rica es un tributo aplicado a
                            ciertos documentos legales y contables,
                            como contratos y escrituras. Se paga
                            mediante la adhesión de timbres fiscales,
                            y su objetivo principal es financiar
                            programas educativos y culturales.
                          </p>
                        </div>
                        <div className="flex flex-col before:dark:bg-violet-600 sm:relative sm:before:absolute sm:before:left-[-35px] sm:before:top-2 sm:before:z-[1] sm:before:h-4 sm:before:w-4 sm:before:rounded-full">
                          <h3 className="text-xl font-semibold tracking-wide text-[#305832]">
                            Registro de Transparencia y Beneficiarios
                            Finales (RTBF)
                          </h3>
                          <time className="text-xs uppercase tracking-wide dark:text-gray-600">
                            Abril 30
                          </time>
                          <p className="mt-3  text-sm text-gray-500">
                            Este es un registro obligatorio en el que
                            todas las personas jurídicas (como
                            sociedades anónimas y sociedades de
                            responsabilidad limitada) deben declarar
                            quiénes son sus beneficiarios finales, es
                            decir, las personas físicas que tienen
                            control o propiedad sobre la sociedad.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <hr class="mx-auto my-2 h-1 w-48 rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-10" />
              <p class="text-center text-xl italic text-gray-500 dark:text-gray-400 rtl:text-right">
                Si tenés un local comercial, recordá la presentación
                de la Declaración Jurada de Patente Comercial.
              </p>
              <hr class="mx-auto my-2 h-1 w-48 rounded border-0 bg-gray-400 dark:bg-gray-700 md:my-10" />
            </div>
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Testimonios con scroll horizontal y animación infinita */}
          <motion.section
            className="w-full bg-white "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInRight}>
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
                    className="  h-fit w-72 flex-none rounded-lg border bg-white p-6 shadow-md">
                    <p className="mb-4 italic text-gray-700">
                      {review.review && (
                        <span>&quot;{review.review}&quot;</span>
                      )}
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
            className=" w-full bg-white "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInLeft}>
            <h2 className="mb-8 text-center text-3xl font-semibold">
              <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#305832]">
                <span className="relative text-white">
                  Preguntas Frequentes
                </span>
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
              Todo lo que ocupás saber de nuestros servicios.
            </p>
            <FAQ faqs={faqs} /> {/* Usa el componente FAQ */}
          </motion.section>

          {/* Espacio entre secciones */}
          <div className="my-8"></div>

          {/* Sección de Llamada a la Acción (CTA) */}
          <motion.section
            className="flex w-full justify-center bg-gradient-to-r from-gray-50  to-white "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInRight}>
            <div className="m-4 max-w-xl rounded-lg bg-gradient-to-b from-[#94AB98] to-white p-8 text-center shadow-lg">
              <div className="mb-6">
                <Image
                  src="/Logo-blanco.svg"
                  alt="JRC Logo"
                  width={48} // Ajusta según el tamaño que necesites
                  height={48} // Ajusta según el tamaño que necesites
                  className="mx-auto" // Puedes mantener solo las clases que no se relacionan con el tamaño
                />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">
                Empezá con nostros
              </h3>
              <p className="mb-8 text-gray-600">
                Agendá una llamada gratuita con uno de nuestros
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
