import { prisma } from '../config';
// @types
import { Payout } from '@prisma/client';
import { ISummaryList } from 'src/@types/payout';
//
import { parseDollarStr, toDollarStr } from './FormattingService';
import { fetchPayeeAccount } from './PayeeAccountService';
import { createPayment } from './PaymentService';
import { fetchPayorAccount } from './PayorAccountService';

// ----------------------------------------------------------------------

async function createPayout() {
  return await prisma.payout.create({
    data: {
      status: 'pending',
    },
  });
}

async function updatePayoutStatus(id: number, status: string, totalAmount: number | null): Promise<Payout> {
  const payout = await prisma.payout.findUnique({
    where: {
      id: id,
    },
  });
  if (!payout) {
    throw new Error(`Payout with ID ${id} not found`);
  }

  const update = {
    status: status || payout.status,
    total_amount: totalAmount || payout.total_amount,
  };

  return await prisma.payout.update({
    where: {
      id,
    },
    data: update,
  });
}

async function consolidate(data: Record<string, any>) {
  let payments: any = {};
  let currRow = 1;
  let numRows = Object.keys(data).length;
  for (let row of Object.values(data)) {
    console.debug(`Preparing payment: ${currRow} of ${numRows}`);
    currRow++;

    try {
      const payor = row.Payor[0];
      const employee = row.Employee[0];
      const payee = row.Payee[0];
      const amount = parseDollarStr(row.Amount[0]);

      const sourceAccount = await fetchPayorAccount(payor);
      const destinationAccount = await fetchPayeeAccount(employee, payee);
      const key = JSON.stringify({ source: sourceAccount.id, destination: destinationAccount.id });
      if (!payments.hasOwnProperty(key)) {
        payments[key] = amount;
      } else {
        payments[key] += amount;
      }
    } catch (e) {
      // for now just catch an error and continue
      console.error(`error preparing payment - ${e}`);
    }
  }

  return payments;
}

async function submit(payments: any, payoutId: any) {
  await updatePayoutStatus(payoutId, 'processing', null);
  let totalPaymentAmount = 0;
  let numPayments = Object.keys(payments).length;
  let currPayment = 1;
  for (let payment in payments) {
    console.debug(`Submitting ${currPayment} of ${numPayments} payments.`);
    currPayment++;

    const paymentAmount = payments[payment];
    const paymentObject = JSON.parse(payment);
    await createPayment(paymentObject.source, paymentObject.destination, payoutId, paymentAmount);
    totalPaymentAmount += paymentAmount;
  }
  await updatePayoutStatus(payoutId, 'complete', totalPaymentAmount);
}

/**
 * ----------------------------------------------------------------------
 * @Public
 * ----------------------------------------------------------------------
 */

export async function getAllPayouts() {
  return await prisma.payout.findMany();
}

export function generateSummary(data: any[]): ISummaryList {
  let summary: ISummaryList = {};

  for (let row of data) {
    const dunkinId = row.Payor[0].DunkinId[0];
    const paymentAmount = parseDollarStr(row.Amount[0]);

    if (!summary.hasOwnProperty(dunkinId)) {
      summary[dunkinId] = { totalPaymentAmount: String(paymentAmount), numPayments: 1 };
    } else {
      summary[dunkinId].totalPaymentAmount = String(
        +summary[dunkinId].totalPaymentAmount + paymentAmount
      );
      summary[dunkinId].numPayments++;
    }
  }

  // convert back to string representation
  for (let value of Object.values(summary)) {
    value.totalPaymentAmount = toDollarStr(+value.totalPaymentAmount);
  }
  return summary;
}

export async function process(paymentsJson: any): Promise<void> {
  const payout = await createPayout();
  console.log(`Preparing payments for payout ${payout.id}`);

  const payments = await consolidate(paymentsJson);
  console.log(`Processing payments for payout ${payout.id}`);

  await submit(payments, payout.id).then((_) => console.log(`Payout ${payout.id} submitted`));
}
