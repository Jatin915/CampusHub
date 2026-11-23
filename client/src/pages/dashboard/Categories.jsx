import { useEffect, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../../components/home/DashboardLayout";
import CategorySection from "../../components/categories/CategorySection";
import ProductCard from "../../components/home/ProductCard";

import { getCategories } from "../../services/categoryServices";
import { getMarketplaceProducts } from "../../services/productServices";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "all",
  );

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [categoriesError, setCategoriesError] = useState("");
  const [productsError, setProductsError] = useState("");

  // Fetch active categories for the logged-in student's college
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        setCategoriesError(
          error.response?.data?.message || "Unable to load categories.",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl || "all");
    setPage(1);
  }, [categoryFromUrl]);

  // Fetch products whenever category, page or sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const response = await getMarketplaceProducts({
          page,
          limit: 12,
          sort,
          ...(selectedCategory !== "all" && {
            categoryId: selectedCategory,
          }),
        });

        setProducts(response.data.products || []);
        setPagination(response.data.pagination);
      } catch (error) {
        setProductsError(
          error.response?.data?.message || "Unable to load products.",
        );
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page, sort]);

  useEffect(() => {
    if (categoriesLoading) return;

    if (
      categoryFromUrl &&
      !categories.some((category) => category._id === categoryFromUrl)
    ) {
      setSearchParams({});
    }
  }, [categories, categoriesLoading, categoryFromUrl, setSearchParams]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const selectedCategoryName = categories.find(
    (category) => category._id === selectedCategory,
  )?.name;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page heading */}
        <section>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="mt-2 text-sm text-slate-500">
            Discover products available in your campus marketplace.
          </p>
        </section>

        {/* Category selection */}
        {categoriesLoading ? (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 w-32 animate-pulse rounded-xl bg-slate-200"
              />
            ))}
          </div>
        ) : categoriesError ? (
          <p className="rounded-xl border border-red-200 bg-white p-4 text-sm text-red-600">
            {categoriesError}
          </p>
        ) : (
          <CategorySection
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        )}

        {/* Products heading and sorting */}
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedCategory === "all"
                  ? "All Products"
                  : selectedCategoryName || "Category Products"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {pagination.totalProducts || 0} products available
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
        </section>

        {/* Product listing */}
        <section>
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
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
              <p className="text-sm text-red-600">{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <Package size={42} className="mx-auto text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No products found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No products are currently available in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {!productsLoading && !productsError && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
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
      </div>
    </DashboardLayout>
  );
};

export default Categories;
