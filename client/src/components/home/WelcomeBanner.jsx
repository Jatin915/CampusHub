
const WelcomeBanner = ({ user }) => {
  return (
    <section className="rounded-2xl bg-slate-900 px-6 py-8 text-white sm:px-8">
      <p className="text-sm font-medium text-slate-300">
        Your campus marketplace
      </p>

      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
        Welcome back, {user?.fullName || "Student"}!
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
        Discover pre-loved products, find useful deals, and give items
        a second life within your campus.
      </p>
    </section>
  );
};

export default WelcomeBanner;
