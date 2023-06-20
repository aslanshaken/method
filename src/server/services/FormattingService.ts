/**
 * Returns a number split by $
 * @param str
 * @returns
 */
export function parseDollarStr(str: string) {
  return parseInt(str.replace('$', '').replace('.', ''));
}

/**
 * Returns a String with suffix $
 * @param num
 * @returns
 */
export function toDollarStr(num: number) {
  return '$' + (num / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
}

export function date(dateStr: string) {
  const dateParts = dateStr.split('-');
  return `${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`;
}
