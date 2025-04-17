/**
 * Calls the Gemini API with a prompt and returns the response with a confidence score
 * @param {string} prompt - The user's message/question
 * @returns {Promise<{response: string, confidence: number}>} - Response text and confidence score
 */
export async function getGeminiResponse(prompt) {
  const API_KEY = "AIzaSyAtlpFbcYWA3WsjK334iJXWK7V0vg5QtNQ"; // Your API key
  // Update the model name to a simpler version
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

  try {
    console.log("Calling Gemini API with prompt:", prompt);
    
    // Updated request body to match the API structure
    const requestData = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.8,
        topK: 40
      }
    };

    // Make the API call
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed:", response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    // Parse the response
    const data = await response.json();
    console.log("API response:", data);
    
    // Extract the text from the API response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    
    // Calculate simple confidence (since we're not using the old function)
    const confidence = 80; // Default high confidence

    return {
      response: text,
      confidence: confidence
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return a fallback response
    return {
      response: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
      confidence: 30
    };
  }
}