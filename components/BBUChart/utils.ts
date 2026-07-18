export const formatTanggal = (tanggal: string) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function createScales(
  width: number,
  height: number,
  padding: Padding,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const scaleX = (x: number) =>
    padding.left + ((x - minX) / (maxX - minX)) * chartWidth;

  const scaleY = (y: number) =>
    padding.top + chartHeight - ((y - minY) / (maxY - minY)) * chartHeight;

  return { scaleX, scaleY };
}

export function buildPath<T>(
  data: T[],
  getX: (d: T) => number,
  getY: (d: T) => number,
  scaleX: (x: number) => number,
  scaleY: (y: number) => number
) {
  return data
    .map((d, i) => {
      const x = scaleX(getX(d));
      const y = scaleY(getY(d));
      if (isNaN(x) || isNaN(y)) return "";
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .filter(Boolean)
    .join(" ");
}

