import {
  ShieldCheck,
  MapPin,
  Wallet,
  BookOpen,
  Laptop,
  Armchair,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#F3F7FF]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-10">
        {/* LEFT CONTENT */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <ShieldCheck size={17} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Exclusive for College Students
            </span>
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#14213D] sm:text-5xl lg:text-[58px]">
            Buy &amp; Sell
            <br />
            Second-Hand Products
            <br />
            Within Your <span className="text-blue-600">Campus.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Find affordable books, gadgets, furniture, and more from students in
            your own college. A smarter, easier way to buy and sell within your
            campus community.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="login"
              className="inline-flex min-w-48 items-center justify-center gap-3 rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 sm:min-w-52"
            >
              Browse Products
              <ArrowRight size={18} />
            </a>
          </div>

          {/* TRUST INDICATORS */}
          <div className="mt-9 grid grid-cols-1 gap-4 border-t border-blue-100 pt-6 sm:grid-cols-3 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <ShieldCheck size={21} className="text-blue-700" />
              </div>
              <span className="text-xs font-semibold leading-5 text-slate-700 sm:text-sm">
                Verified Students
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <MapPin size={21} className="text-emerald-700" />
              </div>
              <span className="text-xs font-semibold leading-5 text-slate-700 sm:text-sm">
                Within Your Campus
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Wallet size={21} className="text-amber-700" />
              </div>
              <span className="text-xs font-semibold leading-5 text-slate-700 sm:text-sm">
                Affordable Deals
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-blue-200/50 blur-2xl sm:h-44 sm:w-44" />

          <div className="absolute -bottom-6 -left-5 h-36 w-36 rounded-full bg-indigo-200/50 blur-2xl sm:h-48 sm:w-48" />

          <div className="relative overflow-hidden rounded-3xl border border-white shadow-2xl shadow-blue-900/10">
            <img
              src="/images/hero-campus.png"
              alt="College students spending time together on campus"
              className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[490px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <CheckCircle2 size={15} />
                Your Campus, Your Community
              </div>

              <h2 className="mt-3 text-xl font-bold sm:text-2xl">
                Great deals start with your campus.
              </h2>

              <p className="mt-1 text-sm text-white/85">
                Buy smart. Sell easily. Reuse together.
              </p>
            </div>
          </div>

          {/* FLOATING BOOK CARD */}
          <div className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl sm:-left-8 sm:top-12 sm:p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <BookOpen size={23} className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">Used Books</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Student-friendly prices
              </p>
            </div>
          </div>

          {/* FLOATING ELECTRONICS CARD */}
          <div className="absolute -right-2 top-1/2 flex -translate-y-1/2 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl sm:-right-6 sm:p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
              <Laptop size={23} className="text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">Electronics</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Find your next gadget
              </p>
            </div>
          </div>

          {/* FLOATING HOSTEL ESSENTIALS CARD */}
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl sm:bottom-6 sm:left-6 sm:p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Armchair size={23} className="text-amber-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                Hostel Essentials
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                More value, less spending
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
