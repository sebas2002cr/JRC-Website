import ThemeSwitch from "@/components/themeSwitch";

export default function Footer(props) {
  return (
    <div className="w-full bg-[#305832] text-white">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between px-4 py-12 md:flex-row">
        {/* Sección de la izquierda con el logo */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="img/JRCLogofull.png"
            alt="JRC Logo"
            className="mb-4 w-40" // Ajusta el tamaño del logo aquí
          />
          <div className="text-center md:text-left">
            Trejos Montealegre
            <br />
            Escazú, Costa Rica
          </div>
          <div className="mt-4 flex space-x-4">
            <a
              href="https://www.instagram.com/jrc_consulting/"
              target="_blank"
              rel="noopener noreferrer">
              <svg
                width="40px"
                height="40px"
                viewBox="0 -0.5 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#878787">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clipRule="evenodd"
                    d="M15.5 5H9.5C7.29086 5 5.5 6.79086 5.5 9V15C5.5 17.2091 7.29086 19 9.5 19H15.5C17.7091 19 19.5 17.2091 19.5 15V9C19.5 6.79086 17.7091 5 15.5 5Z"
                    stroke="#878787"
                    strokeWidth="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>{" "}
                  <path
                    fill-rule="evenodd"
                    clipRule="evenodd"
                    d="M12.5 15C10.8431 15 9.5 13.6569 9.5 12C9.5 10.3431 10.8431 9 12.5 9C14.1569 9 15.5 10.3431 15.5 12C15.5 12.7956 15.1839 13.5587 14.6213 14.1213C14.0587 14.6839 13.2956 15 12.5 15Z"
                    stroke="#878787"
                    strokeWidth="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>{" "}
                  <rect
                    x="15.5"
                    y="9"
                    width="2"
                    height="2"
                    rx="1"
                    transform="rotate(-90 15.5 9)"
                    fill="#878787"></rect>{" "}
                  <rect
                    x="16"
                    y="8.5"
                    width="1"
                    height="1"
                    rx="0.5"
                    transform="rotate(-90 16 8.5)"
                    stroke="#878787"
                    stroke-linecap="round"></rect>{" "}
                </g>
              </svg>
              <svg className="h-6 w-6 fill-current"></svg>
            </a>
            <a
              href="https://www.facebook.com/jrcconsultingcr/"
              target="_blank"
              rel="noopener noreferrer">
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M22 12C22 5.92487 17.0751 1 11 1C4.92487 1 0 5.92487 0 12C0 17.4036 3.65636 21.731 8.4375 22.8013V14.7305H5.89844V12H8.4375V9.79375C8.4375 7.31269 9.93069 6 12.2695 6C13.25 6 14.2813 6.16875 14.2813 6.16875V8.625H13.0562C11.8471 8.625 11.5625 9.29681 11.5625 10.1062V12H14.1563L13.7344 14.7305H11.5625V22.8013C16.3436 21.731 20 17.4036 20 12H22Z"
                    fill="#878787"></path>
                </g>
              </svg>

              <svg className="h-6 w-6 fill-current"></svg>
            </a>
            <a
              href="https://www.linkedin.com/company/jrcconsultinggroup/mycompany/"
              target="_blank"
              rel="noopener noreferrer">
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z"
                    fill="#878787"></path>{" "}
                  <path
                    d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z"
                    fill="#878787"></path>{" "}
                  <path
                    d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z"
                    fill="#878787"></path>{" "}
                  <path
                    fill-rule="evenodd"
                    clipRule="evenodd"
                    d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z"
                    fill="#878787"></path>{" "}
                </g>
              </svg>
              <svg className="h-6 w-6 fill-current"></svg>
            </a>
          </div>
          <p className="mt-4 max-w-xs text-center text-sm md:text-left">
            Somos una empresa líder en soluciones de consultoría
            contable, legal y tributaria, comprometidos en brindar
            soluciones professionales y personalizadas a nuestros
            clientes.
          </p>
        </div>

        {/* Sección de enlaces */}
        <div className="mt-8 flex flex-col justify-center space-y-4 text-center md:mt-0 md:flex-row md:justify-end md:space-x-8 md:space-y-0">
          <a href="/blog" className="hover:underline">
            Blog
          </a>
          <a href="/partners" className="hover:underline">
            Socios
          </a>
          <a href="/courses" className="hover:underline">
            Cursos
          </a>
          <a href="/pricing" className="hover:underline">
            Precios
          </a>
          <a href="/contact" className="hover:underline">
            Contacto
          </a>
        </div>
      </div>

      {/* Sección de derechos reservados */}
      <div className="mt-4 border-t border-white pt-4 text-center text-xs">
        <div>
          © {new Date().getFullYear()} JRC. All rights reserved.
        </div>
      </div>
    </div>
  );
}
