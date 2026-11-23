
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";

const RecentListings = ({ products, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="h-48 bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 rounded bg-slate-200" />
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-6 w-1/2 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white px-6 py-10 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
        <Package size={42} className="mx-auto text-slate-300" />

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No listings found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          There are no products available right now. Check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RecentListings;
