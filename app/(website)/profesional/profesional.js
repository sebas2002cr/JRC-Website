"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Summary from "@/components/ui/summary";
import CustomerInfoForm from "@/components/customerInfoForm";
import Payments from "@/components/ui/payment";
import { useRouter } from "next/navigation";

export default function Profesional() {
  // Asegúrate de que estás en el cliente
  const router = typeof window !== "undefined" ? useRouter() : null;

  const controls = useAnimation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({
    colaboradores: 0,
    tipoPersona: "",
    manejoPlanilla: "",
    facturas: "",
    cantidadFacturasEmitidas: "",
    facturasExactas: "",
    cantidadFacturasRecibidas: "",
    transacciones: ""
  });
  const [colaboradores, setColaboradores] = useState("");
  const [facturasExactas, setFacturasExactas] = useState("");
  const [transacciones, setTransacciones] = useState("");
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showColaboradoresQuestion, setShowColaboradoresQuestion] =
    useState(false);
  const [showFacturasQuestion, setShowFacturasQuestion] =
    useState(false);
  const [showFacturasInput, setShowFacturasInput] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});
  const [showSummary, setShowSummary] = useState(true); // Mostrar el resumen inicialmente

  const summaryItems = [
    { label: "Tipo de Plan", value: `Profesional Plan` },
    { label: "Tipo de Persona", value: answers.tipoPersona },
    { label: "Manejo de Planilla", value: answers.manejoPlanilla },
    ...(answers.manejoPlanilla === "Si"
      ? [
          {
            label: "Total de Colaboradores",
            value: answers.colaboradores
          }
        ]
      : []),
    { label: "Facturas Electrónicas", value: answers.facturas },
    ...(answers.facturas === "Si"
      ? [
          {
            label: "Facturas electrónicas emitidas",
            value:
              answers.cantidadFacturasEmitidas === "Más de 40"
                ? ` ${answers.facturasExactas}`
                : answers.cantidadFacturasEmitidas
          },
          {
            label: "Facturas electrónicas recibidas",
            value: answers.cantidadFacturasRecibidas
          }
        ]
      : []),
    { label: "Transacciones mensuales", value: answers.transacciones }
  ];

  // Fetch questions from JSON file
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("json-info/questions.json"); // Ruta del archivo JSON
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Dentro de tu componente Profesional

  useEffect(() => {
    // Guardar estado en localStorage cuando cambie
    localStorage.setItem("answers", JSON.stringify(answers));
    localStorage.setItem(
      "currentQuestion",
      JSON.stringify(currentQuestion)
    );
    localStorage.setItem(
      "customerInfo",
      JSON.stringify(customerInfo)
    );
    localStorage.setItem(
      "showCustomerForm",
      JSON.stringify(showCustomerForm)
    );
    localStorage.setItem(
      "showPayments",
      JSON.stringify(showPayments)
    );
  }, [
    answers,
    currentQuestion,
    customerInfo,
    showCustomerForm,
    showPayments
  ]);

  useEffect(() => {
    // Recuperar el estado desde localStorage si existe
    const savedAnswers = localStorage.getItem("answers");
    const savedCurrentQuestion =
      localStorage.getItem("currentQuestion");
    const savedCustomerInfo = localStorage.getItem("customerInfo");
    const savedShowCustomerForm = localStorage.getItem(
      "showCustomerForm"
    );
    const savedShowPayments = localStorage.getItem("showPayments");

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    if (savedCurrentQuestion) {
      setCurrentQuestion(JSON.parse(savedCurrentQuestion));
    }
    if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo));
    }
    if (savedShowCustomerForm) {
      setShowCustomerForm(
        JSON.parse(savedShowCustomerForm) === "true"
      );
    }
    if (savedShowPayments) {
      setShowPayments(JSON.parse(savedShowPayments) === "true");
    }
  }, []);

  const filterQuestions = () => {
    return questions.filter(q => {
      if (
        q.key === "colaboradores" &&
        answers.manejoPlanilla !== "Si"
      ) {
        return false; // No mostrar si no se requiere manejo de planilla
      }
      if (
        q.key === "cantidadFacturasEmitidas" &&
        answers.facturas !== "Si"
      ) {
        return false; // No mostrar si no se requiere facturación electrónica
      }
      if (
        q.key === "facturasExactas" &&
        answers.cantidadFacturasEmitidas !== "Más de 40"
      ) {
        return false; // No mostrar si no se emiten más de 40 facturas
      }
      if (
        q.key === "cantidadFacturasRecibidas" &&
        answers.facturas !== "Si"
      ) {
        return false; // No mostrar si no se requiere facturación electrónica
      }
      return true; // Mostrar la pregunta por defecto
    });
  };

  const filteredQuestions = filterQuestions();

  const handleAnswer = () => {
    const currentQuestionKey = filteredQuestions[currentQuestion].key;

    if (filteredQuestions[currentQuestion].type === "number") {
      let value = "";
      if (currentQuestionKey === "colaboradores") {
        value = colaboradores;
      } else if (currentQuestionKey === "facturasExactas") {
        value = facturasExactas;
      } else if (currentQuestionKey === "transacciones") {
        value = transacciones;
      }

      if (
        !/^\d+$/.test(value) ||
        (currentQuestionKey === "facturasExactas" &&
          parseInt(value) <= 40)
      ) {
        setError("Por favor, introduce un número válido.");
        return;
      }

      setError("");
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestionKey]: parseInt(value, 10)
      }));
    } else {
      const selectedOption = selectedOptions[currentQuestionKey];

      if (!selectedOption) {
        setError("Por favor, selecciona una opción.");
        return;
      }

      setError("");
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestionKey]: selectedOption
      }));

      if (currentQuestionKey === "facturas") {
        setShowFacturasQuestion(selectedOption === "Si");
      }

      if (currentQuestionKey === "cantidadFacturasEmitidas") {
        setShowFacturasInput(selectedOption === "Más de 40");
      }
    }

    setCurrentQuestion(prev => prev + 1);
  };

  const handleOptionSelect = (key, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: option
    }));
    setError("");
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;

    const prevQuestion = currentQuestion - 1;
    const prevQuestionKey = questions[prevQuestion].key;

    if (prevQuestionKey === "manejoPlanilla") {
      setShowColaboradoresQuestion(answers.manejoPlanilla === "Si");
    }

    if (prevQuestionKey === "facturas") {
      setShowFacturasQuestion(answers.facturas === "Si");
    }

    if (prevQuestionKey === "cantidadFacturasEmitidas") {
      setShowFacturasInput(
        answers.cantidadFacturasEmitidas === "Más de 40"
      );
    }

    setCurrentQuestion(prevQuestion);
  };

  const calculateBaseCost = () => {
    return 99500;
  };

  const calculatePlanillaCost = () => {
    return answers.manejoPlanilla === "Si"
      ? answers.colaboradores * 10000 * 1.13
      : 0;
  };

  const calculateFacturasCost = () => {
    const { cantidadFacturasEmitidas, facturasExactas } = answers;

    switch (cantidadFacturasEmitidas) {
      case "1-10":
        return 10000 * 1.13; // Cálculo dinámico del IVA
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

  const calculateAdditionalCost = () => {
    return calculatePlanillaCost() + calculateFacturasCost();
  };

  const calculateTotalCost = () => {
    const baseCost = calculateBaseCost();
    const additionalCost = calculateAdditionalCost();
    return baseCost + additionalCost;
  };

  const handleContinue = () => {
    setShowCustomerForm(true);
    router.push("/profesional/form");
  };

  const handleSubmitCustomerInfo = info => {
    setCustomerInfo(info); // Guardar la información del cliente
    setShowPayments(true); // Cambiar a la vista de pagos
    router.push("/profesional/checkout");
  };

  const onBackSummary = () => {
    setShowCustomerForm(false); // Regresar al paso anterior si se estaba en el formulario de información del cliente
    setShowPayments(false); // Asegurarse de que no se muestre el paso de pagos
    setCurrentQuestion(currentQuestion - 1); // Retroceder una pregunta
    router.push("/profesional");
  };

  const onBackForm = () => {
    setShowCustomerForm(false); // Ocultar el formulario de información del cliente
    setShowPayments(false); // Asegurarse de que no se muestre el paso de pagos
    setShowSummary(true); // Mostrar el resumen del plan
    router.push("/profesional/summary");
  };
  const onBackPayment = () => {
    setShowPayments(false); // Ocultar el componente de pagos
    setShowCustomerForm(true); // Mostrar el formulario del cliente
    router.push("/profesional/form");
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
          <p className="text-black">
            Recomendaría a JRC sin duda. Excelente asistencia.
          </p>
          <div className="mt-4 flex items-center">
            <div>
              <p className="font-bold text-black">Manuel</p>
              <p className="text-sm text-gray-700">Manuel Web LLC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Derecho */}
      <motion.div
        className="flex w-full items-center justify-center p-8 lg:w-2/3"
        initial={{ opacity: 1 }}
        animate={controls}
        transition={{ duration: 0.4 }}>
        {currentQuestion < filteredQuestions.length ? (
          <div className="mx-auto w-full max-w-2xl">
            <div className="p-10 text-center font-semibold">
              <h1 className="text-4xl md:text-6xl">
                <span className="tracking-wide text-[#305832]">
                  Profesional{" "}
                </span>
                <span>Plan</span>
              </h1>
            </div>

            {/* Renderizar la pregunta */}
            <h3 className="mb-8 text-2xl font-semibold">
              {filteredQuestions[currentQuestion].question}
            </h3>

            {filteredQuestions[currentQuestion].disclaimer &&
              Array.isArray(
                filteredQuestions[currentQuestion].disclaimer
              ) && (
                <ul className=" mb-4 list-inside list-disc space-y-1 ps-5 text-sm text-gray-500">
                  {filteredQuestions[currentQuestion].disclaimer.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>
              )}

            {filteredQuestions[currentQuestion].type === "number" ? (
              <div>
                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-3 text-gray-700 focus:outline-none"
                  value={
                    filteredQuestions[currentQuestion].key ===
                    "colaboradores"
                      ? colaboradores
                      : filteredQuestions[currentQuestion].key ===
                          "facturasExactas"
                        ? facturasExactas
                        : transacciones
                  }
                  onChange={e => {
                    if (
                      filteredQuestions[currentQuestion].key ===
                      "colaboradores"
                    ) {
                      setColaboradores(e.target.value);
                    } else if (
                      filteredQuestions[currentQuestion].key ===
                      "facturasExactas"
                    ) {
                      setFacturasExactas(e.target.value);
                    } else if (
                      filteredQuestions[currentQuestion].key ===
                      "transacciones"
                    ) {
                      setTransacciones(e.target.value);
                    }
                  }}
                  placeholder={
                    filteredQuestions[currentQuestion].key ===
                    "colaboradores"
                      ? "Introduce el número de colaboradores"
                      : filteredQuestions[currentQuestion].key ===
                          "facturasExactas"
                        ? "Introduce la cantidad exacta de facturas"
                        : "Introduce el número de transacciones"
                  }
                />
                {error && (
                  <p className="mt-2 text-red-500">{error}</p>
                )}
              </div>
            ) : (
              <form>
                {filteredQuestions[currentQuestion].options.map(
                  (option, index) => (
                    <div key={index} className="mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionSelect(
                            filteredQuestions[currentQuestion].key,
                            option
                          )
                        }
                        className={`w-full rounded-lg border py-3 font-bold transition-all duration-300 ${
                          selectedOptions[
                            filteredQuestions[currentQuestion].key
                          ] === option
                            ? "bg-[#305832] text-white"
                            : "border-[#305832] bg-white text-[#305832] hover:bg-[#305832] hover:text-white"
                        }`}>
                        {option}
                      </button>
                    </div>
                  )
                )}
              </form>
            )}
            {/* {error && <p className="mt-2 text-red-500">{error}</p>} */}
            <div className="mt-8 flex w-full justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-400"
                disabled={currentQuestion === 0}>
                Atrás
              </button>
              <button
                type="button"
                onClick={handleAnswer}
                className="rounded-lg bg-[#305832] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#234621]">
                {currentQuestion < filteredQuestions.length - 1
                  ? "Siguiente"
                  : "Finalizar"}
              </button>
            </div>
          </div>
        ) : showPayments ? (
          <Payments
            items={summaryItems}
            calculateBaseCost={calculateBaseCost}
            calculatePlanillaCost={calculatePlanillaCost}
            calculateFacturasCost={calculateFacturasCost}
            calculateTotalCost={calculateTotalCost}
            onContinue={handleContinue}
            customerInfo={customerInfo}
            onBackPayment={onBackPayment}
          />
        ) : showCustomerForm ? (
          <CustomerInfoForm
            onSubmit={handleSubmitCustomerInfo}
            summaryItems={summaryItems}
            selectedPlan={"Profesional Plan"}
            calculateBaseCost={calculateBaseCost}
            calculatePlanillaCost={calculatePlanillaCost}
            calculateFacturasCost={calculateFacturasCost}
            calculateTotalCost={calculateTotalCost}
            calculateAdditionalCost={calculateAdditionalCost}
            onContinueForm={handleSubmitCustomerInfo}
            onBackForm={onBackForm}
          />
        ) : (
          <Summary
            items={summaryItems}
            calculateBaseCost={calculateBaseCost}
            calculatePlanillaCost={calculatePlanillaCost}
            calculateFacturasCost={calculateFacturasCost}
            calculateTotalCost={calculateTotalCost}
            onContinue={handleContinue}
            onBackSummary={onBackSummary}
          />
        )}
      </motion.div>
    </div>
  );
}
