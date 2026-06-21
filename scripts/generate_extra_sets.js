const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
global.window = {};
require(path.join(root, "data", "software_engineering_concepts.js"));
require(path.join(root, "data", "software_engineering_notes.js"));

const concepts = window.SE_CONCEPTS.filter((item) => item.range === "기말고사");
const notes = window.SE_NOTES.filter((item) => item.range === "기말고사");
const compact = (text) => String(text || "").replace(/\s+/g, " ").trim();
const textLength = (text) => compact(text).replace(/\s/g, "").length;
const hasBatchim = (text) => {
  const last = [...compact(text)].pop();
  const code = last ? last.charCodeAt(0) : 0;
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
};
const objectParticle = (text) => `${text}${hasBatchim(text) ? "을" : "를"}`;

function optionPool(items, field) {
  return items.map((item) => ({
    id: item.id,
    text: compact(item[field]),
  })).filter((item) => item.text);
}

function makeSpec(source, kind, question, correct, pool, reason) {
  return {
    source,
    kind,
    question: compact(question),
    correct: compact(correct),
    pool: pool.filter((item) => item.id !== source.id && compact(item.text) !== compact(correct)),
    reason: compact(reason),
  };
}

const conceptNames = optionPool(concepts, "name");
const definitions = optionPool(concepts, "definition");
const examPoints = optionPool(concepts, "examPoint");
const examples = optionPool(concepts, "example");
const noteTitles = optionPool(notes, "title");
const noteSummaries = optionPool(notes, "shortSummary");
const noteExamPoints = optionPool(notes, "examPoint");

const specs = [];
for (const [conceptIndex, concept] of concepts.entries()) {
  const definitionQuestions = [
    `${concept.name}의 기본 정의로 가장 적절한 것은?`,
    `${objectParticle(concept.name)} 바르게 설명한 것은?`,
    `${concept.name}의 의미에 가장 가까운 설명은?`,
    `${concept.name}에 대한 설명으로 옳은 것은?`,
  ];
  const examPointQuestions = [
    `${objectParticle(concept.name)} 시험에서 구분할 때 기억할 핵심 설명은?`,
    `${concept.name}에서 혼동하기 쉬운 개념을 가르는 기준은?`,
    `${concept.name}의 핵심 시험 포인트로 가장 적절한 것은?`,
    `${concept.name}을 학습할 때 우선 기억할 내용은?`,
  ];
  const exampleQuestions = [
    `${concept.name}의 사례로 가장 적절한 것은?`,
    `다음 중 ${concept.name}에 해당하는 사례는?`,
    `${objectParticle(concept.name)} 적용한 예로 알맞은 것은?`,
    `${concept.name}의 특징이 가장 잘 드러나는 사례는?`,
  ];
  specs.push(makeSpec(
    concept,
    "개념 식별",
    `“${concept.definition}”에 해당하는 소프트웨어공학 개념은?`,
    concept.name,
    conceptNames,
    `${concept.name}의 정의는 다음과 같다. ${concept.definition}`,
  ));
  specs.push(makeSpec(
    concept,
    "정의 이해",
    definitionQuestions[conceptIndex % definitionQuestions.length],
    concept.definition,
    definitions,
    concept.definition,
  ));
  specs.push(makeSpec(
    concept,
    "핵심 비교",
    examPointQuestions[conceptIndex % examPointQuestions.length],
    concept.examPoint,
    examPoints,
    concept.examPoint,
  ));
  specs.push(makeSpec(
    concept,
    "사례 적용",
    exampleQuestions[conceptIndex % exampleQuestions.length],
    concept.example,
    examples,
    `${concept.name}의 대표 사례는 다음과 같다. ${concept.example}`,
  ));
}
for (const [noteIndex, note] of notes.entries()) {
  const summaryQuestions = [
    `${note.title}의 핵심 내용으로 가장 적절한 것은?`,
    `${note.title}에서 가장 먼저 이해할 내용은?`,
    `${note.title}을 요약한 설명으로 옳은 것은?`,
  ];
  const notePointQuestions = [
    `${note.title}에서 시험에 자주 나오는 판단 기준은?`,
    `${note.title}의 시험 포인트로 가장 적절한 것은?`,
    `${note.title}을 문제에 적용할 때 확인할 기준은?`,
  ];
  specs.push(makeSpec(
    note,
    "핵심 정리",
    summaryQuestions[noteIndex % summaryQuestions.length],
    note.shortSummary,
    noteSummaries,
    note.shortSummary,
  ));
  specs.push(makeSpec(
    note,
    "주제 식별",
    `“${note.shortSummary}”를 중심으로 학습하는 기말 주제는?`,
    note.title,
    noteTitles,
    `제시된 설명의 핵심 주제는 ${note.title}이다.`,
  ));
  specs.push(makeSpec(
    note,
    "시험 포인트",
    notePointQuestions[noteIndex % notePointQuestions.length],
    note.examPoint,
    noteExamPoints,
    note.examPoint,
  ));
}

const selected = specs.slice(0, 200);
if (selected.length !== 200) {
  throw new Error(`추가 문항 후보가 200개가 아님: ${selected.length}`);
}

