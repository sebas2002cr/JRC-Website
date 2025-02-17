"use client";

import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

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
  const reviewName = localStorage.getItem("Review-name");
  const reviewPositon = localStorage.getItem("Review-position");
  const reviewMessage = localStorage.getItem("Review-message");
  const [showMobileDisclaimer, setShowMobileDisclaimer] = useState(false);

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
    const { name, email, phone, address } = customerInfo;
    setIsFormValid(
      name.trim() !== "" &&
        email.trim() !== "" &&
        phone.trim() !== "" &&
        address.trim() !== ""
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
  }, []);

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const { name, email, phone, address } = customerInfo;

    // Validar que todos los campos estén llenos y que el email tenga un formato válido
    setIsFormValid(
      name.trim() !== "" &&
        email.trim() !== "" &&
        isValidEmail(email) &&
        phone.trim() !== "" &&
        address.trim() !== ""
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
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleContinueToPayments = async () => {
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
    const storedBaseCost = localStorage.getItem("baseCost");
    const storedPlanillaCost = localStorage.getItem("planillaCost");
    const storedFacturasCost = localStorage.getItem("facturasCost");
    const storedTotalCost = localStorage.getItem("totalCost");
    const transactionCost = localStorage.getItem("transactions");

    // Verificar si los datos están presentes en localStorage
    if (
      !storedCustomerInfo ||
      !storedAnswers ||
      !storedPlan ||
      !storedBaseCost ||
      !storedPlanillaCost ||
      !storedFacturasCost ||
      !storedTotalCost
    ) {
      console.error(
        "No se encontraron todos los datos necesarios en localStorage."
      );
      return;
    }

    const customerInfo = JSON.parse(storedCustomerInfo);
    const answers = JSON.parse(storedAnswers);
    const selectedPlan = storedPlan; // El plan ya es una cadena directamente

    // Convertir los costos almacenados en números
    const baseCost = parseFloat(storedBaseCost);
    const planillaCost = parseFloat(storedPlanillaCost);
    const facturasCost = parseFloat(storedFacturasCost);
    const totalCost = parseFloat(storedTotalCost);
    const transactions = parseFloat(transactionCost);

    const doc = new jsPDF();
    const cotizacionNumber = generateCotizacionNumber(
      customerInfo.name
    );
    setCotizacionNumber(cotizacionNumber);
    const imgData = "/NEGRO-FONDO-BLANCO.jpg"; // Imagen del logo

    doc.addImage(imgData, "JPEG", 5, 5, 30, 30);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Cotización de Cliente", 10, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 50);
    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 10, 55);
    doc.text(`No. Cotización: ${cotizacionNumber}`, 120, 50);
    doc.line(10, 60, 200, 60);

    // Cargar los planes desde el archivo JSON
    const response = await fetch("/json-info/plans.json");
    const plansData = await response.json();
    const plans = plansData.plans;

    const plan = plans.find(p => p.name === selectedPlan);
    const features = plan
      ? plan.features
      : ["No se encontró el plan seleccionado."];

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Plan Seleccionado: ${selectedPlan}`, 10, 70);

    // Información del cliente
    doc.autoTable({
      startY: 80,
      head: [["Información del Cliente", ""]],
      body: [
        ["Nombre:", customerInfo.name],
        ["Correo Electrónico:", customerInfo.email],
        ["Teléfono:", customerInfo.phone],
        ["Dirección:", customerInfo.address]
      ],
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

    // Características del plan
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Características del Plan"]],
      body: features.map(feature => [feature]),
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

    // Obtener datos adicionales desde answers
    const manejoPlanilla = answers.manejoPlanilla || "N/A";
    const totalColaboradores = answers.colaboradores || "N/A";
    const facturasEmitidas =
      answers.cantidadFacturasEmitidas || "N/A";
    const facturasRecibidas =
      answers.cantidadFacturasRecibidas || "N/A";
    const transaccionesMensuales = answers.transacciones || "N/A";
    const facturas = answers.facturas || "N/A";

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["Especificaciones adicionales", ""]],
      body: [
        ["Manejo de Planilla:", manejoPlanilla],
        ["Cantidad de Colaboradores:", totalColaboradores],
        ["Facturación Electrónica:", facturas],
        ["Facturas Electrónicas Emitidas:", facturasEmitidas],
        ["Facturas Electrónicas Recibidas:", facturasRecibidas],
        ["Transacciones Mensuales:", transaccionesMensuales]
      ],
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

    // Cálculo de costos
    const currencySymbol = "\u00A2";
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 25,
      head: [["Descripción", "Monto"]],
      body: [
        [
          "Costo del plan",
          `${currencySymbol}${baseCost.toLocaleString()} IVAI`
        ],
        [
          "Costo adicional - Planilla",
          `${currencySymbol}${planillaCost.toLocaleString()} IVAI`
        ],
        [
          "Costo adicional - Facturas",
          `${currencySymbol}${facturasCost.toLocaleString()} IVAI`
        ],
        [
          "Costo adicional - Transacciones Mensuales",
          `${currencySymbol}${transactions.toLocaleString()} IVAI`
        ],
        [
          "Costo total",
          `${currencySymbol}${totalCost.toLocaleString()} IVA incluido mensualmente`
        ]
      ],
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

    // Información adicional y observaciones
    const additionalInfoStartY = doc.previousAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "La presente cotización tiene una validez de 15 días naturales.",
      10,
      additionalInfoStartY
    );
    doc.text(
      "Para más información, contáctanos a info@jrc.cr.",
      10,
      additionalInfoStartY + 5
    );

    doc.setFont("Helvetica", "bold");
    doc.text("Observación:", 10, additionalInfoStartY + 15);
    const observacionText =
      "Nosotros brindamos acompañamiento, es el factor de diferenciación entre muchos otros contadores o asesores.";
    const lines = doc.splitTextToSize(observacionText, 180);
    doc.text(lines, 10, additionalInfoStartY + 20);

    doc.setFont("Helvetica", "normal");
    const importanceText =
      "Es importante destacar que el servicio ofrecido no incluye certificaciones de ingresos, flujos proyectados por CPA, certificaciones literales, personerías jurídicas, ni RTBF.";
    const linesImportance = doc.splitTextToSize(importanceText, 180);
    doc.text(linesImportance, 10, additionalInfoStartY + 35);

    // --- Agregar logo y nombre en la última página ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("JRC CONSULTING GROUP ©", 130, 290);
    const imgDataFinal = "/pyme_costa_rica_image.png"; // Ruta de la imagen subida
    doc.addImage(imgDataFinal, "PNG", 180, 255, 25, 40); // Ajusta la posición del logo

    setCotizacionGenerada(true);
    setCotizacionNumber(`${cotizacionNumber}`);

    const pdfBlob = doc.output("blob"); // Convierte el PDF a un Blob
    const pdfUrl = URL.createObjectURL(pdfBlob); // Crear un URL del blob

    if (openInNewTab) {
      // Obtiene el enlace temporal y configura su URL
      const link = document.getElementById("pdfLink");
      link.setAttribute("href", pdfUrl);
      link.setAttribute("target", "_blank");
      link.click(); // Simula el clic para abrir en una nueva pestaña
    }

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
                  type="text"
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
                  required
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none"
                />
              </div>

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
    </div>
  );
}
