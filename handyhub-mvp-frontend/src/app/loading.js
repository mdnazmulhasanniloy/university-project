import Image from "next/image";
import logo from "/public/logos/logo-sm.png";

export default function loading() {
  return (
    <section className="flex-center h-[75vh]">
      <div className="flex-center relative z-10 h-[180px] w-[180px]">
        <div
          className="absolute inset-0 -z-[999px] aspect-square h-full w-full animate-ping rounded-full bg-primary-orange/30 ease-in-out"
          style={{
            animationDuration: "1500ms",
            animationPlayState: "revert",
          }}
        />

        <Image
          src={logo}
          alt="Logo of Handyhub"
          height={1200}
          width={1200}
          className="custom-pulse-animation z-10 h-[150px] w-auto object-cover"
        />
      </div>
    </section>
  );
}
