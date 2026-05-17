# 向东渠事迹数字馆小程序

这是原生微信小程序版本，独立于现有 PC/H5 React 项目。

## 打开方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本目录：`C:\Users\admin\Documents\xiangdongqu\miniprogram`。
4. AppID 使用当前测试号：`wx960344d2e8aec1a1`。

## 说明

- `AppSecret` 不在小程序代码里，也不应该放进小程序前端。
- 当前素材已压缩到 `assets` 目录，整个小程序目录约 2.6MB，方便测试号开发。
- 智能咨询请求使用现有 Netlify 接口：
  `https://xiangdongqu-digital-museum.netlify.app/api/ai-consult`
- 开发阶段如果接口请求被拦截，可以在开发者工具里临时关闭“校验合法域名”。正式上线前需要在微信公众平台配置 request 合法域名。

## 正式上线前

- 替换为正式小程序 AppID。
- 在微信公众平台配置服务器域名。
- 用开发者工具上传版本，再到公众平台提交审核和发布。
