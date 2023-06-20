export interface ISummary {
  numPayments: number;
  totalPaymentAmount: string;
}

export interface ISummaryList {
  [key: string]: ISummary;
}

export type IPayoutStatus = 'pending' | 'processing' | 'complete';

export interface IPayout {
  created_at: string;
  id: number;
  status: IPayoutStatus;
  total_amount: number;
  updated_at: string;
}
