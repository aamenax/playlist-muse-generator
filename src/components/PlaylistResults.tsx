
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PlaylistResultsProps {
  playlistNames: string[];
}

const PlaylistResults: React.FC<PlaylistResultsProps> = ({ playlistNames }) => {
  const { toast } = useToast();

  if (playlistNames.length === 0) {
    return null;
  }

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({
      title: "Copied to clipboard",
      description: `"${name}" has been copied to your clipboard.`,
    });
  };

  // Enhanced array of aesthetic gradient backgrounds for Gen-Z vibes
  const gradients = [
    "from-violet-500 to-fuchsia-400",
    "from-rose-400 to-orange-300",
    "from-cyan-400 to-blue-500", 
    "from-emerald-400 to-cyan-400",
    "from-pink-500 to-rose-300",
    "from-amber-300 to-pink-500",
    "from-indigo-600 to-violet-400",
    "from-teal-300 to-emerald-500",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight mb-4">Your Vibe Collection ✨</h2>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {playlistNames.map((name, index) => (
          <Card 
            key={index} 
            className={`playlist-card overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]} border-none shadow-lg shadow-accent/20 hover:scale-[1.03] transition-all duration-200`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3 animate-pulse">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white drop-shadow-md">{name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(name)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlaylistResults;
