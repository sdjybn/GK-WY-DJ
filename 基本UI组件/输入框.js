function createInput(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const placeholder = opts.placeholder || "";
  const value = opts.value || "";
  const disabled = opts.disabled || false;
  const error = opts.error || false;
  const prefix = opts.prefix || "";
  const suffix = opts.suffix || "";
  const onChange = opts.onChange;
  const onInput = opts.onInput;

  const wrap = document.createElement("div");
  wrap.className = "input-wrap" + (disabled ? " disabled" : "");

  const input = document.createElement("input");
  input.className = "input-field input-" + size;
  if (prefix) input.classList.add("input-has-prefix");
  if (suffix) input.classList.add("input-has-suffix");
  if (error) input.classList.add("input-error");

  input.type = opts.type || "text";
  input.placeholder = placeholder;
  input.value = value;
  input.disabled = disabled;

  const strokeHex = getColorHex("gray", 800);
  input.style.webkitTextStrokeColor = strokeHex;

  if (onChange) input.addEventListener("change", () => onChange(input.value));
  if (onInput) input.addEventListener("input", () => onInput(input.value));

  if (prefix) {
    const pre = document.createElement("span");
    pre.className = "input-prefix";
    pre.textContent = prefix;
    wrap.appendChild(pre);
  }

  wrap.appendChild(input);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "input-disable-mark";
    wrap.appendChild(mark);
  }

  if (suffix) {
    const suf = document.createElement("span");
    suf.className = "input-suffix";
    suf.textContent = suffix;
    wrap.appendChild(suf);
  }

  return wrap;
}
