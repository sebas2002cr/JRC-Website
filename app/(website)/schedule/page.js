import CalendlyWidget from "@/components/ui/calendly";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Agendá una consulta gratuita",
  description:
    "Reservá una reunión de 30 minutos con JRC Consulting Group y conversemos sobre la contabilidad, los impuestos y el cumplimiento de tu empresa en Costa Rica.",
  path: "/schedule"
});

export default function Schedule() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Agendá una Reunión
      </h1>
      <div className="flex justify-center">
        <CalendlyWidget />
      </div>
    </div>
  );
}
