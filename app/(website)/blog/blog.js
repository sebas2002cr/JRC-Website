"use client";
import { useState } from "react";
import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function Blog({ posts, categories }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filtrar posts por categoría seleccionada
  const filteredPosts = selectedCategory
    ? posts.filter(post =>
        post.categories.some(category => category.slug.current === selectedCategory)
      )
    : posts;

  return (
    <>
      {posts && (
        <Container>
          {/* Sección de Noticias Relevantes */}
          <section className="text-center mb-12">
            <p className="text-sm font-semibold text-[#305832]">Blog</p>
            <h1 className="text-4xl font-bold text-gray-800">Noticias relevantes</h1>
            <p className="text-gray-600 mt-4 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  !selectedCategory ? "bg-[#305832] text-white" : "border border-[#305832] text-[#305832]"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </button>
              {categories.length > 0 && categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-md ${
                    selectedCategory === category.slug.current
                      ? "bg-[#305832] text-white"
                      : "border border-[#305832] text-[#305832]"
                  }`}
                  onClick={() => setSelectedCategory(category.slug.current)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </section>

          {/* Listado de Posts */}
          <div className="grid gap-10 md:grid-cols-2 lg:gap-10">
            {filteredPosts.slice(0, 2).map((post) => (
              <PostList
                key={post._id}
                post={post}
                aspect="landscape"
                preloadImage={true}
              />
            ))}
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
            {filteredPosts.slice(2, 14).map((post) => (
              <PostList key={post._id} post={post} aspect="square" />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
