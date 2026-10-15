import {
  UserPlus,
  Search,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your account and join your college community on CampusHub.",
    icon: UserPlus,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    number: "02",
    title: "Browse or List",
    description:
      "Discover second-hand products or list items you no longer need.",
    icon: Search,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    number: "03",
    title: "Connect",
    description: "Connect with interested buyers or sellers from your campus.",
    icon: MessageCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    number: "04",
    title: "Buy or Sell",
    description:
      "Discuss the deal and complete your exchange with the other student.",
    icon: ShoppingBag,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#F3F7FF] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADING */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
            How CampusHub Works
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
            Get started in a few simple steps and make the most of your campus
            marketplace.
          </p>
        </div>

        {/* STEPS */}
        <div className="relative mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* CONNECTING LINE — DESKTOP */}
          <div className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-blue-200 lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative z-10 rounded-2xl border border-blue-100 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5"
              >
                {/* STEP ICON */}
                <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${step.iconBg}`}
                  >
                    <Icon
                      size={27}
                      strokeWidth={1.8}
                      className={step.iconColor}
                    />
                  </div>

                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-4 ring-white">
                    {step.number}
                  </span>
                </div>

                {/* STEP CONTENT */}
                <h3 className="mt-6 text-lg font-bold text-[#14213D]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
