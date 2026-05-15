const COLOR_SCALES = [
  { name: "红", css: "red",    hue: 345, sat: 100, baseLight: 50 },
  { name: "橙", css: "orange", hue: 25,  sat: 100, baseLight: 50 },
  { name: "黄", css: "yellow", hue: 55,  sat: 100, baseLight: 50 },
  { name: "绿", css: "green",  hue: 130, sat: 100, baseLight: 45 },
  { name: "青", css: "cyan",   hue: 185, sat: 100, baseLight: 48 },
  { name: "蓝", css: "blue",   hue: 215, sat: 100, baseLight: 55 },
  { name: "紫", css: "purple", hue: 275, sat: 100, baseLight: 55 },
  { name: "灰", css: "gray",   hue: 220, sat: 8,   baseLight: 40 },
];

function levelToHSL(level, baseHue, baseSat, baseLight) {
  let s, l;
  if (level <= 500) {
    const t = level / 500;
    l = baseLight * t;
    s = baseSat * t;
  } else {
    const t = (level - 500) / 500;
    l = baseLight + (100 - baseLight) * t;
    s = baseSat * (1 - t);
  }
  return { h: baseHue, s, l };
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getColorHex(scaleCss, level) {
  const scale = COLOR_SCALES.find(s => s.css === scaleCss);
  if (!scale) return "#000000";
  const { h, s, l } = levelToHSL(level, scale.hue, scale.sat, scale.baseLight);
  return hslToHex(h, s, l);
}

function getStrokeLevel(fillLevel) {
  return 1000 - fillLevel;
}

function injectColorCSSVars() {
  const vars = [];
  COLOR_SCALES.forEach((scale) => {
    for (let level = 0; level <= 1000; level += 50) {
      const hex = getColorHex(scale.css, level);
      vars.push(`--${scale.css}-${level}: ${hex};`);
    }
  });
  const style = document.createElement("style");
  style.textContent = `:root {\n  ${vars.join("\n  ")}\n}`;
  document.head.appendChild(style);
}
