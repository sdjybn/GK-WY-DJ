function createEmpty(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const text = opts.text || "";
  const icon = opts.icon != null ? opts.icon : true;
  const size = opts.size || "md";
  const action = opts.action || null;

  const el = document.createElement("div");
  el.className = "empty-el empty-" + size;

  if (icon) {
    const iconWrap = document.createElement("div");
    iconWrap.className = "empty-icon";
    iconWrap.appendChild(createIcon({ name: "搜索", size: "xl", color: getColorHex(scaleCss, level) }));
    el.appendChild(iconWrap);
  }

  const textEl = document.createElement("div");
  textEl.className = "empty-text";
  textEl.textContent = text;
  applyStrokedText(textEl, "gray", 600);
  el.appendChild(textEl);

  if (action) {
    const actionWrap = document.createElement("div");
    actionWrap.className = "empty-action";
    if (typeof action === "string") {
      const btn = createButton(action, { scaleCss: "cyan", level: 500, variant: "outline", size: "sm" });
      actionWrap.appendChild(btn);
    } else if (action instanceof HTMLElement) {
      actionWrap.appendChild(action);
    }
    el.appendChild(actionWrap);
  }

  return el;
}
