"use client";
import { useState } from "react";
import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog({ posts, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filtrar posts por categoría seleccionada
  const filteredPosts = selectedCategory
    ? posts.filter(
        post =>
          post.categories &&
          Array.isArray(post.categories) &&
          post.categories.some(
            category => category.slug.current === selectedCategory
          )
      )
    : posts;

  return (
    <>
      {posts && (
        <Container>
          {/* Sección de Noticias Relevantes */}
          <section className="mb-12 text-center">
            <p className="text-sm font-semibold text-[#305832]">
              Blog
            </p>
            <h1 className="text-4xl font-bold text-gray-800">
              Noticias relevantes
            </h1>
            <p className="mb-8 mt-4 text-gray-600">
              Mantente al día con las ultimas noticias y
              actualizaciones del sector.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                className={`rounded-md px-4 py-2 ${
                  !selectedCategory
                    ? "bg-[#305832] text-white"
                    : "border border-[#305832] text-[#305832]"
                }`}
                onClick={() => setSelectedCategory(null)}>
                Todos
              </button>
              {categories.length > 0 &&
                categories.map((category, index) => (
                  <button
                    key={index}
                    className={`rounded-md px-4 py-2 ${
                      selectedCategory === category.slug.current
                        ? "bg-[#305832] text-white"
                        : "border border-[#305832] text-[#305832]"
                    }`}
                    onClick={() =>
                      setSelectedCategory(category.slug.current)
                    }>
                    {category.title}
                  </button>
                ))}
            </div>
          </section>

          {/* Mostrar mensaje si no hay posts en la categoría seleccionada */}
          {filteredPosts.length === 0 ? (
            <div className="mt-10 text-center text-gray-600">
              <p>No hay noticias en esta categoría por el momento.</p>
              <p>¡Vuelve pronto para más actualizaciones!</p>
            </div>
          ) : (
            <>
              {/* Listado de Posts */}
              <AnimatePresence>
                <motion.div
                  key={selectedCategory} // clave única para cada categoría
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="grid gap-10 md:grid-cols-2 lg:gap-10">
                  {filteredPosts.slice(0, 2).map(post => (
                    <PostList
                      key={post._id}
                      post={post}
                      aspect="landscape"
                      preloadImage={true}
                    />
                  ))}
                </motion.div>

                <motion.div
                  key={selectedCategory + "-grid"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
                  {filteredPosts.slice(2, 14).map(post => (
                    <PostList
                      key={post._id}
                      post={post}
                      aspect="square"
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </Container>
      )}
    </>
  );
}
