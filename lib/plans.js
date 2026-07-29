/**
 * Planes de contabilidad mensual.
 *
 * Vive aparte del componente de /pricing para que la pagina y los datos
 * estructurados (JSON-LD) usen exactamente la misma fuente y no se
 * desincronicen los precios.
 */

export const services = [
  "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
  "Asignación de ejecutivo de cuenta",
  "Asesoría tributaria y fiscal por parte del ejecutivo",
  "Acompañamiento mensual en el pago de impuestos",
  "Proyecciones trimestrales de Renta",
  "Elaboración de Estados Financieros en formato QuickBooks Online",
  "Elaboración y presentación de planilla CCSS e INS – Máximo 5 colaboradores"
];

export const plans = [
  {
    name: "Starter",
    description: "La etapa inicial para pequeñas empresas.",
    price: "¢45.000",
    // Valor numerico para el JSON-LD; debe coincidir con `price`.
    priceAmount: 45000,
    cta: "Escoger Plan",
    popular: false,
    url: "/plans/starter",
    features: [
      "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
      "Asignación de ejecutivo de cuenta",
      "Asesoría tributaria y fiscal por parte del ejecutivo",
      "Acompañamiento mensual en el pago de impuestos",
      "Proyecciones trimestrales de Renta"
    ]
  },
  {
    name: "Professional",
    description: "El apoyo que necesitas a medida que tu empresa crece.",
    price: "¢99.500",
    priceAmount: 99500,
    cta: "Escoger Plan",
    popular: true,
    url: "/plans/professional",
    features: [
      "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
      "Asignación de ejecutivo de cuenta",
      "Asesoría tributaria y fiscal por parte del ejecutivo",
      "Acompañamiento mensual en el pago de impuestos",
      "Proyecciones trimestrales de Renta",
      "Elaboración de Estados Financieros en formato QuickBooks Online"
    ]
  },
  {
    name: "Full Compliance",
    description: "Soporte completo en contabilidad y planilla.",
    price: "¢130.000",
    priceAmount: 130000,
    cta: "Escoger Plan",
    popular: false,
    url: "/plans/full-compliance",
    features: [
      "Declaraciones mensuales D-104 (IVA) & D-101 (Renta anual)",
      "Asignación de ejecutivo de cuenta",
      "Asesoría tributaria y fiscal por parte del ejecutivo",
      "Acompañamiento mensual en el pago de impuestos",
      "Proyecciones trimestrales de Renta",
      "Elaboración de Estados Financieros en formato QuickBooks Online",
      "Elaboración y presentación de planilla CCSS e INS – Máximo 5 colaboradores"
    ]
  }
];
