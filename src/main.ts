import "./style.css";
import Alpine from "alpinejs";
import focus from "@alpinejs/focus";

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;
Alpine.plugin(focus);

type Release = { id: string; img: string; color: string; year: string; title: string; bc: string };

Alpine.directive(
  "scroll-active",
  (
    el,
    _directive,
    { evaluate, cleanup }: { evaluate: (expression: string) => unknown; cleanup: (callback: () => void) => void }
  ) => {
    let timeout: number | null = null;

    const onScroll = () => {
      if (timeout !== null) {
        window.clearTimeout(timeout);
      }

      evaluate("scrollActive = true");

      timeout = window.setTimeout(() => {
        evaluate("scrollActive = false");
        evaluate("isAutoScrolling = false");
        evaluate("$dispatch('center-activate:update')");
        timeout = null;
      }, 300);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    cleanup(() => {
      el.removeEventListener("scroll", onScroll);
      if (timeout !== null) window.clearTimeout(timeout);
    });
  }
);

Alpine.directive(
  "center-activate",
  (
    el,
    { expression },
    { evaluate, cleanup }: { evaluate: (expression: string) => unknown; cleanup: (callback: () => void) => void }
  ) => {
    const parseStart = (raw: string | undefined) => {
      const fallback = 0.4;
      if (!raw || raw.trim().length === 0) return fallback;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) return fallback;
      return Math.min(0.49, Math.max(0.01, parsed));
    };

    const start = parseStart(expression);
    const end = 1 - start;
    let rafLiveId: number | null = null;
    let rafSettledId: number | null = null;
    const getCards = () => Array.from(el.querySelectorAll<HTMLElement>("[data-release-id]"));

    const setMetadataById = (releaseId: string) => {
      const releases = evaluate("$store.releases") as unknown as Release[];
      const release = releases?.find((r) => r.id === releaseId);

      if (!release) {
        evaluate(`activeReleaseId = ${JSON.stringify(releaseId)}`);
        return;
      }

      evaluate(
        `activeReleaseId = ${JSON.stringify(release.id)}; ` +
          `bc = ${JSON.stringify(release.bc)}; ` +
          `releaseTitle = ${JSON.stringify(release.title)}; ` +
          `releaseYear = ${JSON.stringify(release.year)}`
      );
    };

    const commitPlayerById = (releaseId: string) => {
      const releases = evaluate("$store.releases") as unknown as Release[];
      const release = releases?.find((r) => r.id === releaseId);
      if (!release) return;
      evaluate(`playerReleaseId = ${JSON.stringify(release.id)}`);
    };

    const chooseReleaseId = () => {
      const containerRect = el.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const cards = getCards();
      if (cards.length === 0) return null;
      let best: { el: HTMLElement; score: number } | null = null;
      let bestFallback: { el: HTMLElement; score: number } | null = null;

      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        if (rect.width <= 0) continue;
        const t = (centerX - rect.left) / rect.width;
        const bandScore = Math.abs(t - 0.5);

        if (t >= start && t <= end) {
          if (!best || bandScore < best.score) best = { el: card, score: bandScore };
        }

        const fallbackScore = Math.abs(rect.left + rect.width / 2 - centerX);
        if (!bestFallback || fallbackScore < bestFallback.score) bestFallback = { el: card, score: fallbackScore };
      }

      const chosen = best?.el ?? bestFallback?.el;
      if (!chosen) return null;
      const releaseId = chosen.dataset.releaseId || chosen.id;
      return releaseId || null;
    };

    const updateSettled = () => {
      rafSettledId = null;
      const releaseId = chooseReleaseId();
      if (!releaseId) return;
      setMetadataById(releaseId);
      commitPlayerById(releaseId);
    };

    const updateLive = () => {
      rafLiveId = null;
      const isAutoScrolling = Boolean(evaluate("isAutoScrolling"));
      if (isAutoScrolling) return;
      const releaseId = chooseReleaseId();
      if (!releaseId) return;
      const currentActive = evaluate("activeReleaseId") as unknown;
      if (currentActive === releaseId) return;
      setMetadataById(releaseId);
    };

    const scheduleUpdateSettled = () => {
      if (rafSettledId !== null) return;
      if (rafLiveId !== null) {
        window.cancelAnimationFrame(rafLiveId);
        rafLiveId = null;
      }
      rafSettledId = window.requestAnimationFrame(updateSettled);
    };

    const scheduleUpdateLive = () => {
      if (rafSettledId !== null) return;
      if (rafLiveId !== null) return;
      rafLiveId = window.requestAnimationFrame(updateLive);
    };

    const onUpdateEvent = () => scheduleUpdateSettled();
    el.addEventListener("scroll", scheduleUpdateLive, { passive: true });
    el.addEventListener("center-activate:update", onUpdateEvent);
    window.addEventListener("resize", scheduleUpdateSettled, { passive: true });
    scheduleUpdateSettled();

    cleanup(() => {
      el.removeEventListener("scroll", scheduleUpdateLive);
      el.removeEventListener("center-activate:update", onUpdateEvent);
      window.removeEventListener("resize", scheduleUpdateSettled);
      if (rafLiveId !== null) window.cancelAnimationFrame(rafLiveId);
      if (rafSettledId !== null) window.cancelAnimationFrame(rafSettledId);
    });
  }
);

