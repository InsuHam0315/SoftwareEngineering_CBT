(function () {
  "use strict";

  const shuffle = (items) => {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  };
  const choiceObjects = (question) => question.choices.map((text, index) => ({ text, originalIndex: index + 1 }));

  document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("cbt-app"); if (!app) return;
    const bankName = document.body.dataset.bank;
    const retryId = new URLSearchParams(location.search).get("q");
    const configs = {
      mock01: { data: window.SE_MOCK_01, label: "모의고사 1회" },
      mock02: { data: window.SE_MOCK_02, label: "모의고사 2회" },
      mock03: { data: window.SE_MOCK_03, label: "모의고사 3회" },
      "final-set-01": { data: window.SE_FINAL_SET_01, label: "기말 CBT 1세트" },
      "final-set-02": { data: window.SE_FINAL_SET_02, label: "기말 CBT 2세트" },
      "final-set-03": { data: window.SE_FINAL_SET_03, label: "기말 CBT 3세트" },
      "final-set-04": { data: window.SE_FINAL_SET_04, label: "기말 CBT 4세트" },
      "final-set-05": { data: window.SE_FINAL_SET_05, label: "기말 CBT 5세트" },
      "final-set-06": { data: window.SE_FINAL_SET_06, label: "기말 CBT 6세트" },
      "final-set-07": { data: window.SE_FINAL_SET_07, label: "기말 CBT 7세트" },
      "final-set-08": { data: window.SE_FINAL_SET_08, label: "기말 CBT 8세트" },
      "final-set-09": { data: window.SE_FINAL_SET_09, label: "기말 CBT 9세트" },
      "final-set-10": { data: window.SE_FINAL_SET_10, label: "기말 CBT 10세트" },
      "final-random": { data: window.SE_FINAL_BANK, label: "기말 CBT 랜덤 50문항", random: true }
    };
    const config = configs[bankName];
    if (!config || !Array.isArray(config.data) || !config.data.length) { app.innerHTML = '<div class="empty">문제 데이터를 불러오지 못했습니다.</div>'; return; }
    const retryQuestion = retryId ? config.data.find((question) => question.id === retryId) : null;
    const randomSource = config.random ? [
      ...(retryQuestion ? [retryQuestion] : []),
      ...shuffle(config.data.filter((question) => question.id !== retryQuestion?.id)).slice(0, retryQuestion ? 49 : 50)
    ] : config.data;
    const allSource = randomSource.map((question) => ({ ...question }));
    let filteredSource = allSource.slice();
    let questions = filteredSource.map((question) => ({ ...question, displayChoices: choiceObjects(question) }));
    let gradingMode = "single";
    const states = new Map(); let savedSignature = "";
    const list = document.getElementById("question-list"); const palette = document.getElementById("question-palette"); const live = document.getElementById("cbt-live");
    const e = SEStorage.escapeHTML; const stateOf = (id) => states.get(id) || { selected: null, confirmed: false, correct: false };

    function buildStudyControls() {
      const summary = app.querySelector(".card"); const actions = summary?.querySelector(".actions"); const submit = app.querySelector(".floating-submit");
      if (!actions || !submit) return;
      actions.insertAdjacentHTML("afterend", '<div class="cbt-controls"><div class="grading-control"><span class="control-label">채점 방식</span><div class="grading-mode" role="group" aria-label="채점 방식"><button class="mode-button active" id="grading-single" type="button" aria-pressed="true">문제별 확인</button><button class="mode-button" id="grading-batch" type="button" aria-pressed="false">전체 채점</button></div></div><div class="subject-filter"><label class="control-label" for="bank-topic">과목(주제)</label><select class="select" id="bank-topic"><option value="">전체 과목</option></select><button class="btn btn-sm" id="apply-bank-filter" type="button">과목 적용</button></div></div>');
      submit.insertAdjacentHTML("afterbegin", '<button class="btn btn-primary" id="submit-all" type="button" hidden>전체 답안 채점</button>');
    }
    function buildFilterOptions() {
      const topic = document.getElementById("bank-topic"); const tag = document.getElementById("bank-tag");
      if (!topic) return;
      const topics = [...new Set(allSource.map((item) => item.topic))].sort((a, b) => a.localeCompare(b, "ko"));
      topic.innerHTML = '<option value="">전체 과목</option>' + topics.map((value) => `<option value="${e(value)}">${e(value)}</option>`).join("");
      if (tag) {
        const tags = [...new Set(allSource.flatMap((item) => item.tags || []))].sort((a, b) => a.localeCompare(b, "ko"));
        tag.innerHTML = '<option value="">전체 태그</option>' + tags.map((value) => `<option value="${e(value)}">#${e(value)}</option>`).join("");
      }
    }
    function applyFilters() {
      if ([...states.values()].some((state) => state.selected) && !window.confirm("필터를 바꾸면 현재 풀이 상태가 초기화됩니다. 계속할까요?")) return;
      const range = document.getElementById("bank-range")?.value || ""; const topic = document.getElementById("bank-topic")?.value || ""; const tag = document.getElementById("bank-tag")?.value || "";
      filteredSource = allSource.filter((item) => (!range || item.range === range) && (!topic || item.topic === topic) && (!tag || (item.tags || []).includes(tag)));
      questions = filteredSource.map((question) => ({ ...question, displayChoices: choiceObjects(question) })); states.clear(); savedSignature = ""; draw();
      live.textContent = filteredSource.length ? `${topic || "전체 과목"} ${filteredSource.length}문항으로 문제집을 구성했습니다.` : "선택한 과목에 해당하는 문제가 없습니다.";
    }
    function counts() {
      const values = [...states.values()]; const confirmed = values.filter((state) => state.confirmed).length; const correct = values.filter((state) => state.confirmed && state.correct).length;
      return { confirmed, correct, selected: values.filter((state) => state.selected).length };
    }
    function paintStats() {
      const { confirmed, correct, selected } = counts(); const total = questions.length; const completed = gradingMode === "batch" ? selected : confirmed; const progress = total ? Math.round(completed / total * 100) : 0;
      const completion = document.getElementById("confirmed-count"); const completionLabel = completion.parentElement.querySelector("span");
      document.getElementById("cbt-total").textContent = `${total}문항`; completion.textContent = `${completed} / ${total}`; completionLabel.textContent = gradingMode === "batch" ? "답변 완료" : "확인 완료";
      document.getElementById("correct-count").textContent = `${correct}문항`; document.getElementById("current-score").textContent = confirmed ? `${Math.round(correct / confirmed * 100)}점` : "0점";
      document.getElementById("progress-percent").textContent = `${progress}%`; document.getElementById("cbt-progress").style.width = `${progress}%`;
    }
    function paletteClass(state) { if (state.confirmed) return state.correct ? "correct" : "wrong"; return state.selected ? "selected" : ""; }
    function drawPalette() {
      palette.innerHTML = questions.map((question, index) => `<button class="palette-btn ${paletteClass(stateOf(question.id))}" data-target="${e(question.id)}" type="button" aria-label="${index + 1}번 문제로 이동">${index + 1}</button>`).join("");
      palette.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => document.getElementById(`q-${button.dataset.target}`)?.scrollIntoView({ behavior: "smooth", block: "start" })));
    }
    function choiceClass(option, state, answer) {
      if (!state.confirmed) return state.selected === option.originalIndex ? "selected" : "";
      if (option.originalIndex === answer) return "correct-answer"; if (!state.correct && option.originalIndex === state.selected) return "wrong-answer"; return "";
    }
    function questionHTML(question, index) {
      const state = stateOf(question.id); const correctDisplay = question.displayChoices.findIndex((option) => option.originalIndex === question.answer) + 1;
      const result = state.confirmed ? `<div class="question-result ${state.correct ? "correct" : "wrong"}" role="status"><strong>${state.correct ? "정답입니다." : "오답입니다."}</strong><p><b>현재 표시 기준 정답:</b> ${correctDisplay}번 · ${e(question.choices[question.answer - 1])}</p><p>${e(question.explanation)}</p></div>` : "";
      const confirm = gradingMode === "single" ? `<div class="question-actions"><button class="btn btn-primary confirm-answer" data-id="${e(question.id)}" type="button" ${state.confirmed ? "disabled" : ""}>${state.confirmed ? "확인 완료" : "확인"}</button></div>` : "";
      return `<article class="card question-card" id="q-${e(question.id)}"><header><div><span class="question-number">문제 ${index + 1}</span> <span class="source">원본 ID ${e(question.id)}</span></div><div>${SEStorage.rangeBadge(question.range)} <span class="badge mid">${e(question.difficulty)}</span></div></header><div class="question-text">${e(question.question)}</div><div class="choices">${question.displayChoices.map((option, displayIndex) => `<button class="choice ${choiceClass(option, state, question.answer)}" type="button" data-id="${e(question.id)}" data-choice="${option.originalIndex}" ${state.confirmed ? "disabled" : ""}><span class="choice-index">${displayIndex + 1}</span><span>${e(option.text)}</span></button>`).join("")}</div>${confirm}${result}<div class="source">주제: ${e(question.topic)} · 출처: ${e(question.sourceFile)} · ${SEStorage.tags(question.tags)}</div></article>`;
    }
    function draw() {
      list.innerHTML = questions.length ? questions.map(questionHTML).join("") : '<div class="empty">선택한 조건에 해당하는 문제가 없습니다.</div>'; drawPalette(); paintStats();
      list.querySelectorAll(".choice:not(:disabled)").forEach((button) => button.addEventListener("click", () => { const previous = stateOf(button.dataset.id); states.set(button.dataset.id, { ...previous, selected: Number(button.dataset.choice) }); draw(); }));
      list.querySelectorAll(".confirm-answer:not(:disabled)").forEach((button) => button.addEventListener("click", () => confirmAnswer(button.dataset.id)));
    }
    function saveWrong(question, state, displayedQuestion) {
      const selectedDisplay = displayedQuestion.displayChoices.findIndex((option) => option.originalIndex === state.selected) + 1; const answerDisplay = displayedQuestion.displayChoices.findIndex((option) => option.originalIndex === question.answer) + 1;
      SEStorage.upsertWrongNote({ exam: bankName, examLabel: config.label, sourceExam: question.exam, questionId: question.id, range: question.range, topic: question.topic, sourceFile: question.sourceFile, question: question.question, choices: question.choices, selected: state.selected, selectedDisplay, selectedAnswer: question.choices[state.selected - 1], answer: question.answer, answerDisplay, correctAnswer: question.choices[question.answer - 1], explanation: question.explanation, tags: question.tags, updatedAt: new Date().toISOString() });
    }
    function confirmAnswer(id) {
      const question = filteredSource.find((item) => item.id === id); const displayedQuestion = questions.find((item) => item.id === id); const state = stateOf(id);
      if (!state.selected) { live.textContent = "선지를 먼저 선택한 뒤 확인을 눌러 주세요."; return; }
      const next = { ...state, confirmed: true, correct: state.selected === question.answer }; states.set(id, next);
      live.textContent = next.correct ? "정답으로 확인했습니다." : "오답으로 확인해 오답노트에 저장했습니다."; if (!next.correct) saveWrong(question, next, displayedQuestion); draw();
      if (questions.length && counts().confirmed === questions.length) saveRecord(true);
    }
    function submitAll() {
      if (!questions.length) { live.textContent = "채점할 문제가 없습니다."; return; }
      const unanswered = questions.filter((question) => !stateOf(question.id).selected);
      if (unanswered.length) {
        live.textContent = `${unanswered.length}문항이 남아 있습니다. 모두 답변한 뒤 전체 채점해 주세요.`;
        document.getElementById(`q-${unanswered[0].id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      questions.forEach((question) => {
        const state = stateOf(question.id); const next = { ...state, confirmed: true, correct: state.selected === question.answer };
        states.set(question.id, next);
        if (!state.confirmed && !next.correct) saveWrong(question, next, question);
      });
      draw(); saveRecord(true);
    }
    function setGradingMode(mode) {
      gradingMode = mode;
      app.querySelectorAll(".mode-button").forEach((button) => {
        const active = button.id === `grading-${mode}`; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active));
      });
      document.getElementById("submit-all").hidden = mode !== "batch";
      document.getElementById("save-record").hidden = mode === "batch";
      draw();
      live.textContent = mode === "batch" ? "모든 문제에 답한 뒤 아래의 전체 답안 채점을 눌러 주세요." : "각 문제의 확인 버튼으로 바로 정답과 해설을 볼 수 있습니다.";
    }
    function saveRecord(automatic) {
      const { confirmed, correct } = counts(); const total = questions.length;
      if (!confirmed || !total) { live.textContent = "확인한 문제가 없어 기록을 저장할 수 없습니다."; return; }
      const signature = `${bankName}|${total}|${confirmed}|${correct}|${[...states.entries()].filter(([, state]) => state.confirmed).map(([id, state]) => `${id}:${state.selected}`).sort().join(",")}`;
      if (signature === savedSignature) { live.textContent = "현재 풀이 상태는 이미 기록했습니다."; return; }
      const wrongQuestions = filteredSource.filter((question) => stateOf(question.id).confirmed && !stateOf(question.id).correct); const user = SEStorage.currentUser();
      SEStorage.addRecord({ id: `${bankName}-${Date.now()}`, userId: user.userId, exam: bankName, examLabel: config.label, total, confirmed, correct, score: Math.round(correct / total * 100), rangeFilter: document.getElementById("bank-range")?.value || "전체", topicFilter: document.getElementById("bank-topic")?.value || "전체", wrongRanges: wrongQuestions.map((question) => question.range), wrongTags: wrongQuestions.flatMap((question) => question.tags || []), createdAt: new Date().toISOString() });
      savedSignature = signature; live.textContent = `${automatic ? "전 문항 완료로" : "현재 상태를"} ${Math.round(correct / total * 100)}점 기록으로 저장했습니다.`;
    }
    function restoreOrder() {
      const current = new Map(questions.map((question) => [question.id, question])); questions = filteredSource.map((question) => current.get(question.id) || { ...question, displayChoices: choiceObjects(question) }); draw(); live.textContent = "문제를 기본 순서로 복원했습니다.";
    }

    buildStudyControls();
    document.getElementById("random-order").addEventListener("click", () => { questions = shuffle(questions); draw(); live.textContent = "문제 표시 순서를 섞었습니다. 원본 ID와 풀이 상태는 유지됩니다."; });
    document.getElementById("restore-order").addEventListener("click", restoreOrder);
    document.getElementById("random-choices").addEventListener("click", () => { questions.forEach((question) => { question.displayChoices = shuffle(question.displayChoices); }); draw(); live.textContent = "선지 순서를 섞었습니다. 원본 정답 인덱스로 안전하게 채점합니다."; });
    document.getElementById("restore-choices").addEventListener("click", () => { questions.forEach((question) => { question.displayChoices = choiceObjects(question); }); draw(); live.textContent = "선지를 기본 순서로 복원했습니다."; });
    document.getElementById("save-record").addEventListener("click", () => saveRecord(false));
    document.getElementById("submit-all").addEventListener("click", submitAll);
    document.getElementById("grading-single").addEventListener("click", () => setGradingMode("single"));
    document.getElementById("grading-batch").addEventListener("click", () => setGradingMode("batch"));
    document.getElementById("apply-bank-filter").addEventListener("click", applyFilters);
    buildFilterOptions(); draw();
    if (retryId) setTimeout(() => document.getElementById(`q-${retryId}`)?.scrollIntoView({ behavior: "smooth" }), 120);
  });
}());
