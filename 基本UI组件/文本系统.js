function applyStrokedText(el, scaleCss, level, options) {
  const opts = options || {};
  const strokeLevel = getStrokeLevel(level);
  const strokeHex = getColorHex("gray", strokeLevel);

  if (!opts.skipColor) {
    const fillHex = getColorHex(scaleCss, level);
    el.style.color = fillHex;
  }
  el.style.webkitTextStrokeColor = strokeHex;
  if (opts.fontSize) el.style.fontSize = opts.fontSize + "px";
  if (opts.fontWeight) el.style.fontWeight = opts.fontWeight;
  if (opts.fontStyle) el.style.fontStyle = opts.fontStyle || "normal";

  const thick = opts.fontSize && opts.fontSize >= 20;
  el.classList.add("stroked-text");
  if (thick) el.classList.add("thick");
}
