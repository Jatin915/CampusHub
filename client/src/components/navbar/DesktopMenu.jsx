const navLinks = [
  {
    name: "Home",
    href: "#home",
  },
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Contact",
    href: "#contact",
  },
];

const DesktopMenu = () => {
  return (
    <nav
      className="
        hidden
        lg:flex
        items-center
        gap-8
      "
    >
      {navLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="
              text-sm
              font-medium
              text-gray-600
              hover:text-blue-600
              transition-colors
            "
        >
          {link.name}
        </a>
      ))}
    </nav>
  );
};

export default DesktopMenu;
