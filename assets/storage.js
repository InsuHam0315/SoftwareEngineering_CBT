(function () {
  "use strict";

  const CURRENT_USER_KEY = "softwareEngineeringCurrentUser";
  const USERS_KEY = "softwareEngineeringUsers";
  const DATA_PREFIX = "softwareEngineeringStudyData_";

  function parse(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; }
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }
  function normalize(value) { return String(value ?? "").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim(); }
  function hash(value) {
    let result = 2166136261;
    for (let i = 0; i < value.length; i += 1) { result ^= value.charCodeAt(i); result = Math.imul(result, 16777619); }
    return (result >>> 0).toString(36);
  }
  function makeUserId(name, identifier) { return `user-${hash(`${name.trim()}|${identifier.trim()}`)}`; }
  function currentUser() {
    const user = parse(CURRENT_USER_KEY, null);
    return user && user.userId && user.name ? user : { userId: "guest", name: "게스트", identifier: "", guest: true };
  }
  function getUsers() { return parse(USERS_KEY, []); }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
  function dataKey(userId) { return `${DATA_PREFIX}${userId || currentUser().userId}`; }
  function emptyStudyData() { return { records: [], wrongNotes: [], updatedAt: null }; }
  function getStudyData(userId) {
    const data = parse(dataKey(userId), emptyStudyData());
    return { records: Array.isArray(data.records) ? data.records : [], wrongNotes: Array.isArray(data.wrongNotes) ? data.wrongNotes : [], updatedAt: data.updatedAt || null };
  }
  function saveStudyData(data, userId) {
    const value = { records: data.records || [], wrongNotes: data.wrongNotes || [], updatedAt: new Date().toISOString() };
    localStorage.setItem(dataKey(userId), JSON.stringify(value)); return value;
  }
  function addRecord(record) {
    const data = getStudyData(); data.records.push(record); saveStudyData(data); return record;
  }
  function upsertWrongNote(entry) {
    const data = getStudyData();
    const index = data.wrongNotes.findIndex((item) => item.exam === entry.exam && item.questionId === entry.questionId);
    if (index >= 0) data.wrongNotes[index] = entry; else data.wrongNotes.push(entry);
    saveStudyData(data); return entry;
  }
  function removeWrongNote(exam, questionId) {
    const data = getStudyData(); data.wrongNotes = data.wrongNotes.filter((item) => !(item.exam === exam && item.questionId === questionId)); saveStudyData(data);
  }
  function clearWrongNotes() { const data = getStudyData(); data.wrongNotes = []; saveStudyData(data); }
  function tags(items) { return (items || []).map((tag) => `<span class="tag">#${escapeHTML(tag)}</span>`).join(""); }
  function rangeBadge(range) { return `<span class="badge ${range === "중간고사" ? "range-mid" : "range-final"}">${escapeHTML(range)}</span>`; }
  function basePath() { return document.body.dataset.base || ""; }

  function mountShell() {
    const header = document.getElementById("site-header"); const base = basePath();
    if (header) {
      const links = [
        ["index.html", "홈"], ["cbt/software_engineering_mock_01.html", "모의 1회"], ["cbt/software_engineering_mock_02.html", "모의 2회"], ["cbt/software_engineering_mock_03.html", "모의 3회"],
        ["cbt/software_engineering_final_cbt.html", "기말 세트"], ["review/wrong-notes.html", "오답노트"],
        ["stats/study-record.html", "학습기록"], ["notes/software-engineering-final/index.html", "개념정리"]
      ];
      const current = location.pathname.replace(/\\/g, "/");
      header.className = "site-header";
      header.innerHTML = `<div class="nav-wrap"><a class="brand" href="${base}index.html"><span class="brand-mark">SE</span><span>소프트웨어공학 CBT</span></a><nav class="nav-links" id="nav-links" aria-label="주요 메뉴">${links.map(([href, label]) => `<a href="${base}${href}"${current.endsWith(href) || (href === "index.html" && current.endsWith("/")) ? ' class="active"' : ""}>${label}</a>`).join("")}</nav><div class="nav-actions"><a class="user-chip" href="${base}login.html" data-current-user></a><button class="icon-btn" id="theme-toggle" type="button" aria-label="테마 전환">◐</button><button class="icon-btn mobile-menu" id="menu-toggle" type="button" aria-label="메뉴 열기">☰</button></div></div>`;
      header.querySelector("#menu-toggle")?.addEventListener("click", () => header.querySelector("#nav-links").classList.toggle("open"));
      header.querySelector("#theme-toggle")?.addEventListener("click", () => { const theme = document.body.classList.toggle("light") ? "light" : "dark"; localStorage.setItem("softwareEngineeringTheme", theme); });
    }
    document.querySelectorAll("[data-current-user]").forEach((element) => { const user = currentUser(); element.textContent = user.guest ? "게스트 모드" : `${user.name} 님`; });
    const footer = document.getElementById("site-footer");
    if (footer) { footer.className = "footer"; footer.textContent = "2026 소프트웨어공학 기말고사 CBT 문제집 · 기록은 현재 브라우저에만 저장됩니다."; }
  }

  function renderLanding() {
    if (!document.getElementById("landing-recent-score")) return;
    const data = getStudyData(); const records = data.records.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    document.getElementById("landing-recent-score").textContent = records[0] ? `${records[0].score}점` : "기록 없음";
    document.getElementById("landing-attempt-count").textContent = `${records.length}회`;
    document.getElementById("landing-wrong-count").textContent = `${data.wrongNotes.length}문항`;
    const list = document.getElementById("landing-record-list");
    list.innerHTML = records.length ? records.slice(0, 3).map((item) => `<li><b>${item.examLabel}</b><span>${item.score}점 · ${new Date(item.createdAt).toLocaleDateString("ko-KR")}</span></li>`).join("") : "<li><span>아직 저장된 응시 기록이 없습니다.</span></li>";
  }

  window.SEStorage = { CURRENT_USER_KEY, USERS_KEY, DATA_PREFIX, parse, escapeHTML, normalize, makeUserId, currentUser, getUsers, saveUsers, getStudyData, saveStudyData, addRecord, upsertWrongNote, removeWrongNote, clearWrongNotes, tags, rangeBadge, basePath };
  if (localStorage.getItem("softwareEngineeringTheme") === "light") document.documentElement.classList.add("pre-light");
  document.addEventListener("DOMContentLoaded", () => { if (document.documentElement.classList.contains("pre-light")) document.body.classList.add("light"); mountShell(); renderLanding(); });
}());
