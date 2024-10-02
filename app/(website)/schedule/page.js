import CalendlyWidget from "@/components/ui/calendly";

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
