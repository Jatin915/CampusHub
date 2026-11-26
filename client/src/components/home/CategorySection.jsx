import {
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Dumbbell,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categoryIcons = [BookOpen, Laptop, Armchair, Shirt, Dumbbell];

const CategorySection = ({ categories = [], isLoading = false }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-bold text-slate-900">Explore Categories</h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900">Explore Categories</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index) => {
          const Icon = categoryIcons[index % categoryIcons.length] || Package;

          return (
            <div
              key={category._id}
              onClick={() =>
                  navigate(`/dashboard/categories?category=${category._id}`)
                }
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:shadow-sm"
            >
                <div className="rounded-lg bg-slate-100 p-3">
                  <Icon size={20} className="text-slate-700" />
                </div>

                <span className="truncate text-sm font-semibold text-slate-800">
                  {category.name}
                </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
