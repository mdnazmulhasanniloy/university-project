"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import { Button } from "@/components/ui/button";
import { useApproveAndSendQuoteMutation } from "@/redux/api/contractApi";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { z } from "zod";

// Zod resolver
const sendQuoteValidationSchema = z.object({
  quote: z.coerce.number({ required_error: "Budget is required" }),
});

export default function SendQuoteModal({ open, setOpen, id }) {
  const [approveAndSendQuote, { isLoading }] = useApproveAndSendQuoteMutation();
  const onSubmit = async (data) => {
    try {
      await approveAndSendQuote({ id: id, data: data }).unwrap();
      SuccessModal("Quotation sent successfully");
      setOpen(false);
    } catch (error) {
      ErrorModal(error?.message || "Failed to send quote!!");
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen} title="Send Budget Quote">
      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(sendQuoteValidationSchema)}
      >
        <div className="relative mb-5">
          <DollarSign className="absolute left-3 top-3/4 size-5 -translate-y-3/4 text-muted" />
          <UInput
            type="number"
            name="quote"
            label="Estimated Budget"
            placeholder={"Enter your budget"}
            className={"pl-10"}
          />
        </div>

        <Button
          type="submit"
          variant="blue"
          size="lg"
          className="w-full rounded-full"
          loading={isLoading}
          loadingText="Sending Quote..."
        >
          Send Budget
        </Button>
      </FormWrapper>
    </ModalWrapper>
  );
}
