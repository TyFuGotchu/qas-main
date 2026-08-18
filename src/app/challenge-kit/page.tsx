import { redirect } from "next/navigation";

/** Legacy URL — $29 challenge kit removed from the public site. */
export default function ChallengeKitRedirectPage() {
  redirect("/");
}
