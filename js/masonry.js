import { gsap } from "../node_modules/gsap/index.js";

const defaultOptions = {
  items: [],
  ease: "power3.out",
  duration: 0.6,
  stagger: 0.05,
  animateFrom: "bottom",
  scaleOnHover: true,
  hoverScale: 0.95,
  blurToFocus: false,
  colorShiftOnHover: false,
};

export default class Masonry {
  constructor(container, options = {}) {
    this.container = container;
    this.options = { ...defaultOptions, ...options };
  }

  init() {
    if (!this.container || !this.options.items?.length) return;
    this.render();
    this.animateIn();
    if (this.options.scaleOnHover || this.options.blurToFocus || this.options.colorShiftOnHover) {
      this.attachHoverEffects();
    }
  }

  render() {
    const fragment = document.createDocumentFragment();
    this.options.items.forEach((item) => {
      const link = document.createElement("div");
      link.className = "masonry-item";
      link.setAttribute("data-id", item.id);

      const img = document.createElement("img");
      const webpPath = this.toWebpPath(item.img);
      if (webpPath) {
        img.src = webpPath;
        img.onerror = () => {
          img.onerror = null;
          img.src = item.img;
        };
      } else {
        img.src = item.img;
      }
      img.alt = item.alt ?? "Gallery preview";
      img.loading = "lazy";
      img.decoding = "async";

      link.appendChild(img);
      fragment.appendChild(link);
    });
    this.container.innerHTML = "";
    this.container.appendChild(fragment);
  }

  toWebpPath(src) {
    if (typeof src !== "string") return null;
    // Only rewrite if it points into the images directory and has an extension
    const lastSlash = src.lastIndexOf("/");
    const lastDot = src.lastIndexOf(".");
    if (lastDot === -1 || lastDot < lastSlash) return null;
    const dir = src.substring(0, lastSlash + 1);
    const base = src.substring(lastSlash + 1, lastDot);
    return `${dir}webp/${base}.webp`;
  }

  animateIn() {
    const nodes = this.container.querySelectorAll(".masonry-item");
    if (!nodes.length) return;
    let fromY = 0;
    let fromX = 0;
    if (this.options.animateFrom === "bottom") fromY = 60;
    if (this.options.animateFrom === "top") fromY = -60;
    if (this.options.animateFrom === "left") fromX = -60;
    if (this.options.animateFrom === "right") fromX = 60;

    gsap.fromTo(
      nodes,
      { autoAlpha: 0, y: fromY, x: fromX, scale: 0.95 },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: this.options.duration,
        ease: this.options.ease,
        stagger: this.options.stagger,
      }
    );
  }

  attachHoverEffects() {
    const nodes = this.container.querySelectorAll(".masonry-item");
    nodes.forEach((node) => {
      node.addEventListener("mouseenter", () => this.handleHover(node, true));
      node.addEventListener("mouseleave", () => this.handleHover(node, false));
      node.addEventListener("focus", () => this.handleHover(node, true));
      node.addEventListener("blur", () => this.handleHover(node, false));
    });
  }

  handleHover(node, isActive) {
    const effects = {};
    if (this.options.scaleOnHover) {
      effects.scale = isActive ? this.options.hoverScale : 1;
    }
    if (this.options.blurToFocus) {
      effects.filter = isActive ? "blur(0px)" : "blur(1px)";
    }
    if (this.options.colorShiftOnHover) {
      effects.filter = `${effects.filter ?? ""} saturate(${isActive ? 1.1 : 1})`;
    }
    gsap.to(node, {
      duration: 0.35,
      ease: "power2.out",
      ...effects,
    });
  }
}
