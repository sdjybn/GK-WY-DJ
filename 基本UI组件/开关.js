function createSwitch(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const checked = opts.checked || false;
  const disabled = opts.disabled || false;
  const label = opts.label || "";
  const onChange = opts.onChange;

  const wrap = document.createElement("div");
  wrap.className = "switch-wrap" + (checked ? " on" : "") + (disabled ? " disabled" : "");
  wrap.setAttribute("role", "switch");
  wrap.setAttribute("aria-checked", checked);
  wrap.tabIndex = disabled ? -1 : 0;

  const track = document.createElement("div");
  track.className = "switch-track";

  const onHex = getColorHex(scaleCss, level);
  const offHex = getColorHex(scaleCss, 300);
  track.style.setProperty("--switch-on", onHex);
  track.style.setProperty("--switch-off", offHex);

  if (disabled) {
    const bg = document.createElement("div");
    bg.className = "switch-track-bg";
    track.appendChild(bg);

    const mark = document.createElement("span");
    mark.className = "switch-disable-mark";
    track.appendChild(mark);
  }

  const thumb = document.createElement("div");
  thumb.className = "switch-thumb";
  track.appendChild(thumb);
  wrap.appendChild(track);

  if (label) {
    const labelEl = document.createElement("span");
    labelEl.className = "switch-label";
    labelEl.textContent = label;
    applyStrokedText(labelEl, "gray", 900);
    wrap.appendChild(labelEl);
  }

  function toggle() {
    if (disabled) return;
    const next = !wrap.classList.contains("on");
    wrap.classList.toggle("on", next);
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
