"use client";
import React from "react";
import { cn } from "@repo/design-system/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "mx-auto w-full bg-transparent relative rounded-2xl overflow-hidden",
        containerClassName
      )}
    >
      <div
        className="relative h-full bg-transparent sm:mx-0 sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow: "none",
        }}
      >
        <div className={cn("h-full px-4 py-20 sm:px-10", className)}>
          {children}
        </div>
      </div>
    </section>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: "30%",
      }}
    ></div>
  );
};
