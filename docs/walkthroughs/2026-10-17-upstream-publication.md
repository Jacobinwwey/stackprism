# CLI / SDK contribution preparation

## 中文

本记录替代同日初始 CLI/SDK 与 Bing walkthrough 中的提交状态和验证计数。最终包版本为 `@jacobinwwey/stackprism@0.2.0`，未发布 npm。

基于上游 `c1a42d4` 拆分四个分支，均使用 Conventional Commits、DCO Signed-off-by 和线性历史：

| 分支 | 范围 |
| --- | --- |
| `fix/validation-toolchain` | TypeScript 5.9 兼容性、既有类型／lint 阻断、ESM 翻译脚本及回归 |
| `fix/page-support-reasons` | 补齐 popup 已消费的本地化原因键及协议回归 |
| `fix/jquery-resource-scope` | 限制 jQuery 文本模式到资源 URL，保留 global／版本检测 |
| `feat/shared-cli-sdk` | 共享核心抽取、CLI/SDK、有界子资源响应头、离线测试与可选 Bing 基线 |

`integration/agent-cli-sdk` 集成所有更新和双语过程记录。上游功能 PR 不包含过程记录与独立缺陷修复；功能分支声明其工具链依赖，并以 draft 提交。工具链分支单独运行类型检查仍有三处 `PageSupport.reasonCode` 错误，第二个修复分支解决它们。组合分支完整类型检查通过。

复用结论：页面检测器仅新增导出与协作式时间预算；规则归一化、预编译与原扩展共享，响应头匹配、规则预筛、去重直接使用既有实现。未创建第二套指纹引擎。

发布前验证：36/36 单测、13/13 真实 Chrome 集成测试、ESLint、vue-tsc、扩展生产构建与 VitePress 构建通过。实际 npm tarball 在仓库外离线安装，SDK/CLI 浏览器 smoke 和严格 NodeNext 消费者编译（未使用 skipLibCheck）通过。Windows x64、Node 22.19.0、Bun 1.3.11、Chrome 154；其他 OS／浏览器未验证。自动审查后追加动态快照 jQuery 回归、精确 fallback 文案断言，并移除翻译脚本提前写入；不重写已推送历史。

已提交上游：页面原因 [PR 30](https://github.com/setube/stackprism/pull/30)、jQuery [PR 31](https://github.com/setube/stackprism/pull/31)、工具链 [PR 32](https://github.com/setube/stackprism/pull/32)、CLI/SDK draft [PR 33](https://github.com/setube/stackprism/pull/33)。

Bing 发布候选实测：最终 `https://cn.bing.com/`、HTTP 200、8/8 检查、38 个响应、0 跳过／失败；耗时 3125 ms，包含 1000 ms 观察窗口。单次采样不构成准确率或性能基准。

权衡：规则加载 O(R) 并进程内缓存；每个响应沿用既有 H 条头规则匹配，最多 K=64 个响应和 64 个挂起读取，额外匹配 O(K×H)，保留记录 O(K)。请求世代 WeakMap 随仍被引用的请求数量增长，不能把整个扫描内存声称为 O(64)。规则 JSON 约 19.6 MB，tarball 约 1.5 MB。时间预算是协作式的，退出清理可延长实际返回时间。

## English

This record supersedes commit status and validation counts in the earlier CLI/SDK and Bing walkthroughs from this date. The final package is `@jacobinwwey/stackprism@0.2.0`; it has not been published to npm.

Four branches start from upstream `c1a42d4`, using conventional subjects, DCO sign-offs and linear histories:

| Branch | Scope |
| --- | --- |
| `fix/validation-toolchain` | TypeScript 5.9 compatibility, existing type/lint blockers, ESM translation generator regression |
| `fix/page-support-reasons` | Localization keys already consumed by the popup, with protocol regression coverage |
| `fix/jquery-resource-scope` | Resource-only jQuery text patterns while preserving globals and versions |
| `feat/shared-cli-sdk` | Shared core, CLI/SDK, bounded response-header observation, offline tests and opt-in Bing baseline |

`integration/agent-cli-sdk` combines all updates and bilingual work records. The upstream feature PR excludes internal records and independent bug fixes, declares the toolchain dependency, and is submitted as a draft. Typechecking the toolchain branch alone still reports three existing `PageSupport.reasonCode` errors, addressed by the second fix. Combined typechecking passes.

Core reuse is verified: the page detector only gains an export and cooperative deadline checks. Rule normalization and precompilation are shared with the extension; header matching, prefiltering and deduplication use the existing implementations. There is no second fingerprint engine.

Pre-publication validation: 36/36 unit tests, 13/13 real-Chrome integration tests, ESLint, vue-tsc, extension production build and VitePress build pass. An actual npm tarball installs offline outside the repository; SDK/CLI browser smoke and strict NodeNext consumer compilation without skipLibCheck pass. Tested on Windows x64, Node 22.19.0, Bun 1.3.11 and Chrome 154; other operating systems and engines are unverified. Follow-up commits add the dynamic-snapshot jQuery regression, assert exact fallback messages and remove premature translation output; published history is not rewritten.

Submitted upstream: page reasons [PR 30](https://github.com/setube/stackprism/pull/30), jQuery [PR 31](https://github.com/setube/stackprism/pull/31), toolchain [PR 32](https://github.com/setube/stackprism/pull/32), CLI/SDK draft [PR 33](https://github.com/setube/stackprism/pull/33).

Bing candidate run: final URL `https://cn.bing.com/`, HTTP 200, 8/8 checks, 38 responses, zero skipped/failed. Detection took 3125 ms including the 1000 ms observation window. One sample is neither an accuracy study nor a performance benchmark.

Tradeoffs: O(R) rule loading is cached per process. At most K=64 responses reuse H header rules, adding O(K×H) matching and O(K) retained records, with at most 64 pending reads. Request-generation WeakMap entries scale with still-referenced requests, so total scan memory is not O(64). Rules occupy about 19.6 MB; the tarball is about 1.5 MB. Deadlines are cooperative and cleanup can extend wall time.
