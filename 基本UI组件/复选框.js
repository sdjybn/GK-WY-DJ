function createCheckbox(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const checked = opts.checked || false;
  const disabled = opts.disabled || false;
  const label = opts.label || "";
  const onChange = opts.onChange;

  const wrap = document.createElement("div");
  wrap.className = "checkbox-wrap" + (checked ? " checked" : "") + (disabled ? " disabled" : "");
  wrap.setAttribute("role", "checkbox");
  wrap.setAttribute("aria-checked", checked);
  wrap.tabIndex = disabled ? -1 : 0;

  const box = document.createElement("div");
  box.className = "checkbox-box";
  const onHex = getColorHex(scaleCss, level);
  const offHex = getColorHex(scaleCss, 300);
  box.style.setProperty("--checkbox-on", onHex);
  box.style.setProperty("--checkbox-off", offHex);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "checkbox-check");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("fill", "none");

  const d = "M1 5.5L3.5 8L9 2";
  const borderColor = getColorHex("gray", 0);
  const fillColor = getColorHex("gray", 1000);

  const borderPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  borderPath.setAttribute("d", d);
  borderPath.setAttribute("stroke", borderColor);
  borderPath.setAttribute("stroke-width", "2.2");
  borderPath.setAttribute("stroke-linecap", "round");
  borderPath.setAttribute("stroke-linejoin", "round");
  svg.appendChild(borderPath);

  const mainPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  mainPath.setAttribute("d", d);
  mainPath.setAttribute("stroke", fillColor);
  mainPath.setAttribute("stroke-width", "1.5");
  mainPath.setAttribute("stroke-linecap", "round");
  mainPath.setAttribute("stroke-linejoin", "round");
  svg.appendChild(mainPath);

  box.appendChild(svg);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "checkbox-disable-mark";
    box.appendChild(mark);
  }

  wrap.appendChild(box);

  if (label) {
    const labelEl = document.createElement("span");
    labelEl.className = "checkbox-label";
    labelEl.textContent = label;
    applyStrokedText(labelEl, "gray", 900);
    wrap.appendChild(labelEl);
  }

  function toggle() {
    if (disabled) return;
    const next = !wrap.classList.contains("checked");
    wrap.classList.toggle("checked", next);
    wrap.setAttribute("aria-checked", next);
    if (onChange) onChange(next);
  }

  wrap.addEventListener("click", toggle);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  });

  return wrap;
}
