
import {
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Dumbbell,
  Package,
  Smartphone,
  Headphones,
} from "lucide-react";

const categoryIcons = [
  BookOpen,
  Laptop,
  Armchair,
  Shirt,
  Dumbbell,
  Smartphone,
  Headphones,
];

const CategorySection = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Browse Categories
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Explore products by category.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelectCategory("all")}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
            selectedCategory === "all"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
          }`}
        >
          <Package size={19} />
          All Products
        </button>

        {categories.map((category, index) => {
          const Icon = categoryIcons[index % categoryIcons.length];

          const isSelected = selectedCategory === category._id;

          return (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                isSelected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <Icon size={19} />
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
