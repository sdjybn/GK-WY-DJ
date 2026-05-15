function createTag(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const variant = opts.variant || "fill";
  const size = opts.size || "md";
  const text = opts.text || "";
  const closable = opts.closable || false;
  const onClose = opts.onClose;

  const el = document.createElement("span");
  el.className = "tag-el tag-" + variant + " tag-" + size;

  const hex = getColorHex(scaleCss, level);

  if (variant === "fill") {
    el.style.background = hex;
  } else if (variant === "outline") {
    el.style.borderColor = hex;
  }

  const label = document.createElement("span");
  label.textContent = text;
  if (variant === "fill") {
    const textColor = level <= 500 ? getColorHex("gray", 1000) : getColorHex("gray", 0);
    const strokeColor = level <= 500 ? getColorHex("gray", 0) : getColorHex("gray", 1000);
    applyStrokedText(label, scaleCss, level, { skipColor: true });
    label.style.color = textColor;
    label.style.webkitTextStrokeColor = strokeColor;
  } else {
    applyStrokedText(label, scaleCss, level);
  }
  el.appendChild(label);

  if (closable) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "tag-close";
    closeBtn.type = "button";
    closeBtn.textContent = "\u00D7";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onClose) onClose();
      el.remove();
    });
    el.appendChild(closeBtn);
  }

  return el;
}
