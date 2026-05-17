import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

function readJsonBody(req: import("node:http").IncomingMessage) {
  return new Promise<unknown>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 32_000) {
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

function aiConsultPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.DEEPSEEK_API_KEY || env.AI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY;
  const baseUrl = (env.AI_API_BASE_URL || process.env.AI_API_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = env.AI_MODEL || process.env.AI_MODEL || "deepseek-chat";

  return {
    name: "xiangdongqu-ai-consult",
    configureServer(server) {
      server.middlewares.use("/api/ai-consult", async (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed." }));
          return;
        }

        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "未配置 DEEPSEEK_API_KEY。" }));
          return;
        }

        try {
          const payload = (await readJsonBody(req)) as {
            messages?: Array<{ role?: string; content?: string }>;
          };
          const messages = (payload.messages ?? [])
            .filter((message) => message.role === "user" || message.role === "assistant")
            .map((message) => ({
              role: message.role,
              content: String(message.content ?? "").trim(),
            }))
            .filter((message) => message.content);

          if (!messages.length) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "请输入咨询内容。" }));
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
              messages,
              stream: false,
            }),
          });

          const result = (await apiResponse.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
            error?: { message?: string };
          };

          if (!apiResponse.ok) {
            res.statusCode = apiResponse.status;
            res.end(JSON.stringify({ error: result.error?.message ?? "AI 接口请求失败。" }));
            return;
          }

          res.end(JSON.stringify({ content: result.choices?.[0]?.message?.content ?? "" }));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : "智能咨询接口异常。" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), aiConsultPlugin(mode)],
}));
