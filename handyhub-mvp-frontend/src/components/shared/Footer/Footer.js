import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import Image from "next/image";
import logo from "/public/images/footer/logo-white.svg";
import { Separator } from "@/components/ui/separator";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Twitter } from "lucide-react";
import { Linkedin } from "lucide-react";
import Link from "next/link";

const socialMediaIcons = [
  {
    key: "facebook",
    route: "#",
    label: "Facebook",
    icon: <Facebook />,
  },
  {
    key: "instagram",
    route: "#",
    label: "Instagram",
    icon: <Instagram />,
  },
  {
    key: "twitter",
    route: "#",
    label: "Twitter",
    icon: <Twitter />,
  },
  {
    key: "linkedin",
    route: "#",
    label: "Linkedin",
    icon: <Linkedin />,
  },
];

const links = [
  {
    key: "home",
    route: "/",
    label: "Home",
  },
  {
    key: "about",
    route: "/about",
    label: "About",
  },
  {
    key: "terms",
    route: "/terms-conditions",
    label: "Terms and Conditions",
  },
  {
    key: "privacy-policy",
    route: "/privacy-policy",
    label: "Privacy Policy",
  },
];

export default function Footer() {
  return (
    <footer className="mt-40 bg-primary-black pb-4 pt-8 text-primary-white">
      <ResponsiveContainer className="flex flex-col items-center">
        <Image src={logo} alt="Logo of Handyhub" />

        <h1 className="my-8 text-2xl font-semibold lg:text-3xl 2xl:text-4xl">
          Welcome to HandyHub
        </h1>

        <div className="flex-center w-full gap-x-5 lg:w-3/4">
          <div className="h-[0.5px] w-full bg-primary-white" />

          <div className="flex-center flex-1 gap-x-5">
            {socialMediaIcons.map((icon) => (
              <Link
                key={icon.route}
                href={icon.route}
                target="_blank"
                className="flex-center hover:text-cream-black size-10 rounded-full border bg-transparent transition-all duration-300 ease-in-out hover:bg-primary-white"
              >
                {icon.icon}
              </Link>
            ))}
          </div>

          <div className="h-[0.5px] w-full bg-primary-white" />
        </div>

        <div className="flex-center-between mt-16 w-full flex-col gap-y-4 border-t border-primary-white pt-2 lg:flex-row lg:gap-y-0">
          <p>Copyright &copy; 2023 HandyHub. All rights reserved.</p>

          <div className="flex-center-end gap-x-4">
            {links.map((link) => (
              <Link
                key={link.key}
                href={link.route}
                className="hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}
