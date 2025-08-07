import "./style.css";
import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";

declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;
Alpine.plugin(focus);
Alpine.plugin(intersect);

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

Alpine.store("releases", [
  { id: "1029783069", img: "a0431739409", color: "#584135", year: "2025", title: "Night Cycle", bc: "night-cycle" },
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
