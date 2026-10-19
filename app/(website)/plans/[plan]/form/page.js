"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { avisarAlErp } from "@/lib/crm";
import { CasillaContacto, CampoTrampa, useTiempoEnPantalla } from "@/components/ui/consentimiento";
import DocumentoCotizacion, { armarCotizacion } from "@/components/cotizacion/documentoCotizacion";
import { pdfDeCotizacion } from "@/lib/cotizacionPdf";

// Los nombres de los planes, por su dirección (lib/plans.js).
const NOMBRE_PLAN = { starter: "Starter", professional: "Professional", "full-compliance": "Full Compliance" };

export default function CustomerInfoForm() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [baseCost, setBaseCost] = useState(0);
  const [planillaCost, setPlanillaCost] = useState(0);
  const [facturasCost, setFacturasCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const router = useRouter();
  const params = useParams(); // Para obtener el nombre del plan desde la URL
  const [cotizacionGenerada, setCotizacionGenerada] = useState(false);
  const [cotizacionNumber, setCotizacionNumber] = useState("");
  // localStorage no existe en el servidor: se lee tras el montaje.
  const [reviewName, setReviewName] = useState("");
  const [reviewPositon, setReviewPositon] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [showMobileDisclaimer, setShowMobileDisclaimer] = useState(false);
  // La casilla de consentimiento, el campo trampa y el tiempo en pantalla:
  // lo que pide el ERP para anotar la cotización como lead (lib/crm.js).
  const [acepta, setAcepta] = useState(false);
  const [sitioWeb, setSitioWeb] = useState("");
  const msEnPantalla = useTiempoEnPantalla();
  // El documento oficial (el mismo papel que el ERP), montado fuera de la
  // pantalla y siempre al día con lo que se va escribiendo.
  const documentoRef = useRef(null);
  const [respuestas, setRespuestas] = useState({});
  const [transacciones, setTransacciones] = useState(0);
  const [alcances, setAlcances] = useState([]);
  const [creadaEn] = useState(() => new Date().toISOString());

  useEffect(() => {
    setReviewName(localStorage.getItem("Review-name") || "");
    setReviewPositon(localStorage.getItem("Review-position") || "");
    setReviewMessage(localStorage.getItem("Review-message") || "");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowMobileDisclaimer(window.innerWidth <= 768);
    };
  
    handleResize(); // Ejecuta la función al cargar
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  


  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(
      "customerInfo",
      JSON.stringify(customerInfo)
    );
  }, [customerInfo]);

  // Inicializa un enlace temporal en el DOM al cargar el componente
  useEffect(() => {
    // Crear el enlace solo una vez al montar el componente
    const linkElement = document.createElement("a");
    linkElement.id = "pdfLink";
    linkElement.style.display = "none"; // Oculto en el DOM
    document.body.appendChild(linkElement);

    // Limpieza al desmontar el componente
    return () => document.body.removeChild(linkElement);
  }, []);

  // Cargar datos de localStorage al montar el componente
  useEffect(() => {
    const savedInfo = localStorage.getItem("customerInfo");
    if (savedInfo) {
      setCustomerInfo(JSON.parse(savedInfo));
    }
  }, []);

  // Validación de los campos del formulario
  useEffect(() => {
    const { name, email, phone } = customerInfo;
    setIsFormValid(
      name.trim() !== "" &&
        email.trim() !== "" &&
        phone.trim() !== ""
    );
  }, [customerInfo]);

  useEffect(() => {
    const storedBaseCost = localStorage.getItem("baseCost");
    const storedPlanillaCost = localStorage.getItem("planillaCost");
    const storedFacturasCost = localStorage.getItem("facturasCost");
    const storedTotalCost = localStorage.getItem("totalCost");

    setBaseCost(storedBaseCost ? parseFloat(storedBaseCost) : 0);
    setPlanillaCost(
      storedPlanillaCost ? parseFloat(storedPlanillaCost) : 0
    );
    setFacturasCost(
      storedFacturasCost ? parseFloat(storedFacturasCost) : 0
    );
    setTotalCost(storedTotalCost ? parseFloat(storedTotalCost) : 0);
    setTransacciones(parseFloat(localStorage.getItem("transactions")) || 0);
    try {
      setRespuestas(JSON.parse(localStorage.getItem("answers") || "{}"));
    } catch {
      setRespuestas({});
    }
  }, []);

  // Lo que incluye el plan, de public/json-info/plans.json.
  useEffect(() => {
    fetch("/json-info/plans.json")
      .then(r => r.json())
      .then(d => setAlcances(d.plans.find(p => p.name === params.plan)?.features || []))
      .catch(() => setAlcances([]));
  }, [params.plan]);

  const costosDoc = useMemo(
    () => ({ plan: baseCost, planilla: planillaCost, facturas: facturasCost, transacciones }),
    [baseCost, planillaCost, facturasCost, transacciones]
  );
  const cotizacionDoc = useMemo(
    () =>
      baseCost > 0
        ? armarCotizacion({
            planNombre: NOMBRE_PLAN[params.plan] || params.plan,
            costos: costosDoc,
            respuestas,
            alcances,
            creadaEn,
            cliente: { nombreCompleto: customerInfo.name, correo: customerInfo.email, telefono: customerInfo.phone }
          })
        : null,
    [baseCost, costosDoc, respuestas, alcances, creadaEn, customerInfo, params.plan]
  );

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const { name, email, phone } = customerInfo;

    // Validar los campos obligatorios y que el email tenga un formato válido.
    // La dirección es opcional (Omar, 19 oct 2026), sin decirlo en el rótulo.
    setIsFormValid(
      name.trim() !== "" &&
        email.trim() !== "" &&
        isValidEmail(email) &&
        phone.trim() !== ""
    );

    // Mostrar un mensaje de advertencia si el email no es válido
    if (email.trim() !== "" && !isValidEmail(email)) {
      setValidationMessage(
        "Por favor, introduce un correo electrónico válido."
      );
    } else {
      setValidationMessage("");
    }
  }, [customerInfo]);

  const handleChange = e => {
    const { name, value } = e.target;
    // El telefono solo acepta digitos (8 en Costa Rica): evita que lleguen
    // letras o formatos raros a la cotizacion.
    const cleaned =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 8) : value;

    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [name]: cleaned
    }));
  };

  // Sin la casilla no se sigue: es el consentimiento para que JRC le contacte.
  const faltaLaCasilla = () => {
    if (acepta) return false;
    setValidationMessage("Marcá la casilla para que podamos contactarte.");
    setTimeout(() => {
      setValidationMessage("");
    }, 3000);
    return true;
  };

  const handleContinueToPayments = async () => {
    if (isFormValid && faltaLaCasilla()) return;
    if (isFormValid) {
      setIsLoading(true);
      localStorage.setItem(
        "customerInfo",
        JSON.stringify(customerInfo)
      );
      localStorage.setItem("baseCost", baseCost);
      localStorage.setItem("planillaCost", planillaCost);
      localStorage.setItem("facturasCost", facturasCost);
      localStorage.setItem("totalCost", totalCost);

      // Si la cotización no fue generada, la crea pero sin abrir el PDF en una pestaña
      let currentCotizacionNumber = cotizacionNumber;
      if (!cotizacionGenerada) {
        currentCotizacionNumber = await generatePDF(false);
        setCotizacionGenerada(true);
        setCotizacionNumber(currentCotizacionNumber);
      }

      // Redirigir a la página de checkout con el número de cotización
      router.push(
        `/plans/${params.plan}/checkout?cotizacion=${currentCotizacionNumber}`
      );
      setIsLoading(false);
    } else {
      setValidationMessage(
        "Por favor, completa todos los campos antes de continuar."
      );
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(customerInfo);
      setValidationMessage("");
    } else {
      setValidationMessage(
        "Por favor, completa todos los campos antes de continuar."
      );
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
    }
  };

  const handleSubmitQuote = async e => {
    e.preventDefault();
    if (isFormValid && faltaLaCasilla()) return;
    if (isFormValid) {
      await generatePDF(true); // Genera y abre el PDF en una nueva pestaña
      setValidationMessage("");
    } else {
      setValidationMessage(
        "Por favor, completa todos los campos antes de descargar la cotización."
      );
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
    }
  };

  // Función para generar un número de cotización único
  const generateCotizacionNumber = customerName => {
    const now = new Date();
    const initials = customerName
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("");

    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    return `${initials}${year}-${month}-${randomCode}`;
  };

  // Función para manejar el clic en el botón de "Atrás"
  const handleBack = () => {
    router.push(`/plans/${params.plan}/summary`);
  };

  const generatePDF = async (openInNewTab = false) => {
    if (cotizacionGenerada) return cotizacionNumber; // Evita la generación si ya está hecha

    const storedCustomerInfo = localStorage.getItem("customerInfo");
    const storedAnswers = localStorage.getItem("answers");
    const storedPlan = localStorage.getItem("selectedPlan");
    const storedTotalCost = localStorage.getItem("totalCost");

    // Verificar si los datos están presentes en localStorage
    if (!storedCustomerInfo || !storedAnswers || !storedPlan || !storedTotalCost) {
      console.error(
        "No se encontraron todos los datos necesarios en localStorage."
      );
      return;
    }

    const customerInfo = JSON.parse(storedCustomerInfo);
    const answers = JSON.parse(storedAnswers);
    const selectedPlan = storedPlan; // El plan ya es una cadena directamente
    const cotizacionNumber = generateCotizacionNumber(customerInfo.name);
    setCotizacionNumber(cotizacionNumber);

    // El PDF es la foto del documento oficial que está montado abajo, fuera
    // de la pantalla (components/cotizacion/documentoCotizacion.js).
    const nodo = documentoRef.current?.querySelector(".cot-doc");
    if (!nodo || !cotizacionDoc) {
      console.error("El documento de la cotización no está listo.");
      return;
    }
    const pdfBlob = await pdfDeCotizacion(nodo);

    setCotizacionGenerada(true);
    setCotizacionNumber(`${cotizacionNumber}`);

    const pdfUrl = URL.createObjectURL(pdfBlob); // Crear un URL del blob

    if (openInNewTab) {
      // Obtiene el enlace temporal y configura su URL
      const link = document.getElementById("pdfLink");
      link.setAttribute("href", pdfUrl);
      link.setAttribute("target", "_blank");
      link.click(); // Simula el clic para abrir en una nueva pestaña
    }

    // La cotización entra como lead en el ERP. Aparte de la llamada de abajo y
    // sin esperarla: si el ERP no contesta, el visitante no se entera. Va con
    // el desglose y los alcances para que el ERP dibuje el mismo documento.
    // El pago, si lo hace, lo avisa la página de pago con este permiso.
    localStorage.setItem("contactoAceptado", acepta ? "1" : "");
    avisarAlErp({
      tipo: "cotizacion",
      acepta,
      sitioWeb,
      msEnPantalla: msEnPantalla(),
      nombre: customerInfo.name,
      correo: customerInfo.email,
      telefono: customerInfo.phone,
      plan: selectedPlan || params.plan,
      total: cotizacionDoc.totales.total,
      numero: cotizacionNumber,
      respuestas: answers,
      desglose: costosDoc,
      alcances: cotizacionDoc.alcances
    });

    // Configura la solicitud POST al backend
    const formData = new FormData();
    formData.append(
      "pdf",
      pdfBlob,
      `Cotización_${cotizacionNumber}.pdf`
    );
    formData.append("customerEmail", customerInfo.email); // Añade cualquier información adicional que quieras enviar
    formData.append("customerName", customerInfo.name);
    formData.append("fileName", `${cotizacionNumber}.pdf`);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/email/recieve-quote-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200) {
      } else {
        console.error(
          "Error al enviar el PDF al backend:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
    // Retornamos el número de cotización para que `handleContinueToPayments` pueda usarlo
    return cotizacionNumber;
  };

  return (
    <div className=" flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Overlay de carga con blur y logo */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <Image
            src="/img/JRCLogofull.png" // Ruta de la imagen del logo de JRC
            alt="Cargando..."
            width={200}
            height={100}
            className="animate-pulse" // Añade una animación de pulso
          />
        </div>
      )}
      {/* Panel Izquierdo */}
      <div className=" flex w-full flex-col items-center justify-between bg-[#305832] p-8 lg:w-1/3">
        {/* Logo */}
        <div className="flex w-full justify-center">
          <Link href="/">
            <Image
              src="/img/JRCLogofull.png"
              alt="Nuevo Logo"
              width={200}
              height={100}
              priority
            />
          </Link>
        </div>
        {/* Texto */}
        <div className="m-auto hidden text-center lg:block">
          <h1 className="text-3xl font-extrabold text-white">
            Hacemos que las empresas puedan progresar y crecer.
          </h1>
        </div>
        {/* Reviews */}
        <div className="mt-auto hidden rounded-lg bg-[#d6e8d2] p-4 lg:block">
          <p className="text-black">{reviewMessage}</p>
          <div className="mt-4 flex items-center">
            <div>
              <p className="font-bold text-black">{reviewName}</p>
              <p className="text-sm text-gray-700">{reviewPositon}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="m-auto flex w-full max-w-4xl flex-col rounded bg-gray-100 p-6 px-4 shadow lg:flex-row lg:px-0">
        <div className="mx-auto w-full max-w-2xl flex-1">
          <h1 className="mb-8 text-center text-3xl font-extrabold text-[#305832] lg:text-center">
            Un último paso...
          </h1>
          {showMobileDisclaimer && (
  <div className="bg-gray-200 p-3 text-center text-xs text-gray-600 mb-4 rounded">
    Nota: La descarga de la cotización puede verse afectada en navegadores como Safari debido a bloqueos de ventanas emergentes.
  </div>
)}
          <span className="text-md mb-8 text-center font-semibold text-gray-500 ">
            Bríndanos tu información para ponernos en contacto con
            vos.
          </span>


          <div className="mb-8 mt-8 rounded-lg bg-white p-6 shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="mb-2 block font-bold text-gray-700"
                  htmlFor="name">
                  Nombre propio o de la empresa
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={customerInfo.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  className="mb-2 block font-bold text-gray-700"
                  htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                />
                {/* Mostrar mensaje de validación solo si el email no es válido */}
                {customerInfo.email.trim() !== "" &&
                  !isValidEmail(customerInfo.email) && (
                    <p className="mt-1 text-xs text-red-600">
                      Por favor, introduce un correo electrónico
                      válido.
                    </p>
                  )}
              </div>

              <div className="mb-4">
                <label
                  className="mb-2 block font-bold text-gray-700"
                  htmlFor="phone">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="88887777"
                  value={customerInfo.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  className="mb-2 block font-bold text-gray-700"
                  htmlFor="address">
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={customerInfo.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                />
              </div>

              <CampoTrampa id="sitioWeb-cotizacion" valor={sitioWeb} alCambiar={setSitioWeb} />
              <CasillaContacto id="acepta-cotizacion" acepta={acepta} alCambiar={setAcepta} className="mb-4" />

              {/* Mensaje de advertencia */}
              {validationMessage && (
                <div className="mb-4 rounded border border-red-500 p-3 text-center text-xs text-red-700">
                  {validationMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitQuote}
                className="mb-4 w-full rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all  duration-300 hover:bg-[#E5FAE7]">
                Descargar cotización
              </button>
              <button
                type="button"
                onClick={handleContinueToPayments}
                className="mb-4 w-full rounded-lg bg-[#305832] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#234621]">
                Continuar a la página de pago
              </button>
            </form>
            <button
              type="button"
              className="mt-6 flex w-1/3 items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
              onClick={handleBack}>
              <FaArrowLeft className="mr-2" /> Atrás
            </button>
          </div>
        </div>
      </div>

      <div className="cot-doc-anfitrion" aria-hidden="true" ref={documentoRef}>
        <DocumentoCotizacion cotizacion={cotizacionDoc} />
      </div>
    </div>
  );
}
