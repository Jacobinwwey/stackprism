# PR #33 observed-page delivery / 观察会话交付

## 中文

维护者要求：建议包命名空间、基于已合并 #30–#32 的 main rebase、测试通过后 ready。已先简要回复：建议 @stackprism/sdk，命令保持 stackprism，scope 与发布权限由维护者控制。本次没有发布 npm。

实现保留现有检测器、规则准备、header matcher 和去重；新增 await observePage(page) → detect()/dispose()。agent 自己负责导航、认证和业务就绪，会话只持有监听器及总检测预算。detectPage 继续作为无网络快照，scanUrl 复用观察机制并负责自建浏览器的关闭。

补齐的边界：未观察到的主文档头标记 not_observed；多次导航／重载替换旧头；SPA 路由保留文档头；检测期间导航拒绝 PAGE_CHANGED；一次性消费、幂等释放、闲置／活动状态的取消、超时和关闭均有真实浏览器回归。子资源沿用每文档 64 条响应与 64 个在途读取的上限，端点技术不提升为主站技术。

CLI help 和中英 SDK 文档提供入口选择、生命周期、coverage、重试、证据归属和提示注入边界。未添加单独 agent skill：现阶段重复维护同一契约会增加漂移，公开 help 与 SDK 文档已覆盖实际流程。

验证：36/36 单元测试、22/22 Chrome SDK/CLI 集成测试；lint、vue-tsc、扩展构建、VitePress 构建、Prettier、diff 检查通过。实际 tarball 在仓库外离线安装，通过严格 NodeNext 类型检查（不启用 skipLibCheck）以及真实浏览器 SDK/观察/CLI 实测。包压缩约 1.5 MB、解压约 19.7 MB。

2026-10-18 Bing：HTTP 200，8/8 断言，38 条响应，skipped/failed 均 0；5366 ms 含 1000 ms 观察窗口，仅为一次观察，不能推断总体准确率或性能改善。规则 1.3.90，SHA-256 09056a5ed496e74f395e0ca7a59211bd8a1f7cc9fc40ba1d649f17bbde2d7ef6。

PR 分支基于 upstream/main 58cf3c9，保留上游 Vue Devtools 误报修复。签名提交 1149236（观察实现与回归）、d7140bf（命名空间和 agent 文档）、a15bc12（Linux/Windows CI）、06f1cba（固定维护中的官方 Action 版本）。按维护者要求 rebase 后以旧 SHA 精确约束 force-with-lease 更新分支；fork integration 采用追加提交，不改写历史。两者实现文件完全一致，仅 fork 保存计划及 walkthrough。既有未跟踪 package-lock.json 保留。

交付：PR #33 已 ready、无合并冲突；最终 HEAD 06f1cba 的 Linux 与 Windows CI 均通过。运行：https://github.com/setube/stackprism/actions/runs/39083399594。

最终汇总回复：https://github.com/setube/stackprism/pull/33#issuecomment-6243856753。

## English

The maintainer requested a namespace recommendation, a rebase after #30–#32 merged, and readiness after tests. Replied first: recommend @stackprism/sdk with the stackprism executable, leaving scope/publishing access to maintainers. Nothing was published to npm.

Reuse the detector, rule preparation, header matcher and deduplication. Add await observePage(page) → detect()/dispose(). Agents own navigation, authentication and application readiness; the session owns listeners and one detection budget. detectPage remains a no-network snapshot; scanUrl reuses observation and closes its owned browser.

Real-browser regressions cover unavailable document headers, document replacement/reloads, SPA history, navigation during detection, single consumption, idempotent disposal, idle/active cancellation, deadline and close. Retain the existing 64-response/64-active-read bounds and endpoint attribution without promoting resource technology to site detections.

CLI help and bilingual SDK docs cover API choice, lifecycle, coverage, retry, attribution and prompt injection. A separate agent skill would duplicate these contracts without adding a distinct workflow, so none was added.

Validation: 36/36 unit and 22/22 real-Chrome integration tests; lint, vue-tsc, extension build, VitePress build, Prettier and diff checks pass. Install the actual tarball offline outside the repository; strict NodeNext types without skipLibCheck and real-browser SDK/observation/CLI smoke pass. Package size is about 1.5 MB compressed / 19.7 MB unpacked.

Bing on 2026-10-18: HTTP 200, 8/8 assertions, 38 responses, zero skipped/failed. The 5366 ms capture includes a 1000 ms window and establishes neither overall accuracy nor a performance improvement. Rules 1.3.90 SHA-256: 09056a5ed496e74f395e0ca7a59211bd8a1f7cc9fc40ba1d649f17bbde2d7ef6.

Rebased onto upstream/main 58cf3c9, retaining its Vue Devtools false-positive fix. Signed commits: 1149236 (observation/regressions), d7140bf (namespace/agent docs), a15bc12 (Linux/Windows CI), 06f1cba (pin maintained official Action releases). Update the rebased branch with an exact-old-SHA force-with-lease; append the fork integration sync without rewriting its history. Implementation trees match, with plans/walkthroughs kept only in the fork. Preserve the pre-existing untracked package-lock.json.

Delivery: PR #33 is ready and mergeable; Linux and Windows CI both passed at final HEAD 06f1cba. Run: https://github.com/setube/stackprism/actions/runs/39083399594.

Final delivery reply: https://github.com/setube/stackprism/pull/33#issuecomment-6243856753.
