<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useData } from 'vitepress'
  import SpSelect from '../../../src/ui/components/Select.vue'
  import SpInput from '../../../src/ui/components/Input.vue'
  import SpTextarea from '../../../src/ui/components/Textarea.vue'

  const REPO = 'https://github.com/setube/stackprism'

  // ─── 多语言文案 ────────────────────────────────────────────────────────────
  const i18n: Record<string, Record<string, string>> = {
    'zh-CN': {
      langLabel: '语言',
      typeLabel: '议题类型',
      submitBtn: '跳转到 GitHub 提交',
      charCount: '{n}/{max}',
      required: '必填',
      // tabs
      tab_rule: '规则贡献',
      tab_bug: 'Bug 反馈',
      tab_feedback: '反馈',
      tab_suggestion: '建议',
      // rule contribution
      rule_name: '技术名称',
      rule_name_ph: '例如：ExampleCMS',
      rule_category: '分类',
      rule_category_ph: '选择分类',
      rule_kind: '类型说明',
      rule_kind_ph: '例如：CMS / 第三方支付 / 统计平台',
      rule_patterns: '匹配规则（每行一个关键词或正则）',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms\n/wp-content/themes/example/',
      rule_evidence: '真实样例 / 证据',
      rule_evidence_ph: '官网链接、测试页面、响应头、源码片段或截图（敏感信息请脱敏）',
      rule_confidence: '建议置信度',
      rule_confidence_ph: '选择',
      rule_url: '官网 / 仓库 URL',
      rule_url_ph: 'https://example.com',
      conf_high: '高',
      conf_mid: '中',
      conf_low: '低',
      // bug
      bug_version: '插件版本',
      bug_version_ph: '例如：v1.0.1',
      bug_browser: '浏览器与系统',
      bug_browser_ph: '例如：Chrome 124 / Windows 11',
      bug_problem: '问题描述',
      bug_problem_ph: '实际结果：...\n期望结果：...',
      bug_steps: '复现步骤',
      bug_steps_ph: '1. 打开 ...\n2. 点击 ...\n3. 出现 ...',
      bug_evidence: '截图 / 控制台 / 原始线索',
      bug_evidence_ph: '可以粘贴截图描述、错误日志或插件原始 JSON 片段',
      // feedback
      fb_content: '反馈内容',
      fb_content_ph: '我在使用 ... 时发现 ...',
      fb_version: '插件版本（可选）',
      fb_version_ph: '例如：v1.0.1',
      fb_context: '补充上下文（可选）',
      fb_context_ph: '相关网站、截图、原始线索或其他说明',
      // suggestion
      sug_content: '建议内容',
      sug_content_ph: '希望支持 ...',
      sug_reason: '使用场景 / 原因',
      sug_reason_ph: '说明这个建议解决什么问题，或能减少什么操作成本',
      sug_alternatives: '你考虑过的替代方案（可选）',
      sug_alternatives_ph: '如果有其他实现方式，也可以一起写',
      // categories
      cat_frontend: '前端框架',
      cat_ui: 'UI / CSS 框架',
      cat_lib: '前端库',
      cat_build: '构建与运行时',
      cat_cdn: 'CDN / 托管',
      cat_waf: 'WAF / 防火墙',
      cat_web: 'Web 服务器',
      cat_backend: '后端 / 服务器框架',
      cat_lang: '开发语言 / 运行时',
      cat_cms: '网站程序',
      cat_theme: '主题 / 模板',
      cat_source: '网站源码线索',
      cat_probe: '探针 / 监控',
      cat_ecom: 'CMS / 电商平台',
      cat_rss: 'RSS / 订阅',
      cat_saas: 'SaaS / 第三方服务',
      cat_ai: 'AI / 大模型',
      cat_oauth: '第三方登录 / OAuth',
      cat_pay: '支付系统',
      cat_ad: '广告 / 营销',
      cat_stat: '统计 / 分析',
      cat_analytics: '分析与标签',
      cat_security: '安全与协议',
      cat_other: '其他库'
    },
    en: {
      langLabel: 'Language',
      typeLabel: 'Issue type',
      submitBtn: 'Open on GitHub',
      charCount: '{n}/{max}',
      required: 'Required',
      tab_rule: 'Rule contribution',
      tab_bug: 'Bug report',
      tab_feedback: 'Feedback',
      tab_suggestion: 'Suggestion',
      rule_name: 'Technology name',
      rule_name_ph: 'e.g.: ExampleCMS',
      rule_category: 'Category',
      rule_category_ph: 'Select a category',
      rule_kind: 'Type description',
      rule_kind_ph: 'e.g.: CMS / Payment / Analytics',
      rule_patterns: 'Match rules (one keyword or regex per line)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms\n/wp-content/themes/example/',
      rule_evidence: 'Evidence / real example',
      rule_evidence_ph: 'Official site, test page, response headers, source snippet, or screenshot (redact sensitive data)',
      rule_confidence: 'Suggested confidence',
      rule_confidence_ph: 'Select',
      rule_url: 'Official site / repo URL',
      rule_url_ph: 'https://example.com',
      conf_high: 'High',
      conf_mid: 'Medium',
      conf_low: 'Low',
      bug_version: 'Extension version',
      bug_version_ph: 'e.g.: v1.0.1',
      bug_browser: 'Browser and OS',
      bug_browser_ph: 'e.g.: Chrome 124 / Windows 11',
      bug_problem: 'Problem description',
      bug_problem_ph: 'Actual result: ...\nExpected result: ...',
      bug_steps: 'Reproduction steps',
      bug_steps_ph: '1. Open ...\n2. Click ...\n3. See ...',
      bug_evidence: 'Screenshots / console / raw data',
      bug_evidence_ph: 'Paste screenshot description, error logs, or raw JSON from the extension',
      fb_content: 'Feedback',
      fb_content_ph: 'I noticed that when using ... ',
      fb_version: 'Extension version (optional)',
      fb_version_ph: 'e.g.: v1.0.1',
      fb_context: 'Additional context (optional)',
      fb_context_ph: 'Relevant sites, screenshots, raw data, or other notes',
      sug_content: 'Suggestion',
      sug_content_ph: 'I would like to see ...',
      sug_reason: 'Use case / reason',
      sug_reason_ph: 'What problem does this solve, or what friction does it reduce?',
      sug_alternatives: 'Alternatives you considered (optional)',
      sug_alternatives_ph: 'If there are other approaches, feel free to mention them',
      cat_frontend: 'Frontend Framework',
      cat_ui: 'UI / CSS Framework',
      cat_lib: 'Frontend Library',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hosting',
      cat_waf: 'WAF / Firewall',
      cat_web: 'Web Server',
      cat_backend: 'Backend / Server Framework',
      cat_lang: 'Dev Language / Runtime',
      cat_cms: 'CMS / Web App',
      cat_theme: 'Theme / Template',
      cat_source: 'Source Code Clue',
      cat_probe: 'Probe / Monitoring',
      cat_ecom: 'CMS / E-commerce',
      cat_rss: 'RSS / Feed',
      cat_saas: 'SaaS / Third-party',
      cat_ai: 'AI / LLM',
      cat_oauth: 'Third-party Login / OAuth',
      cat_pay: 'Payment System',
      cat_ad: 'Ads / Marketing',
      cat_stat: 'Analytics',
      cat_analytics: 'Analytics & Tag',
      cat_security: 'Security & Protocol',
      cat_other: 'Other Library'
    },
    'zh-TW': {
      langLabel: '語言',
      typeLabel: '議題類型',
      submitBtn: '跳轉到 GitHub 提交',
      charCount: '{n}/{max}',
      required: '必填',
      tab_rule: '規則貢獻',
      tab_bug: 'Bug 回報',
      tab_feedback: '回饋',
      tab_suggestion: '建議',
      rule_name: '技術名稱',
      rule_name_ph: '例如：ExampleCMS',
      rule_category: '分類',
      rule_category_ph: '選擇分類',
      rule_kind: '類型說明',
      rule_kind_ph: '例如：CMS / 第三方支付 / 統計平台',
      rule_patterns: '匹配規則（每行一個關鍵字或正規表示式）',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: '真實範例 / 證據',
      rule_evidence_ph: '官網連結、測試頁面、回應標頭、原始碼片段（敏感資訊請去識別化）',
      rule_confidence: '建議信心度',
      rule_confidence_ph: '選擇',
      rule_url: '官網 / 儲存庫 URL',
      rule_url_ph: 'https://example.com',
      conf_high: '高',
      conf_mid: '中',
      conf_low: '低',
      bug_version: '擴充功能版本',
      bug_version_ph: '例如：v1.0.1',
      bug_browser: '瀏覽器與系統',
      bug_browser_ph: '例如：Chrome 124 / Windows 11',
      bug_problem: '問題描述',
      bug_problem_ph: '實際結果：...\n預期結果：...',
      bug_steps: '重現步驟',
      bug_steps_ph: '1. 開啟 ...\n2. 點擊 ...\n3. 出現 ...',
      bug_evidence: '截圖 / 主控台 / 原始線索',
      bug_evidence_ph: '可貼上截圖說明、錯誤日誌或外掛原始 JSON 片段',
      fb_content: '回饋內容',
      fb_content_ph: '我在使用 ... 時發現 ...',
      fb_version: '擴充功能版本（可選）',
      fb_version_ph: '例如：v1.0.1',
      fb_context: '補充說明（可選）',
      fb_context_ph: '相關網站、截圖、原始線索或其他說明',
      sug_content: '建議內容',
      sug_content_ph: '希望支援 ...',
      sug_reason: '使用情境 / 原因',
      sug_reason_ph: '說明這個建議解決什麼問題，或能減少什麼操作成本',
      sug_alternatives: '您考慮過的替代方案（可選）',
      sug_alternatives_ph: '如果有其他實作方式，也可以一起寫',
      cat_frontend: '前端框架',
      cat_ui: 'UI / CSS 框架',
      cat_lib: '前端函式庫',
      cat_build: '建置與執行環境',
      cat_cdn: 'CDN / 託管',
      cat_waf: 'WAF / 防火牆',
      cat_web: 'Web 伺服器',
      cat_backend: '後端 / 伺服器框架',
      cat_lang: '開發語言 / 執行環境',
      cat_cms: '網站程式',
      cat_theme: '主題 / 模板',
      cat_source: '網站原始碼線索',
      cat_probe: '探針 / 監控',
      cat_ecom: 'CMS / 電商平台',
      cat_rss: 'RSS / 訂閱',
      cat_saas: 'SaaS / 第三方服務',
      cat_ai: 'AI / 大型語言模型',
      cat_oauth: '第三方登入 / OAuth',
      cat_pay: '支付系統',
      cat_ad: '廣告 / 行銷',
      cat_stat: '統計 / 分析',
      cat_analytics: '分析與標籤',
      cat_security: '安全與協定',
      cat_other: '其他函式庫'
    },
    ja: {
      langLabel: '言語',
      typeLabel: '議題の種類',
      submitBtn: 'GitHub で提出',
      charCount: '{n}/{max}',
      required: '必須',
      tab_rule: 'ルール貢献',
      tab_bug: 'バグ報告',
      tab_feedback: 'フィードバック',
      tab_suggestion: '提案',
      rule_name: '技術名',
      rule_name_ph: '例：ExampleCMS',
      rule_category: 'カテゴリ',
      rule_category_ph: 'カテゴリを選択',
      rule_kind: '種類の説明',
      rule_kind_ph: '例：CMS / 決済 / 分析',
      rule_patterns: 'マッチルール（1行1キーワードまたは正規表現）',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: '実例 / 証拠',
      rule_evidence_ph: '公式サイト、テストページ、レスポンスヘッダー、ソースコード断片（機密情報はマスク）',
      rule_confidence: '推奨信頼度',
      rule_confidence_ph: '選択',
      rule_url: '公式サイト / リポジトリ URL',
      rule_url_ph: 'https://example.com',
      conf_high: '高',
      conf_mid: '中',
      conf_low: '低',
      bug_version: '拡張機能バージョン',
      bug_version_ph: '例：v1.0.1',
      bug_browser: 'ブラウザと OS',
      bug_browser_ph: '例：Chrome 124 / Windows 11',
      bug_problem: '問題の説明',
      bug_problem_ph: '実際の結果：...\n期待した結果：...',
      bug_steps: '再現手順',
      bug_steps_ph: '1. ... を開く\n2. ... をクリック\n3. ... が表示される',
      bug_evidence: 'スクリーンショット / コンソール / 生データ',
      bug_evidence_ph: 'スクリーンショットの説明、エラーログ、または拡張機能の生 JSON を貼り付け',
      fb_content: 'フィードバック内容',
      fb_content_ph: '... を使用しているときに気づいたのですが ...',
      fb_version: '拡張機能バージョン（任意）',
      fb_version_ph: '例：v1.0.1',
      fb_context: '補足情報（任意）',
      fb_context_ph: '関連サイト、スクリーンショット、生データ、その他の補足',
      sug_content: '提案内容',
      sug_content_ph: '... に対応してほしい',
      sug_reason: '使用ケース / 理由',
      sug_reason_ph: 'この提案がどんな問題を解決するか説明してください',
      sug_alternatives: '検討した代替案（任意）',
      sug_alternatives_ph: '他の実装方法があれば記述してください',
      cat_frontend: 'フロントエンドフレームワーク',
      cat_ui: 'UI / CSS フレームワーク',
      cat_lib: 'フロントエンドライブラリ',
      cat_build: 'ビルド・ランタイム',
      cat_cdn: 'CDN / ホスティング',
      cat_waf: 'WAF / ファイアウォール',
      cat_web: 'Web サーバー',
      cat_backend: 'バックエンド / サーバーフレームワーク',
      cat_lang: '開発言語 / ランタイム',
      cat_cms: 'CMS / Web アプリ',
      cat_theme: 'テーマ / テンプレート',
      cat_source: 'ソースコード手がかり',
      cat_probe: 'プローブ / モニタリング',
      cat_ecom: 'CMS / EC',
      cat_rss: 'RSS / フィード',
      cat_saas: 'SaaS / サードパーティ',
      cat_ai: 'AI / LLM',
      cat_oauth: 'サードパーティログイン / OAuth',
      cat_pay: '決済システム',
      cat_ad: '広告 / マーケティング',
      cat_stat: '分析',
      cat_analytics: '分析 & タグ',
      cat_security: 'セキュリティ & プロトコル',
      cat_other: 'その他'
    },
    fr: {
      langLabel: 'Langue',
      typeLabel: 'Type de ticket',
      submitBtn: 'Ouvrir sur GitHub',
      charCount: '{n}/{max}',
      required: 'Obligatoire',
      tab_rule: 'Contribution de règle',
      tab_bug: 'Rapport de bug',
      tab_feedback: 'Retour',
      tab_suggestion: 'Suggestion',
      rule_name: 'Nom de la technologie',
      rule_name_ph: 'ex. : ExampleCMS',
      rule_category: 'Catégorie',
      rule_category_ph: 'Sélectionner',
      rule_kind: 'Description du type',
      rule_kind_ph: 'ex. : CMS / Paiement / Analytique',
      rule_patterns: 'Règles (un mot-clé ou regex par ligne)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: 'Exemple réel / preuve',
      rule_evidence_ph: 'Site officiel, page de test, en-têtes, extrait de code (masquer les données sensibles)',
      rule_confidence: 'Confiance suggérée',
      rule_confidence_ph: 'Sélectionner',
      rule_url: 'Site officiel / dépôt URL',
      rule_url_ph: 'https://example.com',
      conf_high: 'Haute',
      conf_mid: 'Moyenne',
      conf_low: 'Basse',
      bug_version: "Version de l'extension",
      bug_version_ph: 'ex. : v1.0.1',
      bug_browser: 'Navigateur et OS',
      bug_browser_ph: 'ex. : Chrome 124 / Windows 11',
      bug_problem: 'Description du problème',
      bug_problem_ph: 'Résultat réel : ...\nRésultat attendu : ...',
      bug_steps: 'Étapes de reproduction',
      bug_steps_ph: '1. Ouvrir ...\n2. Cliquer ...\n3. Voir ...',
      bug_evidence: 'Captures / console / données brutes',
      bug_evidence_ph: 'Coller une description de capture, des logs ou du JSON brut',
      fb_content: 'Retour',
      fb_content_ph: "J'ai remarqué que ...",
      fb_version: 'Version (optionnel)',
      fb_version_ph: 'ex. : v1.0.1',
      fb_context: 'Contexte supplémentaire (optionnel)',
      fb_context_ph: 'Sites, captures, données brutes ou autres remarques',
      sug_content: 'Suggestion',
      sug_content_ph: 'Je souhaiterais ...',
      sug_reason: "Cas d'usage / raison",
      sug_reason_ph: 'Quel problème cela résout-il ?',
      sug_alternatives: 'Alternatives envisagées (optionnel)',
      sug_alternatives_ph: "D'autres approches si applicable",
      cat_frontend: 'Framework frontend',
      cat_ui: 'Framework UI / CSS',
      cat_lib: 'Bibliothèque frontend',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hébergement',
      cat_waf: 'WAF / Pare-feu',
      cat_web: 'Serveur web',
      cat_backend: 'Backend / Framework serveur',
      cat_lang: 'Langage / Runtime',
      cat_cms: 'CMS / App web',
      cat_theme: 'Thème / Modèle',
      cat_source: 'Indice source',
      cat_probe: 'Sonde / Monitoring',
      cat_ecom: 'CMS / E-commerce',
      cat_rss: 'RSS / Flux',
      cat_saas: 'SaaS / Tiers',
      cat_ai: 'IA / LLM',
      cat_oauth: 'Connexion tierce / OAuth',
      cat_pay: 'Paiement',
      cat_ad: 'Pub / Marketing',
      cat_stat: 'Analytique',
      cat_analytics: 'Analytique & Tag',
      cat_security: 'Sécurité & Protocole',
      cat_other: 'Autre'
    },
    de: {
      langLabel: 'Sprache',
      typeLabel: 'Issue-Typ',
      submitBtn: 'Auf GitHub öffnen',
      charCount: '{n}/{max}',
      required: 'Pflichtfeld',
      tab_rule: 'Regelkontribution',
      tab_bug: 'Fehlerbericht',
      tab_feedback: 'Feedback',
      tab_suggestion: 'Vorschlag',
      rule_name: 'Technologiename',
      rule_name_ph: 'z. B.: ExampleCMS',
      rule_category: 'Kategorie',
      rule_category_ph: 'Auswählen',
      rule_kind: 'Typbeschreibung',
      rule_kind_ph: 'z. B.: CMS / Zahlung / Analytik',
      rule_patterns: 'Regeln (ein Schlüsselwort oder Regex pro Zeile)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: 'Echtes Beispiel / Nachweis',
      rule_evidence_ph: 'Offizielle Seite, Testseite, Response-Header, Quellcode-Snippet (sensible Daten schwärzen)',
      rule_confidence: 'Empfohlenes Vertrauen',
      rule_confidence_ph: 'Auswählen',
      rule_url: 'Offizielle Seite / Repo-URL',
      rule_url_ph: 'https://example.com',
      conf_high: 'Hoch',
      conf_mid: 'Mittel',
      conf_low: 'Niedrig',
      bug_version: 'Erweiterungsversion',
      bug_version_ph: 'z. B.: v1.0.1',
      bug_browser: 'Browser und OS',
      bug_browser_ph: 'z. B.: Chrome 124 / Windows 11',
      bug_problem: 'Problembeschreibung',
      bug_problem_ph: 'Tatsächliches Ergebnis: ...\nErwartetes Ergebnis: ...',
      bug_steps: 'Reproduktionsschritte',
      bug_steps_ph: '1. Öffne ...\n2. Klicke ...\n3. Erscheint ...',
      bug_evidence: 'Screenshots / Konsole / Rohdaten',
      bug_evidence_ph: 'Screenshot-Beschreibung, Fehlerlogs oder Roh-JSON einfügen',
      fb_content: 'Feedback',
      fb_content_ph: 'Mir ist aufgefallen, dass ...',
      fb_version: 'Version (optional)',
      fb_version_ph: 'z. B.: v1.0.1',
      fb_context: 'Zusätzlicher Kontext (optional)',
      fb_context_ph: 'Relevante Seiten, Screenshots, Rohdaten oder Anmerkungen',
      sug_content: 'Vorschlag',
      sug_content_ph: 'Ich hätte gerne ...',
      sug_reason: 'Anwendungsfall / Grund',
      sug_reason_ph: 'Welches Problem löst das?',
      sug_alternatives: 'Betrachtete Alternativen (optional)',
      sug_alternatives_ph: 'Andere Ansätze falls vorhanden',
      cat_frontend: 'Frontend-Framework',
      cat_ui: 'UI / CSS-Framework',
      cat_lib: 'Frontend-Bibliothek',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hosting',
      cat_waf: 'WAF / Firewall',
      cat_web: 'Webserver',
      cat_backend: 'Backend / Server-Framework',
      cat_lang: 'Sprache / Runtime',
      cat_cms: 'CMS / Web-App',
      cat_theme: 'Theme / Template',
      cat_source: 'Quellcode-Hinweis',
      cat_probe: 'Probe / Monitoring',
      cat_ecom: 'CMS / E-Commerce',
      cat_rss: 'RSS / Feed',
      cat_saas: 'SaaS / Drittanbieter',
      cat_ai: 'KI / LLM',
      cat_oauth: 'Drittanbieter-Login / OAuth',
      cat_pay: 'Zahlungssystem',
      cat_ad: 'Werbung / Marketing',
      cat_stat: 'Analytik',
      cat_analytics: 'Analytik & Tag',
      cat_security: 'Sicherheit & Protokoll',
      cat_other: 'Sonstiges'
    },
    pt: {
      langLabel: 'Idioma',
      typeLabel: 'Tipo de issue',
      submitBtn: 'Abrir no GitHub',
      charCount: '{n}/{max}',
      required: 'Obrigatório',
      tab_rule: 'Contribuição de regra',
      tab_bug: 'Relatório de bug',
      tab_feedback: 'Feedback',
      tab_suggestion: 'Sugestão',
      rule_name: 'Nome da tecnologia',
      rule_name_ph: 'ex.: ExampleCMS',
      rule_category: 'Categoria',
      rule_category_ph: 'Selecionar',
      rule_kind: 'Descrição do tipo',
      rule_kind_ph: 'ex.: CMS / Pagamento / Análise',
      rule_patterns: 'Regras (uma palavra-chave ou regex por linha)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: 'Exemplo real / evidência',
      rule_evidence_ph: 'Site oficial, página de teste, cabeçalhos, trecho de código (mascare dados sensíveis)',
      rule_confidence: 'Confiança sugerida',
      rule_confidence_ph: 'Selecionar',
      rule_url: 'Site oficial / URL do repositório',
      rule_url_ph: 'https://example.com',
      conf_high: 'Alta',
      conf_mid: 'Média',
      conf_low: 'Baixa',
      bug_version: 'Versão da extensão',
      bug_version_ph: 'ex.: v1.0.1',
      bug_browser: 'Navegador e OS',
      bug_browser_ph: 'ex.: Chrome 124 / Windows 11',
      bug_problem: 'Descrição do problema',
      bug_problem_ph: 'Resultado real: ...\nResultado esperado: ...',
      bug_steps: 'Passos para reprodução',
      bug_steps_ph: '1. Abrir ...\n2. Clicar ...\n3. Ver ...',
      bug_evidence: 'Capturas / console / dados brutos',
      bug_evidence_ph: 'Cole descrição de captura, logs de erro ou JSON bruto',
      fb_content: 'Feedback',
      fb_content_ph: 'Percebi que ...',
      fb_version: 'Versão (opcional)',
      fb_version_ph: 'ex.: v1.0.1',
      fb_context: 'Contexto adicional (opcional)',
      fb_context_ph: 'Sites relevantes, capturas, dados brutos ou outras notas',
      sug_content: 'Sugestão',
      sug_content_ph: 'Gostaria que ...',
      sug_reason: 'Caso de uso / motivo',
      sug_reason_ph: 'Qual problema isso resolve?',
      sug_alternatives: 'Alternativas consideradas (opcional)',
      sug_alternatives_ph: 'Outras abordagens, se aplicável',
      cat_frontend: 'Framework Frontend',
      cat_ui: 'Framework UI / CSS',
      cat_lib: 'Biblioteca Frontend',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hospedagem',
      cat_waf: 'WAF / Firewall',
      cat_web: 'Servidor Web',
      cat_backend: 'Backend / Framework Servidor',
      cat_lang: 'Linguagem / Runtime',
      cat_cms: 'CMS / App Web',
      cat_theme: 'Tema / Template',
      cat_source: 'Indício de Código-Fonte',
      cat_probe: 'Sonda / Monitoramento',
      cat_ecom: 'CMS / E-commerce',
      cat_rss: 'RSS / Feed',
      cat_saas: 'SaaS / Terceiro',
      cat_ai: 'IA / LLM',
      cat_oauth: 'Login de Terceiro / OAuth',
      cat_pay: 'Sistema de Pagamento',
      cat_ad: 'Anúncios / Marketing',
      cat_stat: 'Análise',
      cat_analytics: 'Análise & Tag',
      cat_security: 'Segurança & Protocolo',
      cat_other: 'Outro'
    },
    it: {
      langLabel: 'Lingua',
      typeLabel: 'Tipo di issue',
      submitBtn: 'Apri su GitHub',
      charCount: '{n}/{max}',
      required: 'Obbligatorio',
      tab_rule: 'Contributo regola',
      tab_bug: 'Segnalazione bug',
      tab_feedback: 'Feedback',
      tab_suggestion: 'Suggerimento',
      rule_name: 'Nome tecnologia',
      rule_name_ph: 'es.: ExampleCMS',
      rule_category: 'Categoria',
      rule_category_ph: 'Seleziona',
      rule_kind: 'Descrizione tipo',
      rule_kind_ph: 'es.: CMS / Pagamento / Analisi',
      rule_patterns: 'Regole (una parola chiave o regex per riga)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: 'Esempio reale / prova',
      rule_evidence_ph: 'Sito ufficiale, pagina di test, header, frammento di codice (oscura dati sensibili)',
      rule_confidence: 'Confidenza suggerita',
      rule_confidence_ph: 'Seleziona',
      rule_url: 'Sito ufficiale / URL repository',
      rule_url_ph: 'https://example.com',
      conf_high: 'Alta',
      conf_mid: 'Media',
      conf_low: 'Bassa',
      bug_version: 'Versione estensione',
      bug_version_ph: 'es.: v1.0.1',
      bug_browser: 'Browser e OS',
      bug_browser_ph: 'es.: Chrome 124 / Windows 11',
      bug_problem: 'Descrizione del problema',
      bug_problem_ph: 'Risultato effettivo: ...\nRisultato atteso: ...',
      bug_steps: 'Passi per riprodurre',
      bug_steps_ph: '1. Apri ...\n2. Clicca ...\n3. Appare ...',
      bug_evidence: 'Screenshot / console / dati grezzi',
      bug_evidence_ph: 'Incolla descrizione screenshot, log di errore o JSON grezzo',
      fb_content: 'Feedback',
      fb_content_ph: 'Ho notato che ...',
      fb_version: 'Versione (opzionale)',
      fb_version_ph: 'es.: v1.0.1',
      fb_context: 'Contesto aggiuntivo (opzionale)',
      fb_context_ph: 'Siti rilevanti, screenshot, dati grezzi o altre note',
      sug_content: 'Suggerimento',
      sug_content_ph: 'Vorrei che ...',
      sug_reason: "Caso d'uso / motivo",
      sug_reason_ph: 'Quale problema risolve?',
      sug_alternatives: 'Alternative considerate (opzionale)',
      sug_alternatives_ph: 'Altri approcci se applicabile',
      cat_frontend: 'Framework Frontend',
      cat_ui: 'Framework UI / CSS',
      cat_lib: 'Libreria Frontend',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hosting',
      cat_waf: 'WAF / Firewall',
      cat_web: 'Server Web',
      cat_backend: 'Backend / Framework Server',
      cat_lang: 'Linguaggio / Runtime',
      cat_cms: 'CMS / App Web',
      cat_theme: 'Tema / Template',
      cat_source: 'Indizio Sorgente',
      cat_probe: 'Sonda / Monitoraggio',
      cat_ecom: 'CMS / E-commerce',
      cat_rss: 'RSS / Feed',
      cat_saas: 'SaaS / Terze parti',
      cat_ai: 'AI / LLM',
      cat_oauth: 'Login Terze Parti / OAuth',
      cat_pay: 'Pagamento',
      cat_ad: 'Pubblicità / Marketing',
      cat_stat: 'Analisi',
      cat_analytics: 'Analisi & Tag',
      cat_security: 'Sicurezza & Protocollo',
      cat_other: 'Altro'
    },
    cs: {
      langLabel: 'Jazyk',
      typeLabel: 'Typ issue',
      submitBtn: 'Otevřít na GitHubu',
      charCount: '{n}/{max}',
      required: 'Povinné',
      tab_rule: 'Příspěvek pravidla',
      tab_bug: 'Hlášení chyby',
      tab_feedback: 'Zpětná vazba',
      tab_suggestion: 'Návrh',
      rule_name: 'Název technologie',
      rule_name_ph: 'např.: ExampleCMS',
      rule_category: 'Kategorie',
      rule_category_ph: 'Vybrat',
      rule_kind: 'Popis typu',
      rule_kind_ph: 'např.: CMS / Platba / Analytika',
      rule_patterns: 'Pravidla (jedno klíčové slovo nebo regex na řádek)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: 'Skutečný příklad / důkaz',
      rule_evidence_ph: 'Oficiální stránka, testovací stránka, hlavičky, úryvek kódu (citlivá data anonymizujte)',
      rule_confidence: 'Doporučená spolehlivost',
      rule_confidence_ph: 'Vybrat',
      rule_url: 'Oficiální web / URL repozitáře',
      rule_url_ph: 'https://example.com',
      conf_high: 'Vysoká',
      conf_mid: 'Střední',
      conf_low: 'Nízká',
      bug_version: 'Verze rozšíření',
      bug_version_ph: 'např.: v1.0.1',
      bug_browser: 'Prohlížeč a OS',
      bug_browser_ph: 'např.: Chrome 124 / Windows 11',
      bug_problem: 'Popis problému',
      bug_problem_ph: 'Skutečný výsledek: ...\nOčekávaný výsledek: ...',
      bug_steps: 'Kroky k reprodukci',
      bug_steps_ph: '1. Otevřít ...\n2. Kliknout ...\n3. Zobrazí se ...',
      bug_evidence: 'Snímky / konzole / surová data',
      bug_evidence_ph: 'Vložte popis snímku, chybové logy nebo surové JSON',
      fb_content: 'Zpětná vazba',
      fb_content_ph: 'Všiml/a jsem si, že ...',
      fb_version: 'Verze (nepovinné)',
      fb_version_ph: 'např.: v1.0.1',
      fb_context: 'Další kontext (nepovinné)',
      fb_context_ph: 'Relevantní stránky, snímky, surová data nebo jiné poznámky',
      sug_content: 'Návrh',
      sug_content_ph: 'Chtěl/a bych ...',
      sug_reason: 'Případ použití / důvod',
      sug_reason_ph: 'Jaký problém to řeší?',
      sug_alternatives: 'Zvažované alternativy (nepovinné)',
      sug_alternatives_ph: 'Jiné přístupy, pokud jsou relevantní',
      cat_frontend: 'Frontend Framework',
      cat_ui: 'UI / CSS Framework',
      cat_lib: 'Frontend knihovna',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hosting',
      cat_waf: 'WAF / Firewall',
      cat_web: 'Webový server',
      cat_backend: 'Backend / Server Framework',
      cat_lang: 'Jazyk / Runtime',
      cat_cms: 'CMS / Web App',
      cat_theme: 'Téma / Šablona',
      cat_source: 'Indicie zdrojového kódu',
      cat_probe: 'Sonda / Monitoring',
      cat_ecom: 'CMS / E-commerce',
      cat_rss: 'RSS / Feed',
      cat_saas: 'SaaS / Třetí strana',
      cat_ai: 'AI / LLM',
      cat_oauth: 'Přihlášení třetí strany / OAuth',
      cat_pay: 'Platební systém',
      cat_ad: 'Reklama / Marketing',
      cat_stat: 'Analytika',
      cat_analytics: 'Analytika & Tag',
      cat_security: 'Bezpečnost & Protokol',
      cat_other: 'Ostatní'
    },
    pl: {
      langLabel: 'Język',
      typeLabel: 'Typ zgłoszenia',
      submitBtn: 'Otwórz na GitHubie',
      charCount: '{n}/{max}',
      required: 'Wymagane',
      tab_rule: 'Wkład reguły',
      tab_bug: 'Zgłoszenie błędu',
      tab_feedback: 'Opinia',
      tab_suggestion: 'Sugestia',
      rule_name: 'Nazwa technologii',
      rule_name_ph: 'np.: ExampleCMS',
      rule_category: 'Kategoria',
      rule_category_ph: 'Wybierz',
      rule_kind: 'Opis typu',
      rule_kind_ph: 'np.: CMS / Płatność / Analityka',
      rule_patterns: 'Reguły (jedno słowo kluczowe lub regex w wierszu)',
      rule_patterns_ph: 'examplecms\\.js\nx-generator:.*examplecms',
      rule_evidence: 'Prawdziwy przykład / dowód',
      rule_evidence_ph: 'Oficjalna strona, strona testowa, nagłówki, fragment kodu (zanonimizuj dane wrażliwe)',
      rule_confidence: 'Sugerowane zaufanie',
      rule_confidence_ph: 'Wybierz',
      rule_url: 'Oficjalna strona / URL repozytorium',
      rule_url_ph: 'https://example.com',
      conf_high: 'Wysokie',
      conf_mid: 'Średnie',
      conf_low: 'Niskie',
      bug_version: 'Wersja rozszerzenia',
      bug_version_ph: 'np.: v1.0.1',
      bug_browser: 'Przeglądarka i OS',
      bug_browser_ph: 'np.: Chrome 124 / Windows 11',
      bug_problem: 'Opis problemu',
      bug_problem_ph: 'Rzeczywisty wynik: ...\nOczekiwany wynik: ...',
      bug_steps: 'Kroki do odtworzenia',
      bug_steps_ph: '1. Otwórz ...\n2. Kliknij ...\n3. Pojawia się ...',
      bug_evidence: 'Zrzuty ekranu / konsola / surowe dane',
      bug_evidence_ph: 'Wklej opis zrzutu, logi błędów lub surowy JSON',
      fb_content: 'Opinia',
      fb_content_ph: 'Zauważyłem/am, że ...',
      fb_version: 'Wersja (opcjonalne)',
      fb_version_ph: 'np.: v1.0.1',
      fb_context: 'Dodatkowy kontekst (opcjonalne)',
      fb_context_ph: 'Odpowiednie strony, zrzuty, surowe dane lub inne uwagi',
      sug_content: 'Sugestia',
      sug_content_ph: 'Chciałbym/łabym ...',
      sug_reason: 'Przypadek użycia / powód',
      sug_reason_ph: 'Jaki problem to rozwiązuje?',
      sug_alternatives: 'Rozważane alternatywy (opcjonalne)',
      sug_alternatives_ph: 'Inne podejścia, jeśli dotyczy',
      cat_frontend: 'Framework Frontend',
      cat_ui: 'Framework UI / CSS',
      cat_lib: 'Biblioteka Frontend',
      cat_build: 'Build & Runtime',
      cat_cdn: 'CDN / Hosting',
      cat_waf: 'WAF / Firewall',
      cat_web: 'Serwer Web',
      cat_backend: 'Backend / Framework Serwera',
      cat_lang: 'Język / Runtime',
      cat_cms: 'CMS / Aplikacja Web',
      cat_theme: 'Motyw / Szablon',
      cat_source: 'Ślad Kodu Źródłowego',
      cat_probe: 'Sonda / Monitoring',
      cat_ecom: 'CMS / E-commerce',
      cat_rss: 'RSS / Feed',
      cat_saas: 'SaaS / Zewnętrzny',
      cat_ai: 'AI / LLM',
      cat_oauth: 'Logowanie Zewnętrzne / OAuth',
      cat_pay: 'System Płatności',
      cat_ad: 'Reklama / Marketing',
      cat_stat: 'Analityka',
      cat_analytics: 'Analityka & Tag',
      cat_security: 'Bezpieczeństwo & Protokół',
      cat_other: 'Inne'
    }
  }

  // ─── 语言列表 ───────────────────────────────────────────────────────────────
  const LANGS = [
    { code: 'zh-CN', label: '简体中文' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'cs', label: 'Čeština' },
    { code: 'pl', label: 'Polski' }
  ]

  // ─── 分类键列表（跟 i18n cat_* key 对应） ──────────────────────────────────
  const CAT_KEYS = [
    'cat_frontend',
    'cat_ui',
    'cat_lib',
    'cat_build',
    'cat_cdn',
    'cat_waf',
    'cat_web',
    'cat_backend',
    'cat_lang',
    'cat_cms',
    'cat_theme',
    'cat_source',
    'cat_probe',
    'cat_ecom',
    'cat_rss',
    'cat_saas',
    'cat_ai',
    'cat_oauth',
    'cat_pay',
    'cat_ad',
    'cat_stat',
    'cat_analytics',
    'cat_security',
    'cat_other'
  ]

  type Tab = 'rule' | 'bug' | 'feedback' | 'suggestion'
  const TABS: Tab[] = ['rule', 'bug', 'feedback', 'suggestion']
  const TAB_LABELS: Record<Tab, string> = {
    rule: 'tab_rule',
    bug: 'tab_bug',
    feedback: 'tab_feedback',
    suggestion: 'tab_suggestion'
  }
  const TAB_TITLE_PREFIXES: Record<Tab, string> = {
    rule: 'rule: ',
    bug: 'bug: ',
    feedback: 'feedback: ',
    suggestion: 'feat: '
  }
  const TAB_LABELS_MAP: Record<Tab, string> = {
    rule: 'rule',
    bug: 'bug',
    feedback: 'feedback',
    suggestion: 'enhancement'
  }

  // ─── 字段长度限制 ───────────────────────────────────────────────────────────
  const LIMITS: Record<string, number> = {
    rule_name: 80,
    rule_kind: 120,
    rule_patterns: 2000,
    rule_evidence: 3000,
    rule_url: 200,
    bug_version: 30,
    bug_browser: 80,
    bug_problem: 2000,
    bug_steps: 2000,
    bug_evidence: 3000,
    fb_content: 2000,
    fb_version: 30,
    fb_context: 2000,
    sug_content: 2000,
    sug_reason: 2000,
    sug_alternatives: 1000
  }

  // ─── 浏览器语言映射 ─────────────────────────────────────────────────────────
  function detectLang(): string {
    if (typeof navigator === 'undefined') return 'zh-CN'
    const nav = navigator.language || ''
    const lower = nav.toLowerCase()
    if (lower === 'zh-tw' || lower === 'zh-hk' || lower === 'zh-mo') return 'zh-TW'
    if (lower.startsWith('zh')) return 'zh-CN'
    if (lower.startsWith('ja')) return 'ja'
    if (lower.startsWith('fr')) return 'fr'
    if (lower.startsWith('de')) return 'de'
    if (lower.startsWith('pt')) return 'pt'
    if (lower.startsWith('it')) return 'it'
    if (lower.startsWith('cs')) return 'cs'
    if (lower.startsWith('pl')) return 'pl'
    if (lower.startsWith('en')) return 'en'
    return 'en'
  }

  // ─── 状态 ──────────────────────────────────────────────────────────────────
  const lang = ref('zh-CN')
  const tab = ref<Tab>('rule')

  const { lang: vpLang } = useData()

  onMounted(() => {
    // URL 参数解析：?tab=bug&tech=XXX&category=YYY&version=1.0.0&url=...&lang=en
    const params = new URLSearchParams(window.location.search)

    // 语言优先级：VitePress 当前语言 > URL ?lang= > 浏览器语言
    const vpCode = vpLang.value?.toLowerCase() || ''
    const langParam = params.get('lang') || ''
    const detectedLang = LANGS.some(l => l.code === vpCode)
      ? vpCode
      : langParam && LANGS.some(l => l.code === langParam)
        ? langParam
        : detectLang()
    lang.value = detectedLang
    const tabParam = params.get('tab') as Tab | null
    if (tabParam && TABS.includes(tabParam)) {
      tab.value = tabParam
    }
    // rule tab 预填
    if (fields.value.rule_name !== undefined) {
      const tech = params.get('tech') || params.get('name') || ''
      const category = params.get('category') || ''
      if (tech) fields.value.rule_name = tech
      if (category) fields.value.rule_category = category
    }
    // bug tab 预填
    const version = params.get('version') || ''
    const browser = params.get('browser') || ''
    if (version) fields.value.bug_version = version
    if (browser) fields.value.bug_browser = browser
    // feedback / suggestion 预填
    const body = params.get('body') || params.get('content') || ''
    if (body) {
      if (tab.value === 'feedback') fields.value.fb_content = body
      else if (tab.value === 'suggestion') fields.value.sug_content = body
      else if (tab.value === 'bug') fields.value.bug_problem = body
    }
    // 页面 URL 预填到 bug_steps 补充
    const pageUrl = params.get('url') || ''
    if (pageUrl && tab.value === 'bug' && !fields.value.bug_steps) {
      fields.value.bug_steps = pageUrl
    }
  })

  const m = computed(() => i18n[lang.value] || i18n['zh-CN'])
  const t = (key: string) => m.value[key] || key

  const catOptions = computed(() => CAT_KEYS.map(k => ({ key: k, label: t(k) })))

  const fields = ref<Record<string, string>>({
    rule_name: '',
    rule_category: '',
    rule_kind: '',
    rule_patterns: '',
    rule_evidence: '',
    rule_confidence: '',
    rule_url: '',
    bug_version: '',
    bug_browser: '',
    bug_problem: '',
    bug_steps: '',
    bug_evidence: '',
    fb_content: '',
    fb_version: '',
    fb_context: '',
    sug_content: '',
    sug_reason: '',
    sug_alternatives: ''
  })

  const charCount = (key: string) => {
    const n = fields.value[key]?.length ?? 0
    const max = LIMITS[key] ?? 0
    return t('charCount').replace('{n}', String(n)).replace('{max}', String(max))
  }

  const over = (key: string) => (fields.value[key]?.length ?? 0) > (LIMITS[key] ?? Infinity)

  // ─── 清空字段（切换 tab 时） ────────────────────────────────────────────────
  function switchTab(t2: Tab) {
    tab.value = t2
  }

  // ─── 必填字段验证 ───────────────────────────────────────────────────────────
  const REQUIRED_FIELDS: Record<Tab, string[]> = {
    rule: ['rule_name', 'rule_category', 'rule_confidence', 'rule_patterns', 'rule_evidence'],
    bug: ['bug_version', 'bug_browser', 'bug_problem', 'bug_steps'],
    feedback: ['fb_content'],
    suggestion: ['sug_content', 'sug_reason']
  }

  const canSubmit = computed(() => REQUIRED_FIELDS[tab.value].every(k => (fields.value[k] ?? '').trim().length > 0))

  // ─── 构建 body ─────────────────────────────────────────────────────────────
  function buildBody(): string {
    const f = fields.value
    const l = lang.value
    const lines: string[] = []

    if (tab.value === 'rule') {
      lines.push(
        `**${t('rule_name')}**: ${f.rule_name}`,
        `**${t('rule_category')}**: ${f.rule_category}`,
        f.rule_kind ? `**${t('rule_kind')}**: ${f.rule_kind}` : '',
        '',
        `**${t('rule_patterns')}**`,
        '```',
        f.rule_patterns,
        '```',
        '',
        `**${t('rule_evidence')}**`,
        f.rule_evidence,
        '',
        `**${t('rule_confidence')}**: ${f.rule_confidence}`,
        f.rule_url ? `**${t('rule_url')}**: ${f.rule_url}` : '',
        '',
        `> lang: ${l}`
      )
    } else if (tab.value === 'bug') {
      lines.push(
        `**${t('bug_version')}**: ${f.bug_version}`,
        `**${t('bug_browser')}**: ${f.bug_browser}`,
        '',
        `**${t('bug_problem')}**`,
        f.bug_problem,
        '',
        `**${t('bug_steps')}**`,
        f.bug_steps,
        '',
        f.bug_evidence ? `**${t('bug_evidence')}**\n${f.bug_evidence}` : '',
        '',
        `> lang: ${l}`
      )
    } else if (tab.value === 'feedback') {
      lines.push(
        `**${t('fb_content')}**`,
        f.fb_content,
        '',
        f.fb_version ? `**${t('fb_version')}**: ${f.fb_version}` : '',
        f.fb_context ? `**${t('fb_context')}**\n${f.fb_context}` : '',
        '',
        `> lang: ${l}`
      )
    } else {
      lines.push(
        `**${t('sug_content')}**`,
        f.sug_content,
        '',
        `**${t('sug_reason')}**`,
        f.sug_reason,
        '',
        f.sug_alternatives ? `**${t('sug_alternatives')}**\n${f.sug_alternatives}` : '',
        '',
        `> lang: ${l}`
      )
    }
    return lines.filter(l2 => l2 !== null && l2 !== undefined).join('\n')
  }

  function buildTitle(): string {
    const prefix = TAB_TITLE_PREFIXES[tab.value]
    if (tab.value === 'rule') return `${prefix}${fields.value.rule_name || '?'}`
    return prefix
  }

  function submit() {
    const url = new URL(`${REPO}/issues/new`)
    url.searchParams.set('title', buildTitle())
    url.searchParams.set('labels', TAB_LABELS_MAP[tab.value])
    url.searchParams.set('body', buildBody())
    window.open(url.toString(), '_blank', 'noopener')
  }
