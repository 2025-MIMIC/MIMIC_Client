export async function generateText(prompt) {
  try {
    const res = await fetch("http://localhost:3001/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    //fetch api
    // 로컬 프록시 서버(localhost:3001)에 POST 요청
    // JSON 형태로 prompt 전달
    // Content-Type: application/json → 서버에서 JSON 파싱 ㄱㄴ
    const data = await res.json();
    console.log("get data:", data);

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      //옵셔널 체이닝(?.) 사용 → undefined 방지
      "응답을 생성할 수 없습니다.";

    return aiText;
  } catch (error) {
    console.error("generateText error:", error);
    return "오류가 발생했습니다.";
  }
}