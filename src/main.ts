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

Alpine.store("releases", [
  { id: "263300316", img: "a2224224835", title: "Lemodie (15th Anniversary Edition)" },
  { id: "716799222", img: "a0531723196", title: "An Eye to Windward" },
  { id: "2367681852", img: "a0348369492", title: "Understory" },
  { id: "2194188136", img: "a0659058827", title: "A Midsummer Nice Dream (15th Anniversary Edition)" },
  { id: "3927340136", img: "a0222776262", title: "Project Caelus" },
  { id: "506275920", img: "a4092091475", title: "Beyond the Outer Loop" },
  { id: "3323002998", img: "a2064237524", title: "Isolette" },
  { id: "894836221", img: "a1729624781", title: "National Ignition" },
  { id: "541409645", img: "a0802931447", title: "Early Learning" },
  { id: "2371710032", img: "a1034807132", title: "Like Dust of the Balance" },
  { id: "904826306", img: "a2901268869", title: "Petl EP" },
  { id: "500978200", img: "a0088308438", title: "Lemodie" },
  { id: "4213640468", img: "a0970994219", title: "A Midsummer Nice Dream" }
]);

Alpine.start();
