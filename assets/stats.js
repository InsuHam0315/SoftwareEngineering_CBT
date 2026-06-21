(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const host = document.getElementById("records-body"); if (!host) return;
    const user = SEStorage.currentUser(); const data = SEStorage.getStudyData(); const records = data.records.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const average = records.length ? Math.round(records.reduce((sum, item) => sum + item.score, 0) / records.length) : 0; const best = records.length ? Math.max(...records.map((item) => item.score)) : 0;
    document.getElementById("record-user").textContent = user.guest ? "게스트 학습 기록" : `${user.name} 님의 학습 기록`; document.getElementById("stat-attempts").textContent = `${records.length}회`; document.getElementById("stat-average").textContent = `${average}점`; document.getElementById("stat-best").textContent = `${best}점`; document.getElementById("stat-wrong").textContent = `${data.wrongNotes.length}문항`;
    const countValues = (values) => values.reduce((result, value) => { result[value] = (result[value] || 0) + 1; return result; }, {});
    function bars(target, values, empty) {
      const element = document.getElementById(target); const entries = Object.entries(countValues(values)).sort((a, b) => b[1] - a[1]); const max = Math.max(1, ...entries.map((entry) => entry[1]));
      element.innerHTML = entries.length ? entries.slice(0, 7).map(([label, value]) => `<div class="bar-row"><span>${SEStorage.escapeHTML(label)}</span><div class="mini-bar"><i style="width:${value / max * 100}%"></i></div><b>${value}</b></div>`).join("") : `<p class="muted">${empty}</p>`;
    }
    bars("weak-ranges", records.flatMap((item) => item.wrongRanges || []), "아직 취약 범위 데이터가 없습니다."); bars("wrong-tags", records.flatMap((item) => item.wrongTags || []), "아직 오답 태그 데이터가 없습니다.");
    const examLabels = { mock01: "모의고사 1회", mock02: "모의고사 2회", "final-random": "랜덤 50문항", finalbank: "이전 기말 CBT" };
    for (let number = 1; number <= 6; number += 1) examLabels[`final-set-${String(number).padStart(2, "0")}`] = `기말 CBT ${number}세트`;
    const groupExams = ["mock01", "mock02", ...Array.from({ length: 6 }, (_, index) => `final-set-${String(index + 1).padStart(2, "0")}`), "final-random"];
    if (records.some((item) => item.exam === "finalbank")) groupExams.push("finalbank");
    const groups = groupExams.map((exam) => { const values = records.filter((item) => item.exam === exam); return { exam, label: examLabels[exam], attempts: values.length, best: values.length ? Math.max(...values.map((item) => item.score)) : 0 }; });
    document.getElementById("exam-summary").innerHTML = groups.map((item) => `<div class="card"><span class="muted">${item.label}</span><strong class="summary-score">${item.best}점</strong><small>${item.attempts}회 응시</small></div>`).join("");
    host.innerHTML = records.length ? `<div style="overflow-x:auto"><table class="record-table"><thead><tr><th>일시</th><th>시험</th><th>확인</th><th>정답</th><th>점수</th></tr></thead><tbody>${records.map((item) => `<tr><td>${new Date(item.createdAt).toLocaleString("ko-KR")}</td><td>${SEStorage.escapeHTML(item.examLabel)}</td><td>${item.confirmed}/${item.total}</td><td>${item.correct}개</td><td><strong>${item.score}점</strong></td></tr>`).join("")}</tbody></table></div>` : '<div class="empty">저장된 응시 기록이 없습니다. CBT에서 결과를 저장해 보세요.</div>';
  });
}());
