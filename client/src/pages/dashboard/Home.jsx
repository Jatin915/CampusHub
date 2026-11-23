import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../../components/home/DashboardLayout";
import WelcomeBanner from "../../components/home/WelcomeBanner";
import CategorySection from "../../components/home/CategorySection";
import RecentListings from "../../components/home/RecentListings";
import ProductCard from "../../components/home/ProductCard";

import useAuth from "../../hooks/useAuth";
import { getCategories } from "../../services/categoryServices";
import { getMarketplaceProducts } from "../../services/productServices";

const Home = () => {
  const { user } = useAuth();

  // Product states
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // Category states
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Pagination and sorting
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });

  const [refreshKey, setRefreshKey] = useState(0);
  const [recentLoading, setRecentLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Category fetch error:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch recently listed products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setRecentLoading(true);

        const response = await getMarketplaceProducts({
          page: 1,
          limit: 4,
          sort: "newest",
        });

        setRecentProducts(response.data.products || []);
      } catch (error) {
        console.error("Recent products fetch error:", error);
      } finally {
        setRecentLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  // Fetch marketplace products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await getMarketplaceProducts({
          page,
          limit: 12,
          sort,
        });

        setProducts(response.data.products || []);
        setPagination(response.data.pagination);
      } catch (error) {
        setProductsError(
          error.response?.data?.message ||
            "Unable to load products. Please try again.",
        );
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [page, sort, refreshKey]);

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleRetryProducts = () => {
    // Changing the page triggers the product-fetch effect.
    // A dedicated refresh state handles retrying the same page.
    setRefreshKey((current) => current + 1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome */}
        <WelcomeBanner user={user} />

        {/* Categories */}
        <CategorySection
          categories={categories}
          isLoading={categoriesLoading}
        />

        {/* Recent Listings */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Recently Listed
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Check out the latest products added to your campus marketplace.
            </p>
          </div>

          <RecentListings
            products={recentProducts}
            isLoading={recentLoading}
            error=""
          />
        </section>

        {/* All Products */}
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Explore Marketplace
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Browse products available in your campus.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2">
              <ArrowUpDown size={16} className="text-slate-500" />

              <select
                value={sort}
                onChange={handleSortChange}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            {pagination.totalProducts} products available
          </p>

          <div className="mt-5">
            {productsLoading ? (
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
            ) : productsError ? (
              <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
                <p className="text-sm text-red-600">{productsError}</p>

                <button
                  onClick={handleRetryProducts}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  <RefreshCw size={15} />
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
                <p className="font-semibold text-slate-900">
                  No products available
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Check back later for new listings.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!productsLoading && !productsError && pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
              <p className="text-sm text-slate-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Home;
