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
  action: "例: 会議で言いたいことを飲み込んだ",
  branch: "例: 胸が詰まる、怖い、あとで悔しい",
  premise: "例: 変なことを言うと、場を壊してしまう",
  core: "例: 迷惑をかけない自分でいないといけない",
  value: "例: 小さく意見を出すことも、場への参加になる",
  practice: "例: 次の会議で一度だけ質問をする",
};

const writingQuestions = {
  action: "何が起きた？ 自分は何をした／しなかった？",
  branch: "その直後、体や気持ちはどう反応した？",
  premise: "その気持ちの奥に、どんな決めつけがありそう？",
  core: "今までの自分は、どんな価値観（ものさし）でこれを見ていた？",
  value: "これからは、どんな見方を試してみたい？",
  practice: "その新しい見方を、今日どんな小さな行動で試す？",
};

const defaultState = {
  core:
    "過去の出来事から、気持ち、思い込み、価値観を見る。そこから新しい価値観と、試す行動へつなげる。",
  selectedId: "n1",
  activeSessionId: null,
  sessions: [],
  nodes: [
    {
      id: "n1",
      parentIds: [],
      type: "action",
      text: "会議で言いたいことを飲み込んだ",
      confidence: 80,
    },
    {
      id: "n2",
      parentIds: ["n1"],
      type: "branch",
      text: "胸が詰まる。あとで悔しさが残る",
      confidence: 70,
    },
    {
      id: "n3",
      parentIds: ["n2"],
      type: "premise",
      text: "変なことを言うと、場を壊してしまう",
      confidence: 65,
    },
    {
      id: "n4",
      parentIds: ["n3"],
      type: "core",
      text: "迷惑をかけない自分でいないといけない",
      confidence: 55,
    },
    {
      id: "n5",
      parentIds: ["n4"],
      type: "value",
      text: "小さく意見を出すことも、場への参加になる",
      confidence: 55,
    },
    {
      id: "n6",
      parentIds: ["n5"],
      type: "practice",
      text: "次の会議で一度だけ質問をする",
      confidence: 60,
    },
  ],
};

let state = loadState();
let draggedId = null;
let dropHandled = false;
let linkingId = null;
let pendingFocusId = null;
let timerId = null;
const expandedReflections = new Set();

const coreText = document.querySelector("#coreText");
const links = document.querySelector("#links");
const connectionStatus = document.querySelector("#connectionStatus");
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

document.querySelector("#addRoot").addEventListener("click", () => addNode(null, "action"));
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

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY) ?? findLegacyState();
  if (!raw) return normalizeState(structuredClone(defaultState));

  try {
    const loadedState = normalizeState(JSON.parse(raw));
    return hasCorruptedText(loadedState) ? normalizeState(structuredClone(defaultState)) : loadedState;
  } catch {
    return normalizeState(structuredClone(defaultState));
  }
}

function findLegacyState() {
  for (const key of LEGACY_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) return raw;
  }
  return null;
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

function hasCorruptedText(targetState) {
  const values = [
    targetState.core,
    ...targetState.nodes.map((node) => node.text),
    ...targetState.sessions.flatMap((session) => [
      session.result,
      session.feeling,
      session.nextAction,
    ]),
  ];
  const corruptedTextPattern = new RegExp("[\\u7e3a\\u7e67\\u86df\\u9666\\u8700\\u8b41\\u8c4c\\u8b17\\u9695\\u8ae2\\u8389]");
  return values.some((value) => corruptedTextPattern.test(value));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  state = normalizeState(structuredClone(defaultState));
  saveAndRender();
}

