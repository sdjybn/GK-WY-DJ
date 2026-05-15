function createTooltip(options) {
  const opts = options || {};
  const text = opts.text || "";
  const placement = opts.placement || "top";
  const delay = opts.delay || 0;

  const el = document.createElement("div");
  el.className = "tooltip-el tooltip-" + placement;
  el.textContent = text;
  applyStrokedText(el, "gray", 900);

  const _attached = [];

  function attach(target) {
    let timer = null;

    function show() {
      timer = setTimeout(() => {
        document.body.appendChild(el);
        position(target);
        el.classList.add("visible");
      }, delay);
    }

    function hide() {
      clearTimeout(timer);
      el.classList.remove("visible");
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 150);
    }

    function position(target) {
      const rect = target.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const gap = 8;
      let top, left;

      switch (placement) {
        case "top":
          top = rect.top - elRect.height - gap;
          left = rect.left + (rect.width - elRect.width) / 2;
          break;
        case "bottom":
          top = rect.bottom + gap;
          left = rect.left + (rect.width - elRect.width) / 2;
          break;
        case "left":
          top = rect.top + (rect.height - elRect.height) / 2;
          left = rect.left - elRect.width - gap;
          break;
        case "right":
          top = rect.top + (rect.height - elRect.height) / 2;
          left = rect.right + gap;
          break;
        case "top-left":
          top = rect.top - elRect.height - gap;
          left = rect.left;
          break;
        case "top-right":
          top = rect.top - elRect.height - gap;
          left = rect.right - elRect.width;
          break;
        case "bottom-left":
          top = rect.bottom + gap;
          left = rect.left;
          break;
        case "bottom-right":
          top = rect.bottom + gap;
          left = rect.right - elRect.width;
          break;
      }

      top = Math.max(4, Math.min(window.innerHeight - elRect.height - 4, top));
      left = Math.max(4, Math.min(window.innerWidth - elRect.width - 4, left));

      el.style.top = top + "px";
      el.style.left = left + "px";
    }

    const handlers = { show, hide };
    target.addEventListener("mouseenter", show);
    target.addEventListener("mouseleave", hide);
    target.addEventListener("focus", show);
    target.addEventListener("blur", hide);
    _attached.push({ target, handlers });
  }

  function destroy() {
    _attached.forEach(({ target, handlers }) => {
      target.removeEventListener("mouseenter", handlers.show);
      target.removeEventListener("mouseleave", handlers.hide);
      target.removeEventListener("focus", handlers.show);
      target.removeEventListener("blur", handlers.hide);
    });
    _attached.length = 0;
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  return { el, attach, destroy };
}
