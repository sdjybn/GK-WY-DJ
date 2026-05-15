function createModal(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const title = opts.title || "";
  const content = opts.content || "";
  const closable = opts.closable !== false;
  const onOpen = opts.onOpen;
  const onClose = opts.onClose;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay modal-" + size;

  const box = document.createElement("div");
  box.className = "modal-box";

  const header = document.createElement("div");
  header.className = "modal-header";

  const titleEl = document.createElement("span");
  titleEl.className = "modal-title";
  titleEl.textContent = title;
  applyStrokedText(titleEl, "gray", 900);
  header.appendChild(titleEl);

  if (closable) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.type = "button";
    closeBtn.textContent = "\u00D7";
    closeBtn.addEventListener("click", () => modal.close());
    header.appendChild(closeBtn);
  }

  box.appendChild(header);

  const body = document.createElement("div");
  body.className = "modal-body";
  if (typeof content === "string") {
    body.textContent = content;
    applyStrokedText(body, "gray", 800);
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }
  box.appendChild(body);

  const footer = document.createElement("div");
  footer.className = "modal-footer";
  box.appendChild(footer);

  overlay.appendChild(box);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) e.stopPropagation();
  });

  const _escHandler = (e) => {
    if (e.key === "Escape" && modal.isOpen()) {
      e.preventDefault();
      if (closable) modal.close();
    }
  };
  document.addEventListener("keydown", _escHandler);

  const modal = {
    el: overlay,
    footer: footer,
    body: body,
    open() {
      document.body.appendChild(overlay);
      overlay.classList.add("open");
      if (onOpen) onOpen();
    },
    close() {
      overlay.classList.remove("open");
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 200);
      if (onClose) onClose();
    },
    isOpen() {
      return overlay.classList.contains("open");
    },
    destroy() {
      document.removeEventListener("keydown", _escHandler);
    },
    setFooter(buttons) {
      footer.replaceChildren();
      (buttons || []).forEach((btn) => footer.appendChild(btn));
    },
    setConfirmCancel(confirmText, cancelText, onConfirm, onCancel) {
      footer.replaceChildren();
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "modal-btn-cancel";
      cancelBtn.type = "button";
      cancelBtn.textContent = cancelText || "取消";
      applyStrokedText(cancelBtn, "cyan", 300, { skipColor: true });
      cancelBtn.style.color = "#fff";
      cancelBtn.addEventListener("click", () => {
        if (onCancel) onCancel();
        modal.close();
      });
      const confirmBtn = document.createElement("button");
      confirmBtn.className = "modal-btn-confirm";
      confirmBtn.type = "button";
      confirmBtn.textContent = confirmText || "确认";
      applyStrokedText(confirmBtn, "green", 450, { skipColor: true });
      confirmBtn.style.color = "#fff";
      confirmBtn.addEventListener("click", () => {
        if (onConfirm) {
          const result = onConfirm();
          if (result === false) return;
        }
        modal.close();
      });
      footer.appendChild(cancelBtn);
      footer.appendChild(confirmBtn);
    }
  };

  return modal;
}
