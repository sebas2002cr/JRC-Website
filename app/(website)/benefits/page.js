import { Suspense } from "react";
import Container from "@/components/container";
import Benefits from "./benefits";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

export const runtime = "edge";



export default async function ArchivePage() {

  return <Benefits />;
}

// export const revalidate = 60;
