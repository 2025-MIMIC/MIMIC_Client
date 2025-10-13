export async function generateText(prompt) {
  try {
    const res = await fetch("http://localhost:3001/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    console.log("📦 받은 데이터:", data);

    // ✅ Gemini API 응답 구조
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "응답을 생성할 수 없습니다.";

    return aiText;
  } catch (error) {
    console.error("❌ generateText 에러:", error);
    return "오류가 발생했습니다.";
  }
}