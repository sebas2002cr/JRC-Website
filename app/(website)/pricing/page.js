"use client";
import { useState, useEffect } from "react";
import { getFAQs } from "@/lib/sanity/client";
import { motion, useAnimation } from "framer-motion";
import FAQ from "@/components/faqs";
import Link from "next/link";

const services = [
  "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
  "Asignación de ejecutivo de cuenta",
  "Asesoría tributaria y fiscal por parte del ejecutivo",
  "Acompañamiento mensual en el pago de impuestos",
  "Proyecciones trimestrales de Renta",
  "Elaboración de Estados Financieros en formato QuickBooks Online",
  "Elaboración y presentación de planilla CCSS e INS – Máximo 5 colaboradores"
];

const plans = [
  {
    name: "Starter",
    description: "La etapa inicial para pequeñas empresas.",
    price: "¢45.000",
    cta: "Escoger Plan",
    popular: false,
    url: "/plans/starter",
    features: [
      "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
      "Asignación de ejecutivo de cuenta",
      "Asesoría tributaria y fiscal por parte del ejecutivo",
      "Acompañamiento mensual en el pago de impuestos",
      "Proyecciones trimestrales de Renta"
    ]
  },
  {
    name: "Professional",
    description:
      "El apoyo que necesitas a medida que tu empresa crece.",
    price: "¢99.500",
    cta: "Escoger Plan",
    popular: true,
    url: "/plans/professional",
    features: [
      "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
      "Asignación de ejecutivo de cuenta",
      "Asesoría tributaria y fiscal por parte del ejecutivo",
      "Acompañamiento mensual en el pago de impuestos",
      "Proyecciones trimestrales de Renta",
      "Elaboración de Estados Financieros en formato QuickBooks Online"
    ]
  },
  {
    name: "Full Compliance",
    description: "Soporte completo en contabilidad y planilla.",
    price: "¢130.000",
    cta: "Escoger Plan",
    popular: false,
    url: "/plans/full-compliance",
    features: [
      "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
      "Asignación de ejecutivo de cuenta",
      "Asesoría tributaria y fiscal por parte del ejecutivo",
      "Acompañamiento mensual en el pago de impuestos",
      "Proyecciones trimestrales de Renta",
      "Elaboración de Estados Financieros en formato QuickBooks Online",
      "Elaboración y presentación de planilla CCSS e INS – Máximo 5 colaboradores"
    ]
  }
];

