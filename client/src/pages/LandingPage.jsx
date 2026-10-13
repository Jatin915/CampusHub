import Navbar from "../components/navbar/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="p-10">
        <h1 className="text-4xl font-bold text-slate-900">
          CampusHub Landing Page
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Student Marketplace
        </p>
      </div>
    </div>
  );
};

export default LandingPage;