// src/lib/numberToWords.ts
// Custom implementation for Indian numbering (handles lakhs, crores)

const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety",
];

function convertHundreds(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  if (n < 100) {
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
  }
  return (
    ones[Math.floor(n / 100)] +
    " Hundred" +
    (n % 100 !== 0 ? " " + convertHundreds(n % 100) : "")
  );
}

export function numberToWords(amount: number): string {
  if (amount === 0) return "Zero";

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = "";

  if (rupees > 0) {
    // Indian system: crores, lakhs, thousands, hundreds
    const crore = Math.floor(rupees / 10000000);
    const lakh = Math.floor((rupees % 10000000) / 100000);
    const thousand = Math.floor((rupees % 100000) / 1000);
    const remainder = rupees % 1000;

    if (crore > 0) result += convertHundreds(crore) + " Crore ";
    if (lakh > 0) result += convertHundreds(lakh) + " Lakh ";
    if (thousand > 0) result += convertHundreds(thousand) + " Thousand ";
    if (remainder > 0) result += convertHundreds(remainder);

    result = result.trim() + " Rupees";
  }

  if (paise > 0) {
    result += " and " + convertHundreds(paise) + " Paise";
  }

  return result + " Only";
}