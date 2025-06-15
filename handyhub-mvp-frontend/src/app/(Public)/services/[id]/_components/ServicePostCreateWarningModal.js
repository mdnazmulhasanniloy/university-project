"use client";

import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function ServicePostCreateWarningModal({ open, setOpen }) {
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <span className="sr-only">Continue to login prompt</span>

      <div className="space-y-8">
        <div className="flex items-start gap-x-5">
          <div className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-primary-orange text-white">
            <TriangleAlert size={20} strokeWidth={2.6} />
          </div>

          <div>
            <h5 className="mb-1 text-xl font-bold">
              Ooops!! Invalid User Request
            </h5>

            <p className="text-base font-medium">
              Only <span className="underline">customers</span> can contract for
              a service!! Please <Link href="/login">login</Link> or{" "}
              <Link href="/sign-up">create account</Link> as a customer to
              continue.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction className="bg-primary-blue">
            Continue to login
          </AlertDialogAction>
        </AlertDialogFooter>
      </div>
    </ModalWrapper>
  );
}
