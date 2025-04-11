
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Playlist Names</h2>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {playlistNames.map((name, index) => (
          <Card key={index} className="playlist-card bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <Music className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(name)}
                className="opacity-50 hover:opacity-100"
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
