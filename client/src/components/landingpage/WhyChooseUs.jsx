import {
  ShieldCheck,
  Users,
  Wallet,
  Recycle,
  Handshake,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Student Community",
    description:
      "Connect with students from your college and enjoy a more trusted campus marketplace.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Wallet,
    title: "Affordable Deals",
    description:
      "Save money on books, electronics, furniture, and other student essentials.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Campus-Only Connections",
    description:
      "Find buyers and sellers within your college community and make local exchanges easier.",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Recycle,
    title: "Reuse & Reduce Waste",
    description:
      "Give pre-loved products a second life and make more sustainable choices.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADING */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why CampusHub?
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#14213D] sm:text-4xl">
            A Smarter Marketplace for Students
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
            Everything you need to buy and sell second-hand products within your
            college community.
          </p>
        </div>

        {/* BENEFIT CARDS */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${benefit.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon
                    size={27}
                    strokeWidth={1.8}
                    className={benefit.iconColor}
                  />
                </div>

                <h3 className="mt-6 text-lg font-bold leading-7 text-[#14213D]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
