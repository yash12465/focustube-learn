import { useState } from "react";
import Navigation from "@/components/Navigation";
import { VideoInput } from "../components/VideoInput";
import { VideoPlayer } from "../components/VideoPlayer";
import { TranscriptPanel } from "../components/TranscriptPanel";

const Watch = () => {
  const [videoId, setVideoId] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <VideoInput onVideoLoad={setVideoId} />

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
          <div className="text-center py-12 text-muted-foreground">
            <p>Enter a YouTube URL above to get started</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Watch;
