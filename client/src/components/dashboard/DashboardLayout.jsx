
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  GraduationCap,
  Search,
  Heart,
  ChevronDown,
  Menu,
  X,
  House,
  ShoppingCart,
  LayoutGrid,
  ShoppingBag,
  Settings,
  UserRound,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const navigation = [
  { label: "Home", path: "/dashboard/home", icon: House },
  { label: "Cart", path: "/dashboard/cart", icon: ShoppingCart },
  { label: "Categories", path: "/dashboard/categories", icon: LayoutGrid },
  { label: "My Orders", path: "/dashboard/orders", icon: ShoppingBag },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const DashboardLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.fullName || "Student";
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard/home"
          className="flex shrink-0 items-center gap-2"
        >
          <GraduationCap className="h-8 w-8 text-black" strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tight">
            Campus<span className="text-slate-500">Hub</span>
          </span>
        </Link>

        <div className="mx-6 hidden max-w-xl flex-1 md:block">
          <div className="flex h-10 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-slate-400">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search for books, laptops, furniture..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-500">
              ⌘ K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/dashboard/wishlist"
            aria-label="Wishlist"
            className="hidden rounded-lg p-2 transition hover:bg-slate-100 sm:block"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
              aria-expanded={profileOpen}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {initials}
              </div>
              <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                {displayName}
              </span>
              <ChevronDown className="hidden h-4 w-4 sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <Link
                  to="/dashboard/home"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
                >
                  <UserRound className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 w-60 border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-1">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen pt-16 lg:pl-60">
        <div className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
