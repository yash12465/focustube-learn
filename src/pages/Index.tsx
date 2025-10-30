import { useState, useEffect } from "react";
import { Search, Play, FileText, Focus, GraduationCap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { VideoCard } from "@/components/VideoCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { query: searchQuery, maxResults: 12 }
      });

      if (error) throw error;

      setVideos(data.videos || []);
      
      if (data.videos.length === 0) {
        toast({
          title: "No results",
          description: "No educational videos found for your search.",
        });
      }
    } catch (error) {
      console.error('Error searching videos:', error);
      toast({
        title: "Error",
        description: "Failed to search videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const loadDefaultVideos = async () => {
    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { query: 'educational tutorial', maxResults: 12 }
      });

      if (error) throw error;
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading default videos:', error);
    } finally {
      setSearching(false);
    }
  };

  // Load default educational videos on mount
  useEffect(() => {
    loadDefaultVideos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-16 px-4">
        <div className="absolute inset-0 bg-grid-white/10" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' 
        }} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              FocusTube
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
              Distraction-Free Educational YouTube
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              Watch educational content without distractions. Get transcripts. Stay focused on learning.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search educational videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  disabled={searching}
                />
                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  disabled={searching}
                >
                  {searching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Video Results Section */}
      {(videos.length > 0 || searching) && (
        <section className="py-12 px-4 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {hasSearched && searchQuery ? `Results for "${searchQuery}"` : 'Educational Videos'}
            </h2>
            {searching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    description={video.description}
                    thumbnail={video.thumbnail}
                    channelTitle={video.channelTitle}
                    viewCount={video.viewCount}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/10 to-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why FocusTube?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Focus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Zero Distractions</h3>
              <p className="text-muted-foreground">
                Clean interface with no comments, recommendations, or ads. Just pure educational content.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Video Transcripts</h3>
              <p className="text-muted-foreground">
                Access full transcripts with timestamps. Search, review, and learn at your own pace.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Education First</h3>
              <p className="text-muted-foreground">
                Designed specifically for learners who want to stay focused on educational content.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Specific Video in Mind?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Paste any YouTube URL to watch with transcripts and AI assistance.
          </p>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate("/watch")}
          >
            <Play className="h-5 w-5" />
            Watch Your Video
          </Button>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Index;
