import { Heart, MapPin, ArrowRight, Clock, Tag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "MacBook Air M1",
    category: "Electronics",
    price: "₹45,000",
    condition: "Like New",
    location: "GLA University",
    image: "/images/laptop.jpg",
    badge: "Popular",
    badgeColor: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    name: "Engineering Mathematics",
    category: "Books",
    price: "₹400",
    condition: "Good",
    location: "GLA University",
    image: "/images/books.jpg",
    badge: "Best Deal",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    name: "Study Chair",
    category: "Furniture",
    price: "₹1,200",
    condition: "Good",
    location: "GLA University",
    image: "/images/chair.jpg",
    badge: null,
    badgeColor: "",
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: "₹12,000",
    condition: "Like New",
    location: "GLA University",
    image: "/images/earbuds.jpg",
    badge: "Trending",
    badgeColor: "bg-violet-50 text-violet-700",
  },
];

export default function FeaturedListings() {
  return (
    <section
      id="featured-listings"
      className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADING */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Campus Marketplace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
              Featured Listings
            </h2>

            <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
              Discover great finds from students in your campus community at
              student-friendly prices.
            </p>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
            >
              {/* PRODUCT IMAGE */}
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* BADGE */}
                {product.badge && (
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${product.badgeColor}`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* FAVOURITE BUTTON */}
                <button
                  type="button"
                  aria-label={`Add ${product.name} to favourites`}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Heart size={18} />
                </button>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="p-5">
                <p className="text-xs font-medium text-blue-600">
                  {product.category}
                </p>

                <h3 className="mt-2 truncate text-base font-bold text-[#14213D]">
                  {product.name}
                </h3>

                {/* PRICE */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-xl font-extrabold text-[#14213D]">
                    {product.price}
                  </p>

                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    <Tag size={12} />
                    {product.condition}
                  </span>
                </div>

                {/* LOCATION */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex min-w-0 items-center gap-1.5 text-slate-500">
                    <MapPin size={15} className="shrink-0" />
                    <span className="truncate text-xs">{product.location}</span>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600">
                    <Clock size={13} />
                    Used
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
