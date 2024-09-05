import { getSettings } from "@/lib/sanity/client";
import Partners from "./partners";

export default async function PartnersPage() {
  const settings = await getSettings();
  return <Partners settings={settings} />;
}

// export const revalidate = 60;
