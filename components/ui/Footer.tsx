"use client";

import Image from "next/image";
import {
  ArrowUp,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  Phone,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";

const footerColumns = [
  {
    title: "Services",
    links: [
      "Customer Experience",
      "Digital Engineering",
      "AI and Analytics",
      "Cloud & DevOps Services",
      "Cybersecurity",
      "Integrated Digital Marketing",
      "Managed Services",
    ],
  },
  {
    title: "Industries",
    links: [
      "Banking & Finance",
      "Insurance",
      "Life Sciences",
      "Retail and FMCG",
    ],
    secondaryTitle: "Tech Stack",
  },
  {
    title: "Company",
    links: [
      "About INT.",
      "Our Story",
      "Leadership and Team",
      "Culture & Purpose",
      "Careers",
      "Recognition",
      "Case Studies",
      "Events",
      "Contact Us",
    ],
  },
  {
    title: "Insights",
    links: ["Blogs", "Events & Talk"],
  },
  {
    title: "Press Kit",
    links: ["INT. Profile", "Logo & Image Gallery"],
  },
];

const socialLinks = [
  { label: "X", href: "#", icon: XLogo },
  { label: "LinkedIn", href: "#", icon: LinkedinLogo },
  { label: "Instagram", href: "#", icon: InstagramLogo },
  { label: "Facebook", href: "#", icon: FacebookLogo },
  { label: "YouTube", href: "#", icon: YoutubeLogo },
];

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-slate-200 bg-white text-slate-700">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-7xl py-12 sm:w-[calc(100%-3rem)] lg:py-16">
        <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
          <Image
            src="/int_logo.png"
            alt="INT."
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-8">
            <a
              href="mailto:info@intglobal.com"
              className="inline-flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <EnvelopeSimple size={22} />
              info@intglobal.com
            </a>
            <a
              href="tel:+918047092630"
              className="inline-flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <Phone size={22} />
              +91 80470 92630 (IND)
            </a>
            <a
              href="tel:+19175401340"
              className="inline-flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <Phone size={22} />
              +1 (917) 540-1340 (US)
            </a>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-6 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-7">
            <a
              href="#"
              className="text-sm leading-5 text-slate-600 transition-colors hover:text-indigo-600"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="text-sm leading-5 text-slate-600 transition-colors hover:text-indigo-600"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm leading-5 text-slate-600 transition-colors hover:text-indigo-600"
            >
              Site Map
            </a>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: SocialIcon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                <SocialIcon size={18} weight="fill" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-700 bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 transition-all hover:-translate-y-1 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp size={20} weight="bold" />
      </button>
    </footer>
  );
};
