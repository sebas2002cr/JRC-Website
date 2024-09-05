"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Summary from "@/components/ui/summary";
import CustomerInfoForm from "@/components/customerInfoForm";

export default function Profesional() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ colaboradores: 0, tipoPersona: "" });
  const [colaboradores, setColaboradores] = useState("");
  const [transacciones, setTransacciones] = useState(""); 
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showColaboradoresQuestion, setShowColaboradoresQuestion] = useState(true);
  const [showFacturasQuestion, setShowFacturasQuestion] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const summaryItems = [
    { label: "Tipo de Plan", value: `Profesional Plan `},
    { label: "Tipo de Persona", value: answers.tipoPersona },
    { label: "Manejo de Planilla", value: answers.manejoPlanilla },   
    { label: "Total de Colaboradores", value: answers.colaboradores },
    { label: "Facturas Electrónicas", value: answers.facturas },
    { label: "Facturas electrónicas emitidas", value: answers.cantidadFacturasEmitidas },
    { label: "Facturas electrónicas recibidas", value: answers.cantidadFacturasRecibidas },
    { label: "Transacciones mensuales", value: answers.transacciones },
  ];

  const questions = [
    {
      question: "¿La actividad económica se trabaja como persona física o jurídica?",
      options: ["Física", "Jurídica"],
      key: "tipoPersona",
    },
    {
      question: "¿Ocupás manejo de planilla?",
      options: ["Si", "No"],
      key: "manejoPlanilla",
    },
    ...showColaboradoresQuestion ? [
      {
        question: "¿Cuántos colaboradores tiene tu empresa? (₡10.000 + IVAI por colaborador extra)",
        type: "number",
        key: "colaboradores",
      },
    ] : [],
    {
      question: "¿Ocupas facturas electrónicas?",
      options: ["Si", "No"],
      key: "facturas",
    },
    ...showFacturasQuestion ? [
    {
      question: "¿Cuántas facturas por mes en promedio se emiten? (Solamente cantidad no importa el monto)",
      options: ["1-5", "6-10", "11-15", "16-20", "Más de 20"],
      key: "cantidadFacturasEmitidas",
    },
    {
      question: "¿Cuántas facturas por mes en promedio recibe? (Solamente cantidad no importa el monto)",
      options: ["1-5", "6-10", "11-15", "16-20", "Más de 20"],
      key: "cantidadFacturasRecibidas",
    },
    ] : [],
    {
      question: "¿Cuántas transacciones mensuales tienen en promedio en el estado de cuenta bancario?",
      type: "number",
      key: "transacciones",
    },
  ];

  const handleAnswer = () => {
    const currentQuestionKey = questions[currentQuestion].key;
  
    if (questions[currentQuestion].type === "number") {
      if (currentQuestionKey === "colaboradores") {
        if (!/^\d+$/.test(colaboradores)) {
          setError("Por favor, introduce un número válido.");
          return;
        }
        setError("");
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [currentQuestionKey]: parseInt(colaboradores, 10),
        }));
      } else if (currentQuestionKey === "transacciones") { 
        if (!/^\d+$/.test(transacciones)) {
          setError("Por favor, introduce un número válido.");
          return;
        }
        setError("");
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [currentQuestionKey]: parseInt(transacciones, 10),
        }));
      }
      setSelectedOption(null);
    } else {
      if (!selectedOption) {
        setError("Por favor, selecciona una opción.");
        return;
      }
      setError("");
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestionKey]: selectedOption,
      }));
  
      if (currentQuestionKey === "manejoPlanilla") {
        setShowColaboradoresQuestion(selectedOption === "Si");
      }
  
      if (currentQuestionKey === "facturas") {
        setShowFacturasQuestion(selectedOption === "Si");
      }
  
      setSelectedOption(null);
    }
  
    controls.start({ opacity: 0 }).then(() => {
      setCurrentQuestion(currentQuestion + 1);
      controls.start({ opacity: 1 });
    });
  };
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setError("");
  };

  const handleBack = () => {
    controls.start({ y: "100vh", opacity: 0 }).then(() => {
      setCurrentQuestion(currentQuestion - 1);
  
      if (questions[currentQuestion - 1].key === "manejoPlanilla") {
        setShowColaboradoresQuestion(answers.manejoPlanilla === "Si");
      }
  
      if (questions[currentQuestion - 1].key === "facturas") {
        setShowFacturasQuestion(answers.facturas === "Si");
      }
  
      controls.start({ y: 0, opacity: 1 });
    });
  };

  const calculateBaseCost = () => {
    return 99500;
  };

  const calculateAdditionalCost = () => {
    const colaboradores = answers.colaboradores || 0;
    return colaboradores * 11300;
  };

  const calculateTotalCost = () => {
    return calculateBaseCost() + calculateAdditionalCost();
  };

  const handleContinue = () => {
    setShowCustomerForm(true); // Mostrar el formulario de cliente después del resumen
  };

  const handleSubmitCustomerInfo = (customerInfo) => {
    console.log("Información del cliente:", customerInfo);
    // Aquí puedes manejar lo que sigue después de recibir la información del cliente
  };

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row">
      {/* Panel Izquierdo */}
      <motion.div
        className="w-full lg:w-1/3 bg-[#305832] p-8 flex flex-col justify-between items-center"
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
      >
        {/* Logo en la parte superior */}
        <div className="w-full flex justify-center">
          <Link href="/">
            <Image
              src="/img/JRCLogofull.png"
              alt="Nuevo Logo"
              width={200}
              height={100}
              priority={true}
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </Link>
        </div>

        {/* Texto en el centro */}
        <div className="hidden lg:block text-center m-auto">
          <h1 className="text-white text-3xl font-extrabold">
            Hacemos que las empresas puedan progresar y crecer.
          </h1>
        </div>

        {/* Reviews en la parte inferior */}
        <div className="hidden lg:block mt-auto bg-[#d6e8d2] p-4 rounded-lg">
          <p className="text-black">
            Recomendaría a JRC sin duda. Excelente asistencia.
          </p>
          <div className="flex items-center mt-4">
            <div>
              <p className="font-bold text-black">Manuel</p>
              <p className="text-sm text-gray-700">Manuel Web LLC</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Panel Derecho */}
      <motion.div
        className="w-full lg:w-2/3 p-8 flex justify-center items-center"
        initial={{ y: 0, opacity: 1 }}
        animate={controls}
        transition={{ duration: 0.4 }}
      >
        {currentQuestion < questions.length ? (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center font-semibold p-10">
              <h1 className="text-4xl md:text-6xl">
                <span className="text-[#305832] tracking-wide">Profesional </span>
                <span>Plan</span>
              </h1>
            </div>
            <h3 className="text-2xl font-semibold mb-8">
              {questions[currentQuestion].question}
            </h3>
            {questions[currentQuestion].type === "number" ? (
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-3 text-gray-700 border rounded-lg focus:outline-none"
                    value={questions[currentQuestion].key === "colaboradores" ? colaboradores : transacciones}
                    onChange={(e) => {
                      if (questions[currentQuestion].key === "colaboradores") {
                        setColaboradores(e.target.value);
                      } else if (questions[currentQuestion].key === "transacciones") {
                        setTransacciones(e.target.value);
                      }
                    }}
                    placeholder={questions[currentQuestion].key === "colaboradores" ? "Introduce el número de colaboradores" : "Introduce el número de transacciones"}
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              ) : (
              <form>
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="mb-4">
                    <button
                      type="button"
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full py-3 border font-bold rounded-lg transition-all duration-300 ${
                        selectedOption === option
                          ? "bg-[#305832] text-white"
                          : "bg-white text-[#305832] border-[#305832] hover:bg-[#305832] hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </form>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-8 flex justify-between w-full">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-6 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
                disabled={currentQuestion === 0}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleAnswer}
                className="py-3 px-6 bg-[#305832] text-white font-semibold rounded-lg hover:bg-[#234621] transition-all duration-300"
              >
                {currentQuestion < questions.length - 1 ? "Siguiente" : "Finalizar"}
              </button>
            </div>
          </div>
        ) : showCustomerForm ? (
          <CustomerInfoForm 
            onSubmit={handleSubmitCustomerInfo} 
            summaryItems={summaryItems}
            calculateBaseCost={calculateBaseCost}
            calculateAdditionalCost={calculateAdditionalCost}
            calculateTotalCost={calculateTotalCost}
          />

        ) : (
          <Summary
            items={summaryItems}
            calculateBaseCost={calculateBaseCost}
            calculateAdditionalCost={calculateAdditionalCost}
            calculateTotalCost={calculateTotalCost}
            onContinue={handleContinue} // Pasa la función handleContinue como prop
          />
        )}
      </motion.div>
    </div>
  );
}


