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
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer">
              <svg
                width="35px"
                height="35px"
                viewBox="0 -0.5 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#878787">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.5 5H9.5C7.29086 5 5.5 6.79086 5.5 9V15C5.5 17.2091 7.29086 19 9.5 19H15.5C17.7091 19 19.5 17.2091 19.5 15V9C19.5 6.79086 17.7091 5 15.5 5Z"
                    stroke="#878787"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"></path>{" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.5 15C10.8431 15 9.5 13.6569 9.5 12C9.5 10.3431 10.8431 9 12.5 9C14.1569 9 15.5 10.3431 15.5 12C15.5 12.7956 15.1839 13.5587 14.6213 14.1213C14.0587 14.6839 13.2956 15 12.5 15Z"
                    stroke="#878787"
                    stroke-width="1.5"
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
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer">
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M19.83 8.00001C19.83 8.17001 19.83 8.35001 19.83 8.52001C19.8393 10.0302 19.5487 11.5272 18.9751 12.9242C18.4014 14.3212 17.5562 15.5904 16.4883 16.6583C15.4204 17.7262 14.1512 18.5714 12.7542 19.1451C11.3572 19.7187 9.86017 20.0093 8.34999 20C6.15213 20.0064 3.9992 19.3779 2.14999 18.19C2.47999 18.19 2.78999 18.19 3.14999 18.19C4.96345 18.19 6.72433 17.5808 8.14999 16.46C7.30493 16.4524 6.48397 16.1774 5.80489 15.6744C5.12581 15.1714 4.62349 14.4662 4.36999 13.66C4.62464 13.7006 4.88213 13.7207 5.13999 13.72C5.49714 13.7174 5.85281 13.6738 6.19999 13.59C5.2965 13.4056 4.48448 12.9147 3.90135 12.2003C3.31822 11.486 2.99981 10.5921 2.99999 9.67001C3.55908 9.97841 4.18206 10.153 4.81999 10.18C4.25711 9.80767 3.79593 9.30089 3.47815 8.7055C3.16038 8.11011 2.99604 7.44489 2.99999 6.77001C3.00124 6.06749 3.18749 5.37769 3.53999 4.77001C4.55172 6.01766 5.81423 7.03889 7.24575 7.76757C8.67727 8.49625 10.2459 8.91613 11.85 9.00001C11.7865 8.69737 11.753 8.38922 11.75 8.08001C11.7239 7.25689 11.9526 6.44578 12.4047 5.75746C12.8569 5.06913 13.5104 4.53714 14.2762 4.23411C15.0419 3.93109 15.8826 3.87181 16.6833 4.06437C17.484 4.25693 18.2057 4.69195 18.75 5.31001C19.655 5.12822 20.5214 4.78981 21.31 4.31001C21.0088 5.24317 20.3754 6.0332 19.53 6.53001C20.3337 6.44316 21.1194 6.23408 21.86 5.91001C21.3116 6.71097 20.6361 7.41694 19.86 8.00001H19.83Z"
                    fill="#878787"></path>{" "}
                </g>
              </svg>
              <svg className="h-6 w-6 fill-current"></svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer">
              <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
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
                    clip-rule="evenodd"
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
            Partners
          </a>
          <a href="/benefits" className="hover:underline">
            Beneficios
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
        <div className="mt-2">
          <a href="#" className="hover:underline">
            Terms
          </a>{" "}
          |{" "}
          <a href="#" className="hover:underline">
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
}
