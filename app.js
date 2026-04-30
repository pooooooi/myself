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

const typeLabels = {
  action: "過去の出来事",
  branch: "気持ち",
  premise: "思い込み",
  core: "価値観",
  value: "新しい価値観",
  practice: "試す行動",
};

const writingPrompts = {
  action: "例: 資料を開く前にスマホを見続けた",
  branch: "例: 重い、失敗しそう、始めるのが怖い",
  premise: "例: ちゃんと進められないなら触らない方がいい",
  core: "例: 中途半端な自分はだめだ",
  value: "例: 10秒戻るだけでも、流れは作れる",
  practice: "例: 資料を開いて、タイトルだけ読む",
};

const writingQuestions = {
  action: "何が起きた？ 自分は何をした／しなかった？",
  branch: "その直後、体や気持ちはどう反応した？",
  premise: "その気持ちの奥に、どんな決めつけがありそう？",
  core: "今までの自分は、どんな価値観（ものさし）でこれを見ていた？",
  value: "これからは、どんな見方を試してみたい？",
  practice: "今すぐできる最初の一歩にすると？",
};

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

document.querySelector("#newEntry").addEventListener("click", createEntry);
document.querySelector("#deleteEntry").addEventListener("click", deleteCurrentEntry);
document.querySelector("#prevStep").addEventListener("click", () => moveStep(-1));
document.querySelector("#nextStep").addEventListener("click", () => moveStep(1));
installApp.addEventListener("click", installPwa);
dismissInstall.addEventListener("click", dismissInstallPrompt);
document.querySelector("#exportData").addEventListener("click", exportData);
document.querySelector("#importData").addEventListener("click", () => importFile.click());
document.querySelector("#resetDemo").addEventListener("click", resetDemo);
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

render();
if (state.activeSessionId) startTimer();
updateExperimentOverlay();
setupQuickActionComposer();
setupInstallPrompt();

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
      outcome: typeof session.outcome === "string" ? session.outcome : "",
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
    showSaveStatus("ブラウザのメニューからホーム画面に追加できます");
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
  showSaveStatus("保存済み");
}

function showSaveStatus(message) {
  saveStatus.textContent = message;
  window.clearTimeout(showSaveStatus.timeoutId);
  showSaveStatus.timeoutId = window.setTimeout(() => {
    saveStatus.textContent = "保存済み";
  }, 1800);
}

function resetDemo() {
  if (!confirm("初期例に戻しますか？ 今の内容は上書きされます。必要なら先に書き出してください。")) {
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
  showSaveStatus("書き出しました");
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
      showSaveStatus("読み込みました");
    } catch {
      showSaveStatus("読み込み失敗");
      alert("読み込めませんでした。書き出したJSONファイルを選んでください。");
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
    mobileStartAction.textContent = getActiveSession() ? "行動を終える" : "今すぐ行動開始";
  }

  renderEditor();
  requestAnimationFrame(() => {
    drawLinks();
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
    name.setAttribute("aria-label", "場面の名前");
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
    customTitle: "新しい場面",
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
    alert("最後の場面は削除できません。初期例に戻すか、内容を書き換えて使ってください。");
    return;
  }
  if (!confirm("この場面を削除しますか？元に戻せません。")) return;
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
  return "新しい場面";
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
  const preview = source.text.trim() || writingPrompts[source.type] || "未入力のカード";
  connectionStatus.textContent = `接続中: ${typeLabels[source.type]}「${preview.slice(0, 28)}」とつなぐ相手を選ぶ`;
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
  const addButton = card.querySelector(".card-add");
  addButton.textContent = node.type === "practice" ? "+" : "次を書く";
  addButton.title = node.type === "practice" ? "add" : `次を書く: ${typeLabels[childTypeFor(node.type)]}`;

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
    return "例: さっき気になった場面をそのまま書く。うまく書こうとしなくてOK。";
  }
  return writingPrompts[node.type] ?? "ここに書く";
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
    <span>大きいかも。10秒でできる形にする？</span>
    <button type="button">もっと小さくする</button>
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
    startButton.textContent = "行動開始";
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
        <span>行動中</span>
        <strong class="experiment-timer" data-session-id="${activeSession.id}">${formatDuration(
          elapsedSec(activeSession),
        )}</strong>
      </div>
      <button class="experiment-end" type="button">終了</button>
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
  wrapper.innerHTML = `
    <div class="experiment-row">
      <span>前回 ${formatDuration(session.durationSec ?? elapsedSec(session))}</span>
      <strong>${session.outcome || "どうだった？"}</strong>
    </div>
    <div class="reflection-outcomes" aria-label="行動の振り返り">
      <button class="${session.outcome === "できた" ? "active" : ""}" type="button" data-outcome="できた">できた</button>
      <button class="${session.outcome === "少しできた" ? "active" : ""}" type="button" data-outcome="少しできた">少しできた</button>
      <button class="${session.outcome === "できなかった" ? "active" : ""}" type="button" data-outcome="できなかった">できなかった</button>
    </div>
    <button class="reflection-toggle" type="button">${isOpen ? "メモを閉じる" : "必要ならメモ"}</button>
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
  session.outcome = outcome;
  session.feeling = outcome;
  saveAndRender();
  showSaveStatus("振り返りを保存しました");
}

function renderReflection(session) {
  const panel = document.createElement("section");
  panel.className = "reflection-fields";
  panel.innerHTML = `
    <label>
      実際に何をした？
      <textarea class="session-result" rows="3"></textarea>
    </label>
    <label>
      次はどう調整する？
      <textarea class="session-next" rows="3"></textarea>
    </label>
    <button class="reflection-apply" type="button">新しい価値観へ反映</button>
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
    showSaveStatus("振り返りを先に書いてください");
    return;
  }
  const practice = findNode(session.nodeId);
  const parentValue = practice?.parentIds
    ?.map((id) => findNode(id))
    .find((node) => node?.type === "value");
  const valueText = `やってみて調整できる。まず小さく戻ればいい。`;
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
  showSaveStatus("新しい価値観に反映しました");
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
  showSaveStatus(linkingId ? "つなぐ相手を選んでください" : "接続を解除しました");
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
  saveAndRender();
  return node;
}

