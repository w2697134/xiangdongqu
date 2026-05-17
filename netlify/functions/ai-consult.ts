import type { Config } from "@netlify/functions";

type ChatMessage = {
  role?: string;
  content?: string;
};

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const apiKey = Netlify.env.get("DEEPSEEK_API_KEY") || Netlify.env.get("AI_API_KEY");
  const baseUrl = (Netlify.env.get("AI_API_BASE_URL") || "https://api.deepseek.com").replace(/\/$/, "");
  const model = Netlify.env.get("AI_MODEL") || "deepseek-chat";

  if (!apiKey) {
    return jsonResponse({ error: "未配置 DEEPSEEK_API_KEY。" }, 500);
  }

  try {
    const payload = (await req.json()) as { messages?: ChatMessage[] };
    const messages = (payload.messages ?? [])
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
        role: message.role,
        content: String(message.content ?? "").trim(),
      }))
      .filter((message) => message.content);

    if (!messages.length) {
      return jsonResponse({ error: "请输入咨询内容。" }, 400);
    }

    const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });

    const result = (await apiResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!apiResponse.ok) {
      return jsonResponse({ error: result.error?.message ?? "AI 接口请求失败。" }, apiResponse.status);
    }

    return jsonResponse({ content: result.choices?.[0]?.message?.content ?? "" });
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "智能咨询接口异常。" }, 500);
  }
};

export const config: Config = {
  path: "/api/ai-consult",
};
