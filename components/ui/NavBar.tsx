// src/components/ui/Navbar.tsx
"use client";

import React from "react";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import content from "../../data/landing.json";
import { IconMap } from "./IconMap";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="nav-shell">
      <div className="nav-container relative">
        {/* 1. Left: Logo & Brand */}
        <div className="nav-brand">
          <Image
            src={content.navbar.logo}
            alt="Indus Net Technologies"
            width={140}
            height={40}
            priority
            className="nav-logo"
          />
          <span className="nav-brand-text">{content.navbar.brandName}</span>
        </div>

        {/* 2. Center: Navigation Links */}
        <div className="nav-links">
          {content.navbar.links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={
                link.isActive
                  ? "site-nav-item site-nav-item-active"
                  : "site-nav-item"
              }
              aria-current={link.isActive ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* 3. Right: CTA Button */}
        <div className="hidden shrink-0 lg:block">
          <button type="button" className="nav-cta">
            <IconMap name="play" className="nav-cta-icon" />
            {content.navbar.cta}
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-600 transition-colors hover:bg-brand-50 lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          {isMenuOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {content.navbar.links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={
                  link.isActive
                    ? "site-nav-item site-nav-item-active w-full justify-start"
                    : "site-nav-item w-full justify-start"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="nav-cta mt-2 w-full justify-center"
            >
              <IconMap name="play" className="nav-cta-icon" />
              {content.navbar.cta}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
