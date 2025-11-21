import { Card } from "@/components/ui/card";
import { Play, Eye } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
  onClick?: (id: string) => void;
}

export const VideoCard = ({ 
  id, 
  title, 
  description, 
  thumbnail, 
  channelTitle,
  viewCount,
  onClick
}: VideoCardProps) => {
  const formatViews = (views: string) => {
    const num = parseInt(views);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary rounded-full p-4">
              <Play className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{channelTitle}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="h-3 w-3" />
          <span>{formatViews(viewCount)} views</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {description}
        </p>
      </div>
    </Card>
  );
};
