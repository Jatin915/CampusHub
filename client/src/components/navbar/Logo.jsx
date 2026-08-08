const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {/* Logo Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md">
        C
      </div>

      {/* Logo Text */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">CampusHub</h1>

        <p className="text-xs text-gray-500">Student Marketplace</p>
      </div>
    </div>
  );
};

export default Logo;
