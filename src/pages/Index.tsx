import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, FileText, Focus, GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/10" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' 
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
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-lg px-8 py-6 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500"
              onClick={() => navigate("/watch")}
            >
              <Play className="h-5 w-5" />
              Start Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
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
          <h2 className="text-3xl font-bold mb-4">Ready to Focus on Learning?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start watching educational videos without distractions today.
          </p>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => navigate("/watch")}
          >
            <Play className="h-5 w-5" />
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
