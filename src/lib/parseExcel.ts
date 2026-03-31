// src/lib/parseExcel.ts
import * as XLSX from "xlsx";
import { ExcelRow, ILoanRecord } from "@/types";

// Convert Excel serial date number to DD-MM-YYYY string
function excelDateToString(serial: number | string): string {
  if (typeof serial === "string") {
    // Already a date string — normalise it
    return serial.replace(/\//g, "-");
  }
  // Excel dates are days since Jan 1, 1900
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + serial * 86400000);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

const REQUIRED_HEADERS = [
  "MEMBER_NAME",
  "FATHER_NAME",
  "LOAN_ACCOUNT_NUMBER",
  "LOAN_START_DATE",
  "PRINCIPLE_AMOUNT",
  "INTEREST_AMOUNT",
  "DUE_AMOUNT",
  "BALANCE_AMOUNT",
] as const;

function normalizeHeader(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "_");
}

function normalizeRowKeys(row: Record<string, unknown>): ExcelRow {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeHeader(key)] = value;
  }
  return normalized as unknown as ExcelRow;
}

// Sanitise a single Excel row into our clean ILoanRecord shape
function transformRow(row: ExcelRow): ILoanRecord | null {
  // Skip empty or header rows
  if (!row.MEMBER_NAME || typeof row.MEMBER_NAME !== "string") return null;

  const name = row.MEMBER_NAME.trim();
  if (!name || name.toLowerCase() === "member_name") return null;

  return {
    name,
    fatherName: String(row.FATHER_NAME || "").trim(),
    loanAccountNumber: String(row.LOAN_ACCOUNT_NUMBER || "").trim(),
    loanStartDate: excelDateToString(row.LOAN_START_DATE),
    principal: Number(row.PRINCIPLE_AMOUNT) || 0,
    interest: Number(row.INTEREST_AMOUNT) || 0,
    dueAmount: Number(row.DUE_AMOUNT) || 0,
    balance: Number(row.BALANCE_AMOUNT) || 0,
  };
}

export function parseExcelBuffer(buffer: Buffer): {
  records: ILoanRecord[];
  missingHeaders: string[];
} {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // Use the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON — header row becomes keys
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    raw: true,         // keep raw values (numbers stay numbers)
    defval: "",        // empty cells become ""
  });

  const firstRow = rawRows[0] ?? {};
  const firstRowHeaders = new Set(
    Object.keys(firstRow).map((header) => normalizeHeader(header))
  );
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !firstRowHeaders.has(header));

  const records: ILoanRecord[] = [];

  for (const row of rawRows) {
    const transformed = transformRow(normalizeRowKeys(row));
    if (transformed) {
      records.push(transformed);
    }
  }

  return { records, missingHeaders };
}