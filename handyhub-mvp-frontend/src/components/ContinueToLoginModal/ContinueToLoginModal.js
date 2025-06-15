"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ContinueToLoginModal({ open, setOpen, text }) {
  // Get current pathname for redirecting after login
  const currentPathname = usePathname();

  return (
    <AlertDialog open={open} setOpen={setOpen}>
      <AlertDialogTitle>
        <span className="sr-only">Continue to login prompt</span>
      </AlertDialogTitle>

      <AlertDialogContent className="space-y-5">
        <div className="flex items-start gap-x-5">
          <div className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-primary-orange text-white">
            <TriangleAlert size={20} strokeWidth={2.6} />
          </div>

          <div className="space-y-2">
            <h5 className="text-xl font-semibold">Authentication Required</h5>
            <p>
              Please{" "}
              <Link href="/login" className="underline">
                login
              </Link>{" "}
              or{" "}
              <Link href="/sign-up" className="underline">
                create account
              </Link>{" "}
              to {text || "continue"}
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col-reverse items-center lg:flex-row lg:justify-end">
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            className="w-full lg:w-max"
          >
            Cancel
          </AlertDialogCancel>

          <Link
            href={`/login?from-href=${currentPathname}`}
            className="block w-full lg:w-max"
          >
            <AlertDialogAction className="w-full bg-primary-blue">
              Continue to login
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
