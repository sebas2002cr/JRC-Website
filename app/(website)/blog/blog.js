import Container from "@/components/container";
import PostList from "@/components/postlist";
import Filtros from "./filtros";
import Paginacion from "./paginacion";
import Newsletter from "@/components/blog/newsletter";

export default function Blog({
  posts,
  total,
  paginas,
  pagina,
  totalDelAnio,
  categorias,
  categoriaActiva,
  anios,
  anioActivo
}) {
  // Los dos destacados grandes solo tienen sentido en la portada del blog:
  // en la pagina 4, o filtrando por categoria, no hay nada que "destacar".
  const hayDestacados = pagina === 1 && !categoriaActiva && !anioActivo;
  const destacados = hayDestacados ? posts.slice(0, 2) : [];
  const resto = hayDestacados ? posts.slice(2) : posts;

  return (
    <Container>
      <section className="mb-10 text-center">
        <p className="text-sm font-semibold text-[#305832]">Blog</p>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Noticias relevantes
        </h1>
        <p className="mb-8 mt-4 text-gray-600 dark:text-gray-400">
          Mantente al día con las últimas noticias y actualizaciones del sector.
        </p>

      </section>

      <Filtros
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        anios={anios}
        anioActivo={anioActivo}
        totalDelAnio={totalDelAnio}
      />

      {posts.length === 0 ? (
        <div className="py-16 text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg font-medium">No hay noticias con esos filtros.</p>
          <p className="mt-2">Probá con otra categoría u otro periodo.</p>
        </div>
      ) : (
        <>
          {destacados.length > 0 && (
            <div className="mb-8 grid gap-8 md:mb-10 md:grid-cols-2 md:gap-10">
              {destacados.map(post => (
                <PostList key={post._id} post={post} aspect="landscape" preloadImage={true} />
              ))}
            </div>
          )}

          {/* Tres cortes, no dos. Antes se pasaba de una columna a dos recien
              en md (768) y a tres en xl (1280), asi que entre 1024 y 1280 —una
              laptop comun— quedaban dos columnas de ~480px con la foto
              cuadrada: tarjetas enormes, dos por pantalla. Ahora el salto a
              tres ocurre en lg. */}
          <div className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {resto.map(post => (
              <PostList key={post._id} post={post} aspect="custom" />
            ))}
          </div>

          <Paginacion pagina={pagina} paginas={paginas} total={total} />
        </>
      )}

      {/* Va solo en el listado y no en las notas: en la nota ya flota el
          boton de volver, y dos botones flotantes se estorban en movil. */}
      <Newsletter />
    </Container>
  );
}
