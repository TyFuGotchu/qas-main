import { requireAcademyAccess } from "@/lib/access-control";

export default async function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAcademyAccess();
  return <div className="mx-auto max-w-4xl">{children}</div>;
}