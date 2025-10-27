import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, transcript, conversationHistory = [] } = await req.json();
    
    if (!question) {
      throw new Error('Question is required');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable AI API key not configured');
    }

    console.log('Processing question:', question);

    // Build context from transcript
    const transcriptContext = transcript 
      ? `Video Transcript:\n${JSON.stringify(transcript, null, 2)}\n\n`
      : '';

    const systemPrompt = `You are a helpful AI assistant that answers questions about YouTube video content. 
${transcriptContext}
Provide clear, accurate answers based on the video information provided. If the information isn't in the transcript, say so.`;

    // Build messages array with conversation history
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: question }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', errorText);
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ answer }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in transcript-ai-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
