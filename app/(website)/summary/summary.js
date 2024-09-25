import React from "react";
import { FaArrowLeft } from "react-icons/fa"; // Importar el ícono de la flecha

export default function Summary({
  items,
  calculateBaseCost,
  calculatePlanillaCost,
  calculateFacturasCost,
  calculateTotalCost,
  onContinue,
  onBackSummary
}) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 lg:flex-row lg:px-0">
      <div className="mx-auto w-full max-w-2xl flex-1">
        <h3 className="mb-8 text-center text-3xl font-semibold lg:text-left">
          Resumen de tu plan
        </h3>
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <ul className="divide-y divide-gray-200">
            {items.map((item, index) => (
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
        {/* Botón de 'Atrás' */}
        <button
          type="button"
          className="mt-6 flex w-1/3  items-center justify-center rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-gray-100"
          onClick={onBackSummary}>
          <FaArrowLeft className="mr-2" /> Atrás
        </button>
      </div>

      {/* Sidebar */}
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
              ₡{calculateBaseCost().toLocaleString()} IVAI / mensual
            </span>
          </div>
          {calculatePlanillaCost() > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-m font-medium text-gray-900">
                Costo adicional (Planilla):
              </span>
              <span className="text-xs font-semibold text-black">
                ₡{calculatePlanillaCost().toLocaleString()} IVAI
              </span>
            </div>
          )}
          {calculateFacturasCost() > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <span className="text-m font-medium text-gray-900">
                Costo adicional (Facturas):
              </span>
              <span className="text-xs font-semibold text-black">
                ₡{calculateFacturasCost().toLocaleString()} IVAI
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
              ₡{calculateTotalCost().toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-700">
              IVAI / mensual
            </span>
          </div>
        </div>

        {/* Botón de 'Continuar' */}
        <button
          type="button"
          className="mt-6 w-full rounded-lg border border-[#305832] bg-white py-3 font-semibold text-[#305832] transition-all duration-300 hover:bg-[#305832] hover:text-white"
          onClick={onContinue}>
          Continuar con el pago
        </button>
      </div>
    </div>
  );
}
