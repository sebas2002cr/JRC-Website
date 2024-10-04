"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaCheckCircle
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function Checkout() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [baseCost, setBaseCost] = useState(0);
  const [planillaCost, setPlanillaCost] = useState(0);
  const [answers, setAnswers] = useState(0);
  const [facturasCost, setFacturasCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onvoLoaded, setOnvoLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Controlar el modal de error
  const router = useRouter();
  const params = useParams();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Cargar la información del cliente y los costos desde el localStorage
    const storedCustomerInfo = localStorage.getItem("customerInfo");
    const storedBaseCost = localStorage.getItem("baseCost");
    const storedPlanillaCost = localStorage.getItem("planillaCost");
    const storedFacturasCost = localStorage.getItem("facturasCost");
    const storedTotalCost = localStorage.getItem("totalCost");
    const storedAnswers = localStorage.getItem("answers");
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }

    if (storedCustomerInfo) {
      setCustomerInfo(JSON.parse(storedCustomerInfo));
    }
    if (storedBaseCost) {
      setBaseCost(parseFloat(storedBaseCost));
    }
    if (storedPlanillaCost) {
      setPlanillaCost(parseFloat(storedPlanillaCost));
    }
    if (storedFacturasCost) {
      setFacturasCost(parseFloat(storedFacturasCost));
    }
    if (storedTotalCost) {
      setTotalCost(parseFloat(storedTotalCost));
    }
  }, []);

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
        const amount = Math.round(totalCost * 100); // Se utiliza totalCost para el monto

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
              onError: data => {
                setPaymentError("Hubo un error procesando el pago.");
                setLoading(false);
                setShowErrorModal(true); // Mostrar el modal de error
              },
              onSuccess: async data => {
                setPaymentSuccess(true);
                setLoading(false);
                removeOnvoScript();

                // Crear el payload para enviar al backend
                const orderPayload = createOrderPayload();

                // Hacer la solicitud POST al backend
                try {
                  await axios.post(
                    "http://localhost:4200/api/orders",
                    orderPayload
                  );
                  console.log(
                    "Información de orden enviada exitosamente"
                  );
                  console.log(orderPayload);
                } catch (error) {
                  console.error(
                    "Error al enviar la información de la orden:",
                    error
                  );
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
      loadPayment();
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
  }, [totalCost, paymentIntentId, onvoLoaded]);

  // Función para manejar el clic en el botón de "Atrás"
  const handleBack = () => {
    router.push(`/plans/${params.plan}/form`);
  };

  // Función para capitalizar la primera letra de una cadena
  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Generar número de orden único
  const generateOrderNumber = () => {
    const now = new Date();
    const orderNumber = `ORD-${now.getFullYear()}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(
        2,
        "0"
      )}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
      Math.random() * 10000
    )}`;
    setOrderNumber(orderNumber);
  };

  useEffect(() => {
    generateOrderNumber();
  }, []);

  const planName = capitalizeFirstLetter(params.plan);

  const createOrderPayload = () => {
    return {
      orderNumber,
      plan: planName,
      customerInfo,
      answers,
      costs: {
        baseCost,
        planillaCost,
        facturasCost,
        totalCost
      }
    };
  };

  return (
    <>
      {/* Franja verde con el logo de JRC */}
      <div className="flex w-full justify-center bg-[#305832] py-4">
        <Link href="/">
          <Image
            src="/img/JRCLogofull.png" // Cambia la ruta de la imagen según corresponda
            alt="JRC Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
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

      {/* Contenido principal del componente */}
      <div className="m-auto flex w-full flex-col items-center justify-center bg-transparent p-4 md:flex-row">
        {paymentSuccess ? (
          <div className="w-full max-w-5xl rounded-lg border bg-white p-12 text-center shadow-lg">
            <h3 className="text-4xl font-bold text-gray-600">
              ¡Gracias por confiar en JRC Consulting Group!
            </h3>
            <p className="mt-4 text-xl text-green-700">
              Tu transacción ha sido exitosa. Uno de nuestros agentes
              se pondrá en contacto con vos en breve.
            </p>
            <p className="mt-4 text-lg text-gray-700">
              Si tenés alguna pregunta, no dudes en contactarnos.
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
                  {planName}
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
                  <FaMoneyBillWave className="mr-2 hidden text-[#305832] md:block" />
                  <span className="text-sm sm:text-base lg:text-lg">
                    Costo base del plan:
                  </span>
                </div>
                <span className="text-sm font-semibold sm:text-base lg:text-lg">
                  ₡{baseCost.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <FaUserFriends className="mr-2 hidden text-[#305832] md:block" />
                  <span className="text-sm sm:text-base lg:text-lg">
                    Costo adicional por planilla:
                  </span>
                </div>
                <span className="text-sm font-semibold sm:text-base lg:text-lg">
                  ₡{planillaCost.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <FaFileInvoiceDollar className="mr-2 hidden text-[#305832] md:block" />
                  <span className="text-sm  sm:text-base lg:text-lg">
                    Costo adicional por facturas:
                  </span>
                </div>
                <span className="text-sm font-semibold sm:text-base lg:text-lg">
                  ₡{facturasCost.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                <div className="flex items-center text-left">
                  <FaCheckCircle className="mr-2 hidden text-[#305832] md:block" />
                  <span className="text-sm font-bold sm:text-base lg:text-lg">
                    Costo total:
                  </span>
                </div>
                <span className="text-sm font-bold sm:text-base lg:text-2xl">
                  ₡{totalCost.toLocaleString()}
                  <span className="text-xs text-gray-400">
                    {" "}
                    IVAI / mensual
                  </span>
                </span>
              </div>
            </div>

            {/* Botón para regresar */}
            <a href="/">
              <button className="m-6 w-3/4 rounded-lg bg-[#305832] px-6 py-2 text-white shadow-md duration-700 ease-in-out hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832] sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
                Regresar a la página principal
              </button>
            </a>
          </div>
        ) : (
          <>
            {/* Contenido de la izquierda */}
            <div className="w-full rounded-lg bg-white p-2 md:w-1/2">
              {/* Mostrar la información del cliente aquí */}
              <div className="mb-6 rounded bg-gray-100 p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  Información del Cliente
                </h2>
                <p className="mb-2 text-gray-700">
                  Nombre: <br />{" "}
                  <p className="font-semibold">
                    {" "}
                    {customerInfo.name}
                  </p>
                </p>
                <p className="mb-2 text-gray-700">
                  Correo: <br />{" "}
                  <p className="font-semibold">
                    {" "}
                    {customerInfo.email}
                  </p>
                </p>
                <p className="mb-2 text-gray-700">
                  Teléfono: <br />{" "}
                  <p className="font-semibold">
                    {" "}
                    {customerInfo.phone}
                  </p>
                </p>
                <p className="mb-2 text-gray-700">
                  Dirección: <br />{" "}
                  <p className="font-semibold">
                    {" "}
                    {customerInfo.address}
                  </p>
                </p>
              </div>

              <div className="space-y-4 rounded bg-gray-100 p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  Resumen de costos
                </h2>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-[#305832]" />
                    <span>Costo base del plan</span>
                  </div>
                  <span>₡{baseCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaUserFriends className="mr-2 text-[#305832]" />
                    <span>Costo adicional por planilla</span>
                  </div>
                  <span>₡{planillaCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaFileInvoiceDollar className="mr-2 text-[#305832]" />
                    <span>Costo adicional por facturas</span>
                  </div>
                  <span>₡{facturasCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-[#305832]" />
                    <span className="font-bold">Costo total</span>
                  </div>
                  <span className="text-2xl font-bold">
                    ₡{totalCost.toLocaleString()}
                    <span className="text-xs text-gray-400">
                      {" "}
                      IVAI
                    </span>
                  </span>
                </div>
                {/* Botón de 'Atrás' */}
                <button
                  type="button"
                  className="mt-6 flex w-1/3 items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
                  onClick={handleBack}>
                  <FaArrowLeft className="mr-2" /> Atrás
                </button>
              </div>
            </div>

            {/* Contenedor para el SDK de ONVO */}
            <div className="relative  w-full max-w-lg justify-center">
              {/* Logo de JRC encima del contenedor de ONVO */}
              <div className="flex justify-center">
                <Image
                  src="/NEGRO-FONDO-BLANCO.jpg" // Cambia la ruta de la imagen según corresponda
                  alt="JRC Logo"
                  width={80}
                  height={80}
                  priority
                />
              </div>
              {/* Contenedor de ONVO */}
              <div
                id="onvo-container"
                className="m-4 w-full rounded-lg border bg-white p-6 shadow-md md:w-full">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent"></div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
