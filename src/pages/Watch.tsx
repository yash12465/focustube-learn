import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { VideoInput } from "@/components/VideoInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Watch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlVideoId = searchParams.get("v");
  const [videoId, setVideoId] = useState(urlVideoId || "");

  const handleVideoLoad = (id: string) => {
    setVideoId(id);
    navigate(`/watch?v=${id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FocusTube
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <VideoInput onVideoLoad={handleVideoLoad} />
        </div>

        {videoId ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer videoId={videoId} />
            </div>
            <div className="lg:col-span-1">
              <TranscriptPanel videoId={videoId} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold mb-3">No Video Loaded</h2>
              <p className="text-muted-foreground">
                Paste a YouTube URL above to start your distraction-free learning experience.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Watch;
