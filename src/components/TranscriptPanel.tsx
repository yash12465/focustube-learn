import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface TranscriptPanelProps {
  videoId: string;
}

export const TranscriptPanel = ({ videoId }: TranscriptPanelProps) => {
  // Placeholder - ready for API integration
  return (
    <Card className="h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Transcript</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-3 pr-4">
            <p className="text-sm text-muted-foreground">
              Transcript feature ready for integration.
            </p>
            <p className="text-sm text-muted-foreground">
              Video ID: <code className="px-2 py-1 bg-secondary rounded text-xs">{videoId}</code>
            </p>
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                The transcript API will be integrated here. This panel is ready to display:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>• Timestamped captions</li>
                <li>• Searchable text</li>
                <li>• Clickable timestamps to jump to video positions</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
