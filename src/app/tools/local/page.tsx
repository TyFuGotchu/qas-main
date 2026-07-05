import { redirect } from "next/navigation";

/** Legacy funnel URL — tools are hosted natively on /tools */
export default function LocalToolsLegacyRedirect() {
  redirect("/tools");
}