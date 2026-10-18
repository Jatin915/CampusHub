import {
  ShieldCheck,
  Box,
  MessageCircle,
} from "lucide-react";

const benefits = [
  {
    title: "Secure Transactions",
    description: "Verify the product before completing an exchange.",
    Icon: ShieldCheck,
  },
  {
    title: "Meet on Campus",
    description: "Coordinate a convenient pickup with the seller.",
    Icon: Box,
  },
  {
    title: "Need Help?",
    description: "Contact the CampusHub support team.",
    Icon: MessageCircle,
  },
];

const CartBenefits = () => {
  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      {benefits.map(({ title, description, Icon }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold">{title}</h3>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CartBenefits;