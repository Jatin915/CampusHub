import { Mail, MessageCircle, GraduationCap } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-950 sm:text-5xl">
            Contact Us
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Have questions or suggestions? We would love to hear from you.
          </p>
        </div>


        {/* Main Layout */}

        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-start">

          {/* Left Content */}

          <div className="w-full space-y-8 rounded-3xl bg-blue-600 p-6 text-white shadow-xl sm:p-8 lg:p-10">

            <div>
              <h3 className="text-3xl font-bold">
                Let's connect with CampusHub
              </h3>

              <p className="mt-4 leading-relaxed text-blue-100">
                Have questions about buying, selling, or joining your campus
                marketplace? Our team is here to help.
              </p>
            </div>


            {/* Contact Cards */}

            <div className="space-y-5">

              <ContactCard
                icon={<Mail />}
                title="Email Support"
                text="support@campushub.com"
              />

              <ContactCard
                icon={<MessageCircle />}
                title="Student Support"
                text="Get help with your queries"
              />

              <ContactCard
                icon={<GraduationCap />}
                title="College Partnership"
                text="Partner with CampusHub"
              />

            </div>

          </div>


          {/* Right Form */}

          <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

            <form className="space-y-5">

              <InputField
                label="Your Name"
                placeholder="Aditi Sharma"
              />


              <InputField
                label="College Email"
                placeholder="aditi@college.edu"
              />


              <InputField
                label="Subject"
                placeholder="How can we help you?"
              />


              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Your Message
                </label>

                <textarea
                  rows="4"
                  placeholder="Tell us about your question or feedback..."
                  className="w-full max-w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>


              <button className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700">
                Send Message →
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};



const ContactCard = ({ icon, title, text }) => {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
        {icon}
      </div>


      <div>
        <h4 className="font-semibold">
          {title}
        </h4>

        <p className="text-sm text-blue-100">
          {text}
        </p>
      </div>

    </div>
  );
};



const InputField = ({ label, placeholder }) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>


      <input
        placeholder={placeholder}
        className="w-full max-w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />

    </div>
  );
};


export default ContactSection;