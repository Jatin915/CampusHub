const HeroContent = () => {
  return (
    <div>
      <div
        className="
inline-flex
rounded-full
bg-blue-100
px-5
py-2
text-sm
font-semibold
text-blue-600
"
      >
        🎓 Exclusive for College Students
      </div>

      <h1
        className="
mt-8
text-5xl
font-bold
leading-tight
tracking-tight
text-gray-950
lg:text-6xl
"
      >
        Buy & Sell
        <br />
        <span className="text-blue-600">Second-Hand Products</span>
        <br />
        Within Your Campus
      </h1>

      <p
        className="
mt-6
max-w-xl
text-lg
leading-8
text-gray-600
"
      >
        CampusHub is a trusted marketplace where verified college students can
        buy and sell books, electronics, furniture, cycles, and more— securely
        within their own campus.
      </p>
    </div>
  );
};

export default HeroContent;
