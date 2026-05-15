function createProgress(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "cyan";
  const level = opts.level != null ? opts.level : 500;
  const value = opts.value != null ? opts.value : 0;
  const size = opts.size || "md";
  const disabled = opts.disabled || false;
  const showLabel = opts.showLabel !== false;

  const wrap = document.createElement("div");
  wrap.className = "progress-wrap progress-" + size + (disabled ? " disabled" : "");

  const onHex = getColorHex(scaleCss, level);
  const offHex = getColorHex(scaleCss, 300);
  wrap.style.setProperty("--progress-on", onHex);
  wrap.style.setProperty("--progress-off", offHex);

  const track = document.createElement("div");
  track.className = "progress-track";

  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = Math.max(0, Math.min(100, value)) + "%";
  track.appendChild(fill);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "progress-disable-mark";
    track.appendChild(mark);
  }

  wrap.appendChild(track);

  if (showLabel) {
    const label = document.createElement("span");
    label.className = "progress-label";
    label.textContent = Math.round(value) + "%";
    wrap.appendChild(label);
  }

  wrap.setValue = function (v) {
    const clamped = Math.max(0, Math.min(100, v));
    fill.style.width = clamped + "%";
    if (showLabel) {
      const lbl = wrap.querySelector(".progress-label");
      if (lbl) lbl.textContent = Math.round(clamped) + "%";
    }
  };

  return wrap;
}
