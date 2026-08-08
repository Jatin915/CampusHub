const HeroButtons = () => {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        sm:flex-row
      "
    >
      <button
        className="
          rounded-xl
          bg-blue-600
          px-8
          py-4
          font-semibold
          text-white
          shadow-lg
          shadow-blue-200
          transition
          hover:bg-blue-700
        "
      >
        Get Started
      </button>
    </div>
  );
};

export default HeroButtons;
