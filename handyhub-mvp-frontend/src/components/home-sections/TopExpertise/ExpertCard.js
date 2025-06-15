import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import placeholderImage from "/public/images/placeholder-bg.svg";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function ExpertCard({ expert }) {
  return (
    <Link
      href={`/seller/${expert?._id}`}
      className="group block space-y-4 rounded-3xl border p-3 transition-all duration-300 ease-in-out hover:border-primary-blue"
    >
      <div className="relative">
        <Image
          src={expert?.profile || placeholderImage}
          alt={"Portfolio image of" + expert?.name}
          width={1200}
          height={1200}
          className="max-h-[200px] w-full rounded-2xl object-cover"
        />

        {/* Rating */}
        {expert?.avgRating > 4 && (
          <Badge className="flex-center absolute right-2 top-2 w-max gap-x-1 rounded-full bg-yellow-300 py-0.5 !font-bold text-black shadow-none hover:bg-yellow-300">
            <Star size={14} className="-translate-y-0.5" /> {expert?.avgRating}
          </Badge>
        )}
      </div>

      <div className="flex-center-between">
        <div className="max-w-3/4">
          <h4 className="text-xl font-bold">{expert?.name}</h4>
          <p className="font-dm-sans text-sm text-dark-gray">
            {expert?.designation}
          </p>
        </div>

        <Button variant="blue" className="group h-10 rounded-full" asChild>
          <Link href={`/seller/${expert?._id}`}>
            View Details <AnimatedArrow />
          </Link>
        </Button>
      </div>
    </Link>
  );
}
