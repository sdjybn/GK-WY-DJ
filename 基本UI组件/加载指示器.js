function createSpinner(options) {
  const opts = options || {};
  const scaleCss = opts.scaleCss || "gray";
  const level = opts.level != null ? opts.level : 500;
  const size = opts.size || "md";

  const el = document.createElement("span");
  el.className = "spinner-el spinner-" + size;

  const hex = getColorHex(scaleCss, level);
  const trackHex = getColorHex(scaleCss, 300);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.style.width = "100%";
  svg.style.height = "100%";

  const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  track.setAttribute("cx", "12");
  track.setAttribute("cy", "12");
  track.setAttribute("r", "9");
  track.setAttribute("fill", "none");
  track.setAttribute("stroke", trackHex);
  track.setAttribute("stroke-width", "3");

  const arc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  arc.setAttribute("cx", "12");
  arc.setAttribute("cy", "12");
  arc.setAttribute("r", "9");
  arc.setAttribute("fill", "none");
  arc.setAttribute("stroke", hex);
  arc.setAttribute("stroke-width", "3");
  arc.setAttribute("stroke-linecap", "round");
  arc.setAttribute("stroke-dasharray", "28 28");
  arc.setAttribute("stroke-dashoffset", "0");

  svg.appendChild(track);
  svg.appendChild(arc);
  el.appendChild(svg);

  return el;
}
