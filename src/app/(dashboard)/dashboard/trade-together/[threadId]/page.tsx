import { ThreadChat } from "@/components/forum/ThreadChat";

export default function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  return <ThreadChat threadId={params.threadId} />;
}