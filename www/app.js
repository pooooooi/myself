const STORAGE_KEY = "self-map-current";
const LEGACY_STORAGE_KEYS = [
  "self-map-action-first-v2",
  "self-map-action-first-v1",
  "self-map-columns-v1",
  "self-map-radial-v5",
  "self-map-radial-v4",
  "self-map-radial-v3",
  "self-map-radial-v2",
  "self-map-radial-v1",
  "self-map-v1",
];

const typeOrder = ["action", "branch", "premise", "core", "value", "practice"];

const LANGUAGE_KEY = "self-map-language";
const LANGUAGE_MODE_KEY = "self-map-language-mode";
const dictionaries = {
  ja: {
    lang: "ja",
    titleFull: "自己理解と思考整理 - Self Map：迷わず動くためのノート",
    eyebrow: "自己理解と思考整理",
    titleLead: "Self Map：",
    titleMain: "迷わず動くためのノート",
    typeLabels: {
      action: "過去の出来事",
      branch: "気持ち",
      premise: "思い込み",
      core: "価値観",
      value: "新しい価値観",
      practice: "試す行動",
    },
    writingPrompts: {
      action: "例: 資料を開く前にスマホを見続けた",
      branch: "例: 重い、失敗しそう、始めるのが怖い",
      premise: "例: ちゃんと進められないなら触らない方がいい",
      core: "例: 中途半端な自分はだめだ",
      value: "例: 10秒戻るだけでも、流れは作れる",
      practice: "例: 資料を開いて、タイトルだけ読む",
    },
    writingQuestions: {
      action: "何が起きた？ 自分は何をした／しなかった？",
      branch: "その直後、体や気持ちはどう反応した？",
      premise: "その気持ちの奥に、どんな決めつけがありそう？",
      core: "今までの自分は、どんな価値観（ものさし）でこれを見ていた？",
      value: "これからは、どんな見方を試してみたい？",
      practice: "今すぐできる最初の一歩にすると？",
    },
    guideLead: "過去の出来事から始めて、最後は今すぐできる小さな行動にする。",
    guideSteps: [
      ["過去の出来事", "さっき気になった場面を1つだけ書く"],
      ["気持ち", "重い、怖い、焦るなどをそのまま書く"],
      ["思い込み", "「ちゃんとしないとだめ」などの決めつけを書く"],
      ["価値観", "本当は何を大事にしたかったかを書く"],
      ["新しい価値観", "今の自分に合う言い方へ言い換える"],
      ["試す行動", "今すぐできる最初の一歩にする"],
    ],
    ui: {
      saved: "保存済み",
      export: "書き出し",
      import: "読み込み",
      reset: "初期化",
      writingGuide: "書き方の参考",
      entryPanel: "振り返る場面",
      deleteEntry: "場面を削除",
      newEntry: "場面を追加",
      newEntryName: "新しい場面",
      entryName: "場面の名前",
      board: "整理ボード",
      connect: "つなぐ",
      delete: "削除",
      nextWrite: "次を書く",
      startAction: "今すぐ行動開始",
      endAction: "行動を終える",
      startExperiment: "行動開始",
      running: "行動中",
      endExperiment: "終了",
      previous: "前回",
      howWasIt: "どうだった？",
      done: "できた",
      partial: "少しできた",
      notDone: "できなかった",
      memoOpen: "必要ならメモ",
      memoClose: "メモを閉じる",
      resultLabel: "実際に何をした？",
      nextLabel: "次はどう調整する？",
      applyValue: "新しい価値観へ反映",
      quickTitle: "今から何をする？",
      quickLead: "すぐ始められる形にする",
      quickExamplesLabel: "行動の例",
      quickExamples: ["開いて、最初の1行だけ見る", "宛先だけ開く", "目の前の1つだけ動かす"],
      quickPlaceholder: "例: 途切れたら、責める前に1分だけ再開する",
      close: "閉じる",
      startWithThis: "この内容で開始",
      installTitle: "ホーム画面に追加できます",
      installBody: "すぐ開けるように、アプリのように使えます。",
      add: "追加",
      firstActionPlaceholder: "例: さっき気になった場面をそのまま書く。うまく書こうとしなくてOK。",
      emptyPlaceholder: "ここに書く",
      emptyCard: "未入力のカード",
      connectStatus: "接続中: {type}「{preview}」とつなぐ相手を選ぶ",
      chooseConnectTarget: "つなぐ相手を選んでください",
      disconnect: "接続を解除しました",
      installFromMenu: "ブラウザのメニューからホーム画面に追加できます",
      resetConfirm: "初期例に戻しますか？ 今の内容は上書きされます。必要なら先に書き出してください。",
      exported: "書き出しました",
      imported: "読み込みました",
      importFailed: "読み込み失敗",
      importFailedAlert: "読み込めませんでした。書き出したJSONファイルを選んでください。",
      cannotDeleteLastEntry: "最後の場面は削除できません。初期例に戻すか、内容を書き換えて使ってください。",
      deleteEntryConfirm: "この場面を削除しますか？元に戻せません。",
      reflectionSaved: "振り返りを保存しました",
      reflectionFirst: "振り返りを先に書いてください",
      valueApplied: "新しい価値観に反映しました",
      actionCardReady: "行動内容を書けるカードを用意しました",
      actionAlreadyRunning: "行動中のカードがあります",
      writeActionFirst: "行動内容を書いてから開始できます",
      shrinkHint: "大きいかも。10秒でできる形にする？",
      shrinkButton: "もっと小さくする",
      valueReflectionText: "やってみて調整できる。まず小さく戻ればいい。",
      overlayNote: "完璧でなくてOK。終わったら気づきを残そう。",
      overlayEnd: "終了して振り返る",
      startPoint: "起点にする",
      linkGuide: "使い方",
      linkExamples: "例",
      linkArticles: "読む",
      linkDevelopment: "設計",
      linkAbout: "About",
      linkPrivacy: "Privacy",
      footerNote: "データはこの端末に保存されます。",
    },
  },
  en: {
    lang: "en",
    titleFull: "Self-understanding and Thought Sorting - Self Map: A note for moving without hesitation",
    eyebrow: "Self-understanding and thought sorting",
    titleLead: "Self Map:",
    titleMain: "A note for moving without hesitation",
    typeLabels: {
      action: "Past Event",
      branch: "Feeling",
      premise: "Assumption",
      core: "Value",
      value: "New Value",
      practice: "Action to Try",
    },
    writingPrompts: {
      action: "Example: I kept looking at my phone before opening the document",
      branch: "Example: Heavy, scared to fail, afraid to start",
      premise: "Example: If I cannot do it properly, I should not touch it",
      core: "Example: I am not good enough if I do things halfway",
      value: "Example: Even returning for a moment can restart the flow",
      practice: "Example: Open the document and read only the title",
    },
    writingQuestions: {
      action: "What happened? What did you do or avoid doing?",
      branch: "How did your body or feelings react right after that?",
      premise: "What hidden assumption might be behind that feeling?",
      core: "What value or rule were you using to see this?",
      value: "What new way of seeing this would you like to try?",
      practice: "What is the first step you can do right now?",
    },
    guideLead: "Start from a past event and end with one small action you can do now.",
    guideSteps: [
      ["Past Event", "Write one scene that caught your attention"],
      ["Feeling", "Write the raw feeling: heavy, scared, rushed"],
      ["Assumption", "Write the rule you may be holding"],
      ["Value", "Write what you actually wanted to care about"],
      ["New Value", "Rephrase it into words that fit you now"],
      ["Action to Try", "Make it the first step you can do now"],
    ],
    ui: {
      saved: "Saved",
      export: "Export",
      import: "Import",
      reset: "Reset",
      writingGuide: "Writing guide",
      entryPanel: "Scenes to reflect on",
      deleteEntry: "Delete scene",
      newEntry: "Add scene",
      newEntryName: "New scene",
      entryName: "Scene name",
      board: "Sorting board",
      connect: "Connect",
      delete: "Delete",
      nextWrite: "Next",
      startAction: "Start action now",
      endAction: "End action",
      startExperiment: "Start action",
      running: "In action",
      endExperiment: "Finish",
      previous: "Previous",
      howWasIt: "How did it go?",
      done: "Done",
      partial: "A little",
      notDone: "Not done",
      memoOpen: "Add note",
      memoClose: "Close note",
      resultLabel: "What did you actually do?",
      nextLabel: "How will you adjust next time?",
      applyValue: "Apply to new value",
      quickTitle: "What will you do now?",
      quickLead: "Make it easy to start",
      quickExamplesLabel: "Action examples",
      quickExamples: ["Open it and read the first line", "Open only the recipient", "Move just one thing nearby"],
      quickPlaceholder: "Example: Restart for one minute before blaming myself",
      close: "Close",
      startWithThis: "Start with this",
      installTitle: "Add to home screen",
      installBody: "Use it like an app and open it quickly.",
      add: "Add",
      firstActionPlaceholder: "Example: Write the scene that just bothered you. It does not need to be perfect.",
      emptyPlaceholder: "Write here",
      emptyCard: "Empty card",
      connectStatus: "Connecting: choose a card to connect with {type} “{preview}”",
      chooseConnectTarget: "Choose a card to connect",
      disconnect: "Connection removed",
      installFromMenu: "You can add this from your browser menu",
      resetConfirm: "Reset to the sample? Your current notes will be overwritten. Export first if needed.",
      exported: "Exported",
      imported: "Imported",
      importFailed: "Import failed",
      importFailedAlert: "Could not import it. Choose a JSON file exported from this app.",
      cannotDeleteLastEntry: "The last scene cannot be deleted. Reset to the sample or rewrite it.",
      deleteEntryConfirm: "Delete this scene? This cannot be undone.",
      reflectionSaved: "Reflection saved",
      reflectionFirst: "Write the reflection first",
      valueApplied: "Applied to the new value",
      actionCardReady: "Prepared a card for your action",
      actionAlreadyRunning: "Another action is already running",
      writeActionFirst: "Write the action before starting",
      shrinkHint: "This may be too big. Make it doable in 10 seconds?",
      shrinkButton: "Make smaller",
      valueReflectionText: "I can adjust after trying. First, return in a small way.",
      overlayNote: "It does not need to be perfect. Leave a note when you finish.",
      overlayEnd: "Finish and reflect",
      startPoint: "Start point",
      linkGuide: "Guide",
      linkExamples: "Examples",
      linkArticles: "Read",
      linkDevelopment: "Design",
      linkAbout: "About",
      linkPrivacy: "Privacy",
      footerNote: "Data is saved on this device.",
    },
  },
  zh: {
    lang: "zh-Hans",
    titleFull: "自我理解与思考整理 - Self Map：帮助你不再犹豫的笔记",
    eyebrow: "自我理解与思考整理",
    titleLead: "Self Map：",
    titleMain: "帮助你不再犹豫的笔记",
    typeLabels: {
      action: "过去的事件",
      branch: "感受",
      premise: "固有想法",
      core: "价值观",
      value: "新的价值观",
      practice: "尝试行动",
    },
    writingPrompts: {
      action: "例：打开资料前一直在看手机",
      branch: "例：沉重、怕失败、不敢开始",
      premise: "例：如果不能好好做，就不要碰",
      core: "例：半途而废的自己是不行的",
      value: "例：只要回来一点点，也能重新开始",
      practice: "例：打开资料，只读标题",
    },
    writingQuestions: {
      action: "发生了什么？你做了什么，或没有做什么？",
      branch: "之后身体或心情有什么反应？",
      premise: "这种感受背后，可能有什么固定想法？",
      core: "你当时用什么价值观或标准看待这件事？",
      value: "接下来想尝试用什么新的看法？",
      practice: "现在可以做的第一小步是什么？",
    },
    guideLead: "从过去的事件开始，最后变成一个现在就能做的小行动。",
    guideSteps: [
      ["过去的事件", "写下刚才在意的一个场景"],
      ["感受", "直接写沉重、害怕、焦急等感受"],
      ["固有想法", "写下可能卡住自己的判断"],
      ["价值观", "写下自己真正想重视的东西"],
      ["新的价值观", "换成更适合现在自己的说法"],
      ["尝试行动", "变成现在就能做的第一步"],
    ],
    ui: {
      saved: "已保存",
      export: "导出",
      import: "导入",
      reset: "重置",
      writingGuide: "写法参考",
      entryPanel: "回顾场景",
      deleteEntry: "删除场景",
      newEntry: "添加场景",
      newEntryName: "新场景",
      entryName: "场景名称",
      board: "整理看板",
      connect: "连接",
      delete: "删除",
      nextWrite: "下一步",
      startAction: "现在开始行动",
      endAction: "结束行动",
      startExperiment: "开始行动",
      running: "行动中",
      endExperiment: "结束",
      previous: "上次",
      howWasIt: "结果如何？",
      done: "做到了",
      partial: "做了一点",
      notDone: "没做到",
      memoOpen: "需要的话写备注",
      memoClose: "关闭备注",
      resultLabel: "实际做了什么？",
      nextLabel: "下次怎么调整？",
      applyValue: "反映到新的价值观",
      quickTitle: "现在要做什么？",
      quickLead: "改成容易开始的形式",
      quickExamplesLabel: "行动例子",
      quickExamples: ["打开它，只读第一行", "只打开收件人", "只移动眼前的一个东西"],
      quickPlaceholder: "例：责备自己之前，先重新开始1分钟",
      close: "关闭",
      startWithThis: "用这个开始",
      installTitle: "可以添加到主屏幕",
      installBody: "像应用一样快速打开。",
      add: "添加",
      firstActionPlaceholder: "例：直接写下刚才在意的场景。不需要写得完美。",
      emptyPlaceholder: "在这里写",
      emptyCard: "空卡片",
      connectStatus: "连接中：选择要和{type}「{preview}」连接的卡片",
      chooseConnectTarget: "请选择要连接的卡片",
      disconnect: "已取消连接",
      installFromMenu: "可以从浏览器菜单添加到主屏幕",
      resetConfirm: "恢复为示例吗？当前内容会被覆盖。需要的话请先导出。",
      exported: "已导出",
      imported: "已导入",
      importFailed: "导入失败",
      importFailedAlert: "无法导入。请选择从本应用导出的 JSON 文件。",
      cannotDeleteLastEntry: "最后一个场景不能删除。请恢复示例或直接改写内容。",
      deleteEntryConfirm: "删除这个场景吗？此操作无法撤销。",
      reflectionSaved: "回顾已保存",
      reflectionFirst: "请先写回顾",
      valueApplied: "已反映到新的价值观",
      actionCardReady: "已准备好可写行动内容的卡片",
      actionAlreadyRunning: "已有行动正在进行中",
      writeActionFirst: "请先写行动内容再开始",
      shrinkHint: "可能太大了。要改成10秒能做的形式吗？",
      shrinkButton: "变得更小",
      valueReflectionText: "试过之后可以再调整。先小小地回到行动。",
      overlayNote: "不需要完美。结束后留下发现就好。",
      overlayEnd: "结束并回顾",
      startPoint: "作为起点",
      linkGuide: "用法",
      linkExamples: "例子",
      linkArticles: "阅读",
      linkDevelopment: "设计",
      linkAbout: "关于",
      linkPrivacy: "隐私",
      footerNote: "数据保存在此设备上。",
    },
  },
};

