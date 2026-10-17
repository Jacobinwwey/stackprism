# Observed caller-page detection: design and implementation plan

## 中文

目标：交付 PR #33；采用项目命名空间 @stackprism/sdk，保留 stackprism 命令，不发布 npm。维护者已接受核心 API、私网策略和观察窗口；用户已授权继续实施。

设计：新增 await observePage(page, options) 返回一次性 PageObservation。调用方先建立观察，再自行导航、认证与等待，最后 detect()；dispose() 幂等。会话的时间预算覆盖规则加载、调用方等待与检测，超时／取消／页面关闭自动释放监听器，始终不导航或关闭调用方页面。复用既有 SubresourceHeaders、主文档 header matcher、collectSnapshot 和 buildReport；检测期间跨文档变化失败，未捕获的主文档响应明确标记 not_observed。

替代方案：给 detectPage 增加开关会混淆快照与观察生命周期；让 SDK 接管调用方导航会侵入 agent 控制面。独立观察会话直接表达资源归属。

步骤：
1. 在 publication worktree rebase feat/shared-cli-sdk 到 upstream/main，保留 DCO；基于最终 manifest 修复 bun.lock。
2. 更新正式包名及上游 repository 元数据；通过打包消费者验证导出和 CLI。
3. 先加入真实浏览器回归，覆盖预导航监听、重定向、旧文档隔离、取消／超时／关闭／释放和并发一次性消费，再实现观察会话。
4. 完善中英 SDK 文档、声明和 CLI help：覆盖范围、生命周期、agent 输入与证据边界；不额外维护重复 skill。
5. 运行单测、Chrome 集成、lint、typecheck／构建、文档构建、tarball 外部消费者和可选 Bing 基线。
6. 追加签名 commit，同步 fork integration；用明确旧 SHA 的 force-with-lease 更新 rebase 后 PR 分支，更新 PR 描述、评论并标记 ready。

## English

Goal: deliver PR #33 as @stackprism/sdk with the stackprism command; do not publish npm. The maintainer accepted the existing core API, private-network policy and observation window. The user authorized implementation and delivery.

Design: await observePage(page, options) returns a single-use PageObservation. Attach before caller-controlled navigation/authentication/readiness, then call detect(); dispose() is idempotent. One session budget covers rules, caller waiting and detection. Expiration, cancellation and page closure release listeners without navigating or closing caller resources. Reuse SubresourceHeaders, the existing main-document matcher, collectSnapshot and buildReport. Reject document changes during detection; absent navigation response remains explicitly not_observed.

Alternatives: a detectPage mode switch hides lifecycle differences; SDK-owned navigation invades agent browser control. An observation session expresses ownership directly.

Steps:
1. Rebase feat/shared-cli-sdk onto upstream/main in the publication worktree; retain DCO and resolve bun.lock from the final manifest.
2. Adopt the project package name and upstream repository metadata; verify exports and CLI from a packed consumer.
3. Add real-browser regressions before implementation for pre-navigation capture, redirects, stale-document isolation, cancellation/deadline/close/disposal, and single consumption.
4. Update bilingual SDK contracts, declarations and CLI help, including agent evidence boundaries; avoid a duplicate skill.
5. Run unit/Chrome integration tests, lint, typecheck/build, docs, packed external consumer and opt-in Bing checks.
6. Append signed commits, sync fork integration, update the rebased PR with an exact-SHA force-with-lease, refresh PR evidence and mark ready.
