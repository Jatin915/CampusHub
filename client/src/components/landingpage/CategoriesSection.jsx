import {
  BookOpen,
  Laptop,
  Armchair,
  Calculator,
  Gamepad2,
  NotebookPen,
  PencilRuler,
  Trophy,
  Guitar,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    name: "Books",
    description: "Textbooks & novels",
    icon: BookOpen,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "Electronics",
    description: "Laptops & gadgets",
    icon: Laptop,
    color: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    name: "Furniture",
    description: "Chairs & tables",
    icon: Armchair,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    name: "Stationery",
    description: "Pens, notebooks & supplies",
    icon: PencilRuler,
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    name: "Calculators",
    description: "Study essentials",
    icon: Calculator,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    name: "Gaming",
    description: "Games & accessories",
    icon: Gamepad2,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    name: "Sports",
    description: "Sports gear & equipment",
    icon: Trophy,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    name: "Musical Instruments",
    description: "Guitars & more",
    icon: Guitar,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADING */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Explore Marketplace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
              Find what you need from students in your own campus. Great
              products, affordable prices, and easy connections.
            </p>
          </div>

          <a
            href="login"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            Explore listings
            <ArrowRight size={17} />
          </a>
        </div>

        {/* CATEGORY CARDS */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                // href="#featured-listings"
                className="group flex min-h-44 flex-col items-start rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 sm:min-h-48 sm:p-6"
              >
                {/* CATEGORY ICON */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon
                    size={27}
                    strokeWidth={1.8}
                    className={category.iconColor}
                  />
                </div>

                {/* CATEGORY NAME */}
                <h3 className="mt-5 text-base font-bold leading-6 text-[#14213D] transition-colors group-hover:text-blue-600 sm:text-lg">
                  {category.name}
                </h3>

                {/* CATEGORY DESCRIPTION */}
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
