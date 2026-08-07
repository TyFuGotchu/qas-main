import { redirect } from "next/navigation";

/** Legacy URL — money-back guarantee removed from product. */
export default function GuaranteeRedirectPage() {
  redirect("/");
}
