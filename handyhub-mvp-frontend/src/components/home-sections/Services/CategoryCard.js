"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import textTruncate from "@/utils/textTruncate";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryCard({ category, index }) {
  const [showBorderBeamIndex, setShowBorderBeamIndex] = useState(-1);

  return (
    <Link
      href={`/services?category=${category?._id}`}
      className={cn(
        "relative cursor-pointer rounded-xl border border-transparent bg-white p-4 duration-300 ease-in-out animate-in animate-out",
        index === showBorderBeamIndex && "shadow-lg",
      )}
      onMouseEnter={() => setShowBorderBeamIndex(index)}
      onMouseLeave={() => setShowBorderBeamIndex(-1)}
    >
      <span className="flex-center size-12 rounded-xl bg-primary-blue">
        <Image
          src={category?.banner}
          alt={category?.name}
          height={30}
          width={30}
        />
      </span>

      <h4 className="mb-1 mt-4 text-xl font-semibold">{category?.name}</h4>

      <p
        className="mt-1 font-dm-sans text-[#707071]"
        title={category?.description}
      >
        {textTruncate(category?.description, 100)}
      </p>

      {index === showBorderBeamIndex && (
        <BorderBeam
          size={250}
          duration={7}
          delay={9}
          borderWidth={2}
          colorFrom="var(--primary-orange)"
          colorTo="var(--primary-blue)"
        />
      )}
    </Link>
  );
}