function exportData() {
  saveState();
  const payload = {
    app: "self-map",
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
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
      state = normalizeState(parsed?.state ?? parsed);
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
  coreText.value = state.core;
  renderLaneHeaders();
  updateConnectionStatus();

  document.querySelectorAll(".lane-body").forEach((lane) => {
    lane.innerHTML = "";
  });

  for (const type of typeOrder) {
    const lane = document.querySelector(`[data-lane="${type}"]`);
    state.nodes
      .filter((node) => node.type === type)
      .forEach((node) => lane.append(renderCard(node)));
  }

  renderEditor();
  requestAnimationFrame(() => {
    drawLinks();
    focusPendingNode();
  });
}

function renderLaneHeaders() {
  document.querySelectorAll(".lane").forEach((lane) => {
    const label = typeLabels[lane.dataset.type];
    const title = lane.querySelector("header span");
    if (label && title) title.textContent = label;
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
  connectionStatus.textContent = `接続中: ${typeLabels[source.type]}「${preview.slice(0, 28)}」から線を引く`;
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

  const textInput = card.querySelector(".card-text");
  textInput.placeholder = writingPrompts[node.type] ?? "ここに書く";
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
      addConnection(dragged, node.id);
      state.selectedId = dragged.id;
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

  card.querySelector(".card-add").addEventListener("click", (event) => {
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

  if (node.type === "practice") renderPracticeTools(card, node);
  return card;
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
      <button class="reflection-toggle" type="button">${isOpen ? "閉じる" : "振り返る"}</button>
    </div>
  `;

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

function renderReflection(session) {
  const panel = document.createElement("section");
  panel.className = "reflection-fields";
  panel.innerHTML = `
    <label>
      実際に何をした？
      <textarea class="session-result" rows="3"></textarea>
    </label>
    <label>
      感覚
      <select class="session-feeling">
        <option value="">選ぶ</option>
        <option value="軽かった">軽かった</option>
        <option value="普通">普通</option>
        <option value="重かった">重かった</option>
        <option value="無理だった">無理だった</option>
      </select>
    </label>
    <label>
      次はどう調整する？
      <textarea class="session-next" rows="3"></textarea>
    </label>
  `;

  const result = panel.querySelector(".session-result");
  const feeling = panel.querySelector(".session-feeling");
  const next = panel.querySelector(".session-next");
  result.value = session.result;
  feeling.value = session.feeling;
  next.value = session.nextAction;

  result.addEventListener("input", () => {
    session.result = result.value;
    saveState();
  });
  feeling.addEventListener("input", () => {
    session.feeling = feeling.value;
    saveState();
  });
  next.addEventListener("input", () => {
    session.nextAction = next.value;
    saveState();
  });

  return panel;
}

function drawLinks() {
  const panel = document.querySelector(".map-panel");
  const panelRect = panel.getBoundingClientRect();
  links.setAttribute("width", panel.scrollWidth);
  links.setAttribute("height", panel.scrollHeight);
  links.setAttribute("viewBox", `0 0 ${panel.scrollWidth} ${panel.scrollHeight}`);
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
  const dragged = findNode(draggedId ?? linkingId);
  const target = findNode(targetId);
  if (!dragged || !target) return false;
  if (target.id === dragged.id) return false;
  if (previousType(dragged.type) !== target.type) return false;
  return !collectDescendants(dragged.id).has(target.id);
}

function startLinking(id) {
  linkingId = linkingId === id ? null : id;
  selectNode(id);
  updateConnectionStatus();
  drawLinks();
  markLinkTargets();
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
  const child = findNode(linkingId);
  if (!child || !canReconnectTo(targetId)) return;
  toggleConnection(child, targetId);
  state.selectedId = child.id;
  saveAndRender();
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
  const child = findNode(childId);
  return Boolean(child?.parentIds?.includes(parentId));
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

function startSession(nodeId) {
  if (getActiveSession()) {
    showSaveStatus("行動中のカードがあります");
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

function addNode(parentId, type) {
  const node = {
    id: crypto.randomUUID(),
    parentIds: parentId ? [parentId] : [],
    type,
    text: "",
    confidence: 50,
  };
  normalizeConnections(node);
  state.nodes.push(node);
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
