import {
  getPaymentsByBranch,
  getUpdatedPayments,
  groupPaymentAmountsByPayor,
} from './PaymentService';

const json2csv = require('json2csv').Parser;

// ----------------------------------------------------------------------

export async function getPaymentsBySourceReport(payoutId: number) {
  const payments = await groupPaymentAmountsByPayor(payoutId);

  const options = {
    fields: [
      { label: 'Account ID', value: 'corp_id' },
      { label: 'Total Payments', value: 'sum' },
    ],
  };

  const parser = new json2csv(options);
  return parser.parse(payments);
}

export async function getPaymentsByBranchReport(payoutId: number) {
  const payments = await getPaymentsByBranch(payoutId);

  const options = {
    fields: [
      { label: 'Branch ID', value: 'branch_id' },
      { label: 'Total Payments', value: 'sum' },
    ],
  };

  const parser = new json2csv(options);
  return parser.parse(payments);
}

export async function getPaymentsReport(payoutId: number) {
  const payments = await getUpdatedPayments(payoutId);

  const options = {
    fields: [
      { label: 'Payment ID', value: 'id' },
      { label: 'Payor', value: 'payor_id' },
      { label: 'Payee', value: 'payee_id' },
      { label: 'Payment Amount', value: 'amount' },
      { label: 'Status', value: 'status' },
      { label: 'Updated At', value: 'updated_at' },
    ],
  };

  const parser = new json2csv(options);
  return parser.parse(payments);
}
