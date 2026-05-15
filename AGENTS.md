# Project Memory

- The user is the person responsible for `xiangdongqu`.
- Agent `019e2c40-8176-7300-be73-0ad9119b54dd` is responsible for UI.
- For UI image generation work, agent `019e2c40-8176-7300-be73-0ad9119b54dd` must use the agent-based image generation workflow.
- That UI agent must not generate images by itself and send them directly into the chat. This is explicitly forbidden.
- Agent `019e2c40-b9f1-75a0-8a9a-1496fac5402f` is responsible for visual acceptance and asset assembly.
- UI generates assets; agent `019e2c40-b9f1-75a0-8a9a-1496fac5402f` validates those assets visually and assembles them.
- Visual acceptance must happen after every asset assembly pass.
- Do not assume an asset is acceptable just because it was regenerated and placed into the project again. It still requires visual acceptance after assembly.
