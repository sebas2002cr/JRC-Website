import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaArrowLeft } from "react-icons/fa";

export default function CustomerInfoForm({
  onSubmit,
  selectedPlan,
  summaryItems,
  calculateBaseCost,
  calculateAdditionalCost,
  calculatePlanillaCost,
  calculateFacturasCost,
  calculateTotalCost,
  onContinueForm,
  onBackForm
}) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isFormValid, setIsFormValid] = useState(false); // Estado para validar formulario
  const [validationMessage, setValidationMessage] = useState(""); // Mensaje de advertencia
  const [plans, setPlans] = useState([]);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(
      "customerInfo",
      JSON.stringify(customerInfo)
    );
  }, [customerInfo]);

  // Cargar datos de localStorage al montar el componente
  useEffect(() => {
    const savedInfo = localStorage.getItem("customerInfo");
    if (savedInfo) {
      setCustomerInfo(JSON.parse(savedInfo)); // Si hay datos guardados, actualiza el estado con ellos
    }
  }, []); // Solo se ejecuta cuando el componente se monta por primera vez

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

  // Fetch the plans data from the public folder
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("json-info/plans.json"); // Ruta del archivo JSON
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

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

  const handleChange = e => {
    const { name, value } = e.target;
    setCustomerInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleSubmitQuote = e => {
    e.preventDefault();
    if (isFormValid) {
      generatePDF();
      setValidationMessage(""); // Limpia el mensaje si todo está bien
    } else {
      setValidationMessage(
        "Por favor, completa todos los campos antes de continuar."
      );
      // Mantener el mensaje visible por 3 segundos y luego eliminarlo
      setTimeout(() => {
        setValidationMessage(""); // Limpiar el mensaje después de 3 segundos
      }, 3000);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(customerInfo); // Envía la info del cliente a través de onSubmit
      setValidationMessage(""); // Limpia el mensaje si todo está bien
    } else {
      setValidationMessage(
        "Por favor, completa todos los campos antes de continuar."
      );
      setTimeout(() => {
        setValidationMessage(""); // Limpiar el mensaje después de 3 segundos
      }, 3000);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const cotizacionNumber = generateCotizacionNumber(
      customerInfo.name
    );
    const imgData = "/NEGRO-FONDO-BLANCO.jpg";
    doc.addImage(imgData, "JPEG", 10, 10, 50, 20);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Cotización de Cliente", 10, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 50);
    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 10, 55);
    doc.text(`No. Cotización: ${cotizacionNumber}`, 120, 50);
    doc.line(10, 60, 200, 60);

    const plan = plans.find(p => p.name === selectedPlan);
    const features = plan
      ? plan.features
      : ["No se encontró el plan seleccionado."];

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Plan Seleccionado: ${selectedPlan}`, 10, 70);

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

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Características del Plan"]],
      body: features.map(feature => [feature]),
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

    const manejoPlanilla =
      summaryItems.find(item => item.label === "Manejo de Planilla")
        ?.value || "N/A";
    const totalColaboradores =
      summaryItems.find(
        item => item.label === "Total de Colaboradores"
      )?.value || "N/A";
    const facturasEmitidas =
      summaryItems.find(
        item => item.label === "Facturas electrónicas emitidas"
      )?.value || "N/A";
    const facturasRecibidas =
      summaryItems.find(
        item => item.label === "Facturas electrónicas recibidas"
      )?.value || "N/A";
    const transaccionesMensuales =
      summaryItems.find(
        item => item.label === "Transacciones mensuales"
      )?.value || "N/A";
    const facturas =
      summaryItems.find(
        item => item.label === "Facturas Electrónicas"
      )?.value || "N/A";

    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 15,
      head: [["Especificaciones adicionales", ""]],
      body: [
        ["Manejo de Planilla:", manejoPlanilla],
        ["Cantidad de Colaboradores:", totalColaboradores],
        ["Facturacion Electrónica:", facturas],
        ["Facturas Electrónicas Emitidas:", facturasEmitidas],
        ["Facturas Electrónicas Recibidas:", facturasRecibidas],
        ["Transacciones Mensuales:", transaccionesMensuales]
      ],
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

    const currencySymbol = "\u00A2";
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 25,
      head: [["Descripción", "Monto"]],
      body: [
        [
          "Costo del plan",
          `${currencySymbol}${calculateBaseCost().toLocaleString()} IVAI`
        ],
        [
          "Costo adicional - Planilla",
          `${currencySymbol}${calculatePlanillaCost().toLocaleString()} IVAI`
        ],
        [
          "Costo adicional - Facturas",
          `${currencySymbol}${calculateFacturasCost().toLocaleString()} IVAI`
        ],
        [
          "Costo total",
          `${currencySymbol}${calculateTotalCost().toLocaleString()} IVA incluido mensualmente`
        ]
      ],
      theme: "grid",
      headStyles: { fillColor: "#305832", textColor: "#ffffff" },
      bodyStyles: { fillColor: "#ffffff", textColor: "#000000" }
    });

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
    // Asegúrate de que esté en una nueva página
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("JRC CONSULTING GROUP ©", 130, 290);
    const imgDataFinal = "/pyme_costa_rica_image.png"; // Ruta de la imagen subida
    doc.addImage(imgDataFinal, "PNG", 180, 270, 25, 25); // Ajusta la posición del logo

    doc.save(`Cotización ${cotizacionNumber}.pdf`);
  };

  return (
    <div className="mx-auto max-w-lg bg-white p-6">
      <div className="text-center">
        <h2 className="mb-8 text-center text-3xl font-semibold">
          <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#305832]">
            <span className="relative text-white">
              Un último paso...
            </span>
          </span>
        </h2>
        <span className="text-gray-500">
          Bríndanos tu información para ponernos en contacto lo más
          pronto posible
        </span>
      </div>

      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
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
            onClick={handleSubmit}
            className="mb-4 w-full rounded-lg bg-[#305832] py-3 font-semibold text-white transition-all duration-300 hover:bg-[#234621]">
            Continuar
          </button>
          {/* Botón de 'Atrás' */}
          <button
            type="button"
            className="mt-6 flex w-1/3 items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
            onClick={onBackForm}>
            <FaArrowLeft className="mr-2" /> Atrás
          </button>
        </form>
      </div>
    </div>
  );
}
