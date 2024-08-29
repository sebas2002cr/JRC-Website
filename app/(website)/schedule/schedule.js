import CalendlyWidget from "@/components/ui/calendly";

export default function Schedule() {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Agendá una Reunión</h1>
        <div className="flex justify-center">
          <CalendlyWidget />
        </div>
      </div>
    );
  }