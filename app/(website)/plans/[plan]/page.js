"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, notFound } from "next/navigation";
import { useParams } from "next/navigation"; // Para obtener los parámetros de la URL

// Fuera del componente: es una constante, y asi el useEffect que la usa no
// necesita listarla como dependencia.
const validPlans = ["starter", "professional", "full-compliance"]; // Nombres de planes válidos

export default function PlanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams(); // Usar useParams para obtener los parámetros de la URL
  const [plan, setPlan] = useState(null); // Estado para el nombre del plan
  // localStorage no existe en el servidor: se lee tras el montaje.
  const [reviewName, setReviewName] = useState("");
  const [reviewPositon, setReviewPositon] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    setReviewName(localStorage.getItem("Review-name") || "");
    setReviewPositon(localStorage.getItem("Review-position") || "");
    setReviewMessage(localStorage.getItem("Review-message") || "");
  }, []);

  // Verifica que el plan en la URL sea válido
  useEffect(() => {
    const { plan } = params;
    if (validPlans.includes(plan)) {
      setPlan(plan);
    } else {
      // No existe una ruta /404: en App Router lo correcto es notFound(),
      // que muestra la pagina de "no encontrado" sin cambiar la URL.
      notFound();
    }
  }, [params, router]);

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
  const [showSummary, setShowSummary] = useState(true);
  const [direction, setDirection] = useState("next");

  const questionVariants = {
    enter: direction => ({
      x: direction === "next" ? 1000 : 0, // Si es hacia adelante, hay movimiento; si es hacia atrás, no hay movimiento
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: direction => ({
      x: direction === "next" ? -550 : 0, // Mantén el movimiento solo al ir hacia adelante
      opacity: 0 // Desvanece en ambas direcciones, pero sin movimiento al ir atrás
    })
  };

  // Cargar preguntas desde un archivo JSON basado en el plan actual
  useEffect(() => {
    if (plan) {
      const fetchQuestions = async () => {
        try {
          let response;
          if (plan === "starter") {
            response = await fetch(
              "/json-info/questionsStarter.json"
            );
          } else {
            response = await fetch("/json-info/questions.json");
          }
          const data = await response.json();
          setQuestions(data.questions);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      };

      fetchQuestions();
    }
  }, [plan]);
  useEffect(() => {
    if (plan) {
      localStorage.setItem("selectedPlan", plan); // Guarda el plan en localStorage
    }
  }, [plan]);

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

  // Recuperar el estado desde localStorage si existe
  useEffect(() => {
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

  // Filtrar preguntas según las respuestas actuales.
  //
  // Recibe las respuestas a usar en vez de leer siempre el estado: cuando se
  // acaba de responder algo, `answers` todavia no refleja ese cambio (setState
  // es asincrono) y hay que decidir con el valor nuevo.
  const filterQuestions = (answersToUse = answers) => {
    // Filtrar las preguntas de acuerdo a las respuestas seleccionadas
    return questions.filter(q => {
      if (
        q.key === "colaboradores" &&
        answersToUse.manejoPlanilla !== "Si"
      ) {
        return false;
      }
      if (
        q.key === "cantidadFacturasEmitidas" &&
        answersToUse.facturas !== "Si"
      ) {
        return false;
      }
      if (
        q.key === "facturasExactas" &&
        answersToUse.cantidadFacturasEmitidas !== "Más de 40"
      ) {
        return false;
      }
      if (
        q.key === "cantidadFacturasRecibidas" &&
        answersToUse.facturas !== "Si"
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredQuestions = filterQuestions();

  /**
   * Valida la pregunta actual, guarda la respuesta y decide si avanzar.
   *
   * @param {string|null} optionOverride Opcion recien elegida. Hace falta
   *   porque al avanzar automaticamente el estado `selectedOptions` todavia
   *   no contiene la seleccion.
   */
  const handleAnswer = (optionOverride = null) => {
    const currentQuestionKey =
      filteredQuestions[currentQuestion]?.key;

    if (currentQuestionKey === "completado") {
      router.push(`/plans/${plan}/summary`);
      return;
    }

    // Respuestas incluyendo la de esta pregunta, para decidir con datos al dia.
    let nextAnswers = answers;

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
        setError(
          currentQuestionKey === "facturasExactas"
            ? "Ingresá un número mayor a 40."
            : "Ingresá un número válido."
        );
        return;
      }

      setError("");
      nextAnswers = {
        ...answers,
        [currentQuestionKey]: parseInt(value, 10)
      };
      setAnswers(nextAnswers);
    } else {
      const selectedOption =
        optionOverride ?? selectedOptions[currentQuestionKey];

      if (!selectedOption) {
        setError("Seleccioná una opción para continuar.");
        return;
      }

      setError("");
      nextAnswers = {
        ...answers,
        [currentQuestionKey]: selectedOption
      };
      setAnswers(nextAnswers);

      // Mostrar preguntas adicionales dependiendo de la respuesta
      if (
        currentQuestionKey === "facturas" &&
        selectedOption === "Si"
      ) {
        setShowFacturasQuestion(true);
        // Asegurarse de no avanzar automáticamente al resumen
        if (
          filteredQuestions.some(
            q => q.key === "cantidadFacturasEmitidas"
          )
        ) {
          return; // No avanzar, hay preguntas adicionales de facturas que mostrar
        }
      } else if (
        currentQuestionKey === "facturas" &&
        selectedOption === "No"
      ) {
        setShowFacturasQuestion(false);
      }

      if (
        currentQuestionKey === "cantidadFacturasEmitidas" &&
        selectedOption === "Más de 40"
      ) {
        setShowFacturasInput(true);
      } else {
        setShowFacturasInput(false);
      }
    }

    // Filtrar de nuevo las preguntas para incluir las adicionales.
    // Se pasan las respuestas ya actualizadas: con el estado anterior, una
    // respuesta que abre una pregunta nueva (por ejemplo manejar planilla ->
    // cuantos colaboradores) no se veia aqui, y el cotizador se saltaba esa
    // pregunta y se iba derecho al resumen.
    const updatedFilteredQuestions = filterQuestions(nextAnswers);

    // Si hay preguntas adicionales, no redirigir aún al resumen
    if (currentQuestion + 1 < updatedFilteredQuestions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      router.push(`/plans/${plan}/summary`);
    }
  };

  const handleOptionSelect = (key, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: option
    }));
    setError("");

    // Las opciones son excluyentes: elegir una ya es la respuesta, no hace
    // falta confirmar con "Siguiente". Se pasa la opcion directamente porque
    // setSelectedOptions todavia no se refleja en el estado.
    // (El boton "Siguiente" sigue ahi: las preguntas donde hay que escribir
    // un numero lo necesitan.)
    setDirection("next");
    handleAnswer(option);
  };

  const handleNext = async () => {
    setDirection("next");
    setIsLoading(true); // Activa el estado de carga
  
    // Verificar si la pregunta actual tiene el key "completado"
    const currentQuestionKey = filteredQuestions[currentQuestion]?.key;
    if (currentQuestionKey === "completado") {
      // Redirige a la página de resumen y desactiva la pantalla de carga después de la navegación
      await router.push(`/plans/${plan}/summary`);
      setIsLoading(false); // Desactiva el estado de carga después de la navegación
    } else {
      handleAnswer(); // Lógica para avanzar a la siguiente pregunta
      setIsLoading(false); // Desactiva el estado de carga si no hay redirección
    }
  };
  

  const handlePrev = () => {
    // En la primera pregunta no hay paso anterior dentro del cotizador:
    // "Atrás" devuelve a la comparativa de planes en vez de quedarse muerto.
    if (currentQuestion === 0) {
      router.push("/pricing");
      return;
    }

    setDirection("prev");
    setCurrentQuestion(prev => prev - 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">

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
        <div>
          <a href="/pricing">
            <button className="w-fill mx-auto mt-6 rounded border border-white bg-white p-4 px-6 py-2  font-extrabold text-[#305832]   sm:mx-0 sm:w-auto sm:px-8 sm:py-3">
              Volver a los planes
            </button>
          </a>
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
      <motion.div
        className="flex w-full items-center justify-center p-8 lg:w-2/3"
        initial={{ opacity: 1 }}
        animate={controls}
        transition={{ duration: 0.4 }}>
        {currentQuestion < filteredQuestions.length ? (
          <div className="mx-auto w-full max-w-2xl">
            <motion.div
              key={currentQuestion}
              custom={direction}
              variants={questionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="mx-auto w-full max-w-2xl">
              <div className="p-10 text-center font-semibold">
                <h1 className="text-4xl md:text-6xl">
                  <span className="tracking-wide text-[#305832]">
                    {plan.charAt(0).toUpperCase() + plan.slice(1)}{" "}
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
                    {filteredQuestions[
                      currentQuestion
                    ].disclaimer.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}

              {filteredQuestions[currentQuestion].key ===
              "completado" ? (
                <div className="flex flex-col items-center justify-center"></div>
              ) : filteredQuestions[currentQuestion].type ===
                "number" ? (
                <div>
                  <input
                    // inputMode numeric en vez de type="number": abre el
                    // teclado numerico en movil pero sin las flechitas ni el
                    // scroll que cambia el valor por accidente.
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
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
                      // Se descarta todo lo que no sea digito, asi no entran
                      // letras ni simbolos a la cotizacion.
                      const soloDigitos = e.target.value.replace(
                        /\D/g,
                        ""
                      );

                      if (
                        filteredQuestions[currentQuestion].key ===
                        "colaboradores"
                      ) {
                        setColaboradores(soloDigitos);
                      } else if (
                        filteredQuestions[currentQuestion].key ===
                        "facturasExactas"
                      ) {
                        setFacturasExactas(soloDigitos);
                      } else if (
                        filteredQuestions[currentQuestion].key ===
                        "transacciones"
                      ) {
                        setTransacciones(soloDigitos);
                      }
                    }}
                    placeholder={
                      filteredQuestions[currentQuestion].key ===
                      "colaboradores"
                        ? "Ingresá el número de colaboradores"
                        : filteredQuestions[currentQuestion].key ===
                            "facturasExactas"
                          ? "Ingresá la cantidad exacta de facturas"
                          : "Ingresá el número de transacciones"
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
                          // El hover pinta la opcion de verde (es lo que le da
                          // vida al paso). Por eso la opcion ya elegida NO
                          // puede usar ese mismo verde: al volver atras se
                          // veia igual que un hover y no se distinguia lo
                          // marcado de lo que estabas señalando. La elegida
                          // va en verde oscuro, con anillo y un check.
                          className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 py-3 font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none ${
                            selectedOptions[
                              filteredQuestions[currentQuestion].key
                            ] === option
                              ? "border-[#234621] bg-[#234621] text-white shadow-md ring-2 ring-[#305832] ring-offset-2"
                              : "border-[#305832] bg-white text-[#305832] hover:bg-[#305832] hover:text-white"
                          }`}>
                          {selectedOptions[
                            filteredQuestions[currentQuestion].key
                          ] === option && (
                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.79 6.8-6.8a1 1 0 011.4 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {option}
                        </button>
                      </div>
                    )
                  )}
                </form>
              )}

              <div className="mt-8 flex w-full justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 ease-out hover:bg-gray-400 hover:shadow-md active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none">
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-lg bg-[#305832] px-6 py-3 font-semibold text-white transition-all duration-200 ease-out hover:bg-[#234621] hover:shadow-md active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none">
                  Siguiente
                </button>
              </div>
            </motion.div>
          </div>
        ) : showPayments ? (
          <></>
        ) : showCustomerForm ? (
          <></>
        ) : (
          <></>
        )}
      </motion.div>
    </div>
  );
}
