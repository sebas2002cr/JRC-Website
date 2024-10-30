"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function SummaryPage() {
  const router = useRouter();
  const params = useParams(); // Para obtener el nombre del plan desde la URL
  const [summaryItems, setSummaryItems] = useState([]);
  const [answers, setAnswers] = useState(null); // Definir answers en el estado
  const [baseCost, setBaseCost] = useState(0);
  const [planillaCost, setPlanillaCost] = useState(0);
  const [facturasCost, setFacturasCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [transactionCost, setTransactionCost] = useState(0);
  const reviewName = localStorage.getItem("Review-name");
  const reviewPositon = localStorage.getItem("Review-position");
  const reviewMessage = localStorage.getItem("Review-message");

  // Función para calcular los costos base según el plan
  const calculateBaseCost = answers => {
    console.log(params.plan);
    switch (params.plan) {
      case "starter":
        return answers.tipoPersona === "Física" ? 45000 : 65000;
      case "professional":
        return 99500;
      case "full-compliance":
        return 130000;
      default:
        return 0;
    }
  };

  // Función para calcular el costo de planilla
  const calculatePlanillaCost = (answers, plan) => {
    const colaboradoresPagados =
      plan === "full-compliance"
        ? Math.max(answers.colaboradores - 5, 0) // Restamos los 5 colaboradores gratuitos
        : answers.colaboradores;

    return answers.manejoPlanilla === "Si"
      ? colaboradoresPagados * 10000 * 1.13
      : 0;
  };

  const calculateFacturasCost = answers => {
    const { cantidadFacturasEmitidas, facturasExactas } = answers;

    switch (cantidadFacturasEmitidas) {
      case "1-10":
        return 10000 * 1.13;
      case "11-20":
        return 20000 * 1.13;
      case "21-30":
        return 30000 * 1.13;
      case "31-40":
        return 40000 * 1.13;
      case "Más de 40":
        return facturasExactas * 1000 * 1.13;
      default:
        return 0;
    }
  };

  // Función para calcular el costo de transacciones adicionales
  const calculateTransactionCost = answers => {
    const maxFreeTransactions = 50;
    const additionalTransactionCost = 500 * 1.13; // 500 colones más IVA por cada transacción adicional
    const transactions = parseInt(answers.transacciones, 10) || 0;

    if (transactions > maxFreeTransactions) {
      const extraTransactions = transactions - maxFreeTransactions;
      return extraTransactions * additionalTransactionCost;
    }
    return 0;
  };

  // Modificar la función calculateTotalCost para incluir el costo de transacciones
  const calculateTotalCost = answers => {
    const baseCost = calculateBaseCost(answers);
    const additionalCost =
      calculatePlanillaCost(answers, params.plan) +
      calculateFacturasCost(answers) +
      calculateTransactionCost(answers); // Agregar el costo de transacciones adicionales
    return baseCost + additionalCost;
  };

  // Cargar datos de localStorage cuando se monta el componente
  useEffect(() => {
    const storedAnswers = localStorage.getItem("answers");

    if (storedAnswers) {
      const parsedAnswers = JSON.parse(storedAnswers);
      setAnswers(parsedAnswers);

      const summaryItems = [
        {
          label: "Tipo de Plan",
          value: `${params.plan.charAt(0).toUpperCase()}${params.plan.slice(1).toLowerCase()} Plan`
        },
        {
          label: "Tipo de Persona",
          value: parsedAnswers.tipoPersona
        },
        {
          label: "Manejo de Planilla",
          value: parsedAnswers.manejoPlanilla
        },
        ...(parsedAnswers.manejoPlanilla === "Si"
          ? [
              {
                label: "Total de Colaboradores",
                value: parsedAnswers.colaboradores
              }
            ]
          : []),
        {
          label: "Facturas Electrónicas",
          value: parsedAnswers.facturas
        },
        ...(parsedAnswers.facturas === "Si"
          ? [
              {
                label: "Facturas electrónicas emitidas",
                value:
                  parsedAnswers.cantidadFacturasEmitidas ===
                  "Más de 40"
                    ? ` ${parsedAnswers.facturasExactas}`
                    : parsedAnswers.cantidadFacturasEmitidas
              },
              {
                label: "Facturas electrónicas recibidas",
                value: parsedAnswers.cantidadFacturasRecibidas
              }
            ]
          : []),
        {
          label: "Transacciones mensuales",
          value: parsedAnswers.transacciones || "N/A"
        }
      ];

      setSummaryItems(summaryItems);
      setBaseCost(calculateBaseCost(parsedAnswers));
      setPlanillaCost(
        calculatePlanillaCost(parsedAnswers, params.plan)
      );
      setFacturasCost(calculateFacturasCost(parsedAnswers));
      setTransactionCost(calculateTransactionCost(parsedAnswers));
      setTotalCost(calculateTotalCost(parsedAnswers)); // Incluir el cálculo total actualizado
    }
  }, [params.plan]);

  // Función para manejar el botón 'Atrás'
  const handleBack = () => {
    router.push(`/plans/${params.plan}`);
  };

  // Función para manejar el botón 'Continuar'
  const handleContinue = () => {
    // Usamos answers del estado
    if (answers) {
      const baseCost = calculateBaseCost(answers, params.plan);
      const planillaCost = calculatePlanillaCost(
        answers,
        params.plan
      );
      const facturasCost = calculateFacturasCost(answers);
      const totalCost = calculateTotalCost(answers);

      // Guarda los resultados en localStorage
      localStorage.setItem("baseCost", baseCost);
      localStorage.setItem("planillaCost", planillaCost);
      localStorage.setItem("facturasCost", facturasCost);
      localStorage.setItem("totalCost", totalCost);
      localStorage.setItem("transactions", transactionCost);

      router.push(`/plans/${params.plan}/form`);
    } else {
      console.error("No se encontraron los datos de 'answers'.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Panel Izquierdo */}
      <div className="flex w-full flex-col items-center justify-between bg-[#305832] p-8 lg:w-1/3">
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
      <div className="m-auto flex w-full max-w-4xl flex-col px-4 sm:px-6 md:px-8 lg:flex-row lg:px-0">
        <div className="mx-auto w-full max-w-full flex-1 lg:max-w-2xl">
          <h3 className="mb-8 mt-8 text-center text-3xl font-semibold lg:text-left">
            Resumen de tu plan
          </h3>
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <ul className="divide-y divide-gray-200">
              {summaryItems.map((item, index) => (
                <li
                  key={index}
                  className="m-2 flex items-center justify-between py-4">
                  <span className="text-lg font-medium text-gray-900">
                    {item.label}
                  </span>
                  <span className="text-lg text-gray-700">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="mb-4 mt-6 flex w-1/3 items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
            onClick={handleBack}>
            <FaArrowLeft className="mr-2" /> Atrás
          </button>
        </div>

        <div className="h-full w-full rounded-lg bg-gray-100 p-4 shadow-md lg:ml-4 lg:w-2/5">
          <h3 className="mb-4 text-center text-xl font-bold lg:text-left">
            Resumen de Precios
          </h3>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-m font-medium text-gray-900">
                Costo del plan:
              </span>
              <span className="text-xs font-semibold text-black">
                ₡{baseCost.toLocaleString()} IVAI / mensual
              </span>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-m font-bold text-gray-900 underline">
                Costos adicionales del plan
              </span>
            </div>
            {planillaCost > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-m font-medium text-gray-900">
                  Costo Planilla:
                </span>
                <span className="text-xs font-semibold text-black">
                  ₡{planillaCost.toLocaleString()} IVAI
                </span>
              </div>
            )}
            {facturasCost > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-m font-medium text-gray-900">
                  Costo Facturas:
                </span>
                <span className="text-xs font-semibold text-black">
                  ₡{facturasCost.toLocaleString()} IVAI
                </span>
              </div>
            )}
            {transactionCost > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-m font-medium text-gray-900">
                  Costo Transacciones:
                </span>
                <span className="text-xs font-semibold text-black">
                  ₡{transactionCost.toLocaleString()} IVAI
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-gray-300 pt-4">
              <span className="text-lg font-semibold text-gray-900">
                Costo total:
              </span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-2xl font-extrabold text-gray-900">
                ₡{totalCost.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-gray-700">
                IVAI / mensual
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-[#305832] hover:text-white"
            onClick={handleContinue}>
            Continuar con el pago
          </button>
        </div>
      </div>
    </div>
  );
}
