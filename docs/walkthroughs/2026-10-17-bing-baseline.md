# Bing baseline and response channel delivery

## 中文

已实现 SDK `0.2.0`。新增主框架子资源响应头通道、`observationMs` / `--observe`、独立资源归属和采集计数。规则匹配仍复用原实现；没有根据 Bing 品牌新增推断规则。当前主框架文档最多采集 64 个响应，同时挂起的响应头读取也限制为 64；导航不会绕过并发上限。异常和取消会移除监听，旧文档与 iframe 内部响应被排除。

基线仅一个 JSON 定义、一条联网命令、一份脱敏头夹具。说明与实测记录见 [Bing 基线](../baselines/bing.md)。完整运行结果位于 Git 忽略的 `artifacts/bing/report.json` 和 `report.md`，可通过 `bun run baseline:bing` 重建。

实测：Bing 重定向到 `cn.bing.com`，HTTP 200，8/8 断言通过；38 个子资源响应，零跳过／失败。页面／主文档仍为原 5 项；子资源中新增可归属到 XHR `/web/xlsc.aspx` 的 ASP.NET medium 线索。证据不足以推断 Bing 全站后端。

验证结果：34/34 单测、13/13 真实 Chrome 回归、lint、vue-tsc、扩展与 SDK 构建、格式检查、diff 检查通过。实际 `0.2.0` tarball 在仓库外离线安装后，SDK／CLI 真实检测及严格 NodeNext 消费端类型检查通过。类型包只保留公开声明，避免发送引用扩展内部类型的悬空声明。

新增回归覆盖延迟 fetch、同源／跨源归属、资源技术不进入顶层主站列表、iframe 排除、64 响应上限、旧文档晚到响应、挂起读跨导航、失败计数、总预算和取消。默认单测不依赖 Bing 网络可达性。实际运行环境为 Windows + Node 22.19.0 + 本机 Chrome；未验证其他系统或 Firefox。

取舍：默认增加 1 秒观察窗口；不读取 body、不额外发送检测请求、不支持无限持续观察。`detectPage` 保持无历史网络数据的只读接口。基线的 HTTP/2、Azure 与 ASP.NET 命中是可变观察，缺失时不会仅因此判为回归；必须命中的只有 HTTPS、JavaScript 和 Open Graph。

未提交、推送或发布 npm；保留用户原有未跟踪的 `package-lock.json`。扩展构建原有 chunk 大小与 inlineDynamicImports 提示仍存在。

## English

Delivered SDK `0.2.0` with main-frame subresource headers, `observationMs` / `--observe`, resource attribution and capture counters. Matching reuses existing rules; no Bing-brand assumptions were added. Captures at most 64 responses from the current main-frame document, with a separate bound of 64 outstanding header reads that navigation cannot bypass. Listeners detach on failure/cancellation; stale-document and iframe responses are excluded.

The baseline consists of one JSON definition, one explicit live command and one sanitized header fixture. See the [Bing baseline](../baselines/bing.md). Full runs are written to Git-ignored `artifacts/bing/report.json` and `report.md`; regenerate with `bun run baseline:bing`.

Live result: Bing redirected to `cn.bing.com`, HTTP 200, 8/8 assertions passed, 38 subresource responses, zero skipped/failed. The original five page/main-document detections remained. The new channel surfaced a medium-confidence ASP.NET signal attributed to the XHR endpoint `/web/xlsc.aspx`, not a claim about Bing's entire backend.

Validation: 34/34 unit tests, 13/13 real Chrome tests, lint, vue-tsc, extension/SDK builds, formatting and diff checks passed. The actual `0.2.0` tarball was installed offline outside the repository; SDK/CLI browser smoke tests and strict NodeNext consumer compilation passed. Only public declarations ship, avoiding dangling references to extension-internal types.

New regressions cover delayed fetch, exact-origin attribution, resource technologies staying out of top-level site detections, iframe exclusion, response limits, late stale-document responses, pending reads across navigation, failure accounting, total budgets and cancellation. Default tests do not require Bing availability. Executed on Windows, Node 22.19.0 and installed Chrome; other operating systems and Firefox remain unverified.

Tradeoffs: a default one-second observation window; no body reads, extra detection requests or unbounded observation. `detectPage` retains its read-only contract without historical network coverage. HTTP/2, Azure and ASP.NET remain variable observations; required technology facts are only HTTPS, JavaScript and Open Graph.

No commit, push or npm publication. Preserved the user's pre-existing untracked `package-lock.json`. Existing extension chunk-size and inlineDynamicImports warnings remain.
