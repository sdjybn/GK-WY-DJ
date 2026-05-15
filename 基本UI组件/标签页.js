function createTabs(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const tabs = opts.tabs || [];
  const activeIndex = opts.activeIndex || 0;

  const wrap = document.createElement("div");
  wrap.className = "tabs-wrap tabs-" + size;

  const bar = document.createElement("div");
  bar.className = "tabs-bar";

  const content = document.createElement("div");
  content.className = "tabs-content";

  const tabBtns = [];
  const panes = [];

  tabs.forEach((tab, i) => {
    const btn = document.createElement("button");
    btn.className = "tabs-tab";
    btn.type = "button";
    btn.textContent = tab.label;
    applyStrokedText(btn, "gray", 600, { skipColor: true });
    if (tab.disabled) btn.disabled = true;

    const pane = document.createElement("div");
    pane.className = "tabs-pane";
    if (tab.content) pane.appendChild(tab.content);

    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      setActive(i);
    });

    bar.appendChild(btn);
    content.appendChild(pane);
    tabBtns.push(btn);
    panes.push(pane);
  });

  wrap.appendChild(bar);
  wrap.appendChild(content);

  function setActive(index) {
    tabBtns.forEach((b, i) => {
      const isActive = i === index;
      b.classList.toggle("active", isActive);
      if (isActive) {
        applyStrokedText(b, "gray", 900, { skipColor: true });
        b.style.color = getColorHex("gray", 1000);
      } else {
        applyStrokedText(b, "gray", 600, { skipColor: true });
        b.style.color = getColorHex("gray", 500);
      }
    });
    panes.forEach((p, i) => p.classList.toggle("active", i === index));
    wrap._activeIndex = index;
  }

  setActive(activeIndex);

  wrap.setActive = setActive;
  wrap.getActiveIndex = () => wrap._activeIndex;

  return wrap;
}
