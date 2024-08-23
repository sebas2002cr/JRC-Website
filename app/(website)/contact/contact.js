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
  
      {/* Resto del contenido... */}
  
    </div>
  );
}
