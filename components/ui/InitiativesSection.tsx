// src/components/ui/InitiativesSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import content from "../../data/landing.json";
import { InitiativeCard } from "../Cards";
import { IconMap } from "./IconMap";
import { useAuth } from "../providers/AuthProvider";
import {
  PERMISSIONS_EXPIRY_STORAGE_KEY,
  PERMISSIONS_STORAGE_KEY,
  type CardPermissions,
} from "@/lib/permissions";

function isCardPermissions(value: unknown): value is CardPermissions {
  return (
    Array.isArray(value) &&
    value.every((permission) => {
      if (!permission || typeof permission !== "object") {
        return false;
      }

      const entry = permission as Record<string, unknown>;
      return (
        typeof entry.token === "string" &&
        entry.token.length > 0 &&
        Object.entries(entry).some(
          ([key, flag]) => key !== "token" && typeof flag === "boolean",
        )
      );
    })
  );
}

export const InitiativesSection: React.FC = () => {
  const { permissions: sessionPermissions } = useAuth();
  const [permissions, setPermissions] = useState<CardPermissions>([]);

  const activePermissions =
    sessionPermissions && sessionPermissions.length > 0
      ? sessionPermissions
      : permissions;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const expiresAt = Number(
        localStorage.getItem(PERMISSIONS_EXPIRY_STORAGE_KEY),
      );

      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
        localStorage.removeItem(PERMISSIONS_EXPIRY_STORAGE_KEY);
        return;
      }

      try {
        const storedPermissions = JSON.parse(
          localStorage.getItem(PERMISSIONS_STORAGE_KEY) ?? "null",
        );

        if (isCardPermissions(storedPermissions)) {
          setPermissions(storedPermissions);
        }
      } catch (error) {
        console.warn("Unable to read stored card permissions.", error);
        localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
        localStorage.removeItem(PERMISSIONS_EXPIRY_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

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
              url={
                activePermissions.some(
                  (permission) =>
                    permission[card.id] === true &&
                    typeof permission.token === "string" &&
                    permission.token.length > 0,
                ) && card.inhouseUrl
                  ? card.inhouseUrl
                  : card.url
              }
              inhouseUrl={card.inhouseUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
