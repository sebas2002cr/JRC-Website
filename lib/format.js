/**
 * Formatea un monto en colones.
 *
 * El locale va SIEMPRE explicito. Con `toLocaleString()` a secas, cada entorno
 * usa el suyo: el servidor formatea 397000 como "397,000" y el navegador del
 * visitante como "397 000". Al no coincidir, React aborta la hidratacion con el
 * error #425 ("Text content does not match server-rendered HTML") y arrastra
 * los #418 y #423.
 *
 * es-CR separa los miles con espacio; en Costa Rica se escribe con punto, asi
 * que se sustituye. Es el mismo criterio que ya se usaba en /pricing.
 */
export function formatColones(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("es-CR").replace(/\s/g, ".");
}
