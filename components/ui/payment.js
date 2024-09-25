import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaUserFriends,
  FaFileInvoiceDollar,
  FaCheckCircle
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

export default function Payments({
  calculateBaseCost,
  calculatePlanillaCost,
  calculateFacturasCost,
  calculateTotalCost,
  customerInfo = { customerInfo }, // Aquí se pasa la info del cliente
  onBackPayment
}) {
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onvoLoaded, setOnvoLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false); // Controlar el modal de error

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
        const amount = Math.round(calculateTotalCost() * 100);

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
  }, [calculateTotalCost, paymentIntentId, onvoLoaded]);

  return (
    <>
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

      <div className="flex w-full flex-col items-center justify-center bg-transparent p-4 md:flex-row">
        {paymentSuccess ? (
          <div className="w-full max-w-3xl rounded-lg border bg-white p-12 text-center shadow-lg">
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
            <a href="/">
              <button className="m-6 w-3/4 rounded-lg bg-[#305832] px-6 py-2 text-white shadow-md duration-700 ease-in-out hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832] sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
                Regresar a la página principal
              </button>
            </a>
          </div>
        ) : (
          <>
            <div className="w-full rounded-lg bg-white p-6 md:w-1/2">
              {/* Mostrar la información del cliente aquí */}
              <div className="mb-6">
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
              <h2 className="mb-6 text-2xl font-bold">
                Resumen de costos
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-[#305832]" />
                    <span>Costo base del plan</span>
                  </div>
                  <span>₡{calculateBaseCost().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaUserFriends className="mr-2 text-[#305832]" />
                    <span>Costo adicional por planilla</span>
                  </div>
                  <span>
                    ₡{calculatePlanillaCost().toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaFileInvoiceDollar className="mr-2 text-[#305832]" />
                    <span>Costo adicional por facturas</span>
                  </div>
                  <span>
                    ₡{calculateFacturasCost().toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-[#305832]" />
                    <span className="font-bold">Costo total</span>
                  </div>
                  <span className="text-2xl font-bold">
                    ₡{calculateTotalCost().toLocaleString()}
                    <span className="text-xs text-gray-400">
                      {" "}
                      IVAI
                    </span>
                  </span>
                </div>
                {/* Botón de 'Atrás' */}
                <button
                  type="button"
                  className="mt-6 flex w-1/3  items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
                  onClick={onBackPayment}>
                  <FaArrowLeft className="mr-2" /> Atrás
                </button>
              </div>
            </div>

            <div
              id="onvo-container"
              className="ml-4 h-full w-full rounded-lg border bg-white p-6 md:w-1/2">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent"></div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  );
}
