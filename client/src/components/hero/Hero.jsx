import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";
import HeroIllustration from "./HeroIllustration";

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-120px)] flex items-center">

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

        <div className="grid items-center gap-10 lg:grid-cols-2">


          {/* LEFT CONTENT */}

          <div className="flex flex-col justify-center">

            <HeroContent />

            <div className="mt-8">
              <HeroButtons />
            </div>

            <div className="mt-10">
              <HeroStats />
            </div>

          </div>



          {/* RIGHT ILLUSTRATION */}

          <div className="flex justify-center lg:justify-end">

            <HeroIllustration />

          </div>


        </div>

      </div>

    </section>
  );
};

export default Hero;