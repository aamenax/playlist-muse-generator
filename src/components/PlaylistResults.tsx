
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
    "from-violet-500 to-purple-800",
    "from-pink-500 to-purple-800",
    "from-indigo-500 to-cyan-800",
    "from-fuchsia-500 to-indigo-800",
    "from-amber-500 to-pink-800",
    "from-green-500 to-blue-800",
    "from-rose-500 to-indigo-800",
    "from-blue-500 to-violet-800",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Playlist Names</h2>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {playlistNames.map((name, index) => (
          <Card 
            key={index} 
            className={`playlist-card overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]} border-none shadow-md shadow-accent/10 hover:scale-[1.02] transition-all duration-200`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mr-3 animate-pulse-slow">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white">{name}</span>
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
