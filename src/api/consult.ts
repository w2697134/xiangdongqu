export type ConsultMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function sendConsultMessage(messages: ConsultMessage[]) {
  const response = await fetch("/api/ai-consult", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  let payload: { content?: string; error?: string } = {};

  try {
    const contentType = response.headers.get("content-type") ?? "";
    payload = contentType.includes("application/json")
      ? ((await response.json()) as { content?: string; error?: string })
      : { error: await response.text() };
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error ?? "智能讲解服务暂时繁忙，请稍后再试");
  }

  return payload.content ?? "";
}
