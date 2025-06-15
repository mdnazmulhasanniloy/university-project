import { getServerSession } from "next-auth";
import LoginForm from "./_components/LoginForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Login",
  description: "Login page",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  return <LoginForm nextAuthUserData={session?.user} />;
}
