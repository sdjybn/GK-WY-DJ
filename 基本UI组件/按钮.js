function createButton(text, options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const variant = opts.variant || "fill";
  const size = opts.size || "md";
  const disabled = opts.disabled || false;
  const onClick = opts.onClick;

  const btn = document.createElement("button");
  btn.className = `btn btn-${variant} btn-${size}`;
  btn.type = opts.type || "button";
  btn.disabled = disabled;

  if (variant === "fill") {
    const fillHex = getColorHex(scaleCss, level);
    btn.style.background = fillHex;
    const strokeColor = level <= 500 ? getColorHex("gray", 0) : getColorHex("gray", 1000);
    applyStrokedText(btn, scaleCss, level, { skipColor: true });
    btn.style.color = getColorHex("gray", 1000);
    btn.style.webkitTextStrokeColor = strokeColor;
  } else if (variant === "outline") {
    btn.style.borderColor = getColorHex(scaleCss, level);
    applyStrokedText(btn, scaleCss, level, { skipColor: true });
    btn.style.color = getColorHex("gray", 1000);
  } else if (variant === "ghost") {
    applyStrokedText(btn, scaleCss, level, { skipColor: true });
    btn.style.color = getColorHex("gray", 1000);
  }

  btn.textContent = text;

  if (onClick) btn.addEventListener("click", onClick);

  return btn;
}
