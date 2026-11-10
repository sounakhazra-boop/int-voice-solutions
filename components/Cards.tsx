"use client";

import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
} from "./ui/dialog";

export interface InitiativeCardProps {
  id: string;
  title: string;
  description: string;
  tag?: string;
  iconType: "purple" | "blue" | "gray";
  icon: React.ReactNode;
  url?: string | null;
}

export const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  description,
  tag,
  iconType,
  icon,
  url,
}) => {
  const normalizedUrl = url?.trim();
  const cardClassName = "group initiative-card relative w-full text-left";

  const cardContent = (
    <>
      <div className={`initiative-icon initiative-icon-${iconType}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className="card-title line-clamp-1 group-hover:text-purple-700"
            title={title}
          >
            {title}
          </h3>
          {tag && <span className="badge-flagship">{tag}</span>}
        </div>
        <p className="card-description line-clamp-2" title={description}>
          {description}
        </p>
      </div>
      <div className="flex items-center justify-center text-blue-200 group-hover:text-purple-600 transition-colors self-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </>
  );

  return (
    <div className="relative">
      {normalizedUrl ? (
        <a
          href={normalizedUrl}
          target="_blank"
          rel="noreferrer"
          className={cardClassName}
        >
          {cardContent}
        </a>
      ) : (
        <Dialog>
          <DialogTrigger className={cardClassName}>{cardContent}</DialogTrigger>
          <DialogPortal>
            <DialogBackdrop />
            <DialogViewport>
              <DialogPopup>
                <DialogTitle>Coming soon</DialogTitle>
                <DialogDescription>
                  This initiative is currently being prepared. Please check back
                  soon.
                </DialogDescription>
                <DialogClose>Close</DialogClose>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
};
