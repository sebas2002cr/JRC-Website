"use client";

import { Fragment, useState, useEffect, useCallback } from "react";
import { Disclosure } from "@headlessui/react";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { motion } from "framer-motion";

export default function Navbar(props) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
  
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
  
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  const leftmenu = [
    { label: "Blog", href: "/blog" },
    { label: "Precios", href: "/pricing" },
    { label: "Contacto", href: "/contact" }
  ];

  const rightmenu = [
    { label: "Cursos", href: "/courses" },
    { label: "Socios", href: "/partners" },
    { label: "Empezar", href: "/pricing" }
  ];

  const mobilemenu = [...leftmenu, ...rightmenu];

  return (
    <>
      {/* Espacio superior para que el contenido no se superponga al navbar */}
      <div style={{ height: "180px" }}></div>

      {/* Navbar que incluye la franja negra */}
      <div
        className={`fixed top-0 z-50 w-full transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"} ${isScrolled ? "shadow-lg" : ""}`}>
        {/* Franja negra */}
        <div className="bg-black px-4 py-2 text-center text-sm text-white">
          <div className="flex items-center justify-center bg-black py-2 text-center text-sm text-white">
            <span>
              📞 ¿Tenés preguntas? &nbsp;
              <a className="underline" href="/schedule">
                Programá hoy mismo una consulta gratuita
              </a>
            </span>
          </div>
        </div>

        {/* Navbar principal */}
        <div className="border-t bg-white">
          <Container>
            <nav>
              <Disclosure>
                {({ open, close }) => (
                  <>
                    <div className="flex flex-wrap justify-between md:flex-nowrap md:gap-10">
                      <div className="order-1 hidden w-full flex-col items-center justify-start md:order-none md:flex md:w-auto md:flex-1 md:flex-row md:justify-end md:gap-5">
                        {leftmenu.map((item, index) => (
                          <Fragment key={`${item.label}${index}`}>
                            <Link
                              href={item.href}
                              key={`${item.label}${index}`}
                              className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-[#305832] dark:text-gray-400"
                              onClick={() => close()}>
                              {item.label}
                            </Link>
                          </Fragment>
                        ))}
                      </div>

                      <div className="flex w-full items-center justify-between md:w-auto">
                        <Link href="/" className="w-16 dark:hidden">
                          <Image
                            src="/Logo-blanco.svg"
                            alt="Nuevo Logo"
                            width={112}
                            height={28}
                            priority={true}
                            sizes="(max-width: 640px) 100vw, 200px"
                          />
                        </Link>
                        <Link
                          href="/"
                          className="hidden w-28 dark:block">
                          {props.logoalt ? (
                            <Image
                              {...urlForImage(props.logoalt)}
                              alt="Logo"
                              priority={true}
                              sizes="(max-width: 640px) 100vw, 200px"
                            />
                          ) : (
                            <span className="block text-center">
                              JRC
                            </span>
                          )}
                        </Link>
                        <Disclosure.Button
                          aria-label="Toggle Menu"
                          className="ml-auto transform rounded-md px-2 py-1 text-gray-500 transition duration-300 hover:scale-110 hover:bg-gray-100 focus:text-[#305832] focus:outline-none dark:text-gray-300 md:hidden">
                          <svg
                            className="h-6 w-6 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            {open ? (
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                              />
                            ) : (
                              <path
                                fillRule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2z"
                              />
                            )}
                          </svg>
                        </Disclosure.Button>
                      </div>

                      <div className="order-2 hidden w-full flex-col items-center justify-start md:order-none md:flex md:w-auto md:flex-1 md:flex-row md:gap-5">
                        {rightmenu.map((item, index) => (
                          <Fragment key={`${item.label}${index}`}>
                            <Link
                              href={item.href}
                              key={`${item.label}${index}`}
                              className={`px-4 py-2 ${
                                item.label === "Empezar"
                                  ? "rounded-lg bg-[#305832] text-white shadow-md transition duration-300 hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832]"
                                  : "text-sm font-medium text-gray-600 hover:text-[#305832] dark:text-gray-400"
                              }`}
                              onClick={() => close()}>
                              {item.label}
                            </Link>
                          </Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Menú móvil */}
                    <Disclosure.Panel className="md:hidden">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 2, y: 0 }}
                        exit={{ opacity: 2, y: -20 }}
                        transition={{ duration: 1.0 }}
                        className="mt-2 w-full flex-col space-y-2 rounded-lg bg-white p-4 shadow-lg">
                        {mobilemenu.map((item, index) => (
                          <Link
                            href={item.href}
                            key={`${item.label}${index}`}
                            className="block w-full rounded-lg border border-[#305832] px-4 py-2 text-sm font-medium text-[#305832] hover:bg-[#305832] hover:text-white"
                            onClick={() => close()} // Aquí cerramos el menú al hacer clic en un enlace
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </nav>
          </Container>
        </div>
      </div>
    </>
  );
}
