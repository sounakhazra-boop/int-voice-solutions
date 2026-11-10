// src/components/ui/InitiativesSection.tsx
"use client";

import React from "react";
import content from "../../data/landing.json";
import { InitiativeCard } from "../Cards";
import { IconMap } from "./IconMap";

export const InitiativesSection: React.FC = () => {
  return (
    <section id="solutions" className="section section-light my-3 sm:my-5">
      <div className="section-container">
        <header className="section-header">
          <h2 className="section-title">{content.initiatives.sectionTitle}</h2>
          <span className="section-divider" aria-hidden="true" />
          <p className="section-subtitle">
            {content.initiatives.sectionSubtitle}
          </p>
        </header>

        <div className="initiatives-grid">
          {content.initiatives.cards.map((card) => (
            <InitiativeCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              tag={card.tag}
              iconType={card.iconType as "purple" | "blue" | "gray"}
              icon={<IconMap name={card.id} className="h-6 w-6" />}
              url={card.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
