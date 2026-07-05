import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicToolShell } from "@/components/tools/PublicToolShell";
import { ExpectancyValidator } from "@/components/tools/local/ExpectancyValidator";
import { AtrPipRangeCalculator } from "@/components/tools/local/AtrPipRangeCalculator";
import { CompoundingMatrix } from "@/components/tools/local/CompoundingMatrix";
import { getLocalToolBySlug } from "@/lib/tools-registry";

const TOOL_COMPONENTS: Record<string, React.ReactNode> = {
  "expectancy-validator": <ExpectancyValidator />,
  "atr-pip-range": <AtrPipRangeCalculator />,
  "compounding-matrix": <CompoundingMatrix />,
};

export function generateStaticParams() {
  return [
    { slug: "expectancy-validator" },
    { slug: "atr-pip-range" },
    { slug: "compounding-matrix" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = getLocalToolBySlug(params.slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: `${tool.name} | Quicksilver Local Tools`,
    description: `${tool.desc} Included with Quicksilver Premium — institutional planning for manual traders.`,
  };
}

export default function PublicLocalToolPage({ params }: { params: { slug: string } }) {
  const tool = getLocalToolBySlug(params.slug);
  if (!tool) notFound();

  const component = TOOL_COMPONENTS[params.slug];
  if (!component) notFound();

  return <PublicToolShell tool={tool}>{component}</PublicToolShell>;
}