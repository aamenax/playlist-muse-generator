
const API_KEY = ""; // This should be handled securely in a real app

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const generatePlaylistNames = async (mood: string, genre: string, theme: string): Promise<string[]> => {
  if (!API_KEY) {
    // Return enhanced Gen-Z style placeholder data since we don't have a real API key
    console.log("Using placeholder data since no API key is provided");
    return [
      `main character ${mood} era (${genre} edition)`,
      `${theme} therapy but make it ${genre}`,
      `not ur basic ${genre} girl :: ${mood} ${theme} hours`,
      `caught in my ${mood} feels <${genre}>${theme}`,
      `${genre} brainrot // ${theme} szn`
    ];
  }

  // Construct a highly specific Gen-Z focused prompt
  const prompt = `As an extremely online, Gen-Z playlist creator for Spotify, create 5 unique playlist names that Gen-Z would actually use. 

Names should use elements like:
- lowercase aesthetic
- special characters (~ // :: + ✨ ♡)
- internet slang (core, vibe, era, brainrot, szn)
- nostalgic concepts
- ironic or self-aware phrases
- very emotional but casual vibes

EXAMPLES OF GREAT NAMES:
- "nobody knows i listen to this"
- "she's so real for that"
- "crying in the bathroom at a party"
- "scrolling till 3am"
- "pov: main character energy"
- "that one song that gets me"
- "romanticizing my life"

DO NOT CREATE GENERIC NAMES OR USE OUTDATED PHRASES!

Mood: ${mood}
Genre: ${genre}
Theme: ${theme}

Return ONLY the 5 playlist names as a JSON array of strings.`;

  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using a more cost-effective model
          messages: [
            {
              role: "system",
              content: "You are an expert at creating Gen-Z aesthetic playlist names that are extremely authentic, trendy, and current. You specifically know what playlists on Spotify and TikTok are named in 2025. ONLY return a JSON array with 5 names."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 1.0, // Increased for more creativity
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Try to parse the response as JSON, handling potential formatting issues
      try {
        // Remove any backticks and json indicators that might be in the response
        const cleanedContent = content.replace(/```json|```|\n/g, "").trim();
        return JSON.parse(cleanedContent);
      } catch (parseError) {
        // If JSON parsing fails, try to extract the names with regex
        const matches = content.match(/"([^"]+)"/g);
        if (matches && matches.length >= 5) {
          return matches.slice(0, 5).map(m => m.replace(/"/g, ""));
        }
        
        // If regex also fails, split by newlines and clean up
        const lines = content.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.startsWith('```'));
          
        if (lines.length >= 5) {
          return lines.slice(0, 5).map(line => {
            // Remove numbers, bullets, quotes, etc.
            return line.replace(/^\d+[\.\)-]?\s*|^[-•*]\s*|"|'/g, "").trim();
          });
        }
        
        throw new Error("Failed to parse playlist names from response");
      }
    } catch (error) {
      console.error("Error generating playlist names:", error);
      retries++;
      
      if (retries >= MAX_RETRIES) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  throw new Error("Failed to generate playlist names after multiple attempts");
};
