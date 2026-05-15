function findScrollParent(el) {
  let node = el;
  while (node) {
    if (node.classList && node.classList.contains("scrollbar-content")) return node;
    node = node.parentElement;
  }
  return null;
}

function preserveScrollDuring(el, fn) {
  const scroller = findScrollParent(el);
  const top = scroller ? scroller.scrollTop : 0;
  const left = scroller ? scroller.scrollLeft : 0;
  fn();
  if (scroller) {
    requestAnimationFrame(() => {
      scroller.scrollTop = top;
      scroller.scrollLeft = left;
      const host = scroller.parentElement;
      if (host && host._scrollbarUpdate) host._scrollbarUpdate();
    });
  }
}

function initScrollbar(hostEl) {
  if (hostEl._scrollbarInit) {
    hostEl._scrollbarUpdate();
    return;
  }
  hostEl._scrollbarInit = true;

  const content = hostEl.querySelector(":scope > .scrollbar-content");
  const barV = hostEl.querySelector(":scope > .float-bar-v");
  const barH = hostEl.querySelector(":scope > .float-bar-h");
  const corner = hostEl.querySelector(":scope > .float-bar-corner");

  function update() {
    const { scrollWidth, scrollHeight, clientWidth, clientHeight, scrollTop, scrollLeft } = content;
    const showV = scrollHeight > clientHeight;
    const showH = scrollWidth > clientWidth;

    if (showV) {
      const ratio = clientHeight / scrollHeight;
      const barH2 = Math.max(20, clientHeight * ratio);
      const maxTop = clientHeight - barH2;
      barV.style.height = barH2 + "px";
      barV.style.top = (scrollTop / (scrollHeight - clientHeight)) * maxTop + "px";
      barV.style.display = "";
    } else {
      barV.style.display = "none";
    }

    if (showH) {
      const ratio = clientWidth / scrollWidth;
      const barW = Math.max(20, clientWidth * ratio);
      const maxLeft = clientWidth - barW;
      barH.style.width = barW + "px";
      barH.style.left = (scrollLeft / (scrollWidth - clientWidth)) * maxLeft + "px";
      barH.style.display = "";
    } else {
      barH.style.display = "none";
    }

    corner.style.display = (showV && showH) ? "" : "none";
  }

  let timer = null;
  content.addEventListener("scroll", () => {
    update();
    hostEl.classList.add("scrolling");
    clearTimeout(timer);
    timer = setTimeout(() => hostEl.classList.remove("scrolling"), 800);
  });

  function initDrag(bar, orientation) {
    let dragging = false;
    let startPos = 0;
    let startScroll = 0;

    bar.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true;
      startPos = orientation === "v" ? e.clientY : e.clientX;
      startScroll = orientation === "v" ? content.scrollTop : content.scrollLeft;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const delta = orientation === "v" ? e.clientY - startPos : e.clientX - startPos;
      const { scrollWidth, scrollHeight, clientWidth, clientHeight } = content;
      if (orientation === "v") {
        content.scrollTop = startScroll + delta / (clientHeight / scrollHeight);
      } else {
        content.scrollLeft = startScroll + delta / (clientWidth / scrollWidth);
      }
    });

    document.addEventListener("mouseup", () => {
      if (dragging) {
        dragging = false;
        document.body.style.userSelect = "";
      }
    });
  }

  initDrag(barV, "v");
  initDrag(barH, "h");

  new ResizeObserver(update).observe(content);
  requestAnimationFrame(update);

  hostEl._scrollbarUpdate = update;
  hostEl._scrollbarDestroy = () => {
    hostEl._scrollbarInit = false;
    delete hostEl._scrollbarUpdate;
    delete hostEl._scrollbarDestroy;
  };
}
