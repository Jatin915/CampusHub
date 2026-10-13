const AuthDivider = () => {
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-slate-200" />

      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        Or continue with
      </span>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
};

export default AuthDivider;