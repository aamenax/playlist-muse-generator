
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PlaylistForm from '@/components/PlaylistForm';
import PlaylistResults from '@/components/PlaylistResults';
import ApiKeyInput from '@/components/ApiKeyInput';
import { generatePlaylistNames } from '@/services/openaiService';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const [playlistNames, setPlaylistNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInputs, setLastInputs] = useState({ mood: '', genre: '', theme: '' });
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  // Load API key from localStorage on initial render
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleGenerate = async (mood: string, genre: string, theme: string) => {
    setIsLoading(true);
    setLastInputs({ mood, genre, theme });
    
    try {
      const names = await generatePlaylistNames(mood, genre, theme);
      setPlaylistNames(names);
    } catch (error) {
      console.error('Error generating playlist names:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate playlist names. Please try again or check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (lastInputs.mood && lastInputs.genre && lastInputs.theme) {
      await handleGenerate(lastInputs.mood, lastInputs.genre, lastInputs.theme);
    }
  };

  return (
    <div className="music-pattern min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-background rounded-lg shadow-lg p-6 relative">
        <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        <Header />
        <PlaylistForm 
          onGenerate={handleGenerate} 
          isLoading={isLoading} 
          onRegenerate={handleRegenerate}
          hasResults={playlistNames.length > 0}
        />
        <PlaylistResults playlistNames={playlistNames} />
      </div>
    </div>
  );
};

export default Index;
