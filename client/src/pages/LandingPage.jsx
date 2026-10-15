import Hero from "../components/landingpage/Hero";
import CategoriesSection from "../components/landingpage/CategoriesSection";
import FeaturedListings from "../components/landingpage/FeaturedListings";
import WhyChooseUs from "../components/landingpage/WhyChooseUs";
import HowItWorks from "../components/landingpage/HowItWorks";
import CallToAction from "../components/landingpage/CallToAction";
import Footer from "../components/landingpage/Footer";

const LandingPage = () => {
  return (
    <div>
      <main>
        <Hero/>
        <CategoriesSection/>
        <FeaturedListings/>
        <WhyChooseUs/>
        <HowItWorks/>
        <CallToAction/>
      </main>
      <Footer/>
    </div>
  )
}

export default LandingPage
