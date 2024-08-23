import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import Pricing from "./pricing";

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();
  return <Pricing settings={settings} authors={authors} />;
}

// export const revalidate = 60;
