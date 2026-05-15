function createSelect(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const placeholder = opts.placeholder || "请选择";
  const disabled = opts.disabled || false;
  const onChange = opts.onChange;
  const selected = opts.selected;
  const rawItems = Array.isArray(opts.items) ? opts.items : [];

  const wrap = document.createElement("div");
  wrap.className = "select-wrap" + (disabled ? " disabled" : "");
  wrap.style.position = "relative";

  const trigger = document.createElement("div");
  trigger.className = "select-trigger select-" + size;
  trigger.tabIndex = disabled ? -1 : 0;

  const label = document.createElement("span");
  trigger.appendChild(label);

  const arrowWrap = document.createElement("span");
  arrowWrap.className = "select-arrow-wrap";
  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("class", "select-arrow");
  arrow.setAttribute("viewBox", "0 0 12 12");
  arrow.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2 4L6 8L10 4");
  path.setAttribute("stroke", "var(--muted)");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  arrow.appendChild(path);
  arrowWrap.appendChild(arrow);
  trigger.appendChild(arrowWrap);
  wrap.appendChild(trigger);

  const panel = document.createElement("div");
  panel.className = "select-panel scrollbar-host";
  panel.style.display = "none";
  panel.style.position = "fixed";

  const panelContent = document.createElement("div");
  panelContent.className = "scrollbar-content";
  panel.appendChild(panelContent);

  const barV = document.createElement("div");
  barV.className = "float-bar float-bar-v";
  panel.appendChild(barV);

  const barH = document.createElement("div");
  barH.className = "float-bar float-bar-h";
  panel.appendChild(barH);

  const corner = document.createElement("div");
  corner.className = "float-bar-corner";
  panel.appendChild(corner);

  const state = { items: [], value: "", label: "", open: false };

  function 规范化条目(item) {
    if (item && typeof item === "object") {
      const 标签 = item.label === undefined || item.label === null ? "" : String(item.label);
      const 值 = item.value === undefined || item.value === null ? 标签 : String(item.value);
      return { label: 标签, value: 值 };
    }
    const 文本 = item === undefined || item === null ? "" : String(item);
    return { label: 文本, value: 文本 };
  }

  function 关闭全部下拉(排除) {
    if (!window.__activeSelectPanels) return;
    Array.from(window.__activeSelectPanels).forEach((fn) => {
      if (fn !== 排除) fn();
    });
  }

  function 刷新触发器文本() {
    if (state.label) {
      label.className = "";
      label.textContent = state.label;
      applyStrokedText(label, "gray", 900);
    } else {
      label.className = "select-placeholder";
      label.textContent = placeholder;
      applyStrokedText(label, "gray", 600);
    }
  }

  function 选中值(value, 触发变更) {
    const 目标值 = value === undefined || value === null ? "" : String(value);
    const 命中项 = state.items.find((it) => it.value === 目标值);
    if (!命中项) {
      state.value = "";
      state.label = "";
      panelContent.querySelectorAll(".select-option").forEach((o) => o.classList.remove("selected"));
      刷新触发器文本();
      return;
    }
    state.value = 命中项.value;
    state.label = 命中项.label;
    panelContent.querySelectorAll(".select-option").forEach((o) => {
      o.classList.toggle("selected", String(o.dataset.value || "") === state.value);
    });
    刷新触发器文本();
    if (触发变更 && onChange) onChange(state.value, state.label);
  }

  function 渲染选项(items, selectedValue) {
    panelContent.replaceChildren();
    state.items = (Array.isArray(items) ? items : []).map(规范化条目).filter((it) => it.label);
    state.items.forEach((item) => {
      const opt = document.createElement("div");
      opt.className = "select-option";
      opt.dataset.value = item.value;
      opt.textContent = item.label;
      applyStrokedText(opt, "gray", 900, { skipColor: true });
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        选中值(item.value, true);
        关闭面板();
      });
      panelContent.appendChild(opt);
    });
    const 默认值 = selectedValue !== undefined && selectedValue !== null ? String(selectedValue) : "";
    if (默认值) {
      选中值(默认值, false);
      return;
    }
    if (state.items.length > 0) {
      选中值(state.items[0].value, false);
      return;
    }
    state.value = "";
    state.label = "";
    刷新触发器文本();
  }

  function 定位面板() {
    if (!state.open) return;
    const rect = trigger.getBoundingClientRect();
    panel.style.minWidth = Math.max(120, Math.round(rect.width)) + "px";
    panel.style.left = Math.round(rect.left) + "px";
    panel.style.visibility = "hidden";
    panel.style.display = "block";
    panel.style.top = "0px";
    panel.style.maxHeight = "240px";
    const panelH = panel.offsetHeight || 200;
    const below = window.innerHeight - rect.bottom - 6;
    const above = rect.top - 6;
    if (below >= panelH || below >= above) {
      panel.style.top = Math.round(rect.bottom + 4) + "px";
    } else {
      panel.style.top = Math.round(Math.max(6, rect.top - panelH - 4)) + "px";
    }
    panel.style.maxHeight = Math.max(120, Math.min(280, Math.floor(Math.max(below, above) - 4))) + "px";
    panel.style.visibility = "visible";
    initScrollbar(panel);
  }

  function 打开面板() {
    if (disabled || state.open) return;
    关闭全部下拉(关闭面板);
    if (!window.__activeSelectPanels) window.__activeSelectPanels = new Set();
    window.__activeSelectPanels.add(关闭面板);
    document.body.appendChild(panel);
    state.open = true;
    wrap.classList.add("open");
    panel.style.display = "block";
    定位面板();
    window.addEventListener("resize", 定位面板);
    window.addEventListener("scroll", 定位面板, true);
  }

  function 关闭面板() {
    if (!state.open) return;
    state.open = false;
    wrap.classList.remove("open");
    panel.style.display = "none";
    if (panel.parentNode) panel.parentNode.removeChild(panel);
    if (window.__activeSelectPanels) window.__activeSelectPanels.delete(关闭面板);
    window.removeEventListener("resize", 定位面板);
    window.removeEventListener("scroll", 定位面板, true);
  }

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "select-disable-mark";
    wrap.appendChild(mark);
  } else {
    trigger.addEventListener("click", () => {
      if (state.open) 关闭面板();
      else 打开面板();
    });
    trigger.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (state.open) 关闭面板();
        else 打开面板();
      }
      if (e.key === "Escape") 关闭面板();
    });
  }

  if (!window.__selectOutsideBinded) {
    window.__selectOutsideBinded = true;
    document.addEventListener("click", (e) => {
      if (!window.__activeSelectPanels || window.__activeSelectPanels.size === 0) return;
      let 在下拉内 = false;
      const pathList = typeof e.composedPath === "function" ? e.composedPath() : [];
      for (let i = 0; i < pathList.length; i += 1) {
        const el = pathList[i];
        if (!el || !el.classList) continue;
        if (el.classList.contains("select-wrap") || el.classList.contains("select-panel")) {
          在下拉内 = true;
          break;
        }
      }
      if (在下拉内) return;
      Array.from(window.__activeSelectPanels).forEach((fn) => fn());
    });
  }

  渲染选项(rawItems, selected);

  wrap.getValue = () => state.value;
  wrap.getLabel = () => state.label;
  wrap.setItems = (items, selectedValue) => {
    渲染选项(Array.isArray(items) ? items : [], selectedValue);
  };
  wrap.closePanel = () => {
    关闭面板();
  };

  return wrap;
}
