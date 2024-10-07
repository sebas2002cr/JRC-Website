"use client";

import { Fragment } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import cx from "clsx";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function Navbar(props) {
  const leftmenu = [
    {
      label: "Blog",
      href: "/blog"
    },
    {
      label: "Precios",
      href: "/pricing"
    },
    {
      label: "Contacto",
      href: "/contact"
    }
  ];

  const rightmenu = [
    {
      label: "Cursos",
      href: "/courses"
    },
    {
      label: "Partners",
      href: "/partners"
    },
    {
      label: "Empezar",
      href: "/pricing"
    }
  ];

  const mobilemenu = [...leftmenu, ...rightmenu];

  return (
    <>
      {/* Franja negra superior */}
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
      <div className="border ">
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
                            onClick={() => close()} // Cierra el menú al hacer clic
                          >
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
                            onClick={() => close()} // Cierra el menú al hacer clic
                          >
                            {item.label}
                          </Link>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  {/* Menú móvil */}
                  <Disclosure.Panel>
                    {({ close }) => (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1.0 }}
                        className="mt-2 flex w-full flex-col gap-3 rounded-md bg-white p-4 shadow-md md:hidden">
                        {mobilemenu.map((item, index) => (
                          <Link
                            href={item.href}
                            key={`${item.label}${index}`}
                            className="w-full rounded border border-[#305832] px-5 py-2 text-sm font-medium text-[#305832] hover:text-gray-200"
                            onClick={() => close()} // Cierra el menú al hacer clic
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </nav>
        </Container>
      </div>
    </>
  );
}

const DropdownMenu = ({ menu, items, mobile }) => {
  return (
    <Menu
      as="div"
      className={cx("relative text-left", mobile && "w-full")}>
      {({ open }) => (
        <>
          <Menu.Button
            className={cx(
              "flex items-center gap-x-1 rounded-md px-5 py-2 text-sm font-medium outline-none transition-all focus:outline-none focus-visible:text-indigo-500 focus-visible:ring-1 dark:focus-visible:bg-gray-800",
              open
                ? "text-[#305832] hover:text-[#305832]"
                : " text-gray-600 dark:text-gray-400 ",
              mobile ? "w-full px-4 py-2 " : "inline-block px-4 py-2"
            )}>
            <span>{menu.label}</span>
            <ChevronDownIcon className="mt-0.5 h-4 w-4" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="lg:transition lg:ease-out lg:duration-100"
            enterFrom="lg:transform lg:opacity-0 lg:scale-95"
            enterTo="lg:transform lg:opacity-100 lg:scale-100"
            leave="lg:transition lg:ease-in lg:duration-75"
            leaveFrom="lg:transform lg:opacity-100 lg:scale-100"
            leaveTo="lg:transform lg:opacity-0 lg:scale-95">
            <Menu.Items
              className={cx(
                "z-20 origin-top-left rounded-md focus:outline-none lg:absolute lg:left-0 lg:w-56",
                !mobile && "bg-white shadow-lg dark:bg-gray-800"
              )}>
              <div className={cx(!mobile && "py-3")}>
                {items.map((item, index) => (
                  <Menu.Item as="div" key={`${item.title}${index}`}>
                    {({ active }) => (
                      <Link
                        href={item?.path ? item.path : "#"}
                        className={cx(
                          "flex items-center space-x-2 px-5 py-2 text-sm lg:space-x-4",
                          active
                            ? "text-[#305832]"
                            : "text-gray-700 hover:text-[#305832] focus:text-[#305832] dark:text-gray-300"
                        )}>
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
