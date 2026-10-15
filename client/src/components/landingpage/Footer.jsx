import { GraduationCap } from "lucide-react";

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.4 6.9L18.9 2zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2zM8 18H5V9h3v9zM6.5 7.8a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zM19 18h-3v-4.4c0-1.1 0-2.5-1.5-2.5S12.8 12.3 12.8 13.5V18h-3V9h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.3 2 3.3 4.5V18z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z",
  },
];

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Categories", href: "#categories" },
  { label: "My Orders", href: "#featured-listings" },
  { label: "Profile", href: "#home" },
];

const supportLinks = [
  { label: "Help Center", href: "mailto:campushub@example.com" },
  { label: "Safety Tips", href: "#how-it-works" },
  { label: "Contact Us", href: "mailto:campushub@example.com" },
  { label: "FAQs", href: "mailto:campushub@example.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 pb-6 pt-9 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-[1.7fr_1.15fr_1.05fr_0.8fr] lg:gap-10">
          {/* BRAND */}
          <div className="col-span-2 lg:col-span-1">
            <a href="#home" className="inline-flex items-center gap-3">
              <GraduationCap
                size={39}
                strokeWidth={2.2}
                className="shrink-0 text-[#14213D]"
              />

              <span className="text-2xl font-extrabold tracking-tight text-[#14213D]">
                Campus<span className="text-black">Hub</span>
              </span>
            </a>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              A marketplace by students, for students.
              <br />
              Buy. Sell. Reuse. Together.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold text-[#14213D]">Quick Links</h3>

            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-black"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-sm font-bold text-[#14213D]">Support</h3>

            <ul className="mt-3 space-y-2">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-black"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL LINKS */}
          <div className="mt-4 flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-[#14213D] transition-colors hover:text-slate-500"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-7 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-slate-500 sm:text-left sm:text-sm">
            © {new Date().getFullYear()} CampusHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
            <a
              href="#"
              className="text-xs text-slate-500 transition-colors hover:text-black sm:text-sm"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-xs text-slate-500 transition-colors hover:text-black sm:text-sm"
            >
              Terms of Service
            </a>

            <a
              href="mailto:campushub@example.com"
              className="text-xs text-slate-500 transition-colors hover:text-black sm:text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
