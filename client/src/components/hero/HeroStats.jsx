const stats = [
  {
    value: "10K+",
    label: "Verified Students",
  },
  {
    value: "50K+",
    label: "Products Listed",
  },
  {
    value: "15+",
    label: "Colleges",
  },
  {
    value: "100%",
    label: "Safe & Secure",
  },
];

const HeroStats = () => {
  return (
    <div
      className="
        mt-10
        grid
        grid-cols-2
        gap-4
        rounded-2xl
        border
        border-gray-200
        bg-white/80
        p-5
        shadow-sm
        backdrop-blur
        sm:p-6
        lg:grid-cols-4
      "
    >
      {stats.map((item, index) => (
        <div
          key={index}
          className="
              flex
              flex-col
              gap-1
              border-b
              border-gray-100
              pb-3
              last:border-none
              sm:border-none
              sm:pb-0
            "
        >
          <h3
            className="
                text-2xl
                font-bold
                tracking-tight
                text-gray-900
                sm:text-3xl
              "
          >
            {item.value}
          </h3>

          <p
            className="
                text-sm
                text-gray-500
              "
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;