let currentLanguage = getInitialLanguage();
if (!dictionaries[currentLanguage]) currentLanguage = "ja";
let typeLabels = dictionaries.ja.typeLabels;
let writingPrompts = dictionaries.ja.writingPrompts;
let writingQuestions = dictionaries.ja.writingQuestions;

function dict() {
  return dictionaries[currentLanguage] ?? dictionaries.ja;
}

function ui(key) {
  return dict().ui[key] ?? dictionaries.ja.ui[key] ?? key;
}

function refreshLanguageResources() {
  typeLabels = dict().typeLabels;
  writingPrompts = dict().writingPrompts;
  writingQuestions = dict().writingQuestions;
}

function detectInitialLanguage() {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const language = languages.find(Boolean)?.toLowerCase() ?? "";
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("zh")) return "zh";
  if (language.startsWith("en")) return "en";
  return "en";
}

function getInitialLanguage() {
  if (localStorage.getItem(LANGUAGE_MODE_KEY) !== "manual") return detectInitialLanguage();
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  return dictionaries[savedLanguage] ? savedLanguage : detectInitialLanguage();
}

refreshLanguageResources();

const defaultState = {
  core:
    "気分を変えてから動くより、10秒だけ手をつける方が戻りやすい。",
  selectedId: "n1",
  activeSessionId: null,
  sessions: [],
  nodes: [
    {
      id: "n1",
      parentIds: [],
      type: "action",
      text: "資料を開く前にスマホを見続けた",
      confidence: 80,
    },
    {
      id: "n2",
      parentIds: ["n1"],
      type: "branch",
      text: "重い。失敗しそうで、始めるのが怖い",
      confidence: 70,
    },
    {
      id: "n3",
      parentIds: ["n2"],
      type: "premise",
      text: "ちゃんと進められないなら触らない方がいい",
      confidence: 65,
    },
    {
      id: "n4",
      parentIds: ["n3"],
      type: "core",
      text: "中途半端な自分はだめだ",
      confidence: 55,
    },
    {
      id: "n5",
      parentIds: ["n4"],
      type: "value",
      text: "10秒戻るだけでも、流れは作れる",
      confidence: 55,
    },
    {
      id: "n6",
      parentIds: ["n5"],
      type: "practice",
      text: "資料を開いて、タイトルだけ読む",
      confidence: 60,
    },
  ],
};
let appState = loadAppState();
let state = getActiveEntry();
let draggedId = null;
let dropHandled = false;
let linkingId = null;
let pendingFocusId = null;
let pendingScrollId = null;
let pendingScrollType = null;
let timerId = null;
let showArchivedEntries = false;
let stepMode = false;
let stepIndex = 0;
const expandedReflections = new Set();