Alpine.magic("scrollToRelease", () => (container: HTMLElement, releaseIdOrElement: string | HTMLElement) => {
  let releaseElement: HTMLElement | null;
  let behavior: ScrollBehavior = "smooth";

  if (typeof releaseIdOrElement === "string") {
    releaseElement = document.getElementById(releaseIdOrElement);
    behavior = "instant";
  } else {
    releaseElement = releaseIdOrElement;
  }

  if (!releaseElement) return;
  const containerRect = container.getBoundingClientRect();
  const releaseRect = releaseElement.getBoundingClientRect();
  const offset = containerRect.width / 2 - releaseRect.width / 2;
  const scrollLeft = container.scrollLeft + (releaseRect.left - containerRect.left) - offset;
  container.scrollTo({ left: scrollLeft, behavior });
});

type ReleaseCardComponent = {
  $el: HTMLElement;
  $scrollToRelease: (container: HTMLElement, releaseIdOrElement: string | HTMLElement) => void;
  $watch: (expression: string, callback: (value: unknown) => void) => void;
  activeReleaseId: string;
  bc: string;
  hasLoaded: boolean;
  index: number;
  isAutoScrolling: boolean;
  playerReleaseId: string;
  release: Release;
  releaseTitle: string;
  releaseYear: string;
};

Alpine.data("releaseCard", (release: Release, index: number) => ({
  release,
  index,
  hasLoaded: false,

  init(this: ReleaseCardComponent) {
    this.$watch("playerReleaseId", (playerReleaseId) => {
      if (playerReleaseId === this.release.id) {
        this.hasLoaded = false;
      }
    });
  },

  onClick(this: ReleaseCardComponent, container: HTMLElement) {
    this.isAutoScrolling = true;
    this.activeReleaseId = this.release.id;
    this.bc = this.release.bc;
    this.releaseTitle = this.release.title;
    this.releaseYear = this.release.year;
    this.$scrollToRelease(container, this.$el);
  }
}));

Alpine.store("releases", [
  { id: "2741838751", img: "a3406088319", color: "#f6c178", year: "2026", title: "Oversail", bc: "oversail" },
  { id: "1029783069", img: "a0431739409", color: "#6b4c39", year: "2025", title: "Night Cycle", bc: "night-cycle" },
  {
    id: "263300316",
    img: "a2224224835",
    color: "#e3a681",
    year: "2021",
    title: "Lemodie (15th A.E.)",
    bc: "lemodie-15th-anniversary-edition"
  },
  {
    id: "716799222",
    img: "a0531723196",
    color: "#c3724f",
    year: "2021",
    title: "An Eye to Windward",
    bc: "an-eye-to-windward"
  },
  { id: "2367681852", img: "a0348369492", color: "#a52319", year: "2020", title: "Understory", bc: "understory" },
  {
    id: "2194188136",
    img: "a0659058827",
    color: "#e7a984",
    year: "2019",
    title: "A Midsummer Nice Dream (15th A.E.)",
    bc: "a-midsummer-nice-dream-15th-anniversary-edition"
  },
  {
    id: "3927340136",
    img: "a0222776262",
    color: "#e37625",
    year: "2018",
    title: "Project Caelus",
    bc: "project-caelus"
  },
  {
    id: "506275920",
    img: "a4092091475",
    color: "#eb5b30",
    year: "2017",
    title: "Beyond the Outer Loop",
    bc: "beyond-the-outer-loop"
  },
  { id: "3323002998", img: "a2064237524", color: "#4b4a67", year: "2015", title: "Isolette", bc: "isolette" },
  {
    id: "894836221",
    img: "a1729624781",
    color: "#5aafb0",
    year: "2013",
    title: "National Ignition",
    bc: "national-ignition"
  },
  {
    id: "541409645",
    img: "a0802931447",
    color: "#ac6c58",
    year: "2011",
    title: "Early Learning",
    bc: "early-learning"
  },
  {
    id: "2371710032",
    img: "a1034807132",
    color: "#882b46",
    year: "2009",
    title: "Like Dust of the Balance",
    bc: "like-dust-of-the-balance"
  },
  { id: "904826306", img: "a2901268869", color: "#718b65", year: "2008", title: "Petl EP", bc: "petl-ep" },
  { id: "500978200", img: "a0088308438", color: "#c7728c", year: "2006", title: "Lemodie", bc: "lemodie" },
  {
    id: "4213640468",
    img: "a0970994219",
    color: "#c15e49",
    year: "2004",
    title: "A Midsummer Nice Dream",
    bc: "a-midsummer-nice-dream"
  }
]);

Alpine.start();
