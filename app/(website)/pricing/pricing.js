"use client";

import { useState, useEffect } from "react";
import Container from "@/components/container";

export default function Pricing({ authors, settings }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isLoaded, setIsLoaded] = useState(false);

  const handleToggle = () => {
    setIsLoaded(false); // Desactiva la animación
    setTimeout(() => {
      setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly");
      setIsLoaded(true); // Reactiva la animación
    }, 200); // Tiempo suficiente para la animación de salida
  };

  const pricingData = {
    basic: {
      monthly: 10,
      annual: 100,
    },
    startup: {
      monthly: 24,
      annual: 240,
    },
    enterprise: {
      monthly: 35,
      annual: 350,
    },
  };

  useEffect(() => {
    // Al cargar la página, activar la animación
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <Container>
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-6xl">
          <div className="text-center font-semibold">
          <p className="mb-4 text-s font-bold text-[#305832] text-center">Precios</p>
            <h1 className="text-3xl md:text-5xl">
              <span className="text-[#305832] tracking-wide">Precios claros </span>
              <span>para empezar</span>
            </h1>
            <p className="pt-6 text-lg md:text-xl text-gray-400 font-normal w-full">
              Elige un plan que funcione mejor para ti y<br /> tu equipo.
            </p>
          </div>
          
          {/* Switch para alternar entre mensual y anual */}
          <div className="flex justify-center mt-8">
            <span className={`cursor-pointer px-4 py-2 rounded-l-full ${billingCycle === "monthly" ? "bg-[#305832] text-white" : "bg-gray-200 text-gray-600"}`} onClick={handleToggle}>Mensual</span>
            <span className={`cursor-pointer px-4 py-2 rounded-r-full ${billingCycle === "annual" ? "bg-[#305832] text-white" : "bg-gray-200 text-gray-600"}`} onClick={handleToggle}>Anual</span>
          </div>

          <div className={`pt-12 md:pt-24 flex flex-col md:flex-row justify-center items-center gap-8 transition-opacity duration-2000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            {/* Basic Card */}
            <div className="w-full md:w-1/3 p-8 bg-white text-center rounded-3xl shadow-xl transform transition-transform duration-1\2000 ease-out scale-100">
              <h1 className="text-black font-semibold text-2xl">Básico</h1>
              <p className="pt-2 tracking-wide">
                <span className="text-gray-400 align-top">$ </span>
                <span className="text-3xl font-semibold">{pricingData.basic[billingCycle]}</span>
                <span className="text-gray-400 font-medium">/ {billingCycle === "monthly" ? "mensual" : "anual"}</span>
              </p>
              <hr className="mt-4 border-1" />
              <div className="pt-8">
                <p className="font-semibold text-gray-400 text-left">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    Comienza con <span className="text-black">mensajería</span>
                  </span>
                </p>
                <p className="font-semibold text-gray-400 text-left pt-5">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    Reuniones de equipo <span className="text-black">flexibles</span>
                  </span>
                </p>
                <p className="font-semibold text-gray-400 text-left pt-5">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    <span className="text-black">5 TB</span> de almacenamiento en la nube
                  </span>
                </p>

                <a href="#" className="">
                  <p className="w-full py-4 bg-[#305832] mt-8 rounded-xl text-white">
                    <span className="font-medium">Elige Plan</span>
                    <span className="pl-2 material-icons align-middle text-sm">
                      →
                    </span>
                  </p>
                </a>
              </div>
            </div>
            {/* StartUp Card */}
            <div className="relative w-full md:w-1/3 p-12 bg-[#305832] text-center rounded-3xl text-white border-4 shadow-xl border-white transform transition-transform duration-2000 ease-out scale-100">
              <h1 className="text-white font-semibold text-2xl">Intermedio</h1>
              <p className="pt-2 tracking-wide">
                <span className="text-gray-400 align-top">$ </span>
                <span className="text-3xl font-semibold">{pricingData.startup[billingCycle]}</span>
                <span className="text-gray-400 font-medium">/ {billingCycle === "monthly" ? "mensual" : "anual"}</span>
              </p>
              <hr className="mt-4 border-1 border-gray-600" />
              <div className="pt-8">
                <p className="font-semibold text-gray-400 text-left">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    Todas las funciones de <span className="text-white">Básico</span>
                  </span>
                </p>
                <p className="font-semibold text-gray-400 text-left pt-5">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    Programación de llamadas <span className="text-white">flexible</span>
                  </span>
                </p>
                <p className="font-semibold text-gray-400 text-left pt-5">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    <span className="text-white">15 TB</span> de almacenamiento en la nube
                  </span>
                </p>

                <a href="#" className="">
                  <p className="w-full py-4 bg-white mt-8 rounded-xl text-[#305832]">
                    <span className="font-medium">Elige Plan</span>
                    <span className="pl-2 material-icons align-middle text-sm">
                      →
                    </span>
                  </p>
                </a>
              </div>
              <div className="absolute top-4 right-4">
                <p className="bg-purple-700 font-semibold px-4 py-1 rounded-full uppercase text-xs">
                  Popular
                </p>
              </div>
            </div>
            {/* Enterprise Card */}
            <div className="w-full md:w-1/3 p-8 bg-white text-center rounded-3xl shadow-xl transform transition-transform duration-2000 ease-out scale-100">
              <h1 className="text-black font-semibold text-2xl">Profesional</h1>
              <p className="pt-2 tracking-wide">
                <span className="text-gray-400 align-top">$ </span>
                <span className="text-3xl font-semibold">{pricingData.enterprise[billingCycle]}</span>
                <span className="text-gray-400 font-medium">/ {billingCycle === "monthly" ? "mensual" : "anual"}</span>
              </p>
              <hr className="mt-4 border-1" />
              <div className="pt-8">
                <p className="font-semibold text-gray-400 text-left">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    Todas las funciones de <span className="text-black">Intermedio</span>
                  </span>
                </p>
                <p className="font-semibold text-gray-400 text-left pt-5">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    Crecimiento <span className="text-black">orientado</span>
                  </span>
                </p>
                <p className="font-semibold text-gray-400 text-left pt-5">
                  <span className="material-icons align-middle">✓</span>
                  <span className="pl-2">
                    <span className="text-black">Almacenamiento</span> en la nube ilimitado
                  </span>
                </p>

                <a href="#" className="">
                  <p className="w-full py-4 bg-[#305832] mt-8 rounded-xl text-white">
                    <span className="font-medium">Elige Plan</span>
                    <span className="pl-2 material-icons align-middle text-sm">
                      →
                    </span>
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
