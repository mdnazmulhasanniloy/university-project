import { Phone, Clock } from "lucide-react";
import ContactForm from "./_components/ContactForm";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { Mail } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "Contact us page",
};

export default function ContactUsPage() {
  return (
    <ResponsiveContainer className="flex-center mt-16 min-h-[80vh]">
      <div className="w-full rounded-xl border bg-white p-10 shadow lg:w-[65%]">
        <h1 className="text-center text-6xl font-extrabold text-primary-black">
          Get In Touch
        </h1>

        <div className="flex-center mb-10 mt-6 flex-wrap gap-x-10 font-dm-sans">
          <div className="flex-center-start gap-x-3">
            <Clock size={20} />
            <p className="text-lg">We are available 24/7</p>
          </div>

          <div className="h-1 w-1 rounded-full bg-primary-black" />

          <div className="flex-center-start gap-x-3">
            <Phone size={20} />
            <p className="text-lg">+1 (234) 8097</p>
          </div>

          <div className="h-1 w-1 rounded-full bg-primary-black" />

          <div className="flex-center-start gap-x-3">
            <Mail size={20} />
            <p className="text-lg">contact@handyhub.com</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </ResponsiveContainer>
  );
}
