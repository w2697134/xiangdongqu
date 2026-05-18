# 向东渠项目阿里云服务器部署记忆

更新日期：2026-05-18  
主记忆路径：`C:\Users\admin\.codex\memories\xiangdongqu-aliyun-server.md`  
项目副本路径：`C:\Users\admin\Documents\xiangdongqu\SERVER_DEPLOYMENT_ALIYUN.md`

这份文档记录“向东渠事迹数字馆”当前阿里云正式服务器状态。任何新会话只要涉及该项目的阿里云服务器、域名、HTTPS、systemd、线上部署、接口验证，都应先读取本文件。修改服务器、DNS、证书、部署脚本、服务配置后，必须同步修订本文件和 `.codex` 里的主记忆文件。

## 当前结论

- 正式访问域名：`https://dreamlab.website/`
- WWW 域名：`https://www.dreamlab.website/`
- 阿里云服务器公网 IP：`47.100.192.144`
- 正式部署位置：`/www/wwwroot/xiangdongqu`
- 正式服务：systemd `xiangdongqu`
- HTTP：Node 直接监听 `0.0.0.0:80`
- HTTPS：Node 直接监听 `0.0.0.0:443`
- 证书：Let's Encrypt，路径 `/etc/letsencrypt/live/dreamlab.website/`
- 证书到期：`2026-08-16`
- 当前正式域名已经不再指向 Vercel。

## 服务器信息

```text
Provider: Alibaba Cloud
Product: Lightweight Application Server
Region: Shanghai
Public IP: 47.100.192.144
OS: Alibaba Cloud Linux 3 (OpenAnolis Edition)
Login user observed in Workbench: admin
Project path: /www/wwwroot/xiangdongqu
```

宝塔面板仍存在：

```text
Panel URL: http://47.100.192.144:8888/login
Terminal page: http://47.100.192.144:8888/xterm
```

不要在文档或聊天中输出宝塔密码、DeepSeek API Key、Git 凭证或任何真实密钥。

## 代码仓库

```text
Local workspace: C:\Users\admin\Documents\xiangdongqu
Server workspace: /www/wwwroot/xiangdongqu
Branch: main
Remote: https://github.com/w2697134/xiangdongqu.git
Latest deployment commit at time of this document: 31c5d08 Add self-hosted HTTPS support
```

正式服务器通过 GitHub 拉取代码。推送本地 `main` 后，服务器不会自动更新，需要进入服务器执行拉取、安装、构建和重启。

## Node 自托管服务

关键文件：

```text
server/index.ts
tsconfig.server.json
server-dist/server/index.js
package.json
```

关键脚本：

```bash
npm run build:self-host
npm run start
```

`server/index.ts` 当前行为：

- 静态托管 `dist`
- SPA fallback 到 `dist/index.html`
- 处理 `POST /api/ai-consult`
- HTTP 使用 `node:http`
- HTTPS 使用 `node:https`
- 当配置 `HTTPS_PORT`、`SSL_CERT_PATH`、`SSL_KEY_PATH` 时，同时启动 HTTPS 服务

## systemd 服务

服务名：

```text
xiangdongqu
```

服务文件：

```text
/etc/systemd/system/xiangdongqu.service
```

当前服务内容要点：

```ini
[Unit]
Description=xiangdongqu digital museum
After=network.target

[Service]
Type=simple
WorkingDirectory=/www/wwwroot/xiangdongqu
EnvironmentFile=/www/wwwroot/xiangdongqu/.env
ExecStart=/usr/bin/node /www/wwwroot/xiangdongqu/server-dist/server/index.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

常用命令：

```bash
sudo systemctl status xiangdongqu --no-pager
sudo systemctl restart xiangdongqu
sudo journalctl -u xiangdongqu -n 80 --no-pager
ss -lntp | grep -E ':80|:443'
```

正常监听应看到：

```text
0.0.0.0:80
0.0.0.0:443
```

## 环境变量

服务器环境文件：

```text
/www/wwwroot/xiangdongqu/.env
```

已配置变量名：

```text
HOST=0.0.0.0
PORT=80
HTTPS_PORT=443
SSL_CERT_PATH=/etc/letsencrypt/live/dreamlab.website/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/dreamlab.website/privkey.pem
DEEPSEEK_API_KEY=<do not print>
AI_API_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
```

修改 `.env` 前先备份，例如：

```bash
cd /www/wwwroot/xiangdongqu
sudo cp .env .env.bak-$(date +%Y%m%d%H%M%S)
```

## DNS 状态

阿里云 DNS 控制台中 `dreamlab.website` 当前解析：

```text
@     A     47.100.192.144
www   A     47.100.192.144
TTL: 10 minutes
```

权威 DNS：

```text
dns21.hichina.com
dns22.hichina.com
```

已验证：

```text
dreamlab.website -> 47.100.192.144
www.dreamlab.website -> 47.100.192.144
```

如果刚修改 DNS，本机或运营商 DNS 可能缓存旧值，通常等 10 到 30 分钟。验证时优先查权威 DNS 或阿里公共 DNS：

```powershell
nslookup dreamlab.website dns21.hichina.com
nslookup dreamlab.website 223.5.5.5
nslookup www.dreamlab.website 223.5.5.5
```

## HTTPS 证书

证书工具：

```text
certbot
```

安装命令曾使用：

```bash
sudo dnf install -y certbot
```

证书申请命令曾使用：

```bash
sudo certbot certonly --webroot \
  -w /www/wwwroot/xiangdongqu/dist \
  -d dreamlab.website \
  -d www.dreamlab.website \
  --register-unsafely-without-email \
  --agree-tos \
  --non-interactive
