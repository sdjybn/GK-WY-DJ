function createSlider(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "cyan";
  const level = opts.level != null ? opts.level : 500;
  let value = opts.value != null ? opts.value : 0;
  const min = opts.min != null ? opts.min : 0;
  const max = opts.max != null ? opts.max : 100;
  const step = opts.step || 1;
  const size = opts.size || "md";
  const disabled = opts.disabled || false;
  const showLabel = opts.showLabel !== false;
  const onChange = opts.onChange;

  const wrap = document.createElement("div");
  wrap.className = "slider-wrap slider-" + size + (disabled ? " disabled" : "");

  const onHex = getColorHex(scaleCss, level);
  const offHex = getColorHex(scaleCss, 300);
  wrap.style.setProperty("--slider-on", onHex);
  wrap.style.setProperty("--slider-off", offHex);

  const trackWrap = document.createElement("div");
  trackWrap.className = "slider-track-wrap";

  const track = document.createElement("div");
  track.className = "slider-track";

  const fill = document.createElement("div");
  fill.className = "slider-fill";
  track.appendChild(fill);

  const thumb = document.createElement("div");
  thumb.className = "slider-thumb";
  track.appendChild(thumb);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "slider-disable-mark";
    trackWrap.appendChild(mark);
  }

  trackWrap.appendChild(track);
  wrap.appendChild(trackWrap);

  let labelEl = null;
  if (showLabel) {
    labelEl = document.createElement("span");
    labelEl.className = "slider-label";
    labelEl.textContent = value;
    applyStrokedText(labelEl, "gray", 900);
    wrap.appendChild(labelEl);
  }

  function clamp(v) {
    return Math.max(min, Math.min(max, v));
  }

  function snap(v) {
    return Math.round(v / step) * step;
  }

  function ratio() {
    return max === min ? 0 : (value - min) / (max - min);
  }

  function render() {
    const r = ratio();
    fill.style.width = (r * 100) + "%";
    thumb.style.left = (r * 100) + "%";
    if (labelEl) labelEl.textContent = snap(value);
  }

  function setValue(v) {
    value = clamp(snap(v));
    render();
    if (onChange) onChange(value);
  }

  value = clamp(snap(value));
  render();

  if (!disabled) {
    let dragging = false;

    function posToValue(clientX) {
      const rect = track.getBoundingClientRect();
      const r = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return min + r * (max - min);
    }

    thumb.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
    });

    trackWrap.addEventListener("mousedown", (e) => {
      if (e.target === thumb) return;
      setValue(posToValue(e.clientX));
      dragging = true;
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      setValue(posToValue(e.clientX));
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
    });

    thumb.addEventListener("touchstart", (e) => {
      e.preventDefault();
      dragging = true;
    });

    trackWrap.addEventListener("touchstart", (e) => {
      if (e.target === thumb) return;
      const touch = e.touches[0];
      setValue(posToValue(touch.clientX));
      dragging = true;
    });

    document.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      const touch = e.touches[0];
      setValue(posToValue(touch.clientX));
    });

    document.addEventListener("touchend", () => {
      dragging = false;
    });
  }

  wrap.setValue = setValue;
  wrap.getValue = () => value;

  return wrap;
}
