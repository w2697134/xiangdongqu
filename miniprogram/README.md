# 向东渠事迹数字馆小程序

这是原生微信小程序版本，独立于现有 PC/H5 React 项目。

## 打开方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本目录：`C:\Users\admin\Documents\xiangdongqu\miniprogram`。
4. AppID 使用当前项目配置：`wx0145a11c0a0fc399`。

## 说明

- `AppSecret` 不在小程序代码里，也不应该放进小程序前端。
- 当前素材已压缩到 `assets` 目录，小程序源码包约 740KB，满足主包 2MB 以内的上传要求。
- 智能咨询请求使用正式站服务地址：
  `https://dreamlab.website/api/ai-consult`
- 当前 AppID 的 request 合法域名需包含：`https://dreamlab.website`。

## 发布流程

- 用开发者工具上传版本。
- 在微信公众平台设置体验版，确认智能咨询、栏目导览和底部导航正常。
- 确认体验版无误后提交审核和发布。
