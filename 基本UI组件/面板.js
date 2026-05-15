function createPanel(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const head = opts.head || "";

  const el = document.createElement("div");
  el.className = "panel panel-" + size;

  if (head) {
    const headEl = document.createElement("div");
    headEl.className = "panel-head";
    headEl.textContent = head;
    applyStrokedText(headEl, "gray", 900);
    el.appendChild(headEl);
  }

  const body = document.createElement("div");
  body.className = "panel-body scrollbar-host";

  const content = document.createElement("div");
  content.className = "scrollbar-content";
  body.appendChild(content);

  const barV = document.createElement("div");
  barV.className = "float-bar float-bar-v";
  body.appendChild(barV);

  const barH = document.createElement("div");
  barH.className = "float-bar float-bar-h";
  body.appendChild(barH);

  const corner = document.createElement("div");
  corner.className = "float-bar-corner";
  body.appendChild(corner);

  el.appendChild(body);

  initScrollbar(body);

  return { el, body, content };
}
