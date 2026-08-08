import { Laptop, BookOpen, BadgeCheck, Users } from "lucide-react";

const HeroIllustration = () => {
  return (
    <div
      className="
        relative
        w-full
        max-w-xl
      "
    >
      {/* Main Card */}

      <div
        className="
          rounded-3xl
          bg-blue-600
          p-8
          shadow-2xl
          sm:p-10
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-start
            justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                text-blue-100
              "
            >
              CampusHub
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-bold
                text-white
                sm:text-4xl
              "
            >
              Student Marketplace
            </h2>
          </div>

          <div
            className="
              rounded-full
              bg-white/20
              p-4
              text-white
            "
          >
            <BadgeCheck size={32} />
          </div>
        </div>

        {/* Product Cards */}

        <div
          className="
            mt-10
            space-y-5
          "
        >
          <ProductCard
            icon={<Laptop size={32} />}
            title="MacBook Air"
            category="Electronics"
            price="₹45,000"
          />

          <ProductCard
            icon={<BookOpen size={32} />}
            title="Engineering Books"
            category="Study Material"
            price="₹800"
          />
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ icon, title, category, price }) => {
  return (
    <div
      className="
        flex
        items-center
        gap-5
        rounded-2xl
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* Icon */}

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          bg-blue-50
          text-blue-600
        "
      >
        {icon}
      </div>

      {/* Product Details */}

      <div
        className="
          flex-1
        "
      >
        <h3
          className="
            text-lg
            font-bold
            text-gray-900
          "
        >
          {title}
        </h3>

        <p
          className="
            text-sm
            text-gray-500
          "
        >
          {category}
        </p>
      </div>

      {/* Price */}

      <p
        className="
          text-lg
          font-bold
          text-blue-600
        "
      >
        {price}
      </p>
    </div>
  );
};

export default HeroIllustration;