```

证书路径：

```text
/etc/letsencrypt/live/dreamlab.website/fullchain.pem
/etc/letsencrypt/live/dreamlab.website/privkey.pem
```

续期后重启 hook：

```text
/etc/letsencrypt/renewal-hooks/deploy/restart-xiangdongqu.sh
```

hook 内容：

```sh
#!/bin/sh
systemctl restart xiangdongqu
```

原因：Node 进程启动时读取证书文件。证书续期后需要重启服务，才能加载新证书。

## 正式部署步骤

在本地修改并推送：

```powershell
git status --short
npm run build:self-host
git add <changed-files>
git commit -m "<message>"
git push origin main
```

在服务器更新正式站点：

```bash
sudo git config --global --add safe.directory /www/wwwroot/xiangdongqu
sudo git -C /www/wwwroot/xiangdongqu pull --ff-only
cd /www/wwwroot/xiangdongqu
sudo npm ci
sudo npm run build:self-host
sudo systemctl restart xiangdongqu
```

注意：

- `/www/wwwroot/xiangdongqu` 目录当前需要 `sudo` 才能写。
- Git 可能提示 dubious ownership，已用 `safe.directory` 处理。
- 不要用 `git reset --hard`，除非用户明确要求。

## 验证命令

DNS：

```powershell
nslookup dreamlab.website
nslookup www.dreamlab.website
nslookup dreamlab.website 223.5.5.5
```

页面：

```powershell
curl.exe --noproxy '*' -I --max-time 20 https://dreamlab.website/
curl.exe --noproxy '*' -I --max-time 20 https://www.dreamlab.website/
curl.exe --noproxy '*' -I --max-time 20 https://dreamlab.website/panorama
```

预期：

```text
HTTP/1.1 200 OK
```

AI 接口验证可用 Node 发合法 UTF-8 JSON：

```powershell
@'
const https = require('node:https');
const q = '\u8bf7\u76f4\u63a5\u56de\u7b54\uff1a\u5411\u4e1c\u6e20\u4ec0\u4e48\u65f6\u5019\u7ae3\u5de5\u901a\u6c34\uff1f\u53ea\u8bf4\u65e5\u671f\u3002';
const body = JSON.stringify({ messages: [{ role: 'user', content: q }] });
const req = https.request({
  hostname: 'dreamlab.website',
  path: '/api/ai-consult',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body)
  }
}, res => {
  let data = '';
  res.setEncoding('utf8');
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log(res.statusCode);
    console.log(data);
  });
});
req.on('error', err => {
  console.error(err);
  process.exit(1);
});
req.end(body);
'@ | node -
```

预期返回：

```text
200
{"content":"1973年3月12日。"}
```

## 已完成的关键验证

2026-05-18 已验证：

```text
https://dreamlab.website/          200 OK
https://www.dreamlab.website/      200 OK
https://dreamlab.website/panorama  200 OK
POST /api/ai-consult               200 OK
Chrome 渲染标题                    向东渠事迹数字馆
```

Chrome 渲染检查中页面为 HTTPS，正文能看到：

```text
向东渠事迹数字馆
首页
导览
智能咨询
```

## Workbench 注意事项

用户要求尽量不要用桌面控制。服务器操作优先使用 Chrome 直连 Workbench。

Workbench 里逐字符 keyDown/keyUp 可以输入简单命令，例如：

```bash
echo wbkeyinputok
```

但逐字符输入长命令时，符号如 `/`、`-`、`|`、引号可能丢失。长命令建议用 CDP `Input.insertText` 输入文本，然后单独发送 Enter。此前已验证 `Input.insertText` 在 Workbench 可用。

## Vercel 和 Netlify 状态

- Vercel 仍有历史项目和备用部署，但正式域名已经切到阿里云。
- Netlify 不再作为主部署平台。
- 不要再把 `dreamlab.website` 的 DNS 改回 Vercel，除非用户明确要求回滚。

## 小程序遗留项

`miniprogram/utils/data.js` 里如果仍有旧 Netlify 地址，应改为：

```text
https://dreamlab.website/api/ai-consult
```

微信公众平台 request 合法域名也应配置：

```text
https://dreamlab.website
https://www.dreamlab.website
```

## 维护规则

后续任何会话只要做了以下任一变更，都必须更新本文件和 `.codex` 主记忆文件：

- DNS 解析
- 服务器 IP、区域、系统、登录方式
- systemd 服务名或服务文件
- `.env` 变量名或路径
- 证书申请、续期、路径或到期时间
- Node 监听端口或反代架构
- 部署路径或部署命令
- Git 分支、远端、关键提交
- 正式验证结果

更新时不要写入任何密钥真实值。
