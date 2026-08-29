import { redirect } from "next/navigation";
import { E8_PUBLIC_PATH } from "@/lib/e8-partner";

export default function E8ExecutionCenterAliasPage() {
  redirect(E8_PUBLIC_PATH);
}
