import React, { useState } from 'react';
import jsPDF from 'jspdf';

export default function CustomerInfoForm({ onSubmit, summaryItems, calculateBaseCost, calculateAdditionalCost, calculateTotalCost }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
    sendSMSNotification(customerInfo.name); // Enviar SMS después de generar el PDF
    onSubmit(customerInfo);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Agregar el logo de la empresa
    const imgData = '/NEGRO-FONDO-BLANCO.jpg'; // Ruta de la imagen proporcionada
    doc.addImage(imgData, 'JPEG', 10, 10, 50, 20);

    // Título y fecha
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen del Plan e Información del Cliente', 10, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 50);
    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 10, 55);

    // Línea divisora
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(10, 60, 200, 60);

    // Información del plan (summaryItems)
    doc.setFontSize(16);
    doc.text('Detalles del Plan:', 10, 70);
    doc.setFontSize(12);
    summaryItems.forEach((item, index) => {
      doc.text(`${item.label}: ${item.value}`, 10, 80 + index * 10);
    });

    // Línea divisora
    const customerInfoStartY = 80 + summaryItems.length * 10 + 20;
    doc.line(10, customerInfoStartY - 10, 200, customerInfoStartY - 10);

    // Información del cliente
    doc.setFontSize(16);
    doc.text('Información del Cliente:', 10, customerInfoStartY);
    doc.setFontSize(12);
    doc.text(`Nombre: ${customerInfo.name}`, 10, customerInfoStartY + 10);
    doc.text(`Correo Electrónico: ${customerInfo.email}`, 10, customerInfoStartY + 20);
    doc.text(`Teléfono: ${customerInfo.phone}`, 10, customerInfoStartY + 30);
    doc.text(`Dirección: ${customerInfo.address}`, 10, customerInfoStartY + 40);

    // Línea divisora
    const paymentSummaryStartY = customerInfoStartY + 60;
    doc.line(10, paymentSummaryStartY - 10, 200, paymentSummaryStartY - 10);

    // Resumen de cobro
    const currencySymbol = "\u00A2"; // Unicode para el símbolo de colones "¢"

    doc.setFontSize(16);
    doc.text('Resumen de Precios:', 10, paymentSummaryStartY);

    // Costo del plan
    doc.setFontSize(14);
    doc.text(`Costo del plan: ${currencySymbol}${calculateBaseCost().toLocaleString()} IVAI / mensual`, 10, paymentSummaryStartY + 20);
    doc.text(`Costo adicional: ${currencySymbol}${calculateAdditionalCost().toLocaleString()} IVAI`, 10, paymentSummaryStartY + 30);

    // Línea divisora
    doc.line(10, paymentSummaryStartY + 40, 200, paymentSummaryStartY + 40);

    // Costo total
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold')
    doc.text(`Costo total: ${currencySymbol}${calculateTotalCost().toLocaleString()} IVAI / mensual`, 10, paymentSummaryStartY + 50);

    // Guardar el PDF
    doc.save('resumen_plan_cliente.pdf');
  };

  const sendSMSNotification = async (customerInfo) => {
    try {
      const response = await fetch('/api/sendSms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: customerInfo.name, phone: '+50684277177' }),
      });
  
      if (!response.ok) {
        throw new Error('Error enviando el SMS');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className='max-w-lg mx-auto bg-white p-6'>
      <div className='text-center'>
        <h2 className="text-center text-3xl font-semibold mb-8">
          <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-[#305832] relative inline-block">
            <span className="relative text-white">Un último paso...</span>
          </span>
        </h2>
        <span className="text-gray-500">Danos tu información para ponernos en contacto lo más pronto posible</span>
      </div>

      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={customerInfo.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={customerInfo.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={customerInfo.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
              Dirección
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={customerInfo.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#305832] text-white font-semibold rounded-lg hover:bg-[#234621] transition-all duration-300"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}