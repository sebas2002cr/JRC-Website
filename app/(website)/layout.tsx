"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { usePathname } from 'next/navigation';
import { getSettings } from "@/lib/sanity/client";

export default function Layout({ children, params }) {
  const [settings, setSettings] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsData = await getSettings();
      setSettings(settingsData);
    };
    
    fetchSettings();
  }, []);

  // Define las rutas donde no quieres mostrar el Footer
  const noFooterRoutes = ['/starter', '/profesional'];
  // Define las rutas donde no quieres mostrar el Footer
  const noNavbarRoutes = ['/starter', '/profesional'];

  if (!settings) return null; // O muestra un loader

  return (
    <>
    <title>JRC Consulting Group</title>
      {!noNavbarRoutes.includes(pathname) &&<Navbar/>}
      
      <div>{children}</div>

      {!noFooterRoutes.includes(pathname) && <Footer />}
    </>
  );
}
