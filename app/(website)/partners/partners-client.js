"use client";
import FAQ from "@/components/faqs";
import { useState, useEffect, useRef } from "react";
import { getFAQs } from "@/lib/sanity/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { enviarAlErp } from "@/lib/crm";
import { CasillaContacto, CampoTrampa, useTiempoEnPantalla } from "@/components/ui/consentimiento";

/**
 * /partners: el programa de afiliados y la marca blanca.
 *
 * Desde el 21 oct 2026 (programa de afiliados, H7) la solicitud entra como lead
 * en Comercial del ERP (`tipo: "afiliado"`, con `programa`), ya no va al
 * servidor viejo. Lleva la casilla de consentimiento, el campo trampa y el
 * tiempo en pantalla, como el resto de los formularios que llegan al ERP. Quien
 * pide ser afiliado deja su teléfono: Comercial le escribe por WhatsApp.
 */

const VACIO = { name: "", email: "", phone: "", message: "", partnerType: "Afiliado" };

export default function Partners({ condiciones = false }) {
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(VACIO);
  const [acepta, setAcepta] = useState(false);
  const [trampa, setTrampa] = useState("");
  const [estado, setEstado] = useState("form");
  const [error, setError] = useState({ campo: "", texto: "" });
  const msEnPantalla = useTiempoEnPantalla();
  const primerCampo = useRef(null);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 }
  };

  useEffect(() => {
    const fetchSanityFAQs = async () => {
      const data = await getFAQs();
      setFaqs(data);
    };
    fetchSanityFAQs();
  }, []);

  // Escape cierra el modal y, mientras está abierto, la página de atrás no se mueve.
  useEffect(() => {
    if (!isModalOpen) return undefined;
    const tecla = e => e.key === "Escape" && estado !== "enviando" && closeModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", tecla);
    const t = setTimeout(() => primerCampo.current?.focus(), 80);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", tecla);
      clearTimeout(t);
    };
  }, [isModalOpen, estado]);

  // Abre el modal con el tipo de la tarjeta desde la que se abrió.
  const openModal = (partnerType = "Afiliado") => {
    setContactInfo({ ...VACIO, partnerType });
    setAcepta(false);
    setTrampa("");
    setError({ campo: "", texto: "" });
    setEstado("form");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setContactInfo(prevInfo => ({ ...prevInfo, [name]: value }));
    if (error.campo === name || estado === "error") setError({ campo: "", texto: "" });
  };

  const esAfiliado = contactInfo.partnerType === "Afiliado";

  const handleSubmit = async e => {
    e.preventDefault();
    if (estado === "enviando") return;
    const nombre = contactInfo.name.trim();
    const correo = contactInfo.email.trim();
    const digitos = contactInfo.phone.replace(/\D/g, "");
    if (!nombre) return setError({ campo: "name", texto: "Escribí tu nombre." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return setError({ campo: "email", texto: "Escribí un correo válido." });
    if ((esAfiliado || digitos) && ![8, 11].includes(digitos.length)) {
      return setError({ campo: "phone", texto: "Escribí un teléfono de 8 dígitos." });
    }
    if (!acepta) return setError({ campo: "acepta", texto: "Marcá la casilla para que te podamos contactar." });

    setEstado("enviando");
    setError({ campo: "", texto: "" });
    const r = await enviarAlErp({
      tipo: "afiliado",
      programa: esAfiliado ? "afiliado" : "marcaBlanca",
      acepta: true,
      sitioWeb: trampa,
      msEnPantalla: msEnPantalla(),
      nombre,
      correo,
      telefono: contactInfo.phone,
      mensaje: contactInfo.message
    });
    if (r.ok) setEstado("gracias");
    else {
      setEstado("error");
      setError({ campo: "", texto: r.error });
    }
  };

  const campo = nombre =>
    `block w-full rounded-lg border bg-gray-50 p-2.5 text-sm text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 ${
      error.campo === nombre ? "border-red-600 dark:border-red-400" : "border-gray-300 dark:border-gray-500"
    }`;

  return (
    <div className="mb-12 overflow-x-hidden bg-white">
      {/* Encabezado de la Sección */}
      <section className="bg-white p-2 py-16 text-center">
        <p className="text-s mb-4 text-center font-bold text-gray-700">
          Socios y Afiliados
        </p>
        <h1 className="mb-4 text-4xl font-bold text-[#305832] sm:text-6xl">
          Potenciá tu negocio
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Ofrecemos servicios de creación y cumplimiento de empresas
          para ampliar tus ingresos y agilizar operaciones internas.
        </p>
        {/* La entrada al panel de los afiliados (decisión 13 del programa).
            <a> y no <Link>: el panel vive fuera del traductor del sitio.
            Desde el 22 oct 2026 es una franja oscura con la tarjeta del panel
            en chico (opción A de cuatro maquetas, elegida por Omar): el borde
            es un degradé de 1 px (el <a> lo pinta y la franja va adentro) y,
            al pasar el mouse, la tarjeta gira un poco. */}
        <a
          href="/afiliados"
          className="group mx-2 mt-8 block max-w-[640px] sm:mx-auto rounded-[21px] p-px text-white no-underline shadow-[0_20px_50px_rgba(15,21,18,0.25)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#305832]/30"
          style={{ background: "linear-gradient(120deg, rgba(111,224,166,0.7), rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.06) 60%, rgba(111,224,166,0.5))" }}>
          <span
            className="flex flex-col items-center gap-4 rounded-[20px] p-5 text-center sm:flex-row sm:gap-[22px] sm:py-4 sm:pl-[18px] sm:pr-4 sm:text-left"
            style={{ background: "radial-gradient(400px 160px at 15% 50%, rgba(61,138,102,0.35), transparent 70%), #0f1512" }}>
            <span aria-hidden="true" className="block w-[132px] flex-none [perspective:600px]">
              <span
                className="flex aspect-[1.6/1] flex-col justify-between rounded-xl px-3 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(255,255,255,0.08),0_10px_24px_rgba(0,0,0,0.35)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(-14deg)_rotateX(6deg)] group-hover:[transform:rotateY(8deg)_rotateX(-3deg)] motion-reduce:transition-none"
                style={{ background: "linear-gradient(135deg, #3d8a66 0%, #24523d 38%, #12301f 100%)" }}>
                <Image src="/Logo-blanco.svg" alt="" width={20} height={20} className="brightness-0 invert" />
                <span className="text-[10px] font-semibold">Recomendá y ganá</span>
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-semibold tracking-[-0.01em]">¿Ya sos afiliado?</span>
              <span className="mt-1 block text-sm text-[#a7b5ae]">Tus clientes, lo que ganás y tus pagos, en tu panel.</span>
            </span>
            <span className="inline-flex h-[46px] flex-none items-center rounded-xl bg-white px-5 text-[15px] font-semibold text-[#0f1512] transition-colors duration-200 group-hover:bg-[#e7f6ee]">
              Entrar a mi panel
            </span>
          </span>
        </a>
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

      {/* Cards. El botón se ve siempre: antes aparecía solo al pasar el mouse
          y en el celular no se podía tocar. */}
      <div className="m-4 flex flex-col items-stretch justify-center gap-6 py-8 lg:flex-row lg:items-start">
        <div className="group relative flex h-auto w-full flex-col rounded-[20px] border-2 border-[#c3c6ce] bg-white p-6 transition duration-500 ease-out hover:border-[#305832] hover:shadow-lg lg:w-1/3">
          <div className="place-content-left h-full gap-4 text-[#305832]">
            <p className="mb-6 text-3xl font-bold sm:text-4xl">Afiliados</p>
            <p className="mb-4 text-sm text-[#305832] sm:text-base">
              Recomendá y ganá, así de sencillo. Los pagos comienzan
              en 5% por referencia, pagados mensualmente.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Image src="/referral.svg" alt="" width={300} height={200} className="h-auto w-3/4 object-contain sm:w-1/2" />
          </div>
          <button
            type="button"
            onClick={() => openModal("Afiliado")}
            className="mt-6 w-full rounded-lg bg-[#305832] px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-[#1f3d27] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#305832]/30">
            Quiero ser afiliado
          </button>
        </div>

        <div className="group relative flex h-auto w-full flex-col rounded-[20px] border-2 border-[#c3c6ce] bg-[#305832] p-6 transition duration-500 ease-out hover:border-white hover:shadow-lg lg:w-1/3">
          <div className="flex h-full flex-col justify-between gap-4 text-white">
            <div>
              <p className="mb-6 text-3xl font-bold sm:text-4xl">Marca blanca</p>
              <p className="mb-4 text-sm text-white sm:text-base">
                Servicios privados de marca blanca: nunca nos
                pondremos en contacto con tus clientes. Obtené mejores
                tarifas al traer más cuentas.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Image src="/clients.svg" alt="" width={300} height={200} className="h-auto w-3/4 object-contain sm:w-1/2" />
          </div>
          <button
            type="button"
            onClick={() => openModal("Marca Blanca")}
            className="mt-6 w-full rounded-lg border border-white bg-white px-4 py-3 text-center text-base font-semibold text-[#305832] transition hover:bg-[#eef4ef] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
            Contactanos
          </button>
        </div>
      </div>

      {/* El modal va por encima de todo, también del selector del traductor. */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[120] bg-black bg-opacity-50 backdrop-blur-sm backdrop-brightness-75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => estado !== "enviando" && closeModal()}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="partners-titulo"
              className="pointer-events-none fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
              <div className="pointer-events-auto relative my-auto w-full max-w-md">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
                    <h3 id="partners-titulo" className="text-xl font-semibold text-gray-900 dark:text-white">
                      {estado === "gracias" ? "¡Gracias!" : esAfiliado ? "Quiero ser afiliado" : "Contactanos"}
                    </h3>
                    <button
                      onClick={closeModal}
                      type="button"
                      disabled={estado === "enviando"}
                      className="end-2.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                      <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                      </svg>
                      <span className="sr-only">Cerrar</span>
                    </button>
                  </div>

                  <div className="p-4 md:p-5">
                    {estado === "gracias" ? (
                      <div role="status" className="flex flex-col items-center py-4 text-center">
                        <span aria-hidden="true" className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#305832] text-white">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                        <p className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Recibimos tu solicitud</p>
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                          {esAfiliado
                            ? "Te escribimos en estos días para conocerte y contarte cómo funciona el programa."
                            : "Te escribimos en estos días para conversar sobre la marca blanca."}
                        </p>
                        <button type="button" onClick={closeModal} className="rounded-lg bg-[#305832] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1f3d27]">
                          Listo
                        </button>
                      </div>
                    ) : (
                      <form className="relative space-y-4" onSubmit={handleSubmit} noValidate>
                        <div>
                          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Nombre
                          </label>
                          <input ref={primerCampo} type="text" name="name" id="name" autoComplete="name" maxLength={120} value={contactInfo.name} onChange={handleInputChange} aria-invalid={error.campo === "name" ? "true" : "false"} className={campo("name")} />
                        </div>
                        <div>
                          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Correo electrónico
                          </label>
                          <input type="email" name="email" id="email" autoComplete="email" maxLength={160} value={contactInfo.email} onChange={handleInputChange} aria-invalid={error.campo === "email" ? "true" : "false"} className={campo("email")} />
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Teléfono{" "}
                            <span className="font-normal text-gray-500">{esAfiliado ? "(WhatsApp)" : "(opcional)"}</span>
                          </label>
                          <input type="tel" name="phone" id="phone" autoComplete="tel" inputMode="tel" placeholder="8888 8888" maxLength={20} value={contactInfo.phone} onChange={handleInputChange} aria-invalid={error.campo === "phone" ? "true" : "false"} className={campo("phone")} />
                        </div>
                        <div>
                          <label htmlFor="partnerType" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Tipo de socio
                          </label>
                          <select
                            name="partnerType"
                            id="partnerType"
                            value={contactInfo.partnerType}
                            onChange={handleInputChange}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white">
                            <option value="Afiliado">Afiliado</option>
                            <option value="Marca Blanca">Marca blanca</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Mensaje <span className="font-normal text-gray-500">(opcional)</span>
                          </label>
                          {/* Opcional a propósito: un campo libre obligatorio frena envíos. */}
                          <textarea
                            name="message"
                            id="message"
                            rows={3}
                            maxLength={2000}
                            placeholder={esAfiliado ? "Contanos a quién te gustaría recomendarnos." : "Contanos brevemente sobre tu negocio y cuántos clientes manejás."}
                            value={contactInfo.message}
                            onChange={handleInputChange}
                            className={campo("message")}
                          />
                        </div>
                        <CampoTrampa id="partners-sitio" valor={trampa} alCambiar={setTrampa} />
                        <CasillaContacto
                          id="partners-acepta"
                          acepta={acepta}
                          alCambiar={v => {
                            setAcepta(v);
                            if (error.campo === "acepta") setError({ campo: "", texto: "" });
                          }}
                          className={error.campo === "acepta" ? "rounded-lg p-2 ring-2 ring-red-600" : ""}
                        />
                        {esAfiliado && condiciones && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            El programa se rige por sus{" "}
                            <a href="/condiciones-afiliados" target="_blank" rel="noopener" className="font-medium text-[#305832] underline">
                              Condiciones del programa de afiliados
                            </a>
                            .
                          </p>
                        )}
                        {error.texto && (
                          <p role="alert" className="text-sm font-semibold text-red-700 dark:text-red-300">
                            {error.texto}
                          </p>
                        )}
                        <button
                          type="submit"
                          aria-busy={estado === "enviando" ? "true" : "false"}
                          disabled={estado === "enviando"}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#305832] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-[#305832]/30 disabled:opacity-80">
                          {estado === "enviando" ? (
                            <>
                              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              <span className="sr-only">Enviando</span>
                            </>
                          ) : estado === "error" ? (
                            "Intentar de nuevo"
                          ) : (
                            "Enviar"
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sección de Preguntas Frecuentes */}
      <section className="w-full bg-white py-16">
        <h2 className="mb-8 text-center text-3xl font-semibold">Preguntas Frecuentes</h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">Todo lo que ocupás saber de nuestros servicios.</p>
        <FAQ faqs={faqs} />
      </section>
    </div>
  );
}
