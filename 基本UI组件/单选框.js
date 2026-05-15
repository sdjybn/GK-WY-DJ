function createRadio(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const checked = opts.checked || false;
  const disabled = opts.disabled || false;
  const label = opts.label || "";
  const name = opts.name || "radio-default";
  const value = opts.value || "";
  const onChange = opts.onChange;

  const wrap = document.createElement("div");
  wrap.className = "radio-wrap" + (checked ? " checked" : "") + (disabled ? " disabled" : "");
  wrap.setAttribute("role", "radio");
  wrap.setAttribute("aria-checked", checked);
  wrap.tabIndex = disabled ? -1 : 0;

  const circle = document.createElement("div");
  circle.className = "radio-circle";
  const onHex = getColorHex(scaleCss, level);
  const offHex = getColorHex(scaleCss, 300);
  circle.style.setProperty("--radio-on", onHex);
  circle.style.setProperty("--radio-off", offHex);

  const dot = document.createElement("div");
  dot.className = "radio-dot";
  circle.appendChild(dot);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "radio-disable-mark";
    circle.appendChild(mark);
  }

  wrap.appendChild(circle);

  if (label) {
    const labelEl = document.createElement("span");
    labelEl.className = "radio-label";
    labelEl.textContent = label;
    applyStrokedText(labelEl, "gray", 900);
    wrap.appendChild(labelEl);
  }

  function select() {
    if (disabled) return;
    const container = wrap.parentElement;
    if (container) {
      container.querySelectorAll('.radio-wrap[data-radio-name="' + name + '"]').forEach((r) => {
        r.classList.remove("checked");
        r.setAttribute("aria-checked", "false");
      });
    }
    wrap.classList.add("checked");
    wrap.setAttribute("aria-checked", "true");
    if (onChange) onChange(value);
  }

  wrap.setAttribute("data-radio-name", name);
  wrap.setAttribute("data-radio-value", value);

  wrap.addEventListener("click", select);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      select();
    }
  });

  return wrap;
}