export default function Pricing() {
  const [faqs, setFaqs] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const fetchSanityFAQs = async () => {
      const data = await getFAQs();
      setFaqs(data);
    };
    fetchSanityFAQs();
  }, []);

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 150 },
    visible: { opacity: 1, y: 0 }
  };

  // Variantes para animaciones
  const fadeInRight = {
    hidden: { opacity: 0, x: 150 },
    visible: { opacity: 1, x: 0 }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0 }
  };
  const cardHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05 }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#fffff] px-4">
      <div className="w-full max-w-6xl">
        <div className="pt-20 text-center font-semibold">
          <h1 className="text-3xl md:text-5xl">
            <span className="tracking-wide text-[#305832]">
              Precios claros{" "}
            </span>
            <span>para empezar</span>
          </h1>
          <p className="w-full pt-6 text-lg font-normal text-gray-400 md:text-xl">
            Elige un plan que funcione mejor para vos y tu equipo.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col items-center justify-center gap-8 pt-12 md:flex-row md:pt-24">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`flex w-full flex-col justify-between rounded-xl p-8 text-center shadow-lg md:w-1/3 ${
                plan.popular
                  ? "bg-[#305832] text-white"
                  : "bg-white text-black"
              }`}
              style={{
                border: plan.popular
                  ? "4px solid #ffffff"
                  : "1px solid #e0e0e0",
                position: "relative",
                cursor: "pointer"
              }}
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardHover}
              transition={{ type: "spring", stiffness: 100 }}>
              <div>
                <h1
                  className={`mt-2 text-3xl font-bold ${plan.popular ? "text-white" : "text-[#305832]"}`}>
                  {plan.name}
                </h1>
                <hr
                  className={`my-4 ${plan.popular ? "border-white" : "border-gray-400"}`}
                />
                <p
                  className={`text-sm ${plan.popular ? "text-white" : "text-black"}`}>
                  {plan.description}
                </p>
                <div className="pt-6">
                  <span className="mb-1 block text-sm font-semibold text-gray-500">
                    Desde los
                  </span>
                  <p
                    className={`mt-6 flex items-baseline justify-center gap-x-2 ${plan.popular ? "text-white" : "text-gray-800"}`}>
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide ">
                      {" "}
                      IVAI
                    </span>
                  </p>
                </div>
              </div>
              {plan.popular && (
                <div
                  className="rounded-full bg-[#AA5AEF] px-2 py-1 text-xs text-white"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    zIndex: 10
                  }}>
                  Más popular
                </div>
              )}
              <Link href={plan.url} className="mt-8">
                <p className="w-full rounded-full border border-[#305832] bg-white py-3 text-center font-semibold text-[#305832]">
                  {plan.cta}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Título de Comparación */}
        <div className="mt-20 text-center font-semibold">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#305832]">
              <span className="relative text-4xl text-white ">
                ¿Qué incluye?
              </span>
            </span>
          </h2>
        </div>

        {/* Pricing Table */}
        <div className="mt-20 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b border-[#99B29B] px-4 py-2 text-left"></th>
                {plans.map((plan, index) => (
                  <th
                    key={index}
                    className={`border-b border-[#99B29B] px-4 py-2 ${
                      index === 1
                        ? "bg-[#f0f0f0] font-bold text-[#305832]"
                        : "text-gray-600"
                    }`}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((service, serviceIndex) => (
                <tr key={serviceIndex}>
                  <td className="border-b border-[#99B29B] px-4 py-2 text-left">
                    {service}
                  </td>
                  {plans.map((plan, planIndex) => (
                    <td
                      key={planIndex}
                      className={`border-b border-[#99B29B] px-4 py-2 text-center ${
                        plan.features.includes(service)
                          ? "text-[#305832]"
                          : "text-red-500"
                      }`}>
                      {plan.features.includes(service) ? "✓" : "✗"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sección de Otros Servicios */}
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-[#305832] sm:text-4xl">
                Otros de nuestros servicios
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Para más Información sobre estos servicios dirígete a
                nuestra página de contacto y haznos saber tus dudas.
              </p>
            </div>
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeInLeft}>
              <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                    Constitución de una Sociedad
                  </h3>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    Ideal para quienes desean constituir una sociedad
                    formal, ya sea una SRL o SA, asegurando el
                    cumplimiento de todos los requisitos legales y
                    fiscales.
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-[#305832]">
                      Nuestro servicio incluye:
                    </h4>
                    <div className="h-px flex-auto bg-gray-100"></div>
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Asesoría en la elección del tipo de sociedad
                      (SRL o SA) y en la redacción del pacto social.
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Trámite completo de inscripción de la sociedad
                      ante el Registro Nacional de Costa Rica.
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Obtención del número de cédula jurídica y
                      registro ante la Administración Tributaria.
                    </li>
                  </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">
                        Pago único
                      </p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                        {parseInt(process.env.NEXT_PUBLIC_PLAN_PRICE_CONSTITUTION).toLocaleString("es-CR", { style: "currency", currency: "CRC", minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\s/g, ".")}
                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          IVAI
                        </span>
                      </p>
                      <a
                        href="/constitucionSociedad"
                        className="mt-10 block w-full rounded-lg   bg-[#305832] px-3 py-2 text-white shadow-md transition duration-300 hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832]">
                        Comprar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeInRight}>
              <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                    Inscripción de PYME ante el MEIC
                  </h3>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    En JRC, nos encargamos de gestionar todos los
                    trámites necesarios para que tu empresa obtenga la
                    inscripción como PYME ante el Ministerio de
                    Economía, Industria y Comercio (MEIC) de Costa
                    Rica, incluyendo el registro en el Sistema
                    Electrónico de Información de Empresas (SIEC).
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-[#305832]">
                      Acorde al artículo 3 de la Ley N°8262, todas las
                      PYMES que quieran aprovechar <br /> los
                      beneficios de la presente Ley, deberán
                      satisfacer al menos
                      <br /> dos de los siguientes requisitos:
                    </h4>
                    <div className="h-px flex-auto bg-gray-100"></div>
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      El pago de cargas sociales (Al menos 1
                      colaborador en planillla de la CCSS).
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      El cumplimiento de obligaciones tributarias
                      (Estar inscrito en el Ministerio de Hacienda).
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      El cumplimiento de obligaciones laborales
                      (Contar con una póliza de riegos del trabajo del
                      INS).
                    </li>
                  </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">
                        Pago único
                      </p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                        {parseInt(process.env.NEXT_PUBLIC_PLAN_PRICE_PYME).toLocaleString("es-CR", { style: "currency", currency: "CRC", minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\s/g, ".")}

                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          IVAI
                        </span>
                      </p>
                      <a
                        href="/inscripcionPYME"
                        className="mt-10 block w-full rounded-lg   bg-[#305832] px-3 py-2 text-white shadow-md transition duration-300 hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832]">
                        Comprar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeInLeft}>
              <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                  <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                    Plan Régimen Simplificado
                  </h3>
                  <p className="mt-6 text-base leading-7 text-gray-600">
                    Perfecto para quienes manejan un negocio pequeño y
                    necesitan una gestión eficiente de sus
                    obligaciones fiscales bajo el Régimen
                    Simplificado.
                  </p>
                  <div className="mt-10 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-[#305832]">
                      Nuestro servicio incluye:
                    </h4>
                    <div className="h-px flex-auto bg-gray-100"></div>
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Declaraciones trimestrales D-105 (IVA & Renta).
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Asignación de ejecutivo de cuenta.
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Asesoría tributaria y fiscal por parte del
                      ejecutivo.
                    </li>
                    <li className="flex gap-x-3">
                      <svg
                        className="h-6 w-5 flex-none text-[#305832]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Acompañamiento en el pago de impuestos.
                    </li>
                  </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                    <div className="mx-auto max-w-xs px-8">
                      <p className="text-base font-semibold text-gray-600">
                        Pagos trimestrales
                      </p>
                      <p className="mt-6 flex items-baseline justify-center gap-x-2">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">
                          ¢75.000
                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          IVAI
                        </span>
                      </p>
                      <a
                        href="/contact"
                        className="mt-10 block w-full rounded-lg   bg-[#305832] px-3 py-2 text-white shadow-md transition duration-300 hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832]">
                        Obtener información
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <motion.section
          className="w-full bg-white py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeInRight}>
          <h2 className="mb-8 text-center text-3xl font-semibold">
            <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#305832]">
              <span className="relative text-white">
                Preguntas Frecuentes
              </span>
            </span>
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
            Todo lo que ocupás saber de nuestros servicios.
          </p>
          <FAQ faqs={faqs} />
        </motion.section>

        <div className="my-8"></div>
      </div>
    </div>
  );
}
