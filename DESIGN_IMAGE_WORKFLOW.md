# 设计与图片生成会话工作流

用途：给专门负责平面设计、UI 视觉、图片生成的会话使用。该会话可以频繁更换，因为图片多了容易卡顿；但所有重要结论必须回写成文字，不能只留在聊天里。

## 会话分工

项目建议拆成四类会话：

1. 总控会话
   - 负责项目方向、需求判断、阶段验收、沉淀文档。
   - 不长期塞大量截图和生成图。

2. 代码会话
   - 负责写代码、跑项目、修错误。
   - 每次先读 `CODE_SESSION_BRIEF.md`、`XIANGDONGQU_PLAN.md` 和当前阶段验收文件。

3. 设计/图片生成会话
   - 负责生成视觉素材、首页背景图、栏目封面、图标风格、UI 视觉建议。
   - 可以用图片生成工具。
   - 硬性要求：它只作为调度者，必须派子智能体/worker 实际生成图片、保存文件、更新清单。
   - 主设计会话不要把生成图直接堆在聊天框，只汇报路径、用途和采用建议。
   - 图片多了可以换新会话。
   - 不能作为资料来源的唯一记忆。

4. 内容整理会话，可选
   - 如果后续需要大量整理旧网站资料、新闻、图片标题、文献目录，可以单独开。
   - 但整理结果必须写进项目文件，例如 `CONTENT_INVENTORY.md`，不能只留在聊天里。

## 设计会话职责

设计会话只负责：

- 生成项目视觉方向
- 生成首页主视觉图
- 生成栏目封面图
- 生成视频封面占位图
- 生成资料库封面图
- 生成 UI 风格建议
- 看截图并给修改建议
- 输出可直接发给代码会话的修改指令
- 把最终采用的图片资产保存到项目文件夹
- 维护图片资产清单

设计会话不负责：

- 保存长期项目记忆
- 判断产品阶段
- 写完整代码
- 收集全部资料
- 决定数据库结构

## 图片不要堆在聊天里

为了避免设计会话因为图片太多变卡，默认规则是：

- 聊天里不要连续展示大量生成图
- 每次先生成提示词和用途，不急着出图
- 确认方向后再生成图片
- 最终采用的图片要保存到项目目录
- 聊天里只汇报文件路径、用途、尺寸、提示词
- 如果工具只能把图片显示在聊天里，最多展示 1 到 2 张用于确认方向，然后尽快把可用图片保存到项目文件夹
- 硬性要求：设计会话不要亲自生成图片，而是让子智能体生成图片、保存文件、更新清单。设计会话只接收文件路径和使用建议。

推荐保存目录：

```text
C:/Users/admin/Documents/New project 13/design-assets/generated
```

如果代码项目已经建立，也要同步复制到：

```text
C:/Users/admin/Documents/New project 13/public/generated
```

## 图片文件命名

使用英文小写和短横线，方便代码引用：

```text
hero-xiangdongqu-canal.png
cover-digital-guide.png
cover-history-archive.png
cover-spirit.png
cover-era-value.png
cover-news.png
cover-video.png
cover-old-photos.png
cover-old-objects.png
cover-documents.png
```

## 图片资产清单

设计会话每生成或采用一张图，都要更新或输出一条清单记录。

建议维护文件：

```text
C:/Users/admin/Documents/New project 13/DESIGN_ASSET_MANIFEST.md
```

每条记录格式：

```text
## hero-xiangdongqu-canal.png

- 用途：首页主视觉
- 页面：首页
- 建议尺寸：1920x1080
- 文件位置：C:/Users/admin/Documents/New project 13/design-assets/generated/hero-xiangdongqu-canal.png
- 代码引用：/generated/hero-xiangdongqu-canal.png
- 提示词：……
- 备注：……
```

## 生成图片时的硬性要求

设计会话如果要生成图片，必须按这个流程：

1. 先列出要生成的图片清单
2. 先给提示词，不直接批量生成
3. 用户确认后，每次最多处理 1 到 3 张
4. 必须派子智能体实际调用图片生成工具
5. 子智能体负责保存图片到项目文件夹
6. 子智能体负责更新 `DESIGN_ASSET_MANIFEST.md`
7. 设计会话只汇报路径和使用建议
8. 如果设计会话不能派子智能体，也不能调用图片生成工具，必须停止并说明，不能假装生成

