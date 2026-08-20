import { redirect } from "next/navigation";

/** Member invite program removed from the product UI. */
export default function InviteRedirectPage() {
  redirect("/dashboard");
}
