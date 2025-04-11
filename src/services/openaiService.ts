
const API_KEY = ""; // This should be handled securely in a real app

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const generatePlaylistNames = async (mood: string, genre: string, theme: string): Promise<string[]> => {
  if (!API_KEY) {
    // Return enhanced Gen-Z style placeholder data since we don't have a real API key
    console.log("Using placeholder data since no API key is provided");
    return [
      `${mood} ${genre} vibez ~ ${theme} edition`,
      `${theme} era // ${mood} ${genre} collective`,
      `not ur average ${genre} :: ${mood} ${theme} feels`,
      `${mood} ${genre} maincharacter energy (${theme})`,
      `${theme} dreamcore + ${mood} ${genre} therapy`
    ];
  }

  // Construct an improved Gen-Z focused prompt
  const prompt = `Generate 5 extremely unique and aesthetic playlist names for a ${mood} playlist in the ${genre} genre, themed around ${theme}. 

The names should be creative, modern, and appeal specifically to Gen-Z aesthetic. 

Use stylistic elements like:
- Lowercase styling
- Special characters (~ // :: + *)
- Emotional or evocative phrases
- Internet slang and current Gen-Z terminology
- Nostalgic or dreamcore concepts
- Unexpected word combinations
- Parentheses or brackets for artistic effect

Return ONLY the 5 names as a JSON array of strings without any additional text or explanation.`;

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
              content: "You are a creative assistant that specializes in generating Gen-Z aesthetic playlist names with unique stylization. Only return a JSON array of 5 playlist name strings without any additional text."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.9,
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
