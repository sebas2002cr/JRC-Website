"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutConstitucionSociedad() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    idType: "",
    idNumber: ""
  });
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onvoLoaded, setOnvoLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false); // Estado para habilitar/deshabilitar el botón
  const router = useRouter();

  const planPrice = 452000; // Precio fijo para el servicio de Constitución de una Sociedad

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
      setCustomerInfo(JSON.parse(savedInfo));
      console.log(
        "Datos cargados desde localStorage:",
        JSON.parse(savedInfo)
      );
    }
  }, []);

  // Validar si el formulario está completo
  useEffect(() => {
    // Asegurarse de que no hay campos vacíos o con espacios en blanco
    const isComplete = Object.values(customerInfo).every(
      value => value.trim() !== ""
    );
    setIsFormComplete(isComplete);
  }, [customerInfo]);

  useEffect(() => {
    const loadOnvoSDK = () => {
      if (typeof onvo === "undefined") {
        const script = document.createElement("script");
        script.src = "https://sdk.onvopay.com/sdk.js";
        script.id = "onvo-script";
        script.onload = () => setOnvoLoaded(true);
        script.onerror = () =>
          setPaymentError("Error al cargar el SDK de ONVO Pay.");
        document.body.appendChild(script);
      } else {
        setOnvoLoaded(true);
      }
    };

    if (!onvoLoaded) {
      loadOnvoSDK();
    }

    const loadPayment = async () => {
      try {
        setLoading(true);
        const amount = Math.round(planPrice * 100); // Convertir a la unidad menor de la moneda (centavos)

        if (!paymentIntentId && onvoLoaded) {
          const { data } = await axios.post(
            "http://localhost:4200/api/create-payment-intent",
            {
              currency: "CRC",
              amount
            }
          );

          const { paymentIntentId: newPaymentIntentId, publicKey } =
            data;
          setPaymentIntentId(newPaymentIntentId);

          onvo
            .pay({
              onError: () => {
                setPaymentError("Hubo un error procesando el pago.");
                setLoading(false);
                setShowErrorModal(true);
              },
              onSuccess: async () => {
                const savedInfo = JSON.parse(
                  localStorage.getItem("customerInfo")
                );
                console.log(
                  "Datos del cliente al procesar el pago:",
                  savedInfo
                );

                // Validación de los datos del cliente
                if (
                  !savedInfo?.name ||
                  !savedInfo?.email ||
                  !savedInfo?.phone ||
                  !savedInfo?.idType ||
                  !savedInfo?.idNumber
                ) {
                  setPaymentError(
                    "Faltan datos en la información del cliente."
                  );
                  setShowErrorModal(true);
                  return;
                }

                // Enviar los datos al backend
                const orderPayload = createOrderPayload();
                console.log(
                  "Datos que se enviarán al backend:",
                  orderPayload
                );

                try {
                  await axios.post(
                    "http://localhost:4200/api/orders/pagosunicos",
                    orderPayload
                  );
                  console.log(
                    "Factura generada y enviada correctamente."
                  );
                  // Cambia el estado de paymentSuccess a true
                  setPaymentSuccess(true);
                } catch (error) {
                  console.error("Error al enviar la factura:", error);
                }
              },
              publicKey,
              paymentIntentId: newPaymentIntentId,
              paymentType: "one_time"
            })
            .render("#onvo-container");
        }
      } catch (error) {
        setPaymentError("Error al crear el intento de pago.");
      } finally {
        setLoading(false);
      }
    };

    if (onvoLoaded) {
      loadPayment(); // Cargar el SDK independientemente de si el formulario está completo
    }

    const removeOnvoScript = () => {
      const script = document.getElementById("onvo-script");
      if (script) {
        document.body.removeChild(script);
        setOnvoLoaded(false);
      }

      const onvoContainer = document.getElementById("onvo-container");
      if (onvoContainer) {
        onvoContainer.innerHTML = "";
      }
    };

    // Generar un número de orden único
    const now = new Date();
    const newOrderNumber = `ORD-${now.getFullYear()}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(
        2,
        "0"
      )}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
      Math.random() * 10000
    )}`;
    setOrderNumber(newOrderNumber);
  }, [paymentIntentId, onvoLoaded]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const createOrderPayload = () => {
    const savedInfo = JSON.parse(
      localStorage.getItem("customerInfo")
    );
    return {
      orderNumber,
      plan: "Constitución de una Sociedad",
      customerInfo: savedInfo,
      amount: planPrice
    };
  };

  const handleBack = () => {
    router.push("/pricing");
  };

  return (
    <>
      {/* Franja verde con el logo de JRC */}
      <div className="flex w-full justify-center bg-[#305832] py-4">
        <Link href="/">
          <Image
            src="/img/JRCLogofull.png"
            alt="JRC Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="m-auto flex w-full flex-col items-center justify-center bg-transparent p-4 md:flex-row">
        {paymentSuccess ? (
          // Pantalla de éxito
          <div className="w-full max-w-5xl rounded-lg border bg-white p-12 text-center shadow-lg">
            <h3 className="text-4xl font-bold text-gray-600">
              ¡Gracias por confiar en JRC Consulting Group!
            </h3>
            <p className="mt-4 text-xl text-green-700">
              Tu transacción ha sido exitosa. Uno de nuestros agentes
              se pondrá en contacto contigo en breve.
            </p>
            <p className="mt-4 text-lg text-gray-700">
              Si tienes alguna pregunta, no dudes en contactarnos.
              Estamos aquí para ayudarte.
            </p>

            <div className="m-auto mt-4 w-full max-w-xl space-y-4 rounded bg-gray-100 p-4 sm:p-6 lg:w-2/3 lg:p-8">
              <h2 className="mb-6 text-xl font-bold sm:text-2xl lg:text-3xl">
                Resumen de compra
              </h2>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <span className="text-sm sm:text-base lg:text-lg">
                    Número de Orden:
                  </span>
                </div>
                <span className="text-sm font-semibold sm:text-base lg:text-lg">
                  {orderNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <span className="text-sm sm:text-base lg:text-lg">
                    Tipo de plan:
                  </span>
                </div>
                <span className="text-sm font-semibold sm:text-base lg:text-lg">
                  Inscripción de PYME ante el MEIC
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <span className="text-sm sm:text-base lg:text-lg">
                    Nombre del Cliente:
                  </span>
                </div>
                <span className="text-sm font-semibold sm:text-base lg:text-lg">
                  {customerInfo.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <span className="text-sm sm:text-base lg:text-lg">
                    Correo Electrónico:
                  </span>
                </div>
                <span className="break-all text-sm font-semibold sm:text-base lg:text-lg">
                  {customerInfo.email}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <span className="text-sm sm:text-base lg:text-lg">
                    Monto total pagado:
                  </span>
                </div>
                <span className="text-sm font-bold sm:text-base lg:text-2xl">
                  ₡{planPrice.toLocaleString()}{" "}
                  <span className="text-xs text-gray-400">IVAI</span>
                </span>
              </div>
            </div>

            {/* Botón para regresar */}
            <Link href="/">
              <button className="m-6 w-3/4 rounded-lg bg-[#305832] px-6 py-2 text-white shadow-md duration-700 ease-in-out hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832] sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
                Regresar a la página principal
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="w-full rounded-lg bg-white p-2 md:w-1/2">
              {/* Formulario de Información del Cliente */}
              <div className="mb-6 rounded-lg bg-gray-100 p-8">
                <h2 className="mb-6 text-3xl font-semibold text-[#305832]">
                  Información del Cliente
                </h2>
                <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="relative">
                    <label className="mb-2 block text-sm font-extrabold text-gray-600">
                      Nombre Completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-[#305832] bg-gray-50 p-3 text-gray-700 shadow-sm transition-colors focus:border-green-500 focus:ring focus:ring-green-200"
                      placeholder="Ingrese su nombre completo"
                    />
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-extrabold text-gray-600">
                      Correo Electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-[#305832] bg-gray-50 p-3 text-gray-700 shadow-sm transition-colors focus:border-green-500 focus:ring focus:ring-green-200"
                      placeholder="Ingrese su correo electrónico"
                    />
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-extrabold text-gray-600">
                      Número de Teléfono
                    </label>
                    <input
                      id="phone"
                      type="text"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-lg border border-[#305832] bg-gray-50 p-3 text-gray-700 shadow-sm transition-colors focus:border-green-500 focus:ring focus:ring-green-200"
                      placeholder="Ingrese su número de teléfono"
                    />
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-extrabold text-gray-600">
                      Tipo de Cédula
                    </label>
                    <select
                      id="idType"
                      name="idType"
                      value={customerInfo.idType}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-[#305832] bg-gray-50 p-3 text-gray-700 shadow-sm transition-colors focus:border-green-500 focus:ring focus:ring-green-200">
                      <option value="">
                        Seleccione el tipo de cédula
                      </option>
                      <option value="fisica">Cédula Física</option>
                      <option value="juridica">
                        Cédula Jurídica
                      </option>
                    </select>
                  </div>

                  <div className="relative">
                    <label className="mb-2 block text-sm font-extrabold text-gray-600">
                      Número de Cédula
                    </label>
                    <input
                      id="idNumber"
                      type="text"
                      name="idNumber"
                      value={customerInfo.idNumber}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-[#305832] bg-gray-50 p-3 text-gray-700 shadow-sm transition-colors focus:border-green-500 focus:ring focus:ring-green-200"
                      placeholder="Ingrese su número de cédula"
                    />
                  </div>
                </form>
              </div>

              {/* Detalles del servicio */}
              <div className="mt-12 rounded-lg border border-[#305832] bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-3xl font-semibold text-[#305832]">
                  Constitución de una Sociedad
                </h2>
                <p className="mb-4 text-lg text-gray-700">
                  Ideal para quienes desean constituir una sociedad
                  formal, ya sea una SRL o SA, asegurando el
                  cumplimiento de todos los requisitos legales y
                  fiscales.
                </p>
                <h3 className="mb-6 text-3xl font-semibold text-[#305832]">
                  Nuestro servicio incluye:
                </h3>

                <ul className="mb-4 list-disc space-y-3 pl-5 text-gray-700">
                  <li>
                    Asesoría en la elección del tipo de sociedad (SRL
                    o SA) y en la redacción del pacto social.
                  </li>
                  <li>
                    Trámite completo de inscripción ante el Registro
                    Nacional.
                  </li>
                  <li>
                    Obtención del número de cédula jurídica y registro
                    ante la Administración Tributaria.
                  </li>
                  <li>
                    Asistencia en la apertura de cuentas bancarias y
                    otros trámites financieros.
                  </li>
                </ul>

                <div className="relative text-right">
                  <h2 className="text-3xl font-extrabold text-[#305832]">
                    ¢452.000
                  </h2>
                  <span className="text-sm text-gray-500">
                    IVA incluido
                  </span>
                </div>
              </div>

              {/* Botón de 'Atrás' */}
              <button
                type="button"
                className="mt-6 flex w-1/3 items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
                onClick={handleBack}>
                <FaArrowLeft className="mr-2" /> Volver
              </button>
            </div>

            {/* Contenedor para el SDK de ONVO */}
            <div className="relative w-full max-w-lg justify-center">
              <div className="flex justify-center">
                <Image
                  src="/NEGRO-FONDO-BLANCO.jpg"
                  alt="JRC Logo"
                  width={80}
                  height={80}
                  priority
                />
              </div>
              <div
                id="onvo-container"
                className={`m-4 w-full rounded-lg border bg-white p-6 shadow-md ${
                  !isFormComplete
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}>
                {loading && (
                  <div className="flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de error */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h2 className="text-xl font-bold text-red-600">
              Error en el pago
            </h2>
            <p className="mt-4 text-gray-700">
              Hubo un problema procesando tu pago. Por favor, intenta
              nuevamente.
            </p>
            <button
              className="mt-6 w-full rounded-lg border border-red-600 bg-white px-4 py-2 text-red-600 transition duration-300 hover:bg-red-700 hover:text-white"
              onClick={() => setShowErrorModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