const coreText = document.querySelector("#coreText");
const links = document.querySelector("#links");
const entryTabs = document.querySelector("#entryTabs");
const connectionStatus = document.querySelector("#connectionStatus");
const stepControls = document.querySelector("#stepControls");
const stepLabel = document.querySelector("#stepLabel");
const template = document.querySelector("#nodeTemplate");
const editor = document.querySelector("#editor");
const emptyState = document.querySelector("#emptyState");
const nodeType = document.querySelector("#nodeType");
const nodeParent = document.querySelector("#nodeParent");
const nodeConfidence = document.querySelector("#nodeConfidence");
const confidenceValue = document.querySelector("#confidenceValue");
const saveStatus = document.querySelector("#saveStatus");
const importFile = document.querySelector("#importFile");
const languageButtons = document.querySelectorAll("[data-language]");
const experimentOverlay = document.querySelector("#experimentOverlay");
const overlayPracticeText = document.querySelector("#overlayPracticeText");
const overlayTimer = document.querySelector("#overlayTimer");
const overlayEnd = document.querySelector("#overlayEnd");
const mobileStartAction = document.querySelector("#mobileStartAction");
const installPrompt = document.querySelector("#installPrompt");
const installApp = document.querySelector("#installApp");
const dismissInstall = document.querySelector("#dismissInstall");
let deferredInstallPrompt = null;
let quickActionPanel = null;
let quickActionInput = null;
let quickActionNodeId = null;

function isNativeApp() {
  return Boolean(window.Capacitor?.isNativePlatform?.());
}

document.querySelector("#newEntry").addEventListener("click", createEntry);
document.querySelector("#deleteEntry").addEventListener("click", deleteCurrentEntry);
document.querySelector("#prevStep").addEventListener("click", () => moveStep(-1));
document.querySelector("#nextStep").addEventListener("click", () => moveStep(1));
installApp.addEventListener("click", installPwa);
dismissInstall.addEventListener("click", dismissInstallPrompt);
document.querySelector("#exportData").addEventListener("click", exportData);
document.querySelector("#importData").addEventListener("click", () => importFile.click());
document.querySelector("#resetDemo").addEventListener("click", resetDemo);
languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
document.querySelector("#addChild").addEventListener("click", () => {
  const selected = findNode(state.selectedId);
  if (selected) addNode(selected.id, childTypeFor(selected.type));
});
document.querySelector("#deleteNode").addEventListener("click", () => deleteNode(state.selectedId));
importFile.addEventListener("change", importData);
overlayEnd.addEventListener("click", () => {
  const activeSession = getActiveSession();
  if (activeSession) endSession(activeSession.id);
});
mobileStartAction?.addEventListener("click", handleQuickStartClick);

coreText.addEventListener("input", () => {
  state.core = coreText.value;
  saveState();
});

nodeType.addEventListener("input", updateSelectedFromEditor);
nodeParent.addEventListener("input", updateSelectedFromEditor);
nodeConfidence.addEventListener("input", updateSelectedFromEditor);
window.addEventListener("resize", drawLinks);
document.querySelector(".map-panel").addEventListener("scroll", drawLinks);

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isEditing =
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;

  if (event.key === "Escape" && linkingId) {
    linkingId = null;
    updateConnectionStatus();
    markLinkTargets();
    drawLinks();
    return;
  }

  if (event.key !== "Delete" || isEditing || !state.selectedId) return;
  event.preventDefault();
  deleteNode(state.selectedId);
});

document.querySelectorAll("[data-add-type]").forEach((button) => {
  button.addEventListener("click", () => {
    addNode(defaultParentFor(button.dataset.addType), button.dataset.addType);
  });
});

document.querySelectorAll(".lane-body").forEach((lane) => {
  lane.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (event.target.closest(".card")) return;
    lane.classList.add("drop-target");
  });

  lane.addEventListener("dragleave", () => {
    lane.classList.remove("drop-target");
  });

  lane.addEventListener("drop", (event) => {
    event.preventDefault();
    if (dropHandled) {
      dropHandled = false;
      return;
    }
    lane.classList.remove("drop-target");
    const droppedId = draggedId ?? event.dataTransfer.getData("text/plain");
    const node = findNode(droppedId);
    if (!node) return;
    node.type = lane.dataset.lane;
    normalizeConnections(node);
    moveNodeToEnd(node.id);
    state.selectedId = node.id;
    saveAndRender();
  });
});

applyStaticText();
render();
if (state.activeSessionId) startTimer();
updateExperimentOverlay();
setupInstallPrompt();

function setLanguage(language) {
  currentLanguage = dictionaries[language] ? language : "ja";
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  localStorage.setItem(LANGUAGE_MODE_KEY, "manual");
  refreshLanguageResources();
  applyStaticText();
  render();
}

function applyStaticText() {
  const currentDict = dict();
  document.documentElement.lang = currentDict.lang;
  document.title = currentDict.titleFull;
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  setText(".eyebrow", currentDict.eyebrow);
  const title = document.querySelector("h1");
  if (title) {
    title.replaceChildren();
    const lead = document.createElement("span");
    lead.textContent = currentDict.titleLead;
    const main = document.createElement("span");
    main.textContent = currentDict.titleMain;
    title.append(lead, main);
  }

  setText("#saveStatus", ui("saved"));
  setText("#exportData", ui("export"));
  setText("#importData", ui("import"));
  setText("#resetDemo", ui("reset"));
  setText("#deleteEntry", ui("deleteEntry"));
  setText("#newEntry", ui("newEntry"));
  setText("#prevStep", currentLanguage === "en" ? "Back" : currentLanguage === "zh" ? "上一步" : "前へ");
  setText("#nextStep", currentLanguage === "en" ? "Next" : currentLanguage === "zh" ? "下一步" : "次へ");
  setText("#mobileStartAction", getActiveSession() ? ui("endAction") : ui("startAction"));
  setText("#installApp", ui("add"));
  setText("#dismissOnboarding", ui("close"));
  setText(".guide-head strong", ui("writingGuide"));
  setText(".guide-head span", currentDict.guideLead);
  setText(".entry-tabs-head strong", ui("entryPanel"));
  setText(".install-prompt strong", ui("installTitle"));
  setText(".install-prompt span", ui("installBody"));
  setText(".overlay-note", ui("overlayNote"));
  setText("#overlayEnd", ui("overlayEnd"));

  document.querySelector(".writing-guide")?.setAttribute("aria-label", ui("writingGuide"));
  document.querySelector(".entry-tabs-panel")?.setAttribute("aria-label", ui("entryPanel"));
  document.querySelector(".board")?.setAttribute("aria-label", ui("board"));
  document.querySelector("#dismissInstall")?.setAttribute("aria-label", ui("close"));
  renderGuideSteps();
  updateNodeTypeOptions();
  updateLocalizedLinks();
  setupQuickActionComposer();
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function renderGuideSteps() {
  const steps = document.querySelectorAll(".guide-strip p");
  dict().guideSteps.forEach(([title, body], index) => {
    const step = steps[index];
    if (!step) return;
    step.querySelector("b").textContent = title;
    step.querySelector("span").textContent = body;
  });
}

function updateLocalizedLinks() {
  const suffix = currentLanguage === "ja" ? "" : `-${currentLanguage}`;
  const pageMap = {
    guide: `guide${suffix}.html`,
    examples: `examples${suffix}.html`,
    articles: `articles${suffix}.html`,
    development: `development-notes${suffix}.html`,
    about: `about${suffix}.html`,
    privacy: `privacy${suffix}.html`,
  };
  const labelMap = {
    guide: ui("linkGuide"),
    examples: ui("linkExamples"),
    articles: ui("linkArticles"),
    development: ui("linkDevelopment"),
    about: ui("linkAbout"),
    privacy: ui("linkPrivacy"),
  };

  document.querySelectorAll("[data-page]").forEach((link) => {
    const page = link.dataset.page;
    if (pageMap[page]) link.setAttribute("href", pageMap[page]);
    if (labelMap[page]) link.textContent = labelMap[page];
  });
  setText('[data-localized="footerNote"]', ui("footerNote"));
}


function updateNodeTypeOptions() {
  [...nodeType.options].forEach((option) => {
    option.textContent = typeLabels[option.value] ?? option.textContent;
  });
}

function loadAppState() {
  const raw = localStorage.getItem(STORAGE_KEY) ?? findLegacyState();
  if (!raw) return createAppStateFromEntry(structuredClone(defaultState));

  try {
    const parsed = JSON.parse(raw);
    const loadedState = normalizeAppState(parsed);
    return hasCorruptedAppText(loadedState)
      ? createAppStateFromEntry(structuredClone(defaultState))
      : loadedState;
  } catch {
    return createAppStateFromEntry(structuredClone(defaultState));
  }
}

function findLegacyState() {
  for (const key of LEGACY_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) return raw;
  }
  return null;
}

