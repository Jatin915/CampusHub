import { Menu, X } from "lucide-react";
import { useState } from "react";


const navLinks = [
  "Home",
  "Categories",
  "How It Works",
  "Featured",
  "FAQ",
];


const MobileMenu = () => {

  const [open,setOpen] = useState(false);


  return (
    <div className="lg:hidden">

      {/* Menu Button */}
      <button
        onClick={()=>setOpen(!open)}
        className="
          p-2
          rounded-lg
          hover:bg-gray-100
          transition
        "
      >

        {
          open 
          ? 
          <X size={24}/>
          :
          <Menu size={24}/>
        }

      </button>


      {/* Mobile Dropdown */}

      {
        open && (

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

            {
              navLinks.map((item)=>(
                <a
                  key={item}
                  href="#"
                  className="
                    text-gray-700
                    font-medium
                    hover:text-blue-600
                  "
                  onClick={()=>setOpen(false)}
                >
                  {item}
                </a>
              ))
            }


          </div>

        )
      }

    </div>
  );
};


export default MobileMenu;