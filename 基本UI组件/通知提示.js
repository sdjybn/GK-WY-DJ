let _toastContainer = null;

function _getToastContainer() {
  if (!_toastContainer) {
    _toastContainer = document.createElement("div");
    _toastContainer.className = "toast-container";
    document.body.appendChild(_toastContainer);
  }
  return _toastContainer;
}

function createToast(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "blue";
  const level = opts.level != null ? opts.level : 500;
  const text = opts.text || "";
  const size = opts.size || "md";
  const duration = opts.duration != null ? opts.duration : 3000;
  const closable = opts.closable !== false;
  const icon = opts.icon != null ? opts.icon : true;
  const onClose = opts.onClose;

  const el = document.createElement("div");
  el.className = "toast-el toast-" + size;

  if (icon) {
    const iconWrap = document.createElement("span");
    iconWrap.className = "toast-icon";
    const iconName = _toastIconName(scaleCss, level);
    iconWrap.appendChild(createIcon({ name: iconName, size: "md", color: "#fff" }));
    iconWrap.style.background = getColorHex(scaleCss, level);
    iconWrap.style.borderRadius = "50%";
    iconWrap.style.padding = "2px";
    el.appendChild(iconWrap);
  }

  const textEl = document.createElement("span");
  textEl.className = "toast-text";
  textEl.textContent = text;
  applyStrokedText(textEl, "gray", 800);
  el.appendChild(textEl);

  if (closable) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.type = "button";
    closeBtn.textContent = "\u00D7";
    closeBtn.addEventListener("click", () => toast.close());
    el.appendChild(closeBtn);
  }

  el.style.borderLeftWidth = "3px";
  el.style.borderLeftColor = getColorHex(scaleCss, level);

  const container = _getToastContainer();

  let timer = null;

  const toast = {
    el: el,
    open() {
      container.appendChild(el);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add("visible");
        });
      });
      if (duration > 0) {
        timer = setTimeout(() => toast.close(), duration);
      }
    },
    close() {
      if (timer) { clearTimeout(timer); timer = null; }
      el.classList.remove("visible");
      el.classList.add("closing");
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
        if (onClose) onClose();
      }, 250);
    }
  };

  return toast;
}

function _toastIconName(scaleCss, level) {
  if (scaleCss === "red") return "错误";
  if (scaleCss === "yellow" || scaleCss === "orange") return "警告";
  if (scaleCss === "green") return "勾选";
  if (scaleCss === "blue" || scaleCss === "cyan") return "信息";
  return "信息";
}
