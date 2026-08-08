import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  {
    name: "Home",
    href: "#home",
  },
  {
    name: "About Us",
    href: "#about",
  },
  {
    name: "Contact",
    href: "#contact",
  },
];

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Menu Button */}

      <button
        onClick={() => setOpen(!open)}
        className="
          p-2
          rounded-lg
          hover:bg-gray-100
          transition
        "
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Dropdown */}

      {open && (
        <div
          className="
              absolute
              top-20
              left-0
              w-full
              bg-white
              border
              shadow-lg
              rounded-b-2xl
              p-6
              flex
              flex-col
              gap-5
            "
        >
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="
                    text-gray-700
                    font-medium
                    hover:text-blue-600
                  "
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
