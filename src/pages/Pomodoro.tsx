import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: any = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            completeSession();
            toast({
              title: "Pomodoro Complete!",
              description: "Great work! Take a break.",
            });
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const startSession = async () => {
    if (!isActive) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("pomodoro_sessions")
          .insert({
            user_id: user.id,
            duration_minutes: 25,
            task_name: taskName || "Focus Session",
          })
          .select()
          .single();

        if (!error && data) {
          setSessionId(data.id);
        }
      }
    }
    setIsActive(!isActive);
  };

  const completeSession = async () => {
    if (sessionId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("pomodoro_sessions")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        // Award points
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ total_points: profile.total_points + 10 })
            .eq("user_id", user.id);

          await supabase
            .from("achievements")
            .insert({
              user_id: user.id,
              achievement_type: "pomodoro",
              achievement_name: "Focus Master",
              description: "Completed a Pomodoro session",
              points_earned: 10,
            });
        }
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setSessionId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Pomodoro Timer</h1>
            <p className="text-muted-foreground">
              Focus for 25 minutes, then take a break
            </p>
          </div>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-7xl font-bold text-primary">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>

              <Input
                type="text"
                placeholder="What are you working on?"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                disabled={isActive}
              />

              <div className="flex gap-4 justify-center">
                <Button onClick={startSession} size="lg">
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="lg">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
