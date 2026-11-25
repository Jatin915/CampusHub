import { useEffect, useState } from "react";
import { Heart, Package } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/home/DashboardLayout";
import ProductCard from "../../components/home/ProductCard";
import { getWishlist } from "../../services/wishlistServices";
import { useWishlist } from "../../context/WishlistContext";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { wishlistIds, loading: wishlistIdsLoading } = useWishlist();

  const visibleProducts = products.filter((product) =>
    wishlistIds.has(String(product._id)),
  );

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getWishlist();

        const wishlistProducts = (response.data || [])
          .map((item) => item.product)
          .filter(Boolean);

        setProducts(wishlistProducts);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-3">
            <Heart className="fill-red-500 text-red-500" size={26} />
            <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Products you've saved for later.
          </p>
        </section>

        {loading || wishlistIdsLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
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
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <Package size={44} className="mx-auto text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Save products you're interested in and find them here.
            </p>

            <Link
              to="/dashboard/home"
              className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500">
              {products.length} saved{" "}
              {products.length === 1 ? "product" : "products"}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Wishlist;
