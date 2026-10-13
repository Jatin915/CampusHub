const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Authentication illustration */}
        <section className="hidden bg-slate-50 lg:flex lg:min-h-screen lg:items-center lg:justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-slate-900">
              CampusHub
            </div>

            <p className="mt-3 text-lg text-slate-600">
              Your campus marketplace
            </p>
          </div>
        </section>

        {/* Authentication content */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;