function setupQuickActionComposer() {
  quickActionPanel = document.createElement("section");
  quickActionPanel.className = "quick-action-panel hidden";
  quickActionPanel.innerHTML = `
    <div>
      <strong>今から何をする？</strong>
      <span>すぐ始められる形にする</span>
    </div>
    <div class="quick-action-examples" aria-label="行動の例">
      <button class="quick-action-example" type="button">開いて、最初の1行だけ見る</button>
      <button class="quick-action-example" type="button">宛先だけ開く</button>
      <button class="quick-action-example" type="button">目の前の1つだけ動かす</button>
    </div>
    <textarea class="quick-action-input" rows="3" placeholder="例: 途切れたら、責める前に1分だけ再開する"></textarea>
    <div class="quick-action-buttons">
      <button class="button secondary quick-action-cancel" type="button">閉じる</button>
      <button class="button primary quick-action-start" type="button">この内容で開始</button>
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
    showSaveStatus("行動内容を書けるカードを用意しました");
    return;
  }
  closeQuickActionComposer();
  saveState();
  startSession(node.id, { allowEmpty: true });
}

function startSession(nodeId, options = {}) {
  if (getActiveSession()) {
    showSaveStatus("行動中のカードがあります");
    return;
  }
  const node = findNode(nodeId);
  if (!options.allowEmpty && node?.type === "practice" && !node.text.trim()) {
    openQuickActionComposer(node);
    showSaveStatus("行動内容を書いてから開始できます");
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
  const text = node?.text || "試す行動";
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
  nodeParent.append(new Option("起点にする", ""));
  const parentType = previousType(selected.type);

  for (const node of state.nodes) {
    if (node.id === selected.id) continue;
    if (parentType && node.type !== parentType) continue;
    if (!parentType) continue;
    if (collectDescendants(selected.id).has(node.id)) continue;
    const label = `${typeLabels[node.type]}: ${node.text || "未入力"}`;
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
  const removing = collectDescendants(id);
  state.nodes = state.nodes.filter((node) => !removing.has(node.id));
  state.sessions = state.sessions.filter((session) => !removing.has(session.nodeId));
  if (!state.sessions.some((session) => session.id === state.activeSessionId)) {
    state.activeSessionId = null;
    stopTimerIfIdle();
    updateExperimentOverlay();
  }
  if (linkingId && removing.has(linkingId)) linkingId = null;
  state.selectedId = state.nodes[0]?.id ?? null;
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
  textInput.focus();
  textInput.select();
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
