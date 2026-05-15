function createCollapsible(options) {
  const opts = options || {};
  const label = opts.label || "";
  const size = opts.size || "md";
  const open = opts.open || false;
  const disabled = opts.disabled || false;
  const onChange = opts.onChange;
  const badge = opts.badge;

  const wrap = document.createElement("div");
  wrap.className = "collapsible-wrap" + (open ? " open" : "") + (disabled ? " disabled" : "");

  const trigger = document.createElement("button");
  trigger.className = "collapsible-trigger collapsible-trigger-" + size;
  trigger.type = "button";
  trigger.tabIndex = disabled ? -1 : 0;

  const labelEl = document.createElement("span");
  labelEl.className = "collapsible-label";
  labelEl.textContent = label;
  applyStrokedText(labelEl, "gray", 900);
  trigger.appendChild(labelEl);

  if (badge !== undefined && badge !== null && badge !== "") {
    const badgeEl = document.createElement("span");
    badgeEl.className = "collapsible-badge";
    badgeEl.textContent = badge;
    trigger.appendChild(badgeEl);
  }

  const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("class", "collapsible-arrow");
  arrow.setAttribute("viewBox", "0 0 12 12");
  arrow.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2 4L6 8L10 4");
  path.setAttribute("stroke", "var(--muted)");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  arrow.appendChild(path);
  trigger.appendChild(arrow);

  wrap.appendChild(trigger);

  const body = document.createElement("div");
  body.className = "collapsible-body";

  const content = document.createElement("div");
  content.className = "collapsible-content";
  body.appendChild(content);

  wrap.appendChild(body);

  function refreshOpenHeight() {
    if (!wrap.classList.contains("open")) return;
    body.style.maxHeight = body.scrollHeight + "px";
  }

  let animTimer = null;

  function setOpen(isOpen, animate) {
    const next = Boolean(isOpen);
    const has = wrap.classList.contains("open");
    if (next === has) {
      refreshOpenHeight();
      return;
    }
    clearTimeout(animTimer);
    if (animate) {
      wrap.classList.add("collapsible-animating");
      animTimer = setTimeout(() => {
        wrap.classList.remove("collapsible-animating");
      }, 300);
    }
    if (next) {
      wrap.classList.add("open");
      if (!animate) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = "0px";
        requestAnimationFrame(() => {
          body.style.maxHeight = body.scrollHeight + "px";
        });
      }
    } else {
      const cur = body.scrollHeight;
      body.style.maxHeight = cur + "px";
      requestAnimationFrame(() => {
        wrap.classList.remove("open");
        body.style.maxHeight = "0px";
      });
    }
  }

  trigger.addEventListener("click", () => {
    const isOpen = !wrap.classList.contains("open");
    setOpen(isOpen, true);
    if (onChange) {
      requestAnimationFrame(() => {
        onChange(isOpen);
      });
    }
  });

  trigger.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const isOpen = !wrap.classList.contains("open");
      setOpen(isOpen, true);
      if (onChange) {
        requestAnimationFrame(() => {
          onChange(isOpen);
        });
      }
    }
  });

  if (typeof ResizeObserver !== "undefined") {
    const obs = new ResizeObserver(() => {
      refreshOpenHeight();
    });
    obs.observe(content);
  }
  if (open) {
    wrap.classList.add("open");
    body.style.maxHeight = body.scrollHeight + "px";
  } else {
    body.style.maxHeight = "0px";
  }

  return { wrap, content, setOpen };
}
