import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Megaphone } from "lucide-react";

export async function AnnouncementBanner() {
  const announcements = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (announcements.length === 0) return null;

  return (
    <div className="space-y-3">
      {announcements.map((item) => (
        <Card key={item.id} className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-start gap-4 py-4">
            <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm font-semibold text-amber-300">
                  {item.title}
                </h3>
                <Badge variant="warning">Announcement</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.content}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}