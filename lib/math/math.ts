export const bitTest = (number: number, bit: number) => (number >> bit) % 2 != 0;
