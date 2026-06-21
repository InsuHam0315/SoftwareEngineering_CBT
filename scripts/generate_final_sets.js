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
  return items.map((item) => ({ id: item.id, text: compact(item[field]) })).filter((item) => item.text);
}

function makeSpec(source, kind, question, correct, pool, reason) {
  return {
    source,
    kind,
    question: compact(question),
    correct: compact(correct),
    pool: pool.filter((item) => item.id !== source.id && item.text !== compact(correct)),
    reason: compact(reason),
  };
}

const conceptNames = optionPool(concepts, "name");
const definitions = optionPool(concepts, "definition");
const conceptPoints = optionPool(concepts, "examPoint");
const conceptExamples = optionPool(concepts, "example");
const noteTitles = optionPool(notes, "title");
const noteSummaries = optionPool(notes, "shortSummary");
const notePoints = optionPool(notes, "examPoint");
const noteMemoryTips = optionPool(notes, "quickMemoryTip");

const recognitionTemplates = [
  (description) => `“${description}”에 해당하는 개념은?`,
  (description) => `다음 설명이 가리키는 용어는 무엇인가? “${description}”`,
  (description) => `“${description}”의 이름으로 알맞은 것은?`,
  (description) => `다음 정의에 가장 가까운 개념은? “${description}”`,
];
const definitionTemplates = [
  (name) => `${name}의 기본 정의로 가장 적절한 것은?`,
  (name) => `${objectParticle(name)} 바르게 설명한 것은?`,
  (name) => `${name}의 의미에 가장 가까운 설명은?`,
  (name) => `${name}에 대한 설명으로 옳은 것은?`,
];
const pointTemplates = [
  (name) => `${name}의 핵심 구분 기준으로 가장 적절한 것은?`,
  (name) => `${name}에서 우선 기억할 시험 포인트는?`,
  (name) => `${objectParticle(name)} 다른 개념과 구분하는 기준은?`,
  (name) => `${name}의 핵심 특징으로 옳은 것은?`,
];
const exampleTemplates = [
  (name) => `${name}의 대표 사례로 가장 적절한 것은?`,
  (name) => `다음 중 ${name}에 해당하는 간단한 예는?`,
  (name) => `${objectParticle(name)} 적용한 예로 알맞은 것은?`,
  (name) => `${name}의 특징이 드러나는 사례는?`,
];
const memoryTemplates = [
  (name) => `${name}을 간단히 기억하는 방법으로 가장 적절한 것은?`,
  (name) => `${name}의 핵심을 짧게 정리한 것은?`,
  (name) => `${name}을 복습할 때 사용할 기억법으로 알맞은 것은?`,
  (name) => `${name}의 핵심 암기 포인트는?`,
];

const specs = [];
for (const [sourceIndex, concept] of concepts.entries()) {
  const variants = [
    ["개념 식별", recognitionTemplates[0](concept.definition), concept.name, conceptNames, `${concept.name}의 정의는 ${concept.definition}`],
    ["정의 이해", definitionTemplates[sourceIndex % 4](concept.name), concept.definition, definitions, concept.definition],
    ["핵심 구분", pointTemplates[sourceIndex % 4](concept.name), concept.examPoint, conceptPoints, concept.examPoint],
    ["대표 사례", exampleTemplates[sourceIndex % 4](concept.name), concept.example, conceptExamples, `${concept.name}의 대표 사례는 ${concept.example}`],
    ["개념 식별", recognitionTemplates[1](concept.definition), concept.name, conceptNames, `${concept.name}의 정의는 ${concept.definition}`],
    ["정의 이해", definitionTemplates[(sourceIndex + 1) % 4](concept.name), concept.definition, definitions, concept.definition],
    ["핵심 구분", pointTemplates[(sourceIndex + 1) % 4](concept.name), concept.examPoint, conceptPoints, concept.examPoint],
    ["대표 사례", exampleTemplates[(sourceIndex + 1) % 4](concept.name), concept.example, conceptExamples, `${concept.name}의 대표 사례는 ${concept.example}`],
    ["개념 식별", recognitionTemplates[2 + (sourceIndex % 2)](concept.definition), concept.name, conceptNames, `${concept.name}의 정의는 ${concept.definition}`],
  ];
  variants.forEach(([kind, question, correct, pool, reason]) => specs.push(makeSpec(concept, kind, question, correct, pool, reason)));
}

