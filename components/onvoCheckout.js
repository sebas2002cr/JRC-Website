import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OnvoCheckout({ amount, description }) {
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar el SDK de ONVO Pay cuando el componente se monta
    const script = document.createElement('script');
    script.src = 'https://sdk.onvopay.com/sdk.js';
    script.async = true;

    script.onload = () => {
      console.log('ONVO Pay SDK loaded');
      createPaymentIntent(); // Crear el payment intent una vez que el SDK esté cargado
    };

    script.onerror = () => {
      console.error('Error loading ONVO Pay SDK');
      setError('Error loading payment SDK');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount, description]);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post('http://localhost:4200/create-payment-intent', {
        amount,
        currency: 'USD', // o CRC
        description,
      });

      setPaymentIntentId(response.data.paymentIntentId);
    } catch (error) {
      console.error('Error creando el payment intent:', error);
      setError('Error creando el payment intent');
    }
  };

  const handlePayment = () => {
    if (!paymentIntentId) {
      return;
    }

    window.onvo.pay({
      onError: (data) => {
        console.log('error', data);
        setError('Error en el pago');
      },
      onSuccess: (data) => {
        console.log('success', data);
        // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
      },
      publicKey: process.env.NEXT_PUBLIC_ONVO_PAY_PUBLIC_KEY, // Usa tu clave pública
      paymentIntentId: paymentIntentId,
      paymentType: 'one_time',
      customerId: '', // Opcional
    }).render('#onvo-container');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Resumen del Pedido</h3>
      <p>Costo total: ${(amount / 100).toFixed(2)} USD</p>
      <p>{description}</p>

      <div id="onvo-container" className="mt-6"></div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <button
        onClick={handlePayment}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all mt-4"
        disabled={!paymentIntentId}
      >
        Continuar con el pago
      </button>
    </div>
  );
}
