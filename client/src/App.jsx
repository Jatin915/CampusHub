import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import AboutSection from "./components/about/About";
import ContactSection from "./components/contact/ContactSection";
function App() {

  return (

    <div className="min-h-screen">

      <Navbar />

      <Hero />
      <AboutSection />
      <ContactSection />
    </div>

  );

}


export default App;