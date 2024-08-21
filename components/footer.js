import ThemeSwitch from "@/components/themeSwitch";
import Image from "next/image";
import VercelLogo from "../public/img/vercel.svg";

export default function Footer(props) {
  return (
    <div className="w-full bg-[#305832] text-white">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm py-6 max-w-screen-xl mx-auto px-4">
        <div className="text-center md:text-left">
          <div className="text-lg font-bold">JRC Consulting Group</div>
          <div className="mt-2">Trejos Montealegre<br/>Escazú, Costa Rica</div>
          <div className="mt-2 flex justify-center md:justify-start space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5 fill-current" /* Aquí iría el ícono de Instagram */></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5 fill-current" /* Aquí iría el ícono de Twitter */></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <svg className="w-5 h-5 fill-current" /* Aquí iría el ícono de LinkedIn */></svg>
            </a>
          </div>
          <div className="mt-4 text-sm max-w-xs text-center md:text-left">
          Especialistas en impuestos y contabilidad para PYMES. Gestionamos tus declaraciones y resolvemos tus necesidades contables. ¡Ahorrá con nosotros!
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 flex justify-center md:justify-end space-x-8">
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Partners</a>
          <a href="#" className="hover:underline">Beneficios</a>
          <a href="#" className="hover:underline">Precios</a>
          <a href="#" className="hover:underline">Contacto</a>
        </div>
      </div>
      <div className="border-t border-white mt-4 pt-4 text-center text-xs">
        <div>© {new Date().getFullYear()} JRC. All rights reserved.</div>
        <div className="mt-2">
          <a href="#" className="hover:underline">Terms</a> | <a href="#" className="hover:underline">Privacy</a>
        </div>
      </div>
    </div>
  );
}
