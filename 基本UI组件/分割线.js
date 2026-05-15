function createDivider(options) {
  const opts = options || {};
  const text = opts.text || "";
  const vertical = opts.vertical || false;
  const size = opts.size || "md";

  const el = document.createElement("div");
  el.className = "divider-el" + (vertical ? " divider-vertical" : "") + (size !== "md" ? " divider-" + size : "");

  if (text) {
    const span = document.createElement("span");
    span.className = "divider-text";
    span.textContent = text;
    applyStrokedText(span, "gray", 600);
    el.appendChild(span);
  }

  return el;
}
