const palette = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#22C55E",
  "#0EA5E9",
  "#F97316",
  "#A855F7",
  "#14B8A6",
  "#F43F5E",
  "#6366F1",
  "#FACC15",
  "#E11D48",
];

const randomHex = () => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

const normalizeColor = (color) => String(color || "").trim().toUpperCase();

const hashString = (text) => {
  return Array.from(String(text || "")).reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);
};

const getUniqueRandomColor = (existingColors = [], preferredName = "") => {
  const used = new Set(existingColors.map((c) => normalizeColor(c)));
  const normalizedPalette = palette.map((color) => normalizeColor(color));
  const available = palette.filter((color) => !used.has(normalizeColor(color)));

  if (preferredName) {
    const startIndex = Math.abs(hashString(preferredName)) % palette.length;
    const preferredColor = palette[startIndex];
    if (!used.has(normalizeColor(preferredColor))) {
      return preferredColor;
    }
  }

  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }

  let color = randomHex();
  let tries = 0;
  while (used.has(normalizeColor(color)) && tries < 50) {
    color = randomHex();
    tries += 1;
  }
  return color;
};

module.exports = {
  getUniqueRandomColor,
};
