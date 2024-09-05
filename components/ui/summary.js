import React from 'react';

export default function Summary({ items, calculateBaseCost, calculateAdditionalCost, calculateTotalCost, onContinue }) {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-4xl mx-auto px-4 lg:px-0">
      <div className="flex-1 w-full max-w-2xl mx-auto">
        <h3 className="text-3xl font-semibold mb-8 text-center lg:text-left">Resumen de tu plan</h3>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <ul className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <li key={index} className="py-4 flex justify-between items-center m-2">
                <span className="font-medium text-lg text-gray-900">{item.label}</span>
                <span className="text-lg text-gray-700">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Sidebar */}
      <div className="lg:w-2/5 w-full bg-gray-100 p-4 rounded-lg shadow-md lg:ml-4 h-full">
        <h3 className="text-xl font-bold mb-4 text-center lg:text-left">Resumen de Precios</h3>
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-m text-gray-900">Costo del plan:</span>
            <span className="text-xs font-semibold text-black">₡{calculateBaseCost().toLocaleString()} IVAI /mensual</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-m text-gray-900">Costo adicional:</span>
            <span className="text-xs font-semibold text-black">₡{calculateAdditionalCost().toLocaleString()} IVAI</span>
          </div>
          <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold text-lg text-gray-900">Costo total:</span>
          </div>
          <div className="pt-4 flex justify-between items-center">
            <span className="font-extrabold text-2xl text-gray-900">₡{calculateTotalCost().toLocaleString()}</span>
            <span className="font-bold text-xs text-gray-700">IVAI / mensual</span>
          </div>
        </div>
        <button
          type="button"
          className="mt-6 w-full py-3 bg-[#305832] text-white font-semibold rounded-lg hover:bg-white hover:text-[#305832] hover:border hover:border-[#305832] transition-all duration-300"
          onClick={onContinue}  // Llamar a la función onContinue cuando se hace clic
        >
          Continuar con el pago
        </button>
      </div>
    </div>
  );
}
