#!/usr/bin/env bash
#
# Chequeo rapido de SEO sobre el HTML que realmente sirve el servidor,
# que es lo que ve Google. Sirve para comparar produccion antes y despues
# de un deploy.
#
#   bash scripts/seo-check.sh https://jrc.cr
#   bash scripts/seo-check.sh http://localhost:3000
#
# Cada linea muestra un dato y, entre parentesis, lo que se espera.

BASE="${1:-http://localhost:3000}"
RUTAS=("" "pricing" "contact" "courses" "partners" "schedule" "blog")

cuenta() { grep -o "$2" <<<"$1" | wc -l | tr -d ' '; }
extrae() { sed -n "s/.*$2.*/\1/p" <<<"$1" | head -1; }

echo "============================================================"
echo " Chequeo SEO: $BASE"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================================"
echo ""
printf "%-14s %5s %4s %4s %4s %5s %6s %8s\n" \
  RUTA HTTP H1 LINKS DESC CANON JSONLD BYTES
echo "------------------------------------------------------------"

for r in "${RUTAS[@]}"; do
  url="$BASE/$r"
  html=$(curl -s --max-time 20 "$url")
  http=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url")

  printf "/%-13s %5s %4s %4s %4s %5s %6s %8s\n" \
    "$r" "$http" \
    "$(cuenta "$html" '<h1')" \
    "$(cuenta "$html" '<a ')" \
    "$(cuenta "$html" 'name="description"')" \
    "$(cuenta "$html" 'rel="canonical"')" \
    "$(cuenta "$html" '<script type="application/ld.json">')" \
    "$(wc -c <<<"$html" | tr -d ' ')"
done

echo ""
echo "Esperado: HTTP 200 | H1 = 1 | LINKS > 0 | DESC = 1 | CANON = 1"
echo "          JSONLD = 1 (2 en /pricing, que lleva ademas el catalogo)"
echo ""
echo "OJO con la ultima seccion: en un sitio que sirve HTML vacio, los"
echo "textos dan 0 porque no hay contenido, no porque esten corregidos."
echo "Solo son concluyentes si la columna H1 y LINKS ya dan valores > 0."
echo ""

home=$(curl -s --max-time 20 "$BASE")

echo "--- Home: etiquetas clave ---"
echo "lang:        $(grep -o '<html[^>]*lang="[^"]*"' <<<"$home" | grep -o 'lang="[^"]*"' | head -1)"
echo "title:       $(sed -n 's/.*<title>\(.*\)<\/title>.*/\1/p' <<<"$home" | head -1)"
echo "description: $(grep -o 'name="description" content="[^"]*"' <<<"$home" | sed 's/.*content="//;s/"$//' | cut -c1-70)"
echo "og:image:    $(grep -o 'property="og:image" content="[^"]*"' <<<"$home" | sed 's/.*content="//;s/"$//' | head -1)"
echo "og:title:    $(grep -o 'property="og:title" content="[^"]*"' <<<"$home" | sed 's/.*content="//;s/"$//' | cut -c1-70)"
echo "favicon:     $(grep -o 'rel="icon" href="[^"]*"' <<<"$home" | sed 's/.*href="//;s/"$//' | head -1)"
echo "JSON-LD:     $(grep -o '"@type":"[^"]*"' <<<"$home" | head -3 | tr '\n' ' ')"
echo ""

echo "--- robots.txt ---"
curl -s --max-time 20 "$BASE/robots.txt" | grep -iE 'host|sitemap|disallow' | sed 's/^/  /'
echo ""

echo "--- sitemap: dominio de las URLs ---"
curl -s --max-time 20 "$BASE/sitemap-0.xml" \
  | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g' \
  | sed -E 's#(https?://[^/]+).*#\1#' | sort | uniq -c | sed 's/^/  /'
echo ""

echo "--- Textos que debian corregirse (todo debe dar 0) ---"
for par in "nostros:home" "Elige un plan:pricing" "Descubre tu potencial:courses" \
           "Encuéntranos:contact" "su disposición:contact" "Recomienda y:partners" \
           "Colaboradores:home" "lessons:courses"; do
  texto="${par%%:*}"; donde="${par##*:}"
  ruta=""; [ "$donde" != "home" ] && ruta="$donde"
  n=$(curl -s --max-time 20 "$BASE/$ruta" | grep -o "$texto" | wc -l | tr -d ' ')
  printf "  %-22s en /%-9s %s\n" "$texto" "$ruta" "$n"
done
