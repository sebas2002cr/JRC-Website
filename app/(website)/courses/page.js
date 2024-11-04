"use client";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/lib/sanity/client";
import Image from "next/image";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getAllCourses();
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-gray-50 p-6 sm:p-8">
      <section className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-[#305832] sm:text-4xl">
          Cursos
        </h2>
        <p className="text-base text-gray-600 sm:text-lg">
          Descubre tu potencial en finanzas y contabilidad con
          nuestros cursos.
        </p>
      </section>

      <div className="mx-auto max-w-7xl space-y-8">
        {courses.map(course => (
          <div
            key={course._id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md md:flex-row md:items-stretch">
            {/* Imagen del curso */}
            {course.mainImage?.asset?.url && (
              <div className="relative h-56 w-full md:h-auto md:w-1/3">
                <Image
                  src={course.mainImage.asset.url}
                  alt={course.mainImage.alt || "Course image"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg md:rounded-none md:rounded-l-lg"
                />
              </div>
            )}

            <div className="flex flex-col justify-between p-6 md:w-2/3">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#305832] sm:text-2xl">
                  {course.title}
                </h3>
                <p className="mb-4 text-sm text-gray-700 sm:text-base">
                  {course.description}
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 sm:text-base">
                <span className="text-lg font-extrabold sm:text-xl">
                  ₡{course.price.toLocaleString()}
                </span>
                <span className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#305832] sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                  </svg>
                  <span>{course.lessons} lessons</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#305832] sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M12 7a5 5 0 110 10 5 5 0 010-10zM3.74 3.74a7.998 7.998 0 0110.51-.1A8 8 0 003.74 3.74zm16.53 4.82a8.017 8.017 0 01-11.05 11.05A8 8 0 0020.27 8.56z" />
                  </svg>
                  <span>{course.duration} hrs</span>
                </span>
              </div>
              <a
                href={course.url}
                className=" mt-4 inline-flex w-fit  items-center rounded bg-[#305832] px-4 py-2 text-white transition hover:border hover:border-[#305832] hover:bg-white hover:text-[#305832]"
                target="_blank"
                rel="noopener noreferrer">
                Próximamente
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M10 17l5-5-5-5v10z" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
