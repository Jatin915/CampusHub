import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";


const Navbar = () => {

  return (

    <header
      className="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur-md
        border-b
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          h-20
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}

        <Logo/>


        {/* Desktop Menu */}

        <DesktopMenu/>


        {/* Mobile Menu */}

        <MobileMenu/>


      </div>

    </header>

  );
};


export default Navbar;