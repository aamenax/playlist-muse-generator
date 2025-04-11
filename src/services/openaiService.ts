
const API_KEY = ""; // This should be handled securely in a real app

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const generatePlaylistNames = async (mood: string, genre: string, theme: string): Promise<string[]> => {
  if (!API_KEY) {
    // Return placeholder data for demo since we don't have a real API key
    console.log("Using placeholder data since no API key is provided");
    return [
      `${mood.charAt(0).toUpperCase() + mood.slice(1)} ${genre} Rhythms: ${theme}`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} Waves in ${genre}`,
      `${mood.charAt(0).toUpperCase() + mood.slice(1)} Hours: ${theme} Sessions`,
      `${genre.charAt(0).toUpperCase() + genre.slice(1)} Dreams & ${theme} Memories`,
      `${theme.charAt(0).toUpperCase() + theme.slice(1)} Vibes: ${mood} ${genre} Mix`
    ];
  }

  // Construct the prompt
  const prompt = `Generate 5 unique and aesthetic playlist names for a ${mood} playlist in the ${genre} genre, themed around ${theme}. The names should be creative, catchy, and suitable for music streaming platforms. Return ONLY the 5 names as a JSON array of strings without any additional text or explanation.`;

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
              content: "You are a creative assistant that generates aesthetic playlist names. Only return a JSON array of 5 playlist name strings without any additional text."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
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
