import { pageMetadata } from "@/lib/seo";
import PricingPage from "./pricing-client";

export const metadata = pageMetadata({
  title: "Planes y precios",
  description:
    "Planes de contabilidad y cumplimiento tributario para empresas en Costa Rica. Compará los planes Starter, Professional y Full Compliance de JRC Consulting Group.",
  path: "/pricing"
});

export default function Page() {
  return <PricingPage />;
}
