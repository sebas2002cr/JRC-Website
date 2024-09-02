"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";

export default function Starter() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({ colaboradores: 0, tipoPersona: "" });
  const [colaboradores, setColaboradores] = useState("");
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showColaboradoresQuestion, setShowColaboradoresQuestion] = useState(true);
  const [showFacturasQuestion, setShowFacturasQuestion] = useState(true);


  const questions = [
    {
      question: "¿Qué tipo de persona es?",
      options: ["Física", "Jurídica"],
      key: "tipoPersona",
    },
    {
      question: "¿Ocupas manejo de planilla?",
      options: ["Si", "No"],
      key: "manejoPlanilla",
    },
    ...showColaboradoresQuestion ? [
      {
        question: "¿Cuántos colaboradores tiene tu empresa?",
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
      question: "¿Cuantas facturas ocupas facturar por mes?",
      options: ["1-5", "6-10", "11-15" , "16-20" , "Más de 20"],
      key: "cantidadFacturas",
    },
  ] : [], 
  ];
  

  const handleAnswer = () => {
    if (questions[currentQuestion].type === "number") {
      if (!/^\d+$/.test(colaboradores)) {
        setError("Por favor, introduce un número válido.");
        return;
      }
      setError("");
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentQuestion].key]: parseInt(colaboradores, 10),
      }));
      setSelectedOption(null);
    } else {
      if (!selectedOption) {
        setError("Por favor, selecciona una opción.");
        return;
      }
      setError("");
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentQuestion].key]: selectedOption,
      }));
  
      if (questions[currentQuestion].key === "manejoPlanilla" && selectedOption === "No") {
        setShowColaboradoresQuestion(false);
      }

      if (questions[currentQuestion].key === "facturas" && selectedOption === "No") {
        setShowFacturasQuestion(false);
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
      controls.start({ y: 0, opacity: 1 });
    });
  };

  const calculateBaseCost = () => {
    return answers.tipoPersona === "Física" ? 45000 : 65000;
  };

  const calculateAdditionalCost = () => {
    const colaboradores = answers.colaboradores || 0;
      return (colaboradores * 11300);
    
  };

  const calculateTotalCost = () => {
    return calculateBaseCost() + calculateAdditionalCost();
  };

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row">
      {/* Panel Izquierdo */}
      <motion.div
        className="lg:w-1/3 bg-[#305832] p-8 flex flex-col justify-between items-center"
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }} // Ajuste de velocidad
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
        className=" lg:w-2/3 p-8 flex flex-col justify-center items-center "
        initial={{ y: 0, opacity: 1 }}
        animate={controls}
        transition={{ duration: 0.4 }} // Ajuste de velocidad
      >
        {currentQuestion < questions.length ? (
          <div className="w-full max-w-lg ">
            <div className="text-center font-semibold p-10">
              <h1 className="text-3xl md:text-5xl">
                <span className="text-[#305832] tracking-wide">Starter </span>
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
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  value={colaboradores}
                  onChange={(e) => setColaboradores(e.target.value)}
                  placeholder="Introduce el número de colaboradores"
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
                className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
                disabled={currentQuestion === 0}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleAnswer}
                className="py-2 px-4 bg-[#305832] text-white font-semibold rounded-lg hover:bg-[#234621] transition-all duration-300"
              >
                {currentQuestion < questions.length - 1 ? "Siguiente" : "Finalizar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            <h3 className="text-2xl font-semibold mb-8">
              Resumen de tus respuestas:
            </h3>
            <ul className="list-disc pl-5 mb-8">
              {questions.map((question, index) => (
                <li key={index} className="mb-2">
                  <strong>{question.question}:</strong> {answers[question.key]}
                </li>
              ))}
              <li className="mb-2">
                <strong>Total de colaboradores:</strong> {answers.colaboradores}
              </li>
              <li className="mb-2">
                <strong>Costo del plan:</strong> ₡{calculateBaseCost().toLocaleString()} ivai /mensual
              </li>
              <li className="mb-2">
                <strong>Costo adicional:</strong> ₡{calculateAdditionalCost().toLocaleString()} ivai 
              </li>
              <li className="mb-2">
                <strong>Costo total:</strong> ₡{calculateTotalCost().toLocaleString()} ivai  /mensual
              </li>
            </ul>
            <button
              type="button"
              className="w-full py-3 bg-[#305832] text-white font-bold rounded-lg hover:bg-[#234621] transition-all duration-300"
            >
              Enviar Respuestas
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
