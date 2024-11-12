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
  { id: "263300316", title: "Lemodie (15th Anniversary Edition)" },
  { id: "716799222", title: "An Eye to Windward" },
  { id: "2367681852", title: "Understory" },
  { id: "2194188136", title: "A Midsummer Nice Dream (15th Anniversary Edition)" },
  { id: "3927340136", title: "Project Caelus" },
  { id: "506275920", title: "Beyond the Outer Loop" },
  { id: "3323002998", title: "Isolette" },
  { id: "894836221", title: "National Ignition" },
  { id: "541409645", title: "Early Learning" },
  { id: "2371710032", title: "Like Dust of the Balance" },
  { id: "904826306", title: "Petl EP" },
  { id: "500978200", title: "Lemodie" },
  { id: "4213640468", title: "A Midsummer Nice Dream" }
]);

Alpine.start();
