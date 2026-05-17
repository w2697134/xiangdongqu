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

  const payload = (await response.json()) as { content?: string; error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "智能咨询接口暂时不可用");
  }

  return payload.content ?? "";
}
