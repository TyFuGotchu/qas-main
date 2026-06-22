"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";

interface ExportModuleButtonProps {
  targetId?: string;
  filename?: string;
}

const WATERMARK = "QuicksilverAlgo.com";

export function ExportModuleButton({
  targetId = "qs-module-export",
  filename = "quicksilver-module",
}: ExportModuleButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        backgroundColor: "#020617",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const padding = 16;
        const fontSize = Math.max(14, Math.floor(canvas.width * 0.018));
        ctx.font = `600 ${fontSize}px ui-monospace, monospace`;
        ctx.fillStyle = "rgba(0, 229, 255, 0.45)";
        const metrics = ctx.measureText(WATERMARK);
        ctx.fillText(
          WATERMARK,
          canvas.width - metrics.width - padding,
          canvas.height - padding
        );
      }

      const link = document.createElement("a");
      link.download = `${filename}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("[ExportModuleButton]", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
      title="Download a watermarked PNG to share manually on your social media"
    >
      <Download className="h-3.5 w-3.5" />
      {exporting ? "Exporting…" : "Export PNG"}
    </Button>
  );
}