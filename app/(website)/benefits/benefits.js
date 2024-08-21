import PostList from "@/components/postlist";
import Pagination from "@/components/blog/pagination";
import { getPaginatedPosts } from "@/lib/sanity/client";

export default async function Benefits({ searchParams }) {
  


  return (
    <div className="">
      {/* Encabezado de la Sección */}
      <section className="py-16 bg-white text-center">
      <p className="mb-4 text-s font-bold text-[#305832] text-center">Beneficios</p>
        <h2 className="text-5xl font-bold text-black mb-4">Más beneficios que ninguna</h2>
        <h2 className="text-5xl font-bold text-black mb-4">otra plataforma</h2>

        <p className="text-gray-600 mb-12">Aprovecha las ventajas que solo nuestros clientes disfrutan.</p>
        
        <div className="bg-green-100 py-8 px-4 rounded-lg max-w-6xl mx-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-8">ASOCIADOS CON EMPRESAS EXCEPCIONALES.</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <img src="/img/grass-fed-logo.png" alt="Grass-Fed" className="w-12 h-12 mr-4"/>
              <div>
                <h4 className="font-semibold text-gray-800">Grass-Fed | Food</h4>
                <a href="#" className="text-blue-500 text-sm">Get reward</a>
              </div>
            </div>

            <div className="flex items-center">
              <img src="/img/onvo-logo.png" alt="Onvo" className="w-12 h-12 mr-4"/>
              <div>
                <h4 className="font-semibold text-gray-800">Onvo | Payments</h4>
                <a href="#" className="text-blue-500 text-sm">Get reward</a>
              </div>
            </div>

            <div className="flex items-center">
              <img src="/img/bulali-logo.png" alt="Búlali" className="w-12 h-12 mr-4"/>
              <div>
                <h4 className="font-semibold text-gray-800">Búlali | Food</h4>
                <a href="#" className="text-blue-500 text-sm">Get reward</a>
              </div>
            </div>

            <div className="flex items-center">
              <img src="/img/hojaldre-logo.png" alt="Hojaldre" className="w-12 h-12 mr-4"/>
              <div>
                <h4 className="font-semibold text-gray-800">Hojaldre | Food</h4>
                <a href="#" className="text-blue-500 text-sm">Get reward</a>
              </div>
            </div>

            <div className="flex items-center">
              <img src="/img/bulali-logo.png" alt="Búlali" className="w-12 h-12 mr-4"/>
              <div>
                <h4 className="font-semibold text-gray-800">Búlali | Banking</h4>
                <a href="#" className="text-blue-500 text-sm">Get reward</a>
              </div>
            </div>

            <div className="flex items-center">
              <img src="/img/nutri-salud-logo.png" alt="Nutri Salud" className="w-12 h-12 mr-4"/>
              <div>
                <h4 className="font-semibold text-gray-800">Nutri Salud | Health</h4>
                <a href="#" className="text-blue-500 text-sm">Get reward</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sección de Llamada a la Acción (CTA) */}
      <section className="w-full bg-gradient-to-r from-gray-200 to-white py-16 flex justify-center">
        <div className="bg-gradient-to-b from-[#94AB98] to-white rounded-lg shadow-lg p-8 max-w-xl text-center">
          <div className="mb-6">
            <img src="/Logo-blanco.svg" alt="JRC Logo" className="mx-auto w-12 h-12"/>
          </div>
          <h3 className="text-3xl font-bold mb-4 text-[#305832]">
            Gratis
          </h3>
          <p className="text-gray-600 mb-8">
            Agendá una llamada con un asesor para resolver todas tus dudas.
          </p>
          
          
          <button className="px-8 py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
            Agenda una llamada
          </button>
        </div>
      </section>
    </div>
  );
}
