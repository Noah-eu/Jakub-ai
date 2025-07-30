export async function askJakub(question: string, history: {sender: string, text: string}[]) {
  const response = await fetch("/api/askJakub", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history })
  });

  if (!response.ok) throw new Error("API error");

  const data = await response.json();
  return data.answer;
}
