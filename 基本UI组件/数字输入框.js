const _numCanvas = document.createElement("canvas");
const _numCtx = _numCanvas.getContext("2d");

const _numSizeMap = {
  sm: { font: "12px", padX: 8 },
  md: { font: "13px", padX: 8 },
  lg: { font: "15px", padX: 10 }
};
const _numStepSizeMap = {
  sm: { font: "11px", padX: 8 },
  md: { font: "12px", padX: 8 },
  lg: { font: "13px", padX: 8 }
};

function measureNumWidth(text, size, isStep) {
  const map = isStep ? _numStepSizeMap : _numSizeMap;
  const cfg = map[size] || map.md;
  _numCtx.font = cfg.font + " sans-serif";
  return Math.ceil(_numCtx.measureText(text).width) + cfg.padX + 4;
}

function createNumberInput(options) {
  const opts = options || {};
  const size = opts.size || "md";
  const value = opts.value != null ? opts.value : 0;
  const min = opts.min != null ? opts.min : 0;
  const max = opts.max != null ? opts.max : 100;
  const step = opts.step || 1;
  const stepMin = opts.stepMin || 1;
  const stepMax = opts.stepMax || 100;
  const stepStep = opts.stepStep || 1;
  const disabled = opts.disabled || false;
  const placeholder = opts.placeholder || "";
  const onChange = opts.onChange;

  let currentStep = step;

  const wrap = document.createElement("div");
  wrap.className = "number-input-wrap" + (disabled ? " disabled" : "");

  const field = document.createElement("input");
  field.type = "text";
  field.className = "number-input-field number-input-" + size;
  field.value = value;
  if (placeholder) field.placeholder = placeholder;
  if (disabled) field.disabled = true;

  const strokeHex = getColorHex("gray", 800);
  field.style.webkitTextStrokeColor = strokeHex;

  const btns = document.createElement("div");
  btns.className = "number-input-btns";

  const upSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  upSvg.setAttribute("viewBox", "0 0 12 12");
  upSvg.setAttribute("fill", "none");
  upSvg.setAttribute("width", "10");
  upSvg.setAttribute("height", "10");
  const upPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  upPath.setAttribute("d", "M2 8L6 4L10 8");
  upPath.setAttribute("stroke", "currentColor");
  upPath.setAttribute("stroke-width", "1.5");
  upPath.setAttribute("stroke-linecap", "round");
  upPath.setAttribute("stroke-linejoin", "round");
  upSvg.appendChild(upPath);

  const upBtn = document.createElement("button");
  upBtn.type = "button";
  upBtn.className = "number-input-btn";
  upBtn.appendChild(upSvg);

  const downSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  downSvg.setAttribute("viewBox", "0 0 12 12");
  downSvg.setAttribute("fill", "none");
  downSvg.setAttribute("width", "10");
  downSvg.setAttribute("height", "10");
  const downPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  downPath.setAttribute("d", "M2 4L6 8L10 4");
  downPath.setAttribute("stroke", "currentColor");
  downPath.setAttribute("stroke-width", "1.5");
  downPath.setAttribute("stroke-linecap", "round");
  downPath.setAttribute("stroke-linejoin", "round");
  downSvg.appendChild(downPath);

  const downBtn = document.createElement("button");
  downBtn.type = "button";
  downBtn.className = "number-input-btn";
  downBtn.appendChild(downSvg);

  btns.appendChild(upBtn);
  btns.appendChild(downBtn);

  const stepField = document.createElement("input");
  stepField.type = "text";
  stepField.className = "number-input-step-field number-input-step-" + size;
  stepField.value = currentStep;
  if (disabled) stepField.disabled = true;
  stepField.style.webkitTextStrokeColor = strokeHex;

  wrap.appendChild(field);
  wrap.appendChild(btns);
  wrap.appendChild(stepField);

  if (disabled) {
    const mark = document.createElement("span");
    mark.className = "number-input-disable-mark";
    wrap.appendChild(mark);
  }

  function clamp(v) {
    return Math.max(min, Math.min(max, v));
  }

  function clampStep(v) {
    return Math.max(stepMin, Math.min(stepMax, v));
  }

  function autoSizeField() {
    const text = field.value || field.placeholder || "0";
    field.style.width = measureNumWidth(text, size, false) + "px";
  }

  function autoSizeStep() {
    const text = stepField.value || "0";
    stepField.style.width = measureNumWidth(text, size, true) + "px";
  }

  function setStep(v) {
    currentStep = clampStep(v);
    stepField.value = currentStep;
    autoSizeStep();
  }

  function roundToStep(v) {
    const decimals = Math.max(0, Math.ceil(-Math.log10(Math.max(1e-10, currentStep))));
    const factor = Math.pow(10, decimals);
    return Math.round(v * factor) / factor;
  }

  function setValue(v) {
    const cleaned = Math.round(v * 1e6) / 1e6;
    const clamped = clamp(cleaned);
    field.value = clamped;
    autoSizeField();
    if (onChange) onChange(clamped);
  }

  upBtn.addEventListener("click", () => {
    const cur = parseFloat(field.value) || 0;
    setValue(roundToStep(cur + currentStep));
  });

  downBtn.addEventListener("click", () => {
    const cur = parseFloat(field.value) || 0;
    setValue(roundToStep(cur - currentStep));
  });

  stepField.addEventListener("change", () => {
    const cur = parseFloat(stepField.value);
    if (isNaN(cur)) {
      stepField.value = currentStep;
    } else {
      setStep(cur);
    }
  });

  stepField.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setStep(currentStep + stepStep);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setStep(currentStep - stepStep);
    }
  });

  stepField.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setStep(currentStep + stepStep);
    } else {
      setStep(currentStep - stepStep);
    }
  }, { passive: false });

  field.addEventListener("input", () => {
    autoSizeField();
    const cur = parseFloat(field.value);
    if (!isNaN(cur) && onChange) onChange(clamp(cur));
  });

  field.addEventListener("change", () => {
    const cur = parseFloat(field.value);
    if (isNaN(cur)) {
      field.value = value;
    } else {
      setValue(cur);
    }
  });

  field.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const cur = parseFloat(field.value) || 0;
      setValue(roundToStep(cur + currentStep));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const cur = parseFloat(field.value) || 0;
      setValue(roundToStep(cur - currentStep));
    }
  });

  wrap.addEventListener("wheel", (e) => {
    if (document.activeElement !== field) return;
    e.preventDefault();
    const cur = parseFloat(field.value) || 0;
    if (e.deltaY < 0) {
      setValue(roundToStep(cur + currentStep));
    } else {
      setValue(roundToStep(cur - currentStep));
    }
  }, { passive: false });

  requestAnimationFrame(() => {
    autoSizeField();
    autoSizeStep();
  });

  wrap.setValue = setValue;
  wrap.getValue = () => parseFloat(field.value) || 0;
  wrap.setStep = setStep;
  wrap.getStep = () => currentStep;

  return wrap;
}
