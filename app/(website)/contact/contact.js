"use client";

import Container from "@/components/container";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Contact({ settings }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm({
    mode: "onTouched"
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await fetch('../api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setMessage('Mensaje enviado exitosamente.');
        reset();
      } else {
        setIsSuccess(false);
        setMessage('Algo salió mal. Intenta de nuevo.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error al enviar el mensaje. Por favor, intenta de nuevo.');
    }
  };

  return (    
    <div className="">
      <div className="flex flex-col md:flex-row">
        {/* Sección de la imagen */}
        <div className="w-full md:w-1/2">
          <img
            src="img/socios-jrc.jpeg"
            alt="Contact Image"
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Sección del formulario */}
        <div className="w-full md:w-1/2 p-8 bg-white flex items-center justify-center">
          <Container>
          <p className="mb-4 text-s font-bold text-[#305832] text-center">Contacto</p>
          <h2 className="text-4xl font-bold mb-4 text-gray-700 text-center">Nos encantaría saber de vos</h2>
          <p className="mb-8 text-gray-600 text-center">Estaremos más que felices en atender tus consultas.</p>
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
  
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre"
                      className={`w-full px-4 py-3 border rounded-lg ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                      {...register("nombre", { required: "Este campo es requerido" })}
                    />
                    {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre.message}</span>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Apellido"
                      className={`w-full px-4 py-3 border rounded-lg ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                      {...register("apellido", { required: "Este campo es requerido" })}
                    />
                    {errors.apellido && <span className="text-red-500 text-sm">{errors.apellido.message}</span>}
                  </div>
                </div>
  
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className={`w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    {...register("email", { required: "Este campo es requerido", pattern: { value: /^\S+@\S+$/i, message: "Correo electrónico no válido" } })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Teléfono"
                      className={`w-full px-4 py-3 border rounded-lg ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                      {...register("telefono", { required: "Este campo es requerido" })}
                    />
                    {errors.telefono && <span className="text-red-500 text-sm">{errors.telefono.message}</span>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Empresa / Nombre Comercial"
                      className={`w-full px-4 py-3 border rounded-lg ${errors.empresa ? 'border-red-500' : 'border-gray-300'}`}
                      {...register("empresa")}
                    />
                  </div>
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <select
                      className="w-full px-4 py-3 border rounded-lg border-gray-300"
                      {...register("tipoPersona", { required: "Este campo es requerido" })}
                    >
                      <option value="">Tipo de persona</option>
                      <option value="personaFisica">Persona Física</option>
                      <option value="personaJuridica">Persona Jurídica</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Puesto"
                      className={`w-full px-4 py-3 border rounded-lg ${errors.puesto ? 'border-red-500' : 'border-gray-300'}`}
                      {...register("puesto")}
                    />
                  </div>
                </div>
  
                <div className="mb-4">
                  <select
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    {...register("tema", { required: "Este campo es requerido" })}
                  >
                    <option value="">Tema</option>
                    <option value="consultoria">Consultoría</option>
                    <option value="soporte">Soporte</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
  
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Método preferido de contacto</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("contactoTelefono")}
                      />
                      <span>Llamada Telefónica</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("contactoEmail")}
                      />
                      <span>Correo Electrónico</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("contactoWhatsApp")}
                      />
                      <span>WhatsApp</span>
                    </label>
                  </div>
                </div>
  
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Archivos adicionales</label>
                  <input
                    type="file"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    {...register("archivos")}
                  />
                </div>
  
                <div className="mb-4">
                  <textarea
                    placeholder="Detalles adicionales"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    {...register("detalles")}
                  ></textarea>
                </div>
  
                <button type="submit" className="w-full py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </form>
  
              {isSubmitSuccessful && isSuccess && (
                <div className="mt-3 text-green-500 text-center">Mensaje enviado exitosamente.</div>
              )}
              {isSubmitSuccessful && !isSuccess && (
                <div className="mt-3 text-red-500 text-center">Algo salió mal. Intenta de nuevo.</div>
              )}
            </div>
          </Container>
        </div>
      </div>
  
      <div className="bg-[#305832] text-white py-16">
        <Container>
          <h2 className="text-4xl font-semibold text-center mb-12">Estamos a su disposición</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            <div className="text-center flex flex-col items-center">
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="#878787"></path>
                </g>
              </svg>
              <h3 className="text-xl font-semibold">Correo</h3>
              <p>info@jrc.cr</p>
            </div>
            <div className="text-center flex flex-col items-center border-l border-r border-gray-300">
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.5345 20.9007 20.364C21 20.1582 21 19.9181 21 19.438V16.6207C21 16.2169 21 16.015 20.9335 15.842C20.8749 15.6891 20.7795 15.553 20.6559 15.4456C20.516 15.324 20.3262 15.255 19.9468 15.117L16.74 13.9509C16.2985 13.7904 16.0777 13.7101 15.8683 13.7237C15.6836 13.7357 15.5059 13.7988 15.3549 13.9058C15.1837 14.0271 15.0629 14.2285 14.8212 14.6314L14 16C11.3501 14.7999 9.2019 12.6489 8 10L9.36863 9.17882C9.77145 8.93713 9.97286 8.81628 10.0942 8.64506C10.2012 8.49408 10.2643 8.31637 10.2763 8.1317C10.2899 7.92227 10.2096 7.70153 10.0491 7.26005L8.88299 4.05321C8.745 3.67376 8.67601 3.48403 8.55442 3.3441C8.44701 3.22049 8.31089 3.12515 8.15802 3.06645C7.98496 3 7.78308 3 7.37932 3H4.56201C4.08188 3 3.84181 3 3.63598 3.09925C3.4655 3.18146 3.29814 3.33701 3.2037 3.50103C3.08968 3.69907 3.07375 3.91662 3.04189 4.35173C3.01413 4.73086 3 5.11378 3 5.5Z" stroke="#878787" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </g>
              </svg>
              <h3 className="text-xl font-semibold">Número de Teléfono</h3>
              <p>+506-6055-6705</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M9 11L11 13L15 9M19 10.2C19 14.1764 15.5 17.4 12 21C8.5 17.4 5 14.1764 5 10.2C5 6.22355 8.13401 3 12 3C15.866 3 19 6.22355 19 10.2Z" stroke="#878787" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </g>
              </svg>
              <h3 className="text-xl font-semibold">Oficina</h3>
              <p>Trejos Montealegre<br />Escazú, Costa Rica</p>
            </div>
          </div>
        </Container>
      </div>
  
      {/* Espacio entre secciones */}
      <div className="my-8"></div>

      {/* Aquí se agrega la sección del mapa de Google */}
      <div className="my-8">
        <Container>
          <h2 className="text-4xl font-semibold text-center mb-12">Encuéntranos en Google Maps</h2>
          <div className="w-full h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.973872511824!2d-84.1333128!3d9.9361318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0ffeb90f16f79%3A0xa7016ab0c1f5c947!2sJRC%20Consulting%20Group!5e0!3m2!1sen!2scr!4v1724260324783!5m2!1sen!2scr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Container>
      </div>
  
      {/* Sección de Llamada a la Acción (CTA) */}
      <section className="w-full bg-gradient-to-r from-gray-200 to-white py-16 flex justify-center">
        <div className="bg-gradient-to-b from-[#94AB98] to-white rounded-lg shadow-lg p-8 max-w-xl text-center">
          <div className="mb-6">
            <img src="/Logo-blanco.svg" alt="JRC Logo" className="mx-auto w-12 h-12"/>
          </div>
          <h3 className="text-2xl font-semibold mb-4">
                Comenzá con nostros
              </h3>
              <p className="text-gray-600 mb-8">
                Agenda una llamada gratuita con uno de nuestros asesores para resolver todas tus dudas.
              </p>
          <button className="px-8 py-3 bg-[#305832] text-white rounded-lg shadow-md hover:bg-[#234621]">
            Comenzar
          </button>
        </div>
      </section>
    </div>
  );
}
