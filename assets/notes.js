(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const host = document.getElementById("study-content"); if (!host) return;
    const search = document.getElementById("study-search"); const range = document.getElementById("study-range"); const type = document.getElementById("study-type"); const e = SEStorage.escapeHTML;
    function noteHTML(item) { return `<article class="card note-item"><details><summary><div><div>${SEStorage.rangeBadge(item.range)} <span class="badge high">중요도 ${e(item.importance)}</span></div><h3>${e(item.title)}</h3><div class="source">${e(item.sourceFile)}</div></div><span>＋</span></summary><div class="note-body">${e(item.content)}${item.examTip ? `<p class="exam-point"><strong>시험 포인트</strong><br>${e(item.examTip)}</p>` : ""}<div>${SEStorage.tags(item.tags)}</div><p class="origin-label">${e(item.origin)}</p></div></details></article>`; }
    function conceptHTML(item) { return `<article class="card concept-card"><div>${SEStorage.rangeBadge(item.range || "공통")}</div><h3>${e(item.name)}</h3><p>${e(item.definition)}</p><p class="exam-point"><strong>출제 포인트</strong><br>${e(item.examPoint)}</p><p><strong>예시</strong> · ${e(item.example)}</p><p class="muted"><strong>연관 개념</strong> · ${e((item.related || []).join(", "))}</p><div>${SEStorage.tags(item.tags)}</div><p class="origin-label">${e(item.origin)}</p></article>`; }
    function comparisonHTML(item) { return `<article class="card compare-card"><div class="compare-side"><span class="eyebrow">개념 A</span><h3>${e(item.conceptA)}</h3></div><div class="compare-side"><span class="eyebrow">개념 B</span><h3>${e(item.conceptB)}</h3></div><div class="compare-key"><p><strong>핵심 차이</strong> · ${e(item.keyDifference)}</p><p class="exam-point"><strong>시험 구별 팁</strong><br>${e(item.examTip)}</p><p><strong>예시</strong> · ${e(item.example)}</p><span class="origin-label">${e(item.origin)}</span></div></article>`; }
    function includes(item, fields, query) { const needle = SEStorage.normalize(query); return !needle || fields.some((field) => SEStorage.normalize(Array.isArray(item[field]) ? item[field].join(" ") : item[field]).includes(needle)); }
    function draw() {
      const selected = type.value; let items; let renderer;
      if (selected === "concepts") { items = window.SE_CONCEPTS || []; renderer = conceptHTML; }
      else if (selected === "comparisons") { items = window.SE_COMPARISONS || []; renderer = comparisonHTML; }
      else { items = window.SE_NOTES || []; renderer = noteHTML; }
      const filtered = items.filter((item) => (!range.value || item.range === range.value || item.range === "공통") && includes(item, Object.keys(item), search.value));
      host.className = selected === "comparisons" ? "compare-list section" : "concept-list section"; host.innerHTML = filtered.length ? filtered.map(renderer).join("") : '<div class="empty">조건에 맞는 학습 항목이 없습니다.</div>';
    }
    search.addEventListener("input", draw); range.addEventListener("change", draw); type.addEventListener("change", draw); draw();
  });
}());
