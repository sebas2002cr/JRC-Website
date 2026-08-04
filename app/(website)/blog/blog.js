import Container from "@/components/container";
import PostList from "@/components/postlist";
import Filtros from "./filtros";
import Paginacion from "./paginacion";

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
            <div className="mb-10 grid gap-10 md:grid-cols-2 lg:gap-10">
              {destacados.map(post => (
                <PostList key={post._id} post={post} aspect="landscape" preloadImage={true} />
              ))}
            </div>
          )}

          <div className="grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
            {resto.map(post => (
              <PostList key={post._id} post={post} aspect="square" />
            ))}
          </div>

          <Paginacion pagina={pagina} paginas={paginas} total={total} />
        </>
      )}
    </Container>
  );
}
