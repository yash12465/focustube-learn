import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";

interface VideoInputProps {
  onVideoLoad: (videoId: string) => void;
}

export const VideoInput = ({ onVideoLoad }: VideoInputProps) => {
  const [url, setUrl] = useState("");

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(url);
    if (videoId) {
      onVideoLoad(videoId);
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <Input
        type="text"
        placeholder="Paste YouTube URL or video ID..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 h-12"
      />
      <Button type="submit" size="lg" className="gap-2">
        <Play className="h-4 w-4" />
        Load Video
      </Button>
    </form>
  );
};
