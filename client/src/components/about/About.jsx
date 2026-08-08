const AboutSection = () => {
  return (
    <section
      id="about"
      className="
        px-6
        py-20
        lg:px-12
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          gap-12
          lg:grid-cols-2
          lg:items-center
        "
      >

        <div>
          <p
            className="
              text-sm
              font-semibold
              text-blue-600
            "
          >
            About CampusHub
          </p>

          <h2
            className="
              mt-4
              text-4xl
              font-bold
              tracking-tight
              text-gray-900
              lg:text-5xl
            "
          >
            A trusted marketplace built for students
          </h2>

          <p
            className="
              mt-6
              text-lg
              leading-relaxed
              text-gray-600
            "
          >
            CampusHub connects students within the same college community to buy
            and sell second-hand products safely. From books and electronics to
            furniture and daily essentials, students can find what they need
            from trusted campus members.
          </p>
        </div>

        <div
          className="
            rounded-3xl
            bg-blue-600
            p-8
            text-white
            shadow-xl
          "
        >
          <h3
            className="
              text-2xl
              font-bold
            "
          >
            Why CampusHub?
          </h3>

          <ul
            className="
              mt-6
              space-y-4
              text-blue-100
            "
          >
            <li>✓ Verified college students only</li>

            <li>✓ Safe campus-based transactions</li>

            <li>✓ Easy buying and selling experience</li>

            <li>✓ Built exclusively for student communities</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