function createAppStateFromEntry(entry) {
  const normalizedEntry = normalizeEntry(entry);
  return {
    activeEntryId: normalizedEntry.id,
    entries: [normalizedEntry],
  };
}

function normalizeAppState(rawState) {
  if (Array.isArray(rawState?.entries)) {
    const entries = rawState.entries.map(normalizeEntry).filter(Boolean);
    if (!entries.length) return createAppStateFromEntry(structuredClone(defaultState));
    const activeEntryId = entries.some((entry) => entry.id === rawState.activeEntryId)
      ? rawState.activeEntryId
      : entries[0].id;
    return { activeEntryId, entries };
  }

  const importedState = rawState?.state ?? rawState;
  return createAppStateFromEntry(importedState);
}

function normalizeEntry(rawEntry) {
  const entry = normalizeState(rawEntry);
  entry.id = typeof rawEntry?.id === "string" ? rawEntry.id : crypto.randomUUID();
  entry.createdAt = Number.isFinite(Number(rawEntry?.createdAt)) ? Number(rawEntry.createdAt) : Date.now();
  entry.updatedAt = Number.isFinite(Number(rawEntry?.updatedAt)) ? Number(rawEntry.updatedAt) : entry.createdAt;
  entry.customTitle = typeof rawEntry?.customTitle === "string" ? rawEntry.customTitle : "";
  entry.archivedAt = Number.isFinite(Number(rawEntry?.archivedAt)) ? Number(rawEntry.archivedAt) : null;
  return entry;
}

function getActiveEntry() {
  return (
    appState.entries.find((entry) => entry.id === appState.activeEntryId) ??
    getVisibleEntries()[0] ??
    appState.entries[0]
  );
}

function getVisibleEntries() {
  return appState.entries.filter((entry) => showArchivedEntries || !entry.archivedAt);
}

function normalizeState(rawState) {
  const nextState = {
    core: typeof rawState?.core === "string" ? rawState.core : defaultState.core,
    selectedId: typeof rawState?.selectedId === "string" ? rawState.selectedId : null,
    activeSessionId:
      typeof rawState?.activeSessionId === "string" ? rawState.activeSessionId : null,
    sessions: Array.isArray(rawState?.sessions) ? rawState.sessions : [],
    nodes: Array.isArray(rawState?.nodes) ? rawState.nodes : [],
  };

  nextState.nodes = nextState.nodes
    .filter((node) => node && typeof node.id === "string")
    .map((node) => ({
      id: node.id,
      parentIds: normalizeParentIds(node),
      type: typeOrder.includes(node.type) ? node.type : migrateType(node.type),
      text: typeof node.text === "string" ? node.text : "",
      confidence: Number.isFinite(Number(node.confidence))
        ? Math.min(Math.max(Number(node.confidence), 0), 100)
        : 50,
    }))
    .filter((node) => typeOrder.includes(node.type));

  for (const node of nextState.nodes) normalizeParentForState(nextState, node);

  const nodeIds = new Set(nextState.nodes.map((node) => node.id));
  nextState.sessions = nextState.sessions
    .filter((session) => session && typeof session.id === "string")
    .map((session) => ({
      id: session.id,
      nodeId: typeof session.nodeId === "string" ? session.nodeId : "",
      startedAt: Number.isFinite(Number(session.startedAt))
        ? Number(session.startedAt)
        : Date.now(),
      endedAt: Number.isFinite(Number(session.endedAt)) ? Number(session.endedAt) : null,
      durationSec: Number.isFinite(Number(session.durationSec))
        ? Number(session.durationSec)
        : null,
      result: typeof session.result === "string" ? session.result : "",
      feeling: typeof session.feeling === "string" ? session.feeling : "",
      outcome: normalizedOutcome(session.outcome || session.feeling),
      nextAction: typeof session.nextAction === "string" ? session.nextAction : "",
    }))
    .filter((session) => nodeIds.has(session.nodeId));

  if (!nextState.sessions.some((session) => session.id === nextState.activeSessionId && !session.endedAt)) {
    nextState.activeSessionId = null;
  }

  if (!nextState.nodes.some((node) => node.id === nextState.selectedId)) {
    nextState.selectedId = nextState.nodes[0]?.id ?? null;
  }

  return nextState;
}

function hasCorruptedAppText(targetAppState) {
  const values = targetAppState.entries.flatMap((entry) => [
    entry.core,
    entry.title,
    ...entry.nodes.map((node) => node.text),
    ...entry.sessions.flatMap((session) => [
      session.result,
      session.feeling,
      session.nextAction,
    ]),
  ]);
  const corruptedTextPattern = new RegExp("[\\u7e3a\\u7e67\\u86df\\u9666\\u8700\\u8b41\\u8c4c\\u8b17\\u9695\\u8ae2\\u8389]");
  return values.some((value) => corruptedTextPattern.test(value));
}

function setupInstallPrompt() {
  if (isNativeApp()) return;
  if (localStorage.getItem("self-map-install-dismissed") === "1") return;
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone;
  if (isStandalone) return;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallPrompt();
  });
  window.addEventListener("appinstalled", dismissInstallPrompt);
}

function showInstallPrompt() {
  if (localStorage.getItem("self-map-install-dismissed") === "1") return;
  installPrompt.classList.remove("hidden");
}

