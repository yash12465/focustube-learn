import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, MessageSquare, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TranscriptPanelProps {
  videoId: string;
}

interface TranscriptData {
  videoId: string;
  title: string;
  description: string;
  hasCaptions: boolean;
  captionTracks?: Array<{
    language: string;
    name: string;
    trackKind: string;
  }>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const TranscriptPanel = ({ videoId }: TranscriptPanelProps) => {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [askingAI, setAskingAI] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (videoId) {
      fetchTranscript();
    }
  }, [videoId]);

  const fetchTranscript = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-transcript', {
        body: { videoId }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Note",
          description: data.error,
          variant: "default"
        });
      }

      setTranscript(data);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transcript",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: question };
    setChatMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setAskingAI(true);

    try {
      const { data, error } = await supabase.functions.invoke('transcript-ai-chat', {
        body: { 
          question,
          transcript,
          conversationHistory: chatMessages
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.answer 
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking AI:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setAskingAI(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Transcript & AI Search</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : transcript ? (
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-semibold mb-2">{transcript.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{transcript.description}</p>
              
              {transcript.hasCaptions && transcript.captionTracks && (
                <div className="text-xs text-muted-foreground">
                  Available captions: {transcript.captionTracks.map(t => t.language).join(', ')}
                </div>
              )}
            </div>

            {chatMessages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4" />
                  AI Conversation
                </div>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary/10 ml-4'
                        : 'bg-secondary/50 mr-4'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 opacity-70">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Load a video to see transcript</p>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about this video..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !askingAI && askQuestion()}
            disabled={!transcript || askingAI}
          />
          <Button
            onClick={askQuestion}
            disabled={!transcript || !question.trim() || askingAI}
            size="icon"
          >
            {askingAI ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
