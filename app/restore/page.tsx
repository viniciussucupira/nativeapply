import type { Metadata } from "next";
import RestoreForm from "./RestoreForm";

export const metadata: Metadata = {
  title: "Restore Pro | NativeApply",
  description: "Turn on NativeApply Pro in a new browser or device.",
  robots: { index: false },
};

export default function RestorePage() {
  return <RestoreForm />;
}
