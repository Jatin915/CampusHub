const navLinks = [
  {
    id: 1,
    label: "Home",
    href: "#hero",
  },
  {
    id: 2,
    label: "Categories",
    href: "#categories",
  },
  {
    id: 3,
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    id: 4,
    label: "Featured",
    href: "#featured-products",
  },
  {
    id: 5,
    label: "FAQ",
    href: "#faq",
  },
];


const DesktopMenu = () => {
  return (
    <nav className="hidden lg:flex justify-center items-center gap-8 w-full">
      {
        navLinks.map((link)=>(
          <a
            key={link.id}
            href={link.href}
            className="
              text-sm
              font-medium
              text-gray-600
              hover:text-blue-600
              transition-colors
            "
          >
            {link.label}
          </a>
        ))
      }
    </nav>
  );
};


export default DesktopMenu;