async function installPwa() {
  if (!deferredInstallPrompt) {
    showSaveStatus(ui("installFromMenu"));
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  dismissInstallPrompt();
}

function dismissInstallPrompt() {
  localStorage.setItem("self-map-install-dismissed", "1");
  installPrompt.classList.add("hidden");
}

function migrateType(type) {
  if (type === "root") return "premise";
  if (type === "note") return "core";
  return "action";
}

function normalizeParentForState(targetState, node) {
  const parentType = previousType(node.type);
  if (!parentType) {
    node.parentIds = [];
    return;
  }
  const descendants = collectDescendantsInState(targetState, node.id);
  node.parentIds = node.parentIds.filter((parentId, index, allIds) => {
    if (index !== allIds.indexOf(parentId)) return false;
    const parent = targetState.nodes.find((candidate) => candidate.id === parentId);
    return parent && parent.type === parentType && !descendants.has(parent.id);
  });
}

function collectDescendantsInState(targetState, id) {
  const ids = new Set([id]);
  let added = true;
  while (added) {
    added = false;
    for (const node of targetState.nodes) {
      if (node.parentIds?.some((parentId) => ids.has(parentId)) && !ids.has(node.id)) {
        ids.add(node.id);
        added = true;
      }
    }
  }
  return ids;
}

function normalizeParentIds(node) {
  const rawIds = Array.isArray(node.parentIds)
    ? node.parentIds
    : typeof node.parentId === "string"
      ? [node.parentId]
      : [];
  return rawIds.filter((id, index, allIds) => typeof id === "string" && allIds.indexOf(id) === index);
}

function saveState() {
  state.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  showSaveStatus(ui("saved"));
}

function showSaveStatus(message) {
  saveStatus.textContent = message;
  window.clearTimeout(showSaveStatus.timeoutId);
  showSaveStatus.timeoutId = window.setTimeout(() => {
    saveStatus.textContent = ui("saved");
  }, 1800);
}

function resetDemo() {
  if (!confirm(ui("resetConfirm"))) {
    return;
  }
  appState = createAppStateFromEntry(structuredClone(defaultState));
  state = getActiveEntry();
  saveAndRender();
}

function exportData() {
  saveState();
  const payload = {
    app: "self-map",
    version: 2,
    exportedAt: new Date().toISOString(),
    ...appState,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `self-map-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showSaveStatus(ui("exported"));
}

function importData(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      appState = normalizeAppState(parsed);
      state = getActiveEntry();
      saveAndRender();
      showSaveStatus(ui("imported"));
    } catch {
      showSaveStatus(ui("importFailed"));
      alert(ui("importFailedAlert"));
    }
  });
  reader.readAsText(file);
}
function saveAndRender() {
  saveState();
  render();
}

function render() {
  state = getActiveEntry();
  appState.activeEntryId = state.id;
  coreText.value = state.core;
  renderEntryTabs();
  renderLaneHeaders();
  updateConnectionStatus();
  renderStepMode();

  document.querySelectorAll(".lane-body").forEach((lane) => {
    lane.innerHTML = "";
  });

  for (const type of typeOrder) {
    const lane = document.querySelector(`[data-lane="${type}"]`);
    state.nodes
      .filter((node) => node.type === type)
      .forEach((node) => lane.append(renderCard(node)));
  }

  if (mobileStartAction) {
    mobileStartAction.textContent = getActiveSession() ? ui("endAction") : ui("startAction");
  }

  renderEditor();
  requestAnimationFrame(() => {
    drawLinks();
    scrollPendingLane();
    focusPendingNode();
  });
}

function renderEntryTabs() {
  entryTabs.innerHTML = "";
  for (const entry of [...getVisibleEntries()].sort((a, b) => b.updatedAt - a.updatedAt)) {
    const wrapper = document.createElement("div");
    wrapper.className = "entry-tab";
    wrapper.classList.toggle("active", entry.id === appState.activeEntryId);
    wrapper.classList.toggle("archived", Boolean(entry.archivedAt));

    const name = document.createElement("input");
    name.className = "entry-title-input";
    name.value = deriveEntryTitle(entry);
    name.setAttribute("aria-label", ui("entryName"));
    name.addEventListener("focus", () => switchEntry(entry.id));
    name.addEventListener("input", () => {
      entry.customTitle = name.value;
      entry.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    });
    name.addEventListener("keydown", (event) => {
      if (event.key === "Enter") name.blur();
    });

    const meta = document.createElement("button");
    meta.className = "entry-tab-meta";
    meta.type = "button";
    meta.textContent = formatEntryDate(entry.updatedAt);
    meta.addEventListener("click", () => switchEntry(entry.id));

    wrapper.append(name, meta);
    entryTabs.append(wrapper);
  }
}

function createEntry() {
  const entry = normalizeEntry({
    ...structuredClone(defaultState),
    id: crypto.randomUUID(),
    core: "",
    selectedId: null,
    activeSessionId: null,
    sessions: [],
    nodes: [],
    customTitle: ui("newEntryName"),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  appState.entries.push(entry);
  appState.activeEntryId = entry.id;
  state = entry;
  addNode(null, "action", { prepend: true });
}

function deleteCurrentEntry() {
  if (appState.entries.length <= 1) {
    alert(ui("cannotDeleteLastEntry"));
    return;
  }
  if (!confirm(ui("deleteEntryConfirm"))) return;
  const deletingId = state.id;
  appState.entries = appState.entries.filter((entry) => entry.id !== deletingId);
  appState.activeEntryId = getVisibleEntries()[0]?.id ?? appState.entries[0].id;
  state = getActiveEntry();
  saveAndRender();
}

function switchEntry(id) {
  if (appState.activeEntryId === id) return;
  appState.activeEntryId = id;
  state = getActiveEntry();
  linkingId = null;
  pendingFocusId = null;
  stopTimerIfIdle();
  saveAndRender();
  updateExperimentOverlay();
}

function deriveEntryTitle(entry) {
  if (entry.customTitle?.trim()) return entry.customTitle.trim();
  const actionText = entry.nodes?.find((node) => node.type === "action" && node.text.trim())?.text.trim();
  if (actionText) return actionText.slice(0, 28);
  return ui("newEntryName");
}

function formatEntryDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function renderLaneHeaders() {
  document.querySelectorAll(".lane").forEach((lane) => {
    const label = typeLabels[lane.dataset.type];
    const title = lane.querySelector("header span");
    if (label && title) title.textContent = label;
  });
}

function toggleStepMode() {
  stepMode = !stepMode;
  if (state.selectedId) {
    const selected = findNode(state.selectedId);
    const selectedIndex = typeOrder.indexOf(selected?.type);
    if (selectedIndex >= 0) stepIndex = selectedIndex;
  }
  renderStepMode();
}

function moveStep(delta) {
  stepIndex = Math.min(Math.max(stepIndex + delta, 0), typeOrder.length - 1);
  renderStepMode();
  document.querySelector(".map-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderStepMode() {
  stepMode = false;
  document.body.classList.remove("step-mode");
  stepControls.classList.toggle("hidden", !stepMode);
  const activeType = typeOrder[stepIndex];
  stepLabel.textContent = `${stepIndex + 1}/${typeOrder.length} ${typeLabels[activeType]}`;
  document.querySelector("#prevStep").disabled = stepIndex === 0;
  document.querySelector("#nextStep").disabled = stepIndex === typeOrder.length - 1;
  document.querySelectorAll(".lane").forEach((lane) => {
    lane.classList.toggle("step-active", lane.dataset.type === activeType);
  });
}

function updateConnectionStatus() {
  const source = findNode(linkingId);
  connectionStatus.classList.toggle("hidden", !source);
  if (!source) {
    connectionStatus.textContent = "";
    return;
  }
  const preview = source.text.trim() || writingPrompts[source.type] || ui("emptyCard");
  connectionStatus.textContent = ui("connectStatus")
    .replace("{type}", typeLabels[source.type])
    .replace("{preview}", preview.slice(0, 28));
}

function renderCard(node) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.dataset.nodeId = node.id;
  card.dataset.type = node.type;
  card.classList.toggle("selected", node.id === state.selectedId);
  card.classList.toggle("link-source", node.id === linkingId);
  card.classList.toggle("connect-target", Boolean(linkingId) && canReconnectTo(node.id));
  card.classList.toggle("connected-target", Boolean(linkingId) && isConnectedTo(linkingId, node.id));
  card.querySelector(".type-label").textContent = typeLabels[node.type];
  card.querySelector(".card-question").textContent = writingQuestions[node.type];
  card.querySelector(".card-link").textContent = ui("connect");
  card.querySelector(".card-delete").textContent = ui("delete");
  const addButton = card.querySelector(".card-add");
  addButton.textContent = node.type === "practice" ? "+" : ui("nextWrite");
  addButton.title = node.type === "practice" ? ui("add") : `${ui("nextWrite")}: ${typeLabels[childTypeFor(node.type)]}`;

  const textInput = card.querySelector(".card-text");
  textInput.placeholder = placeholderForNode(node);
  textInput.value = node.text;
  resizeText(textInput);

  card.addEventListener("click", () => {
    if (linkingId && linkingId !== node.id) {
      reconnectTo(node.id);
      return;
    }
    selectNode(node.id);
  });

  const dragHandle = card.querySelector(".card-meta");
  dragHandle.addEventListener("dragstart", (event) => {
    draggedId = node.id;
    dropHandled = false;
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", node.id);
  });

  dragHandle.addEventListener("dragend", () => {
    draggedId = null;
    dropHandled = false;
    card.classList.remove("dragging");
    document.querySelectorAll(".drop-target, .connect-target, .connected-target, .reorder-target").forEach((target) => {
      target.classList.remove("drop-target");
      target.classList.remove("connect-target");
      target.classList.remove("connected-target");
      target.classList.remove("reorder-target");
    });
  });

  card.addEventListener("dragover", (event) => {
    const activeId = draggedId ?? event.dataTransfer.getData("text/plain");
    if (!activeId || activeId === node.id) return;
    if (!canReconnectTo(node.id) && !canReorderWith(node.id)) return;
    event.preventDefault();
    card.classList.toggle("connect-target", canReconnectTo(node.id));
    card.classList.toggle("reorder-target", canReorderWith(node.id));
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("connect-target", "reorder-target");
  });

  card.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    card.classList.remove("connect-target", "reorder-target");
    const activeId = draggedId ?? event.dataTransfer.getData("text/plain");
    if (!activeId || activeId === node.id) return;

    const dragged = findNode(activeId);
    if (!dragged) return;

    if (canReconnectTo(node.id)) {
      connectNodes(activeId, node.id);
      state.selectedId = activeId;
      dropHandled = true;
      saveAndRender();
      return;
    }

    if (dragged.type === node.type) {
      reorderNodeNear(dragged.id, node.id, event.clientY);
      state.selectedId = dragged.id;
      dropHandled = true;
      saveAndRender();
    }
  });

  textInput.addEventListener("focus", () => selectNode(node.id));
  textInput.addEventListener("input", () => {
    node.text = textInput.value;
    resizeText(textInput);
    saveState();
    drawLinks();
  });

  addButton.addEventListener("click", (event) => {
    event.stopPropagation();
    addNode(node.id, childTypeFor(node.type));
  });

  card.querySelector(".card-link").addEventListener("click", (event) => {
    event.stopPropagation();
    startLinking(node.id);
  });

  card.querySelector(".card-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deleteNode(node.id);
  });

  if (node.type === "practice" && isPracticeTooLarge(node.text)) {
    card.append(renderShrinkHint(node, textInput));
  }

  if (node.type === "practice") renderPracticeTools(card, node);
  return card;
}

function placeholderForNode(node) {
  if (
    node.type === "action" &&
    state.nodes.filter((candidate) => candidate.type === "action").length === 1 &&
    !node.text.trim()
  ) {
    return ui("firstActionPlaceholder");
  }
  return writingPrompts[node.type] ?? ui("emptyPlaceholder");
}

function isPracticeTooLarge(text) {
  const value = text.trim();
  if (!value) return false;
  return value.length > 24 || /毎日|全部|完璧|次回|次の|いつか|ちゃんと|しっかり/.test(value);
}

function renderShrinkHint(node, textInput) {
  const hint = document.createElement("section");
  hint.className = "shrink-hint";
  hint.innerHTML = `
    <span>${escapeHtml(ui("shrinkHint"))}</span>
    <button type="button">${escapeHtml(ui("shrinkButton"))}</button>
  `;
  hint.querySelector("button").addEventListener("click", (event) => {
    event.stopPropagation();
    node.text = suggestSmallerPractice(node.text);
    textInput.value = node.text;
    resizeText(textInput);
    saveState();
    render();
  });
  return hint;
}

function suggestSmallerPractice(text) {
  if (currentLanguage === "en") return "Do the first 10 seconds only";
  if (currentLanguage === "zh") return "先做最开始的10秒";
  if (/資料|書類|ファイル|画面/.test(text)) return "開いて、最初の1行だけ見る";
  if (/連絡|返信|メール|チャット/.test(text)) return "宛先だけ開く";
  if (/片付|掃除/.test(text)) return "目の前の1つだけ動かす";
  if (/運動|歩/.test(text)) return "立って10秒だけ伸びる";
  return "最初の10秒だけ手をつける";
}

function renderPracticeTools(card, node) {
  const tools = card.querySelector(".card-tools");
  const activeSession = getActiveSessionForNode(node.id);
  const latestEndedSession = getLatestEndedSessionForNode(node.id);

  if (!activeSession) {
    const startButton = document.createElement("button");
    startButton.className = "experiment-start";
    startButton.type = "button";
    startButton.textContent = ui("startExperiment");
    startButton.disabled = Boolean(getActiveSession());
    startButton.addEventListener("click", (event) => {
      event.stopPropagation();
      startSession(node.id);
    });
    tools.append(startButton);
  }

  if (activeSession) {
    const running = document.createElement("section");
    running.className = "experiment-panel running";
    running.innerHTML = `
      <div class="experiment-row">
        <span>${escapeHtml(ui("running"))}</span>
        <strong class="experiment-timer" data-session-id="${activeSession.id}">${formatDuration(
          elapsedSec(activeSession),
        )}</strong>
      </div>
      <button class="experiment-end" type="button">${escapeHtml(ui("endExperiment"))}</button>
    `;
    running.querySelector(".experiment-end").addEventListener("click", (event) => {
      event.stopPropagation();
      endSession(activeSession.id);
    });
    card.append(running);
    return;
  }

  if (latestEndedSession) card.append(renderReflectionSummary(latestEndedSession));
}

function renderReflectionSummary(session) {
  const wrapper = document.createElement("section");
  wrapper.className = "experiment-panel compact";
  const isOpen = expandedReflections.has(session.id);
  const outcome = normalizedOutcome(session.outcome);
  wrapper.innerHTML = `
    <div class="experiment-row">
      <span>${escapeHtml(ui("previous"))} ${formatDuration(session.durationSec ?? elapsedSec(session))}</span>
      <strong>${escapeHtml(outcome ? outcomeLabel(outcome) : ui("howWasIt"))}</strong>
    </div>
    <div class="reflection-outcomes" aria-label="${escapeHtml(ui("howWasIt"))}">
      <button class="${outcome === "done" ? "active" : ""}" type="button" data-outcome="done">${escapeHtml(ui("done"))}</button>
      <button class="${outcome === "partial" ? "active" : ""}" type="button" data-outcome="partial">${escapeHtml(ui("partial"))}</button>
      <button class="${outcome === "notDone" ? "active" : ""}" type="button" data-outcome="notDone">${escapeHtml(ui("notDone"))}</button>
    </div>
    <button class="reflection-toggle" type="button">${escapeHtml(isOpen ? ui("memoClose") : ui("memoOpen"))}</button>
  `;

  wrapper.querySelectorAll("[data-outcome]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setSessionOutcome(session, button.dataset.outcome);
    });
  });
  wrapper.querySelector(".reflection-toggle").addEventListener("click", (event) => {
    event.stopPropagation();
    if (expandedReflections.has(session.id)) {
      expandedReflections.delete(session.id);
    } else {
      expandedReflections.add(session.id);
    }
    render();
  });

  if (isOpen) wrapper.append(renderReflection(session));
  return wrapper;
}

function setSessionOutcome(session, outcome) {
  session.outcome = normalizedOutcome(outcome) || outcome;
  session.feeling = outcomeLabel(session.outcome);
  saveAndRender();
  showSaveStatus(ui("reflectionSaved"));
}

function normalizedOutcome(outcome) {
  if (["done", "できた", "Done", "做到了"].includes(outcome)) return "done";
  if (["partial", "少しできた", "A little", "做了一点"].includes(outcome)) return "partial";
  if (["notDone", "できなかった", "Not done", "没做到"].includes(outcome)) return "notDone";
  return "";
}

function outcomeLabel(outcome) {
  const key = normalizedOutcome(outcome);
  return key ? ui(key) : "";
}

function renderReflection(session) {
  const panel = document.createElement("section");
  panel.className = "reflection-fields";
  panel.innerHTML = `
    <label>
      ${escapeHtml(ui("resultLabel"))}
      <textarea class="session-result" rows="3"></textarea>
    </label>
    <label>
      ${escapeHtml(ui("nextLabel"))}
      <textarea class="session-next" rows="3"></textarea>
    </label>
    <button class="reflection-apply" type="button">${escapeHtml(ui("applyValue"))}</button>
  `;

  const result = panel.querySelector(".session-result");
  const next = panel.querySelector(".session-next");
  result.value = session.result;
  next.value = session.nextAction;

  result.addEventListener("input", () => {
    session.result = result.value;
    saveState();
  });
  next.addEventListener("input", () => {
    session.nextAction = next.value;
    saveState();
  });
  panel.querySelector(".reflection-apply").addEventListener("click", (event) => {
    event.stopPropagation();
    applyReflectionToValue(session);
  });

  return panel;
}

function applyReflectionToValue(session) {
  const sourceText = (session.nextAction || session.result || "").trim();
  if (!sourceText) {
    showSaveStatus(ui("reflectionFirst"));
    return;
  }
  const practice = findNode(session.nodeId);
  const parentValue = practice?.parentIds
    ?.map((id) => findNode(id))
    .find((node) => node?.type === "value");
  const valueText = ui("valueReflectionText");
  if (parentValue) {
    parentValue.text = parentValue.text
      ? `${parentValue.text}\n${valueText}`
      : valueText;
    state.selectedId = parentValue.id;
  } else {
    const node = {
      id: crypto.randomUUID(),
      parentIds: [],
      type: "value",
      text: valueText,
      confidence: 50,
    };
    state.nodes.push(node);
    state.selectedId = node.id;
  }
  saveAndRender();
  showSaveStatus(ui("valueApplied"));
}

function drawLinks() {
  const panel = document.querySelector(".map-panel");
  const panelRect = panel.getBoundingClientRect();
  links.setAttribute("width", panel.scrollWidth);
  links.setAttribute("height", panel.scrollHeight);
  links.setAttribute("viewBox", `0 0 ${panel.scrollWidth} ${panel.scrollHeight}`);
  links.style.width = `${panel.scrollWidth}px`;
  links.style.height = `${panel.scrollHeight}px`;
  links.innerHTML = "";

  for (const node of state.nodes) {
    const childEl = document.querySelector(`[data-node-id="${node.id}"]`);
    if (!childEl) continue;

    for (const parentId of node.parentIds ?? []) {
      const parentEl = document.querySelector(`[data-node-id="${parentId}"]`);
      if (!parentEl) continue;

      const childRect = childEl.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();
      const start = {
        x: parentRect.right - panelRect.left + panel.scrollLeft,
        y: parentRect.top + parentRect.height / 2 - panelRect.top + panel.scrollTop,
      };
      const end = {
        x: childRect.left - panelRect.left + panel.scrollLeft,
        y: childRect.top + childRect.height / 2 - panelRect.top + panel.scrollTop,
      };
      const midX = start.x + Math.max(40, (end.x - start.x) / 2);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`);
      links.append(path);
    }
  }
}

