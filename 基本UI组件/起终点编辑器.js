function createStartEndEditor(options) {
  const opts = options || {};
  const regionName = opts.regionName || "区域";
  const startText = opts.startText || "起点像素";
  const endText = opts.endText || "终点像素";
  const numberSize = opts.numberSize || "sm";
  const max = opts.max != null ? Number(opts.max) : 99999;
  const onPickModeChange = opts.onPickModeChange;
  const onPointChange = opts.onPointChange;

  let start = null;
  let end = null;
  let mute = false;

  const wrap = document.createElement("div");
  wrap.className = "se-editor-wrap";

  const header = document.createElement("div");
  header.className = "se-editor-header";
  const regionNameEl = document.createElement("div");
  regionNameEl.className = "se-editor-region-name";
  regionNameEl.textContent = regionName;
  const regionSizeEl = document.createElement("div");
  regionSizeEl.className = "se-editor-region-size";
  header.appendChild(regionNameEl);
  header.appendChild(regionSizeEl);
  wrap.appendChild(header);

  const startBlock = document.createElement("div");
  startBlock.className = "se-editor-block";
  const startLabel = document.createElement("div");
  startLabel.className = "se-editor-label";
  startLabel.textContent = startText;
  const startInputRow = document.createElement("div");
  startInputRow.className = "se-editor-input-row";
  const startXText = document.createElement("span");
  startXText.className = "se-editor-xy";
  startXText.textContent = "X";
  const startXInput = createNumberInput({
    size: numberSize,
    value: 0,
    min: 0,
    max,
    step: 1,
    stepMin: 1,
    stepMax: 20,
    stepStep: 1,
    onChange: () => {
      if (mute) return;
      setStart({ x: startXInput.getValue(), y: start ? start.y : 0 }, { fromInput: true });
    },
  });
  const startYText = document.createElement("span");
  startYText.className = "se-editor-xy";
  startYText.textContent = "Y";
  const startYInput = createNumberInput({
    size: numberSize,
    value: 0,
    min: 0,
    max,
    step: 1,
    stepMin: 1,
    stepMax: 20,
    stepStep: 1,
    onChange: () => {
      if (mute) return;
      setStart({ x: start ? start.x : 0, y: startYInput.getValue() }, { fromInput: true });
    },
  });
  const btnPickStart = createButton("设置", { scaleCss: "gray", level: 500, variant: "outline", size: "sm" });
  startInputRow.appendChild(startXText);
  startInputRow.appendChild(startXInput);
  startInputRow.appendChild(startYText);
  startInputRow.appendChild(startYInput);
  startInputRow.appendChild(btnPickStart);
  startBlock.appendChild(startLabel);
  startBlock.appendChild(startInputRow);

  const endBlock = document.createElement("div");
  endBlock.className = "se-editor-block";
  const endLabel = document.createElement("div");
  endLabel.className = "se-editor-label";
  endLabel.textContent = endText;
  const endInputRow = document.createElement("div");
  endInputRow.className = "se-editor-input-row";
  const endXText = document.createElement("span");
  endXText.className = "se-editor-xy";
  endXText.textContent = "X";
  const endXInput = createNumberInput({
    size: numberSize,
    value: 0,
    min: 0,
    max,
    step: 1,
    stepMin: 1,
    stepMax: 20,
    stepStep: 1,
    onChange: () => {
      if (mute) return;
      setEnd({ x: endXInput.getValue(), y: end ? end.y : 0 }, { fromInput: true });
    },
  });
  const endYText = document.createElement("span");
  endYText.className = "se-editor-xy";
  endYText.textContent = "Y";
  const endYInput = createNumberInput({
    size: numberSize,
    value: 0,
    min: 0,
    max,
    step: 1,
    stepMin: 1,
    stepMax: 20,
    stepStep: 1,
    onChange: () => {
      if (mute) return;
      setEnd({ x: end ? end.x : 0, y: endYInput.getValue() }, { fromInput: true });
    },
  });
  const btnPickEnd = createButton("设置", { scaleCss: "gray", level: 500, variant: "outline", size: "sm" });
  endInputRow.appendChild(endXText);
  endInputRow.appendChild(endXInput);
  endInputRow.appendChild(endYText);
  endInputRow.appendChild(endYInput);
  endInputRow.appendChild(btnPickEnd);
  endBlock.appendChild(endLabel);
  endBlock.appendChild(endInputRow);
  wrap.appendChild(startBlock);
  wrap.appendChild(endBlock);

  function updateInfo() {
    if (!start || !end) {
      regionSizeEl.textContent = "-";
      return;
    }
    const w = Math.abs(end.x - start.x) + 1;
    const h = Math.abs(end.y - start.y) + 1;
    regionSizeEl.textContent = w + "x" + h;
  }

  function normalize(raw) {
    if (!raw) return null;
    return { x: Math.max(0, Math.round(Number(raw.x) || 0)), y: Math.max(0, Math.round(Number(raw.y) || 0)) };
  }

  function setStart(raw, flags) {
    const next = normalize(raw);
    start = next;
    mute = true;
    startXInput.setValue(next ? next.x : 0);
    startYInput.setValue(next ? next.y : 0);
    mute = false;
    updateInfo();
    if (!flags || !flags.silent) {
      if (onPointChange) onPointChange({ start, end, source: flags && flags.fromInput ? "input-start" : "set-start" });
    }
  }

  function setEnd(raw, flags) {
    const next = normalize(raw);
    end = next;
    mute = true;
    endXInput.setValue(next ? next.x : 0);
    endYInput.setValue(next ? next.y : 0);
    mute = false;
    updateInfo();
    if (!flags || !flags.silent) {
      if (onPointChange) onPointChange({ start, end, source: flags && flags.fromInput ? "input-end" : "set-end" });
    }
  }

  function setPickMode(mode) {
    btnPickStart.classList.toggle("nav-active", mode === "start");
    btnPickEnd.classList.toggle("nav-active", mode === "end");
  }

  btnPickStart.addEventListener("click", () => {
    if (onPickModeChange) onPickModeChange("start");
  });
  btnPickEnd.addEventListener("click", () => {
    if (onPickModeChange) onPickModeChange("end");
  });

  updateInfo();

  return {
    wrap,
    setStart,
    setEnd,
    getStart: () => start,
    getEnd: () => end,
    clear: () => {
      setStart(null, { silent: true });
      setEnd(null, { silent: true });
      updateInfo();
      if (onPointChange) onPointChange({ start, end, source: "clear" });
    },
    setPickMode,
    setRegionName: (text) => { regionNameEl.textContent = text || "区域"; },
    setSizeText: (text) => {
      regionSizeEl.textContent = text || "-";
    },
  };
}