</script>

<template>
  <div class="if-root">
    <!-- 语言切换 -->
    <div class="if-toolbar">
      <label class="if-toolbar-label">{{ t('langLabel') }}</label>
      <SpSelect v-model="lang" :options="LANGS.map(l => ({ value: l.code, label: l.label }))" :clearable="false" class="if-lang-select" />
    </div>

    <!-- Tab 切换 -->
    <div class="if-tabs" role="tablist">
      <button
        v-for="tb in TABS"
        :key="tb"
        role="tab"
        class="if-tab"
        :class="{ active: tab === tb }"
        :aria-selected="tab === tb"
        @click="switchTab(tb)"
      >
        {{ t(TAB_LABELS[tb]) }}
      </button>
    </div>

    <!-- 表单 -->
    <div class="if-form" role="tabpanel">
      <!-- 规则贡献 -->
      <template v-if="tab === 'rule'">
        <div class="if-field">
          <label class="if-label">
            {{ t('rule_name') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpInput v-model="fields.rule_name" :placeholder="t('rule_name_ph')" />
          <span class="if-count" :class="{ over: over('rule_name') }">{{ charCount('rule_name') }}</span>
        </div>

        <div class="if-field">
          <label class="if-label">
            {{ t('rule_category') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpSelect
            v-model="fields.rule_category"
            :options="catOptions.map(o => ({ value: o.label, label: o.label }))"
            :placeholder="t('rule_category_ph')"
            :clearable="false"
          />
        </div>

        <div class="if-field">
          <label class="if-label">{{ t('rule_kind') }}</label>
          <SpInput v-model="fields.rule_kind" :placeholder="t('rule_kind_ph')" />
          <span class="if-count" :class="{ over: over('rule_kind') }">{{ charCount('rule_kind') }}</span>
        </div>

        <div class="if-field">
          <label class="if-label">
            {{ t('rule_confidence') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpSelect
            v-model="fields.rule_confidence"
            :options="[
              { value: 'high', label: t('conf_high') },
              { value: 'medium', label: t('conf_mid') },
              { value: 'low', label: t('conf_low') }
            ]"
            :placeholder="t('rule_confidence_ph')"
            :clearable="false"
          />
        </div>

        <div class="if-field">
          <label class="if-label">
            {{ t('rule_patterns') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.rule_patterns" :placeholder="t('rule_patterns_ph')" :rows="5" :clearable="false" />
          <span class="if-count" :class="{ over: over('rule_patterns') }">{{ charCount('rule_patterns') }}</span>
        </div>

        <div class="if-field">
          <label class="if-label">
            {{ t('rule_evidence') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.rule_evidence" :placeholder="t('rule_evidence_ph')" :rows="5" :clearable="false" />
          <span class="if-count" :class="{ over: over('rule_evidence') }">{{ charCount('rule_evidence') }}</span>
        </div>

        <div class="if-field">
          <label class="if-label">{{ t('rule_url') }}</label>
          <SpInput v-model="fields.rule_url" type="url" :placeholder="t('rule_url_ph')" />
          <span class="if-count" :class="{ over: over('rule_url') }">{{ charCount('rule_url') }}</span>
        </div>
      </template>

      <!-- Bug 反馈 -->
      <template v-else-if="tab === 'bug'">
        <div class="if-field">
          <label class="if-label">
            {{ t('bug_version') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpInput v-model="fields.bug_version" :placeholder="t('bug_version_ph')" />
        </div>
        <div class="if-field">
          <label class="if-label">
            {{ t('bug_browser') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpInput v-model="fields.bug_browser" :placeholder="t('bug_browser_ph')" />
        </div>
        <div class="if-field">
          <label class="if-label">
            {{ t('bug_problem') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.bug_problem" :placeholder="t('bug_problem_ph')" :rows="5" :clearable="false" />
          <span class="if-count" :class="{ over: over('bug_problem') }">{{ charCount('bug_problem') }}</span>
        </div>
        <div class="if-field">
          <label class="if-label">
            {{ t('bug_steps') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.bug_steps" :placeholder="t('bug_steps_ph')" :rows="5" :clearable="false" />
          <span class="if-count" :class="{ over: over('bug_steps') }">{{ charCount('bug_steps') }}</span>
        </div>
        <div class="if-field">
          <label class="if-label">{{ t('bug_evidence') }}</label>
          <SpTextarea v-model="fields.bug_evidence" :placeholder="t('bug_evidence_ph')" :rows="4" :clearable="false" />
          <span class="if-count" :class="{ over: over('bug_evidence') }">{{ charCount('bug_evidence') }}</span>
        </div>
      </template>

      <!-- 反馈 -->
      <template v-else-if="tab === 'feedback'">
        <div class="if-field">
          <label class="if-label">
            {{ t('fb_content') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.fb_content" :placeholder="t('fb_content_ph')" :rows="6" :clearable="false" />
          <span class="if-count" :class="{ over: over('fb_content') }">{{ charCount('fb_content') }}</span>
        </div>
        <div class="if-field">
          <label class="if-label">{{ t('fb_version') }}</label>
          <SpInput v-model="fields.fb_version" :placeholder="t('fb_version_ph')" />
        </div>
        <div class="if-field">
          <label class="if-label">{{ t('fb_context') }}</label>
          <SpTextarea v-model="fields.fb_context" :placeholder="t('fb_context_ph')" :rows="4" :clearable="false" />
          <span class="if-count" :class="{ over: over('fb_context') }">{{ charCount('fb_context') }}</span>
        </div>
      </template>

      <!-- 建议 -->
      <template v-else>
        <div class="if-field">
          <label class="if-label">
            {{ t('sug_content') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.sug_content" :placeholder="t('sug_content_ph')" :rows="5" :clearable="false" />
          <span class="if-count" :class="{ over: over('sug_content') }">{{ charCount('sug_content') }}</span>
        </div>
        <div class="if-field">
          <label class="if-label">
            {{ t('sug_reason') }}
            <span class="if-req">{{ t('required') }}</span>
          </label>
          <SpTextarea v-model="fields.sug_reason" :placeholder="t('sug_reason_ph')" :rows="4" :clearable="false" />
          <span class="if-count" :class="{ over: over('sug_reason') }">{{ charCount('sug_reason') }}</span>
        </div>
        <div class="if-field">
          <label class="if-label">{{ t('sug_alternatives') }}</label>
          <SpTextarea v-model="fields.sug_alternatives" :placeholder="t('sug_alternatives_ph')" :rows="3" :clearable="false" />
          <span class="if-count" :class="{ over: over('sug_alternatives') }">{{ charCount('sug_alternatives') }}</span>
        </div>
      </template>
    </div>

    <!-- 提交按钮 -->
    <div class="if-actions">
      <button class="if-submit" :disabled="!canSubmit" @click="submit">{{ t('submitBtn') }}</button>
    </div>
  </div>
</template>

<style scoped>
  .if-root {
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    margin: 0 auto;
    max-width: 720px;
    overflow: hidden;
  }

  /* 工具栏 */
  .if-toolbar {
    align-items: baseline;
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    padding: 10px 16px;
  }

  .if-toolbar-label {
    color: var(--vp-c-text-2);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .if-lang-links {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0;
  }

  .if-lang-sep {
    color: var(--vp-c-text-3);
    font-size: 12px;
    margin: 0 5px;
    user-select: none;
  }

  .if-lang-link {
    color: var(--vp-c-text-2);
    cursor: pointer;
    font-size: 12px;
    text-decoration: none;
    transition: color 0.12s;
  }

  .if-lang-link:hover {
    color: var(--vp-c-brand-1);
    text-decoration: none;
  }

  .if-lang-link.active {
    color: var(--vp-c-brand-1);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Tabs */
  .if-tabs {
    background: var(--vp-c-bg-soft);
    border-bottom: 1px solid var(--vp-c-divider);
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .if-tab {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--vp-c-text-2);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 18px;
    transition:
      color 0.12s,
      border-color 0.12s;
    white-space: nowrap;
  }

  .if-tab:hover {
    color: var(--vp-c-brand-1);
  }

  .if-tab.active {
    border-bottom-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  /* Form */
  .if-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px;
  }

  .if-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .if-label {
    color: var(--vp-c-text-1);
    font-size: 13px;
    font-weight: 500;
  }

  .if-req {
    color: var(--vp-c-danger-1, #e53e3e);
    font-size: 11px;
    font-weight: 400;
    margin-left: 4px;
  }

  .if-input,
  .if-select,
  .if-textarea {
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    color: var(--vp-c-text-1);
    font-family: inherit;
    font-size: 13px;
    outline: none;
    padding: 7px 10px;
    transition:
      border-color 0.12s,
      box-shadow 0.12s;
    width: 100%;
  }

  .if-input:focus,
  .if-select:focus,
  .if-textarea:focus {
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
  }

  .if-textarea {
    line-height: 1.55;
    resize: vertical;
  }

  .if-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    cursor: pointer;
    padding-right: 30px;
  }

  .if-count {
    align-self: flex-end;
    color: var(--vp-c-text-3);
    font-size: 11px;
  }

  .if-count.over {
    color: var(--vp-c-danger-1, #e53e3e);
    font-weight: 600;
  }

  /* 提交 */
  .if-actions {
    background: var(--vp-c-bg-soft);
    border-top: 1px solid var(--vp-c-divider);
    display: flex;
    justify-content: flex-end;
    padding: 12px 16px;
  }

  .if-submit {
    background: var(--vp-c-brand-1);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 18px;
    transition:
      background 0.12s,
      opacity 0.12s;
  }

  .if-submit:hover:not(:disabled) {
    background: var(--vp-c-brand-2);
  }
  .if-submit:active:not(:disabled) {
    background: var(--vp-c-brand-3);
  }
  .if-submit:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  @media (max-width: 480px) {
    .if-tab {
      font-size: 12px;
      padding: 8px 12px;
    }
    .if-form {
      padding: 16px 12px;
    }
  }
</style>
