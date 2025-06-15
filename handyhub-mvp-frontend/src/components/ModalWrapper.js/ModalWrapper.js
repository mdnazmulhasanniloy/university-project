import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function ModalWrapper({
  children,
  open,
  setOpen,
  title = "",
  className,
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen} className="relative">
      <AlertDialogContent
        className={cn(
          `max-h-[85vh] max-w-full overflow-auto scrollbar-thin 2xl:max-w-[35%]`,
          className,
        )}
      >
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogDescription className="text-primary-black">
            {children}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="absolute right-1 top-1 h-8 w-8 rounded-full border-none p-0">
            <X size={22} className="text-primary-black/75" />
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
