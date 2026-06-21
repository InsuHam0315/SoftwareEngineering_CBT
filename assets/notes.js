(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const host = document.getElementById("study-content");
    if (!host) return;

    const search = document.getElementById("study-search");
    const range = document.getElementById("study-range");
    const type = document.getElementById("study-type");
    const count = document.getElementById("study-count");
    const tocHosts = [document.getElementById("study-toc-list-desktop"), document.getElementById("study-toc-list-mobile")].filter(Boolean);
    const e = SEStorage.escapeHTML;
    let sectionObserver;

    function arrayOf(value) {
      if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== "");
      return value === undefined || value === null || value === "" ? [] : [value];
    }

    function itemTitle(item, selected) {
      if (item.title) return item.title;
      if (item.name) return item.name;
      if (selected === "comparisons") return `${item.conceptA || "개념 A"} vs ${item.conceptB || "개념 B"}`;
      return "제목 없는 학습 항목";
    }

    function stableId(item, selected) {
      const source = String(item.id || itemTitle(item, selected));
      const slug = source.toLocaleLowerCase("ko-KR").replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
      return `study-${selected}-${slug || "item"}`;
    }

    function summaryOf(item, selected) {
      let summary;
      if (item.shortSummary) summary = item.shortSummary;
      else if (selected === "notes") summary = item.content || "";
      else if (selected === "concepts") summary = item.definition || "";
      else summary = item.keyDifference || "";

      const sentenceCount = (String(summary).match(/[.!?](?:\s|$)/g) || []).length;
      const examPoint = arrayOf(item.examPoint || item.examTip)[0];
      if (sentenceCount < 2 && examPoint) {
        const firstSentence = String(examPoint).trim().match(/^.*?[.!?](?:\s|$)/);
        summary = `${summary} ${firstSentence ? firstSentence[0].trim() : examPoint}`;
      }
      return summary;
    }

    function sourceBasis(item) {
      const basis = item.sourceBasis || item.origin || "제공 자료 기반";
      if (String(basis).includes("일반적인 소프트웨어공학 관점")) return "일반적인 소프트웨어공학 관점 보충";
      return basis;
    }

    function localImagePath(value) {
      const src = String(value || "").trim().replace(/\\/g, "/");
      if (!src || /^(?:[a-z]+:)?\/\//i.test(src) || /^data:/i.test(src)) return "";
      if (/^(?:\.\.\/|\.\/)/.test(src)) return src;
      return `../../${src.replace(/^\/+/, "")}`;
    }

    function visualOf(item) {
      const visual = item.visual && typeof item.visual === "object" ? item.visual : {};
      const src = localImagePath(visual.src || item.relatedImage);
      if (!src) return "";
      const title = item.title || item.name || item.conceptA || "개념";
      const sourceName = visual.sourceName === "local generated SVG" ? "직접 제작한 로컬 SVG" : visual.sourceName;
      const caption = visual.caption || `${title} 핵심 구조`;
      return `<figure class="study-visual concept-visual-hero"><div class="study-visual-scroll concept-visual-scroll"><img src="${e(src)}" alt="${e(visual.alt || `${title} 학습 다이어그램`)}" loading="lazy" decoding="async"></div><figcaption class="visual-caption">${e(caption)}${sourceName ? `<span>${e(sourceName)}</span>` : ""}</figcaption></figure>`;
    }

    function importanceBadge(value) {
      const label = String(value || "보통").replace(/^\s*중요도\s*/, "");
      const cssClass = label.includes("최상") ? "high" : label.includes("상") ? "mid" : "low";
      return `<span class="badge ${cssClass}">중요도 ${e(label)}</span>`;
    }

    function paragraphs(value) {
      return arrayOf(value).map((paragraph) => `<p>${e(paragraph)}</p>`).join("");
    }

    function list(value, ordered, className) {
      const items = arrayOf(value);
      if (!items.length) return "";
      const tag = ordered ? "ol" : "ul";
      return `<${tag}${className ? ` class="${className}"` : ""}>${items.map((item) => `<li>${e(item)}</li>`).join("")}</${tag}>`;
    }

    function detailBlock(title, content, extraClass) {
      return content ? `<section class="study-detail-block${extraClass ? ` ${extraClass}` : ""}"><h4>${e(title)}</h4>${content}</section>` : "";
    }

    function tags(value) {
      return arrayOf(value).map((tag) => `<span class="tag">#${e(tag)}</span>`).join("");
    }

    function comparisonPair(item, selected) {
      if (selected !== "comparisons") return "";
      return `<div class="study-compare-pair"><div><span class="eyebrow">개념 A</span><strong>${e(item.conceptA)}</strong></div><span class="study-compare-vs" aria-hidden="true">비교</span><div><span class="eyebrow">개념 B</span><strong>${e(item.conceptB)}</strong></div></div>`;
    }

    function cardHTML(item, selected) {
      const title = itemTitle(item, selected);
      const id = stableId(item, selected);
      const detailId = `${id}-detail`;
      const examPoint = item.examPoint || item.examTip;
      const related = item.relatedConcepts || item.related;
      const example = item.concreteExample || item.example;
      const fullExplanation = item.fullExplanation || item.explanation;
      const details = [
        detailBlock("차근차근 이해하기", paragraphs(fullExplanation), "study-detail-full"),
        detailBlock("왜 중요한가", paragraphs(item.whyImportant)),
        detailBlock("프로세스·흐름", list(item.processOrFlow, true, "study-flow")),
        detailBlock("구체적인 예시", paragraphs(example)),
        detailBlock("시험 포인트", paragraphs(examPoint), "exam-point"),
        detailBlock("자주 하는 실수", list(item.commonMistakes, false)),
        detailBlock("연관 개념", list(related, false, "study-related-list")),
        detailBlock("빠른 암기법", paragraphs(item.quickMemoryTip), "memory-tip"),
        detailBlock("OX로 점검하기", list(item.oxPoints, false, "study-ox-list"), "study-detail-full")
      ].join("");
      const meta = [item.unit, item.sourceFile].filter(Boolean).join(" · ");
      return `<article id="${e(id)}" class="card study-card concept-detail-card">
        <header class="study-card-header concept-detail-header">
          <div class="study-card-title">
            <div class="study-card-badges badges">${SEStorage.rangeBadge(item.range || "공통")} ${importanceBadge(item.importance)}</div>
            <h3>${e(title)}</h3>
            ${meta ? `<p class="source source-file"><span class="sr-only">출처: </span>${e(meta)}</p>` : ""}
          </div>
        </header>
        <div class="study-card-intro">
          ${visualOf(item)}
          <section class="study-summary concept-core-summary">
            <h4>핵심 요약</h4>
            <p>${e(summaryOf(item, selected))}</p>
            ${comparisonPair(item, selected)}
          </section>
        </div>
        <div class="study-toggle-row">
          <button class="study-expand-button detail-toggle" type="button" data-study-toggle data-detail-toggle="${e(detailId)}" aria-expanded="false" aria-controls="${e(detailId)}"><span>상세 보기</span><i aria-hidden="true">＋</i></button>
        </div>
        <section id="${e(detailId)}" class="study-detail concept-deep-detail" hidden>
          <div class="study-detail-grid">${details}</div>
          ${item.tags && item.tags.length ? `<div class="study-tags" aria-label="연관 태그">${tags(item.tags)}</div>` : ""}
          <p class="origin-label study-source-basis"><strong>내용 기준</strong> · ${e(sourceBasis(item))}</p>
        </section>
      </article>`;
    }

    function searchableText(item) {
      try { return SEStorage.normalize(JSON.stringify(item)); } catch (_) { return SEStorage.normalize(itemTitle(item, type.value)); }
    }

    function rangeId(value) {
      if (value === "중간고사") return "study-range-midterm";
      if (value === "기말고사") return "study-range-final";
      return "study-range-common";
    }

    function groupedHTML(items, selected) {
      const order = ["중간고사", "기말고사", "공통"];
      return order.map((rangeName) => {
        const group = items.filter((item) => (item.range || "공통") === rangeName);
        if (!group.length) return "";
        const cards = group.map((item) => cardHTML(item, selected)).join("");
        return `<section class="study-range-section" aria-labelledby="${rangeId(rangeName)}"><div id="${rangeId(rangeName)}" class="study-range-heading"><span class="eyebrow">${e(rangeName)} 범위</span><h2>${e(rangeName)} 학습 목록</h2><span>${group.length}개</span></div>${cards}</section>`;
      }).join("");
    }

    function tocHTML(items, selected) {
      const selectedClass = (value) => selected === value ? " type-current" : "";
      const itemLinks = items.map((item) => `<a class="study-toc-link study-toc-item" href="#${e(stableId(item, selected))}">${e(itemTitle(item, selected))}</a>`).join("");
      return `<div class="study-toc-primary">
        <a class="study-toc-link" href="#study-range-midterm" data-study-range="중간고사">중간고사 범위</a>
        <a class="study-toc-link" href="#study-range-final" data-study-range="기말고사">기말고사 범위</a>
        <a class="study-toc-link${selectedClass("notes")}" href="#study-content" data-study-type="notes">자료별 학습노트</a>
        <a class="study-toc-link${selectedClass("concepts")}" href="#study-content" data-study-type="concepts">핵심 개념</a>
        <a class="study-toc-link${selectedClass("comparisons")}" href="#study-content" data-study-type="comparisons">헷갈리는 비교</a>
        <a class="study-toc-link" href="#cram">시험 직전 암기</a>
      </div><div class="study-toc-sub"><span>현재 목록 · ${items.length}개</span>${itemLinks || '<span class="muted">표시할 항목이 없습니다.</span>'}</div>`;
    }

    function closeMobileTOC(link) {
      const details = link.closest(".study-toc-mobile");
      if (details && window.matchMedia("(max-width: 1000px)").matches) details.open = false;
    }

    function scrollToId(id) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
    }

    function markActive(id) {
      document.querySelectorAll(".study-toc-link.active-section").forEach((link) => {
        link.classList.remove("active-section");
        link.removeAttribute("aria-current");
      });
      document.querySelectorAll(`.study-toc-link[href="#${id}"]`).forEach((link) => {
        link.classList.add("active-section");
        link.setAttribute("aria-current", "location");
      });
    }

    function watchSections() {
      if (sectionObserver) sectionObserver.disconnect();
      if (!("IntersectionObserver" in window)) return;
      sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0] && visible[0].target.id) markActive(visible[0].target.id);
      }, { rootMargin: "-18% 0px -68%", threshold: 0 });
      document.querySelectorAll(".study-range-heading[id], .study-card[id], #cram").forEach((section) => sectionObserver.observe(section));
    }

    function draw() {
      const selected = type.value;
      let items;
      if (selected === "concepts") items = window.SE_CONCEPTS || [];
      else if (selected === "comparisons") items = window.SE_COMPARISONS || [];
      else items = window.SE_NOTES || [];

      const needle = SEStorage.normalize(search.value);
      const filtered = items.filter((item) => {
        const itemRange = item.range || "공통";
        const matchesRange = !range.value || itemRange === range.value || (range.value !== "공통" && itemRange === "공통");
        return matchesRange && (!needle || searchableText(item).includes(needle));
      });

      host.className = selected === "comparisons" ? "compare-list section" : "concept-list section";
      host.innerHTML = filtered.length ? groupedHTML(filtered, selected) : '<div class="empty">조건에 맞는 학습 항목이 없습니다.</div>';
      count.textContent = `${filtered.length}개`;
      tocHosts.forEach((toc) => { toc.innerHTML = tocHTML(filtered, selected); });
      watchSections();
    }

    host.addEventListener("click", (event) => {
      const button = event.target.closest("[data-study-toggle]");
      if (!button) return;
      const detail = document.getElementById(button.getAttribute("aria-controls"));
      if (!detail) return;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.querySelector("span").textContent = expanded ? "상세 보기" : "상세 닫기";
      detail.hidden = expanded;
      button.closest(".study-card").classList.toggle("expanded", !expanded);
    });

    document.getElementById("study-toc").addEventListener("click", (event) => {
      const link = event.target.closest("a.study-toc-link");
      if (!link) return;
      if (link.dataset.studyType) {
        event.preventDefault();
        type.value = link.dataset.studyType;
        draw();
        scrollToId("study-content");
      } else if (link.dataset.studyRange) {
        event.preventDefault();
        range.value = link.dataset.studyRange;
        draw();
        scrollToId(rangeId(link.dataset.studyRange));
      }
      closeMobileTOC(link);
    });

    search.addEventListener("input", draw);
    range.addEventListener("change", draw);
    type.addEventListener("change", draw);
    draw();
  });
}());
