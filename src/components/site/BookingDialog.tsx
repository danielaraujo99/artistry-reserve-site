import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookingFlow } from "./BookingFlow";

export function BookingDialog({
  serviceId,
  open,
  onOpenChange,
}: {
  serviceId?: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:w-full">
        <DialogHeader className="shrink-0 border-b border-border/70 px-6 pb-4 pt-6 text-left sm:px-8">
          <div className="eyebrow">Agendamento online</div>
          <DialogTitle className="mt-1 font-serif text-3xl font-semibold">Reserve seu horário</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          {/* Remount on serviceId change so the flow restarts cleanly */}
          <BookingFlow key={serviceId ?? "new"} embedded initialServiceId={serviceId} onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
