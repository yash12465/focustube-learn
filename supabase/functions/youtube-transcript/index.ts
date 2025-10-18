import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOUTUBE_API_KEY = 'AIzaSyDjgaKM1IODWJ6SlKIU0X71cHfM69GgbWg';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();
    
    if (!videoId) {
      throw new Error('Video ID is required');
    }

    console.log('Fetching transcript for video:', videoId);

    // Get video details first
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const videoData = await videoResponse.json();
    
    if (!videoData.items || videoData.items.length === 0) {
      throw new Error('Video not found');
    }

    // Get captions list
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!captionsResponse.ok) {
      throw new Error('Failed to fetch captions');
    }

    const captionsData = await captionsResponse.json();
    console.log('Captions data:', captionsData);

    if (!captionsData.items || captionsData.items.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No captions available for this video',
          transcript: []
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // For now, return caption track info since downloading requires OAuth
    // We'll use the video metadata instead
    const transcript = {
      videoId,
      title: videoData.items[0].snippet.title,
      description: videoData.items[0].snippet.description,
      hasCaptions: true,
      captionTracks: captionsData.items.map((item: any) => ({
        language: item.snippet.language,
        name: item.snippet.name,
        trackKind: item.snippet.trackKind
      }))
    };

    return new Response(
      JSON.stringify(transcript),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
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
