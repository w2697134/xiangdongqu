import type { IncomingMessage, ServerResponse } from "node:http";
import { buildConsultMessages, hasUserConsultMessage, type RawConsultMessage } from "../netlify/functions/consult-agent";

const MAX_BODY_SIZE = 32_000;

function sendJson(res: ServerResponse, payload: unknown, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readJsonBody(req: IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > MAX_BODY_SIZE) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, { error: "Method not allowed." }, 405);
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY;
  const baseUrl = (process.env.AI_API_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "deepseek-chat";

  if (!apiKey) {
    sendJson(res, { error: "智能讲解服务暂时繁忙，请稍后再试。" }, 500);
    return;
  }

  try {
    const payload = (await readJsonBody(req)) as { messages?: RawConsultMessage[] };

    if (!hasUserConsultMessage(payload.messages)) {
      sendJson(res, { error: "请输入咨询内容。" }, 400);
      return;
    }

    const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: buildConsultMessages(payload.messages),
        temperature: 0.25,
        max_tokens: 720,
        stream: false,
      }),
    });

    const result = (await apiResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (!apiResponse.ok) {
      sendJson(res, { error: "智能讲解服务暂时繁忙，请稍后再试。" }, apiResponse.status);
      return;
    }

    sendJson(res, { content: result.choices?.[0]?.message?.content ?? "" });
  } catch {
    sendJson(res, { error: "智能讲解服务暂时繁忙，请稍后再试。" }, 500);
  }
}