for (const [sourceIndex, note] of notes.entries()) {
  const variants = [
    ["주제 식별", recognitionTemplates[0](note.shortSummary), note.title, noteTitles, `제시된 설명의 핵심 주제는 ${note.title}이다.`],
    ["핵심 정리", definitionTemplates[sourceIndex % 4](note.title), note.shortSummary, noteSummaries, note.shortSummary],
    ["시험 포인트", pointTemplates[sourceIndex % 4](note.title), note.examPoint, notePoints, note.examPoint],
    ["핵심 기억", memoryTemplates[sourceIndex % 4](note.title), note.quickMemoryTip, noteMemoryTips, note.quickMemoryTip],
    ["주제 식별", recognitionTemplates[1](note.shortSummary), note.title, noteTitles, `제시된 설명의 핵심 주제는 ${note.title}이다.`],
    ["핵심 정리", definitionTemplates[(sourceIndex + 1) % 4](note.title), note.shortSummary, noteSummaries, note.shortSummary],
    ["시험 포인트", pointTemplates[(sourceIndex + 1) % 4](note.title), note.examPoint, notePoints, note.examPoint],
    ["핵심 기억", memoryTemplates[(sourceIndex + 1) % 4](note.title), note.quickMemoryTip, noteMemoryTips, note.quickMemoryTip],
    ["주제 식별", recognitionTemplates[2 + (sourceIndex % 2)](note.shortSummary), note.title, noteTitles, `제시된 설명의 핵심 주제는 ${note.title}이다.`],
  ];
  variants.forEach(([kind, question, correct, pool, reason]) => specs.push(makeSpec(note, kind, question, correct, pool, reason)));
}

if (specs.length < 500) throw new Error(`직접 개념형 문항 후보 부족: ${specs.length}`);

let seed = 20260623;
const mixed = specs.slice();
for (let index = mixed.length - 1; index > 0; index -= 1) {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  const target = seed % (index + 1);
  [mixed[index], mixed[target]] = [mixed[target], mixed[index]];
}
const selected = mixed.slice(0, 500);

function candidatesFor(spec) {
  const correctLength = textLength(spec.correct);
  return spec.pool.map((item) => ({ ...item, length: textLength(item.text) }))
    .filter((item) => item.text && item.text !== spec.correct)
    .sort((a, b) => Math.abs(a.length - correctLength) - Math.abs(b.length - correctLength));
}

function selectAlternatives(spec, makeCorrectLongest) {
  const correctLength = textLength(spec.correct);
  const candidates = candidatesFor(spec);
  const comparable = candidates.filter((item) => Math.min(item.length, correctLength) / Math.max(item.length, correctLength) >= 0.6);
  const source = comparable.length >= 3 ? comparable : candidates;
  const picked = [];
  const add = (item) => {
    if (item && !picked.some((old) => old.text === item.text)) picked.push(item);
  };

  if (makeCorrectLongest) {
    source.filter((item) => item.length < correctLength).slice(0, 3).forEach(add);
  } else {
    add(source.filter((item) => item.length > correctLength).sort((a, b) => a.length - b.length)[0]);
  }
  source.forEach((item) => { if (picked.length < 3) add(item); });
  candidates.forEach((item) => { if (picked.length < 3) add(item); });
  if (picked.length !== 3) throw new Error(`선지 후보 부족: ${spec.source.id}/${spec.kind}`);
  return picked.map((item) => item.text);
}

const canAvoidLongest = (spec) => candidatesFor(spec).some((item) => item.length > textLength(spec.correct));
const canBeLongest = (spec) => candidatesFor(spec).filter((item) => item.length < textLength(spec.correct)).length >= 3;
const hardPositions = new Set([10, 20, 30, 40, 50]);
const easyPositions = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 23, 25, 27, 32, 34, 36, 43, 45, 47]);

for (let setNumber = 1; setNumber <= 10; setNumber += 1) {
  const setSpecs = selected.slice((setNumber - 1) * 50, setNumber * 50);
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
    const answer = ((index + setNumber - 1) % 4) + 1;
    const choices = selectAlternatives(spec, longestIndexes.has(index));
    choices.splice(answer - 1, 0, spec.correct);
    const source = spec.source;
    const topic = source.name || source.title;
    const difficulty = hardPositions.has(number) ? "어려움" : (easyPositions.has(number) ? "쉬움" : "보통");
    return {
      id: `final-concept-${String(setNumber).padStart(2, "0")}-${String(number).padStart(3, "0")}`,
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
      explanation: `정답은 ${answer}번 '${spec.correct}'이다. ${spec.reason} 다른 선지는 다른 개념의 정의·특징 또는 예이므로 ${topic}과 구분해야 한다. 시험 포인트: ${source.examPoint || source.examTip}`,
      tags: [...new Set([...(source.tags || []), spec.kind, "직접 개념형", "반복 학습"])],
    };
  });

  const strictLongest = questions.filter((item) => {
    const lengths = item.choices.map(textLength);
    const answerLength = lengths[item.answer - 1];
    return answerLength > Math.max(...lengths.filter((_, index) => index !== item.answer - 1));
  }).length;
  if (strictLongest !== 13) throw new Error(`${setNumber}세트 최장 정답 ${strictLongest}문항 (기대 13)`);

  const suffix = String(setNumber).padStart(2, "0");
  const output = `window.SE_FINAL_SET_${suffix} = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(path.join(root, "data", `software_engineering_final_set_${suffix}.js`), output, "utf8");
}

console.log("기말 CBT 1~10세트 500문항을 직접 개념형으로 생성했습니다.");
