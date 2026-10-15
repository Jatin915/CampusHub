import { ArrowRight, ShoppingBag } from "lucide-react";

export default function CallToAction() {
  return (
<section className="bg-white px-4 py-8 sm:px-8 lg:px-12">
  <div className="mx-auto max-w-7xl">
    <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl bg-[#F3F7FF] px-5 py-7 sm:flex-row sm:gap-6 sm:px-8 sm:py-6 lg:px-10">

      {/* DECORATIVE BACKGROUND */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-indigo-100/50 blur-3xl" />

      {/* LEFT ICON */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <ShoppingBag
          size={38}
          strokeWidth={1.8}
          className="text-blue-600"
        />
      </div>

      {/* CENTER CONTENT */}
      <div className="relative min-w-0 flex-1 text-center sm:text-left">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-[#14213D] sm:text-2xl">
          Ready to start buying or selling?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Join thousands of students on CampusHub and be a part of your campus marketplace.
        </p>
      </div>

      {/* RIGHT BUTTON */}
      <div className="relative shrink-0">
        <a
          href="login"
          className="inline-flex min-w-48 items-center justify-center gap-3 rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 sm:min-w-52"
        >
          Get Started
          <ArrowRight size={19} />
        </a>
      </div>

    </div>
  </div>
</section>
  );
}
