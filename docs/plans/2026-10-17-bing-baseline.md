# Bing baseline and bounded response observation

## 中文

用户已授权以 Bing 实测并建立最小基线、扩展检测通道。选择子资源响应头采集，复用既有 headers matcher；这次不增加包体读取或长期动态 observer。理由：实测发现主文档之外的 XHR `.aspx` 线索；短时动态 DOM 扫描并未带来新的核心命中，包体采样则增加请求和解析成本。

契约：`scanUrl` 在导航前注册监听，`load` 后观察 1000 ms，可通过数字预算 `observationMs` 调整（0–5000）。最多采集 64 个当前主框架文档的 HTTP(S) 子资源响应，不抓 body，不补请求。计数必须说明观察、跳过、失败；退出、异常、取消移除监听。旧文档请求和 iframe 请求不能混入。响应按 URL（去掉凭据／查询／片段）、类型、状态及证据单独列出，明确 same_origin / cross_origin；不提升为主站技术。`detectPage` 没有历史网络数据，继续明确 not_observed。

基线：一个小 JSON 定义目标、允许的 Bing 主机、必须命中的 HTTPS／JavaScript／Open Graph，以及可选观察项。默认单测不联网。显式 `baseline:bing` 生成完整 JSON 和中英 Markdown 摘要到 ignored artifacts，成功、回归、无法观察区分退出码。保留脱敏的实测摘要与至少一个脱离公网的回归夹具；不固定正文、资源 hash、资源数或耗时。

验证：本地真实浏览器测试资源归属、去重／上限、旧文档隔离、清理和取消；Bing 再测；运行现有单测、类型检查、lint 和构建。实际结果记录到 walkthrough。一次站点样本只验证通道工作，不能代表总体准确率。

## English

The user authorized Bing live validation, a minimal baseline and channel expansion. Choose bounded subresource response headers using the existing matcher. No body sampling or long-lived dynamic observer: Bing exposed an XHR `.aspx` signal absent from the main document; delayed DOM inspection did not add core detections, while body sampling adds network and parsing cost.

Contract: register before navigation; observe for 1000 ms after load, configurable through the numeric `observationMs` budget (0–5000). Capture at most 64 HTTP(S) subresource responses belonging to the current main-frame document. No body reads or extra requests. Report observed/skipped/failed counts; detach on completion, error and cancellation. Exclude stale-document and iframe requests. Report resource URL (without credentials/query/fragment), type, status and evidence separately, with exact same_origin/cross_origin attribution; never promote these to main-site technologies. `detectPage` has no historical network data and remains not_observed.

Baseline: one small JSON describing target, allowed Bing hosts, required HTTPS/JavaScript/Open Graph detections and optional observations. Normal tests stay offline. Explicit `baseline:bing` writes JSON plus bilingual Markdown to ignored artifacts, with distinct success/regression/unobservable exits. Keep a sanitized live summary and an offline regression fixture. Do not freeze text, asset hashes, counts or timings.

Validation: local browser checks for attribution, limits, stale documents, cleanup and cancellation, then live Bing, unit/type/lint/build checks. Record outcomes in a walkthrough. One site validates a channel, not overall detection accuracy.
