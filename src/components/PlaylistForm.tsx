
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PlaylistFormProps {
  onGenerate: (mood: string, genre: string, theme: string) => Promise<void>;
  isLoading: boolean;
  onRegenerate: () => Promise<void>;
  hasResults: boolean;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  onGenerate,
  isLoading,
  onRegenerate,
  hasResults
}) => {
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [theme, setTheme] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mood.trim() || !genre.trim() || !theme.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to generate playlist names.",
        variant: "destructive",
      });
      return;
    }
    
    await onGenerate(mood, genre, theme);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="space-y-2">
        <Label htmlFor="mood">Mood</Label>
        <Input
          id="mood"
          placeholder="e.g., happy, sad, nostalgic"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="bg-secondary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          placeholder="e.g., pop, lo-fi, rock"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-secondary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="theme">Theme or Occasion</Label>
        <Input
          id="theme"
          placeholder="e.g., heartbreak, road trip, gym workout"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-secondary"
        />
      </div>
      
      <div className="flex space-x-3">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Playlist Names'
          )}
        </Button>
        
        {hasResults && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onRegenerate} 
            disabled={isLoading} 
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default PlaylistForm;
