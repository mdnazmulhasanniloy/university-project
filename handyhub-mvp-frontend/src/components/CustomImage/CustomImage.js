import Image from "next/image";
import placeholderImg from "/public/images/placeholder-img-2.svg";
import { cn } from "@/lib/utils";

export default function CustomImage({
  data,
  src,
  height,
  width,
  className,
  aspectRatio,
}) {
  return (
    <div className="rounded-lg bg-[#eaeaea]">
      <Image
        src={src || placeholderImg}
        alt={"Image of " + data?.name || ""}
        height={height || 1200}
        width={width || 1200}
        className={cn("", className)}
        aspectRatio={aspectRatio || 1}
      />
    </div>
  );
}
