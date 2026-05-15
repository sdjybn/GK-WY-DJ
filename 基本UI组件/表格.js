function createTable(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const columns = opts.columns || [];
  const rows = opts.rows || [];
  const disabled = opts.disabled || false;
  const selectable = opts.selectable || false;
  const onSelect = opts.onSelect;

  const wrap = document.createElement("div");
  wrap.className = "table-wrap" + (disabled ? " disabled" : "");
  wrap.style.position = "relative";

  const table = document.createElement("table");
  table.className = "table-el table-" + size;

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col.label || col.key;
    applyStrokedText(th, "gray", 600);
    if (col.width) th.style.width = col.width;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach((row, rowIdx) => {
    const tr = document.createElement("tr");
    if (selectable && !disabled) {
      tr.style.cursor = "pointer";
      tr.addEventListener("click", () => {
        tbody.querySelectorAll("tr.selected").forEach((r) => r.classList.remove("selected"));
        tr.classList.add("selected");
        if (onSelect) onSelect(row, rowIdx);
      });
    }
    columns.forEach((col) => {
      const td = document.createElement("td");
      const val = row[col.key];
      td.textContent = val != null ? val : "";
      applyStrokedText(td, "gray", 900);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "table-disable-mark";
    wrap.appendChild(mark);
  }

  return wrap;
}