function canReconnectTo(targetId) {
  const sourceId = draggedId ?? linkingId;
  const pair = getConnectionPair(sourceId, targetId);
  if (!pair) return false;
  return !collectDescendants(pair.child.id).has(pair.parent.id);
}

function startLinking(id) {
  linkingId = linkingId === id ? null : id;
  selectNode(id);
  updateConnectionStatus();
  drawLinks();
  markLinkTargets();
  showSaveStatus(linkingId ? ui("chooseConnectTarget") : ui("disconnect"));
}

function markLinkTargets() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("link-source", card.dataset.nodeId === linkingId);
    card.classList.toggle("connect-target", Boolean(linkingId) && canReconnectTo(card.dataset.nodeId));
    card.classList.toggle("connected-target", Boolean(linkingId) && isConnectedTo(linkingId, card.dataset.nodeId));
  });
}

function reconnectTo(targetId) {
  if (!linkingId) return;
  if (!canReconnectTo(targetId)) return;
  connectNodes(linkingId, targetId, { toggle: true });
  state.selectedId = linkingId;
  saveAndRender();
}

function connectNodes(sourceId, targetId, options = {}) {
  const pair = getConnectionPair(sourceId, targetId);
  if (!pair) return;
  if (options.toggle) {
    toggleConnection(pair.child, pair.parent.id);
    return;
  }
  addConnection(pair.child, pair.parent.id);
}

