(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const host = document.getElementById("wrong-list"); if (!host) return;
    const search = document.getElementById("wrong-search"); const range = document.getElementById("wrong-range"); const topic = document.getElementById("wrong-topic"); const tag = document.getElementById("wrong-tag"); const count = document.getElementById("wrong-total"); const e = SEStorage.escapeHTML;
    const notes = () => SEStorage.getStudyData().wrongNotes;
    function setOptions(items) {
      const topicValue = topic.value; const tagValue = tag.value; const topics = [...new Set(items.map((item) => item.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko")); const tags = [...new Set(items.flatMap((item) => item.tags || []))].sort((a, b) => a.localeCompare(b, "ko"));
      topic.innerHTML = '<option value="">전체 주제</option>' + topics.map((value) => `<option value="${e(value)}">${e(value)}</option>`).join(""); tag.innerHTML = '<option value="">전체 태그</option>' + tags.map((value) => `<option value="${e(value)}">#${e(value)}</option>`).join("");
      if (topics.includes(topicValue)) topic.value = topicValue; if (tags.includes(tagValue)) tag.value = tagValue;
    }
    function retryURL(item) {
      const pages = {
        mock01: "software_engineering_mock_01.html", mock02: "software_engineering_mock_02.html",
        "final-set-01": "software_engineering_final_set_01.html", "final-set-02": "software_engineering_final_set_02.html",
        "final-set-03": "software_engineering_final_set_03.html", "final-set-04": "software_engineering_final_set_04.html",
        "final-set-05": "software_engineering_final_set_05.html", "final-set-06": "software_engineering_final_set_06.html",
        "final-random": "software_engineering_final_random.html"
      };
      const legacyPage = String(item.questionId).startsWith("mock01-") ? pages.mock01 : String(item.questionId).startsWith("mock02-") ? pages.mock02 : null;
      const page = item.exam === "finalbank" && legacyPage ? legacyPage : pages[item.exam] || "software_engineering_final_cbt.html";
      return `../cbt/${page}?q=${encodeURIComponent(item.questionId)}`;
    }
    function draw() {
      const items = notes(); setOptions(items); count.textContent = `${items.length}문항`;
      const filtered = items.filter((item) => (!range.value || item.range === range.value) && (!topic.value || item.topic === topic.value) && (!tag.value || (item.tags || []).includes(tag.value)) && [item.question, item.explanation, item.sourceFile, ...(item.tags || [])].some((value) => SEStorage.normalize(value).includes(SEStorage.normalize(search.value))));
      host.innerHTML = filtered.length ? filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((item) => `<article class="card wrong-card"><div>${SEStorage.rangeBadge(item.range)} <span class="badge mid">${e(item.examLabel)}</span></div><h3>${e(item.question)}</h3><div class="answer-row"><div class="answer-box"><strong>내가 고른 답</strong><br>${e(item.selectedDisplay || item.selected)}번 · ${e(item.selectedAnswer)}</div><div class="answer-box correct"><strong>당시 표시 기준 정답</strong><br>${e(item.answerDisplay || item.answer)}번 · ${e(item.correctAnswer)}</div></div><p>${e(item.explanation)}</p><div>${SEStorage.tags(item.tags)}</div><p class="source">${e(item.sourceFile)} · ${new Date(item.updatedAt).toLocaleString("ko-KR")}</p><div class="actions"><a class="btn btn-primary btn-sm" href="${retryURL(item)}">다시 풀기</a><button class="btn btn-danger btn-sm delete-wrong" data-exam="${e(item.exam)}" data-id="${e(item.questionId)}" type="button">삭제</button></div></article>`).join("") : '<div class="empty">조건에 맞는 오답이 없습니다. CBT에서 오답을 확인하면 자동으로 저장됩니다.</div>';
      host.querySelectorAll(".delete-wrong").forEach((button) => button.addEventListener("click", () => { SEStorage.removeWrongNote(button.dataset.exam, button.dataset.id); draw(); }));
    }
    [search, range, topic, tag].forEach((element) => element.addEventListener(element === search ? "input" : "change", draw));
    document.getElementById("clear-wrong").addEventListener("click", () => { if (notes().length && window.confirm("현재 사용자의 오답노트를 모두 삭제할까요?")) { SEStorage.clearWrongNotes(); draw(); } }); draw();
  });
}());
