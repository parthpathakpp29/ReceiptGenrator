// src/types/index.ts

export interface ILoanRecord {
    _id?: string;
    name: string;
    fatherName: string;
    loanAccountNumber: string;
    loanStartDate: string;
    principal: number;
    interest: number;
    dueAmount: number;
    balance: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface IReceipt {
    _id?: string;
    loanRecordId: string;
    receiptNumber: string;
    memberName: string;
    fatherName: string;
    loanAccountNumber: string;
    date: string;
    principal: number;
    interest: number;
    total: number;
    balance: number;
    amountInWords: string;
    generatedAt?: string;
  }
  
  export interface SearchResult {
    data: ILoanRecord[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
  }

export interface IUploadHistory {
  _id?: string;
  fileName: string;
  totalParsed: number;
  inserted: number;
  updated: number;
  status: "success" | "failed";
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}
  
  export interface ExcelRow {
    MEMBER_NAME: string;
    FATHER_NAME: string;
    LOAN_ACCOUNT_NUMBER: string | number;
    LOAN_START_DATE: string | number;
    PRINCIPLE_AMOUNT: number;
    INTEREST_AMOUNT: number;
    DUE_AMOUNT: number;
    BALANCE_AMOUNT: number;
  }