function getConnectionPair(sourceId, targetId) {
  const source = findNode(sourceId);
  const target = findNode(targetId);
  if (!source || !target || source.id === target.id) return null;

  if (previousType(source.type) === target.type) {
    return { child: source, parent: target };
  }
  if (previousType(target.type) === source.type) {
    return { child: target, parent: source };
  }
  return null;
}

function addConnection(child, parentId) {
  child.parentIds = normalizeParentIds(child);
  if (!child.parentIds.includes(parentId)) child.parentIds.push(parentId);
}

function toggleConnection(child, parentId) {
  child.parentIds = normalizeParentIds(child);
  if (child.parentIds.includes(parentId)) {
    child.parentIds = child.parentIds.filter((id) => id !== parentId);
    return;
  }
  child.parentIds.push(parentId);
}

function isConnectedTo(childId, parentId) {
  const pair = getConnectionPair(childId, parentId);
  return Boolean(pair?.child.parentIds?.includes(pair.parent.id));
}

function canReorderWith(targetId) {
  const dragged = findNode(draggedId);
  const target = findNode(targetId);
  return Boolean(dragged && target && dragged.id !== target.id && dragged.type === target.type);
}

function reorderNodeNear(draggedIdValue, targetId, clientY) {
  const draggedIndex = state.nodes.findIndex((node) => node.id === draggedIdValue);
  if (draggedIndex < 0) return;

  const targetEl = document.querySelector(`[data-node-id="${targetId}"]`);
  const targetRect = targetEl?.getBoundingClientRect();
  const placeAfter = targetRect ? clientY > targetRect.top + targetRect.height / 2 : true;
  const [dragged] = state.nodes.splice(draggedIndex, 1);
  const targetIndex = state.nodes.findIndex((node) => node.id === targetId);
  state.nodes.splice(targetIndex + (placeAfter ? 1 : 0), 0, dragged);
}

function moveNodeToEnd(id) {
  const index = state.nodes.findIndex((node) => node.id === id);
  if (index < 0) return;
  const [node] = state.nodes.splice(index, 1);
  state.nodes.push(node);
}

function handleQuickStartClick() {
  const activeSession = getActiveSession();
  if (activeSession) {
    endSession(activeSession.id);
    return;
  }
  const practice = getQuickStartPractice({ create: true });
  if (practice) openQuickActionComposer(practice);
}

function getQuickStartPractice(options = {}) {
  const selected = findNode(state.selectedId);
  const practice =
    selected?.type === "practice"
      ? selected
      : state.nodes.find((node) => node.type === "practice");
  if (practice || !options.create) return practice ?? null;
  return createPracticeNode();
}

function createPracticeNode() {
  const node = {
    id: crypto.randomUUID(),
    parentIds: defaultParentFor("practice") ? [defaultParentFor("practice")] : [],
    type: "practice",
    text: "",
    confidence: 50,
  };
  normalizeConnections(node);
  state.nodes.push(node);
  state.selectedId = node.id;
  pendingFocusId = node.id;
  pendingScrollId = node.id;
  pendingScrollType = node.type;
  saveAndRender();
  return node;
}

function setupQuickActionComposer() {
  quickActionPanel?.remove();
  quickActionPanel = document.createElement("section");
  quickActionPanel.className = "quick-action-panel hidden";
  const examples = ui("quickExamples");
  quickActionPanel.innerHTML = `
    <div>
      <strong>${escapeHtml(ui("quickTitle"))}</strong>
      <span>${escapeHtml(ui("quickLead"))}</span>
    </div>
    <div class="quick-action-examples" aria-label="${escapeHtml(ui("quickExamplesLabel"))}">
      ${examples.map((example) => `<button class="quick-action-example" type="button">${escapeHtml(example)}</button>`).join("")}
    </div>
    <textarea class="quick-action-input" rows="3" placeholder="${escapeHtml(ui("quickPlaceholder"))}"></textarea>
    <div class="quick-action-buttons">
      <button class="button secondary quick-action-cancel" type="button">${escapeHtml(ui("close"))}</button>
      <button class="button primary quick-action-start" type="button">${escapeHtml(ui("startWithThis"))}</button>
    </div>
  `;
  quickActionInput = quickActionPanel.querySelector(".quick-action-input");
  quickActionInput.addEventListener("input", () => {
    const node = findNode(quickActionNodeId);
    if (!node) return;
    node.text = quickActionInput.value;
    state.selectedId = node.id;
    saveState();
  });
  quickActionPanel.querySelector(".quick-action-cancel").addEventListener("click", closeQuickActionComposer);
  quickActionPanel.querySelector(".quick-action-start").addEventListener("click", startQuickActionFromComposer);
  quickActionPanel.querySelectorAll(".quick-action-example").forEach((button) => {
    button.addEventListener("click", () => {
      quickActionInput.value = button.textContent.trim();
      const node = findNode(quickActionNodeId);
      if (node) {
        node.text = quickActionInput.value;
        state.selectedId = node.id;
        saveState();
      }
      quickActionInput.focus();
    });
  });
  document.body.append(quickActionPanel);
}

function openQuickActionComposer(node) {
  if (!quickActionPanel) setupQuickActionComposer();
  quickActionNodeId = node.id;
  state.selectedId = node.id;
  quickActionInput.value = node.text;
  quickActionPanel.classList.remove("hidden");
  saveAndRender();
  requestAnimationFrame(() => {
    quickActionInput.focus();
    quickActionInput.select();
  });
}

function closeQuickActionComposer() {
  const node = findNode(quickActionNodeId);
  if (node) {
    node.text = quickActionInput.value;
    state.selectedId = node.id;
    saveAndRender();
  }
  quickActionPanel?.classList.add("hidden");
  quickActionNodeId = null;
}

function startQuickActionFromComposer() {
  const node = findNode(quickActionNodeId) ?? getQuickStartPractice({ create: true });
  if (!node) return;
  node.text = quickActionInput.value.trim();
  state.selectedId = node.id;
  pendingFocusId = node.id;
  if (!node.text) {
    saveAndRender();
    showSaveStatus(ui("actionCardReady"));
    return;
  }
  closeQuickActionComposer();
  saveState();
  startSession(node.id, { allowEmpty: true });
}

function startSession(nodeId, options = {}) {
  if (getActiveSession()) {
    showSaveStatus(ui("actionAlreadyRunning"));
    return;
  }
  const node = findNode(nodeId);
  if (!options.allowEmpty && node?.type === "practice" && !node.text.trim()) {
    openQuickActionComposer(node);
    showSaveStatus(ui("writeActionFirst"));
    return;
  }
  const session = {
    id: crypto.randomUUID(),
    nodeId,
    startedAt: Date.now(),
    endedAt: null,
    durationSec: null,
    result: "",
    feeling: "",
    outcome: "",
    nextAction: "",
  };
  state.sessions.push(session);
  state.activeSessionId = session.id;
  saveAndRender();
  startTimer();
  updateExperimentOverlay();
}

function endSession(sessionId) {
  const session = state.sessions.find((candidate) => candidate.id === sessionId);
  if (!session || session.endedAt) return;
  session.endedAt = Date.now();
  session.durationSec = Math.max(0, Math.round((session.endedAt - session.startedAt) / 1000));
  if (state.activeSessionId === session.id) state.activeSessionId = null;
  saveAndRender();
  stopTimerIfIdle();
  updateExperimentOverlay();
}