function selectAlternatives(spec, makeCorrectLongest) {
  const correctLength = textLength(spec.correct);
  const candidates = spec.pool.map((item) => ({
    ...item,
    length: textLength(item.text),
  })).filter((item) => item.text && item.text !== spec.correct);
  const comparable = candidates.filter((item) => {
    const ratio = Math.min(item.length, correctLength) / Math.max(item.length, correctLength);
    return ratio >= 0.6;
  });
  const source = comparable.length >= 3 ? comparable : candidates;
  const selectedItems = [];
  const add = (item) => {
    if (item && !selectedItems.some((old) => old.text === item.text)) selectedItems.push(item);
  };

  if (makeCorrectLongest) {
    source.filter((item) => item.length < correctLength)
      .sort((a, b) => Math.abs(a.length - correctLength) - Math.abs(b.length - correctLength))
      .slice(0, 3).forEach(add);
  } else {
    add(source.filter((item) => item.length > correctLength)
      .sort((a, b) => a.length - b.length)[0]);
  }
  source.slice().sort((a, b) => Math.abs(a.length - correctLength) - Math.abs(b.length - correctLength))
    .forEach((item) => {
      if (selectedItems.length < 3) add(item);
    });
  candidates.forEach((item) => {
    if (selectedItems.length < 3) add(item);
  });
  if (selectedItems.length !== 3) throw new Error(`선지 후보 부족: ${spec.source.id}/${spec.kind}`);
  return selectedItems.map((item) => item.text);
}

function canAvoidLongest(spec) {
  return spec.pool.some((item) => textLength(item.text) > textLength(spec.correct));
}

function canBeLongest(spec) {
  return spec.pool.filter((item) => textLength(item.text) < textLength(spec.correct)).length >= 3;
}

const hardPositions = new Set([7, 14, 21, 28, 35, 42, 49]);
const easyPositions = new Set([1, 4, 6, 9, 12, 15, 18, 22, 25, 29, 32, 36, 39, 43, 46, 50]);
const answerPatterns = [
  [1, 2, 3, 4],
  [2, 3, 4, 1],
  [3, 4, 1, 2],
  [4, 1, 2, 3],
];

let seed = 20260622;
const mixed = selected.slice();
for (let index = mixed.length - 1; index > 0; index -= 1) {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  const target = seed % (index + 1);
  [mixed[index], mixed[target]] = [mixed[target], mixed[index]];
}

for (let setNumber = 7; setNumber <= 10; setNumber += 1) {
  const start = (setNumber - 7) * 50;
  const setSpecs = mixed.slice(start, start + 50);
  const forcedLongest = setSpecs.map((spec, index) => ({ spec, index }))
    .filter(({ spec }) => !canAvoidLongest(spec)).map(({ index }) => index);
  if (forcedLongest.length > 13) throw new Error(`${setNumber}세트의 최장 정답 강제 문항이 너무 많음`);
  const longestIndexes = new Set(forcedLongest);
  setSpecs.forEach((spec, index) => {
    if (longestIndexes.size < 13 && canBeLongest(spec)) longestIndexes.add(index);
  });
  if (longestIndexes.size !== 13) throw new Error(`${setNumber}세트의 최장 정답 목표를 구성할 수 없음`);

  const questions = setSpecs.map((spec, index) => {
    const number = index + 1;
    const answer = answerPatterns[setNumber - 7][index % 4];
    const distractors = selectAlternatives(spec, longestIndexes.has(index));
    const choices = [...distractors];
    choices.splice(answer - 1, 0, spec.correct);
    const source = spec.source;
    const topic = source.name || source.title;
    const difficulty = hardPositions.has(number) ? "어려움" : (easyPositions.has(number) ? "쉬움" : "보통");
    return {
      id: `final-${String(setNumber).padStart(3, "0")}-${String(number).padStart(3, "0")}`,
      exam: `final-set-${String(setNumber).padStart(2, "0")}`,
      range: "기말고사",
      sourceFolder: "기말고사",
      sourceFile: source.sourceFile,
      topic,
      type: "객관식",
      difficulty,
      question: spec.question,
      choices,
      answer,
      explanation: `정답은 ${answer}번이다. ${spec.reason} 다른 선지는 서로 다른 개념의 목적·범위 또는 사례를 설명하므로 ${topic}의 핵심 기준과 맞지 않는다. 시험 포인트: ${source.examPoint || source.examTip}`,
      tags: [...new Set([...(source.tags || []), spec.kind, "반복 학습"])],
    };
  });

  const strictLongest = questions.filter((item) => {
    const lengths = item.choices.map(textLength);
    const answerLength = lengths[item.answer - 1];
    return answerLength > Math.max(...lengths.filter((_, index) => index !== item.answer - 1));
  }).length;
  if (strictLongest !== 13) throw new Error(`${setNumber}세트 최장 정답 ${strictLongest}문항 (기대 13)`);

  const variable = `window.SE_FINAL_SET_${String(setNumber).padStart(2, "0")}`;
  const output = `${variable} = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(path.join(root, "data", `software_engineering_final_set_${String(setNumber).padStart(2, "0")}.js`), output, "utf8");
}

console.log("기말 CBT 7~10세트(각 50문항) 생성 완료");
