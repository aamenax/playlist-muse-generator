
import React from 'react';
import { Disc3 } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full mb-8 text-center">
      <div className="flex items-center justify-center mb-2">
        <Disc3 className="w-8 h-8 text-primary mr-2 animate-pulse-slow" />
        <h1 className="text-3xl font-bold tracking-tight">PlaylistMuse</h1>
      </div>
      <p className="text-muted-foreground">
        Generate creative playlist names powered by AI
      </p>
    </header>
  );
};

export default Header;