function getActiveSessionForNode(nodeId) {
  return state.sessions.find(
    (session) =>
      session.id === state.activeSessionId &&
      session.nodeId === nodeId &&
      session.endedAt === null,
  );
}

function getActiveSession() {
  return state.sessions.find(
    (session) => session.id === state.activeSessionId && session.endedAt === null,
  );
}

function getLatestEndedSessionForNode(nodeId) {
  return [...state.sessions]
    .reverse()
    .find((session) => session.nodeId === nodeId && session.endedAt !== null);
}

function elapsedSec(session) {
  const end = session.endedAt ?? Date.now();
  return Math.max(0, Math.floor((end - session.startedAt) / 1000));
}

function formatDuration(totalSec) {
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (timerId) return;
  timerId = window.setInterval(updateTimers, 1000);
}

function updateTimers() {
  const activeSession = getActiveSession();
  if (!activeSession) {
    stopTimerIfIdle();
    updateExperimentOverlay();
    return;
  }
  document.querySelectorAll(`[data-session-id="${activeSession.id}"]`).forEach((timer) => {
    timer.textContent = formatDuration(elapsedSec(activeSession));
  });
  overlayTimer.textContent = formatDuration(elapsedSec(activeSession));
}

function stopTimerIfIdle() {
  const hasActive = state.sessions.some(
    (session) => session.id === state.activeSessionId && session.endedAt === null,
  );
  if (hasActive || !timerId) return;
  window.clearInterval(timerId);
  timerId = null;
}

function updateExperimentOverlay() {
  const activeSession = getActiveSession();
  experimentOverlay.classList.toggle("hidden", !activeSession);
  if (!activeSession) return;

  const node = findNode(activeSession.nodeId);
  const text = node?.text || typeLabels.practice;
  overlayPracticeText.textContent = text;
  overlayPracticeText.className = overlayTextClass(text);
  overlayTimer.textContent = formatDuration(elapsedSec(activeSession));
}

function overlayTextClass(text) {
  const length = [...text].length;
  if (length > 90) return "overlay-title compact";
  if (length > 45) return "overlay-title medium";
  return "overlay-title";
}

function renderEditor() {
  const selected = findNode(state.selectedId);
  editor.classList.toggle("hidden", !selected);
  emptyState.classList.toggle("hidden", Boolean(selected));
  if (!selected) return;

  nodeType.value = selected.type;
  nodeConfidence.value = selected.confidence;
  confidenceValue.textContent = `${selected.confidence}%`;
  renderParentOptions(selected);
}

function renderParentOptions(selected) {
  nodeParent.innerHTML = "";
  nodeParent.append(new Option(ui("startPoint"), ""));
  const parentType = previousType(selected.type);

  for (const node of state.nodes) {
    if (node.id === selected.id) continue;
    if (parentType && node.type !== parentType) continue;
    if (!parentType) continue;
    if (collectDescendants(selected.id).has(node.id)) continue;
    const label = `${typeLabels[node.type]}: ${node.text || ui("emptyCard")}`;
    nodeParent.append(new Option(label.slice(0, 42), node.id));
  }

  nodeParent.value = selected.parentIds?.[0] ?? "";
}

function updateSelectedFromEditor() {
  const selected = findNode(state.selectedId);
  if (!selected) return;
  selected.type = nodeType.value;
  selected.parentIds = nodeParent.value ? [nodeParent.value] : [];
  selected.confidence = Number(nodeConfidence.value);
  normalizeConnections(selected);
  confidenceValue.textContent = `${selected.confidence}%`;
  saveAndRender();
}

function selectNode(id) {
  state.selectedId = id;
  saveState();
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.nodeId === id);
  });
  renderEditor();
  markLinkTargets();
  drawLinks();
}

function deleteNode(id) {
  if (!id) return;
  const removing = new Set([id]);
  const deletingIndex = state.nodes.findIndex((node) => node.id === id);
  state.nodes = state.nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      parentIds: normalizeParentIds(node).filter((parentId) => parentId !== id),
    }));
  state.sessions = state.sessions.filter((session) => session.nodeId !== id);
  if (!state.sessions.some((session) => session.id === state.activeSessionId)) {
    state.activeSessionId = null;
    stopTimerIfIdle();
    updateExperimentOverlay();
  }
  if (linkingId && removing.has(linkingId)) linkingId = null;
  state.selectedId =
    state.nodes[Math.min(Math.max(deletingIndex, 0), state.nodes.length - 1)]?.id ??
    state.nodes[0]?.id ??
    null;
  saveAndRender();
}

function addNode(parentId, type, options = {}) {
  const node = {
    id: crypto.randomUUID(),
    parentIds: parentId ? [parentId] : [],
    type,
    text: "",
    confidence: 50,
  };
  normalizeConnections(node);
  if (options.prepend) {
    state.nodes.unshift(node);
  } else {
    state.nodes.push(node);
  }
  state.selectedId = node.id;
  pendingFocusId = node.id;
  pendingScrollId = node.id;
  pendingScrollType = node.type;
  saveAndRender();
}

function defaultParentFor(type) {
  if (type === "action") return null;
  const parentType = previousType(type);
  const selected = findNode(state.selectedId);
  if (selected?.type === parentType) return selected.id;
  return state.nodes.find((node) => node.type === parentType)?.id ?? null;
}

function previousType(type) {
  if (type === "branch") return "action";
  if (type === "premise") return "branch";
  if (type === "core") return "premise";
  if (type === "value") return "core";
  if (type === "practice") return "value";
  return null;
}

function childTypeFor(type) {
  if (type === "action") return "branch";
  if (type === "branch") return "premise";
  if (type === "premise") return "core";
  if (type === "core") return "value";
  return "practice";
}

function normalizeConnections(node) {
  const parentType = previousType(node.type);
  if (!parentType) {
    node.parentIds = [];
    return;
  }
  node.parentIds = normalizeParentIds(node).filter((parentId) => {
    if (parentId === node.id) return false;
    const parent = findNode(parentId);
    return parent && parent.type === parentType && !collectDescendants(node.id).has(parent.id);
  });
}

function findNode(id) {
  return state.nodes.find((node) => node.id === id);
}

function collectDescendants(id) {
  const ids = new Set([id]);
  let added = true;
  while (added) {
    added = false;
    for (const node of state.nodes) {
      if (node.parentIds?.some((parentId) => ids.has(parentId)) && !ids.has(node.id)) {
        ids.add(node.id);
        added = true;
      }
    }
  }
  return ids;
}

function resizeText(textInput) {
  textInput.style.height = "auto";
  textInput.style.height = `${Math.max(textInput.scrollHeight, 74)}px`;
}

function focusPendingNode() {
  if (!pendingFocusId) return;
  const textInput = document.querySelector(`[data-node-id="${pendingFocusId}"] .card-text`);
  pendingFocusId = null;
  if (!textInput) return;
  textInput.focus({ preventScroll: true });
  textInput.select();
}

function scrollPendingLane() {
  if (!pendingScrollType && !pendingScrollId) return;
  const panel = document.querySelector(".map-panel");
  const lane = document.querySelector(`.lane[data-type="${pendingScrollType}"]`);
  const card = pendingScrollId ? document.querySelector(`[data-node-id="${pendingScrollId}"]`) : null;
  pendingScrollId = null;
  pendingScrollType = null;
  if (!panel || !lane) return;

  const panelRect = panel.getBoundingClientRect();
  const laneRect = lane.getBoundingClientRect();
  const scrollPadding = 16;
  const left = panel.scrollLeft + laneRect.left - panelRect.left - scrollPadding;
  panel.scrollTo({
    left: Math.max(0, left),
    behavior: "smooth",
  });

  if (card) {
    const cardTop = card.offsetTop - lane.offsetTop - 12;
    lane.scrollTo({
      top: Math.max(0, cardTop),
      behavior: "smooth",
    });
  }
  drawLinks();
}

// Final safety overrides.
function getVisibleEntries() {
  return appState.entries;
}

function hasCorruptedAppText(targetAppState) {
  const values = targetAppState.entries.flatMap((entry) => [
    entry.core,
    entry.customTitle,
    entry.title,
    ...entry.nodes.map((node) => node.text),
    ...entry.sessions.flatMap((session) => [session.result, session.feeling, session.nextAction]),
  ]);
  return values.some((value) => /[\u7e3a\u7e67\u8b5b\u8703\u83a0\u9687\u9081\u9aea\u83eb\u879f\u9666\u9a55\u8c4c\u8413\u86df\u8b17\u9711\u8709\u7aca\u8373\u8ae4]/.test(String(value)));
}
