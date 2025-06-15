import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

export default function CustomCarousel({
  children,
  autoplay = false,
  arrows = false,
  dots = false,
  className,
}) {
  return (
    <Carousel
      opts={{
        loop: false,
        duration: 50,
        align: "start",
      }}
      plugins={[
        Autoplay({
          active: autoplay,
          delay: 4000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className={cn("relative", className)}
    >
      <CarouselContent>{children}</CarouselContent>

      {arrows && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 lg:-bottom-16">
          <CarouselPrevious
            className="h-10 w-10 bg-primary-blue text-white"
            icon={<ChevronLeft className="!h-6 !w-6" />}
          />

          <CarouselNext
            className="left-0 h-10 w-10 bg-primary-blue text-white"
            icon={<ChevronRight className="!h-6 !w-6" />}
          />
        </div>
      )}

      {dots && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <CarouselDots />
        </div>
      )}
    </Carousel>
  );
}
