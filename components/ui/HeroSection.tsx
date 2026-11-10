// src/components/ui/HeroSection.tsx
import React from "react";
import Image from "next/image";
import content from "../../data/landing.json";
import { IconMap } from "./IconMap";

export const HeroSection: React.FC = () => {
  const [titleLead, ...titleRest] = content.hero.title.split(" ");

  return (
    <section className="hero-section">
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-overlay" />

      <div className="hero-container">
        {/* Left Column: Text & Benefits */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-white">{titleLead}</span>{" "}
            <span className="text-gradient">{titleRest.join(" ")}</span>
          </h1>

          <p className="hero-subtitle">{content.hero.subtitle}</p>

          {/* Benefits Row */}
          <div className="hero-benefits">
            {content.hero.benefits.map((benefit, index) => (
              <div key={index} className="hero-benefit">
                <IconMap
                  name={
                    index === 0
                      ? "lightning"
                      : index === 1
                        ? "check"
                        : "lightning"
                  }
                  className="hero-benefit-icon"
                />
                <span className="hero-benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
