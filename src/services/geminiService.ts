export async function analyzeMedia(fileInfo: { name: string, type: string }) {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileInfo),
    });
    
    if (!res.ok) {
      throw new Error("Failed to analyze media");
    }
    
    const data = await res.json();
    return data.plan;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Intelligence service currently unavailable. Please check your connection.";
  }
}
