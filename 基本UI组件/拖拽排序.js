function enableDragSort(options) {
  const opts = options || {};
  const container = opts.container;
  const itemSelector = opts.itemSelector || ".drag-sort-item";
  const handleSelector = opts.handleSelector || ".drag-sort-handle";
  const placeholderClass = opts.placeholderClass || "drag-sort-placeholder";
  const draggingClass = opts.draggingClass || "drag-sort-dragging";
  const disabled = opts.disabled || false;
  const onReorder = opts.onReorder;

  if (!container) return;

  container.classList.add("drag-sort-host");

  function getDirectItems() {
    return [...container.querySelectorAll(":scope > " + itemSelector)];
  }

  function getVisibleDirectItems() {
    return getDirectItems().filter(el => el.style.display !== "none");
  }

  function getItemIndexAmongSiblings(el) {
    let idx = 0;
    for (const child of container.children) {
      if (child === el) return idx;
      if (child.matches(itemSelector)) idx++;
    }
    return idx;
  }

  function getAssociatedElements(row) {
    const elements = [row];
    let next = row.nextElementSibling;
    while (next && !next.matches(itemSelector)) {
      elements.push(next);
      next = next.nextElementSibling;
    }
    return elements;
  }

  function startDrag(e, row, fromIndex) {
    const rect = row.getBoundingClientRect();
    const associated = getAssociatedElements(row);
    const totalHeight = associated.reduce((sum, el) => sum + el.getBoundingClientRect().height, 0);

    const clone = document.createElement("div");
    clone.className = draggingClass;
    clone.style.width = rect.width + "px";
    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.zIndex = "10002";
    clone.style.pointerEvents = "none";
    associated.forEach(el => {
      const elClone = el.cloneNode(true);
      clone.appendChild(elClone);
    });
    document.body.appendChild(clone);

    const placeholder = document.createElement("div");
    placeholder.className = placeholderClass;
    placeholder.style.height = totalHeight + "px";
    container.insertBefore(placeholder, row);
    associated.forEach(el => { el.style.display = "none"; });

    const offsetY = e.clientY - rect.top;

    function onMove(ev) {
      clone.style.top = (ev.clientY - offsetY) + "px";
      const siblings = getVisibleDirectItems();
      let targetIdx = siblings.length;
      for (let i = 0; i < siblings.length; i++) {
        const sibRect = siblings[i].getBoundingClientRect();
        if (ev.clientY < sibRect.top + sibRect.height / 2) {
          targetIdx = i;
          break;
        }
      }
      if (targetIdx >= siblings.length) {
        if (siblings.length === 0) return;
        const lastSib = siblings[siblings.length - 1];
        const lastAssoc = getAssociatedElements(lastSib);
        const lastEl = lastAssoc[lastAssoc.length - 1];
        if (lastEl.nextElementSibling === placeholder) return;
        container.insertBefore(placeholder, lastEl.nextElementSibling);
        return;
      }
      const refRow = siblings[targetIdx];
      if (refRow === placeholder) return;
      if (placeholder.nextElementSibling === refRow) return;
      container.insertBefore(placeholder, refRow);
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const placeholderIdx = [...container.children].indexOf(placeholder);
      let targetIndex = 0;
      for (let i = 0; i < placeholderIdx; i++) {
        if (container.children[i].matches(itemSelector)) targetIndex++;
      }
      clone.remove();
      placeholder.remove();
      associated.forEach(el => { el.style.display = ""; });
      if (targetIndex !== fromIndex && onReorder) {
        onReorder(fromIndex, targetIndex);
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function bind() {
    unbind();
    const items = getDirectItems();
    items.forEach((row) => {
      const handle = handleSelector ? row.querySelector(handleSelector) : row;
      if (!handle) return;
      handle._dragSortHandler = (e) => {
        e.preventDefault();
        const currentIndex = getItemIndexAmongSiblings(row);
        startDrag(e, row, currentIndex);
      };
      handle.addEventListener("mousedown", handle._dragSortHandler);
    });
  }

  function unbind() {
    const items = getDirectItems();
    items.forEach((row) => {
      const handle = handleSelector ? row.querySelector(handleSelector) : row;
      if (!handle || !handle._dragSortHandler) return;
      handle.removeEventListener("mousedown", handle._dragSortHandler);
      delete handle._dragSortHandler;
    });
  }

  bind();

  return { bind, unbind };
}
