"use client";  

import { useEffect } from "react";

export default function CalendlyWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Limpiar el script cuando el componente se desmonte
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/jrcadmin-jrccr/30min?primary_color=305832"
      style={{ minWidth: "100%", height: "100vh", maxWidth: "100%", boxSizing: "border-box" }}
    ></div>
  );
}
