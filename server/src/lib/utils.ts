type OpeningHours = {
  [key: string]: { open: string; close: string };
};

export function getIsAutoClosed(openingHours: OpeningHours): boolean {
  const now = new Date();

  const day = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayHours = openingHours[day];

  if (!todayHours || !todayHours.open || !todayHours.close) {
    return true;
  }

  const [openH, openM] = todayHours.open.split(':').map(Number);
  const [closeH, closeM] = todayHours.close.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (openMinutes > closeMinutes) {
    return !(currentMinutes >= openMinutes || currentMinutes < closeMinutes);
  }

  return !(currentMinutes >= openMinutes && currentMinutes < closeMinutes);
}

export function calculateItemTotal(
  basePrice: number,
  quantity: number,
  variants: { price?: number }[] = [],
  addons: { price?: number }[] = [],
): number {
  const variantTotal = variants.reduce((sum, v) => sum + (v.price || 0), 0);
  const addonTotal = addons.reduce((sum, a) => sum + (a.price || 0), 0);

  return (basePrice + variantTotal + addonTotal) * quantity;
}
