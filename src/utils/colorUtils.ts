// دالة تحدد لون الأيقونة (أسود أو أبيض) حسب سطوع اللون
export function getContrastColor(hex: string | undefined): string {
  if (!hex) return '#fff';
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // معادلة السطوع
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 170 ? '#222' : '#fff';
}

// دالة تلوين خلفية الأعمدة مع شفافية
export function getHeaderBg(color?: string) {
  if (!color) return 'rgba(46,133,64,0.08)';
  // تحويل HEX إلى RGBA مع شفافية
  let c = color.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},0.08)`;
}
