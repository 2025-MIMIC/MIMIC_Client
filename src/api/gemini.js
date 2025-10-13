export async function generateText(prompt) {
  try {
    const res = await fetch("http://localhost:3001/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    console.log("get data:", data);

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "응답을 생성할 수 없습니다.";

    return aiText;
  } catch (error) {
    console.error("generateText error:", error);
    return "오류가 발생했습니다.";
  }
}