## 子智能体生成图片流程

设计 UI 会话不要把大量图片直接生成在自己的聊天框里。它应该把生成任务交给子智能体。

设计会话给子智能体的任务格式：

```text
你是图片生成与落地 worker。

请读取：
C:/Users/admin/Documents/New project 13/IMAGEGEN_EXECUTION_BRIEF.md
C:/Users/admin/Documents/New project 13/DESIGN_ASSET_MANIFEST.md
C:/Users/admin/Documents/New project 13/UI_VISUAL_STANDARD.md

任务：
按 manifest 中的提示词生成指定图片，并保存到：
C:/Users/admin/Documents/New project 13/design-assets/generated

如果代码项目目录存在，也同步复制到：
C:/Users/admin/Documents/New project 13/public/generated

要求：
1. 你负责实际调用图片生成工具
2. 不要只创建空文件
3. 不要只写 manifest
4. 每次最多生成 1 到 3 张
5. 生成后更新 DESIGN_ASSET_MANIFEST.md
6. 最终只回复文件路径、代码引用路径、用途、是否成功保存

本轮生成：
- hero-xiangdongqu-canal.png
- cover-history-archive.png
- cover-digital-guide.png
```

设计会话收到子智能体结果后，只需要把路径和使用建议转给用户，不要重复展示所有图片。

如果无法直接保存图片到文件夹，要明确说明限制，并改成：

1. 只生成少量预览图
2. 用户确认采用哪张
3. 再让代码会话或总控会话处理文件落地

## 图片生成方向

项目主题：向东渠事迹数字馆新版原型。

视觉关键词：

- 红色文化
- 水利工程
- 人工长河
- 历史档案
- 数字展馆
- 闽南地方文化
- 稳重
- 现代
- 纪实感

避免：

- 二次元风
- 游戏风
- 赛博朋克
- 纯科技蓝大屏
- 过度炫光
- 廉价模板感
- 与真实历史主题冲突的夸张画面

## 建议生成的图片资产

第一批可生成：

- 首页主视觉背景图
- 数字导览栏目封面
- 历史资料栏目封面
- 精神内涵栏目封面
- 时代价值栏目封面
- 资讯动态栏目封面
- 视频展播栏目封面
- 老照片资料库占位图
- 老物件资料库占位图
- 旧文献资料库占位图

图片要偏“可用于 UI 的背景/封面”，不要生成难以落地的海报。

## 设计会话每次开始提示词

```text
你是“向东渠事迹数字馆新版原型”的平面设计和图片生成顾问。

请先读取：
C:/Users/admin/Documents/New project 13/DESIGN_IMAGE_WORKFLOW.md
C:/Users/admin/Documents/New project 13/IMAGEGEN_EXECUTION_BRIEF.md
C:/Users/admin/Documents/New project 13/UI_VISUAL_STANDARD.md
C:/Users/admin/Documents/New project 13/XIANGDONGQU_PLAN.md
C:/Users/admin/Documents/New project 13/CONTENT_DIRECTION.md

你的任务是帮我生成和规划 UI 所需视觉资产，不负责写代码，不负责长期保存资料。

这个项目按作品级标准做。只要生成图片能明显提升 Logo、主视觉、栏目封面、视频封面、资料库封面、后台视觉的质感，就应该纳入生成计划。但真实历史照片、文献扫描件、准确中文文字不能用生成图冒充或硬生成。

老板后续要提供真实素材的位置，统一做“待放/待上传”占位，不要用生成图冒充真实照片、视频或文献。

设计方向：
稳重、现代、红色文化、水利工程、历史资料、数字展馆、纪实感。

避免：
普通博客风、普通公司官网风、二次元风、游戏风、纯科技蓝大屏、过度炫光。

当我要求生成图片时，请优先生成适合网页 UI 使用的横版封面、背景图、栏目图，而不是独立海报。

每次输出请包含：
1. 图片用途
2. 生成提示词
3. 适合放在哪个页面
4. 给代码会话的使用建议
5. 如果已经生成图片，必须给出本地文件路径和代码引用路径
```

## 重要原则

资料收集和图片生成要分开。

设计会话可以参考内容方向，但不要让设计会话承担资料库职责。真正重要的资料、栏目、文案、素材清单，要由总控会话或内容整理会话写入项目 Markdown 文件。
