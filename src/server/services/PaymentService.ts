import { prisma, method, throttle } from '../config';

// ----------------------------------------------------------------------

export async function createPayment(
  payorId: string,
  payeeId: string,
  payoutId: number,
  paymentAmount: number
) {
  try {
    let methodPayment: any;
    await throttle(async () => {
      methodPayment = await method.payments.create({
        source: payorId,
        destination: payeeId,
        amount: paymentAmount,
        description: 'DD pmnt',
      });
    });

    return await prisma.payment.create({
      data: {
        id: methodPayment.id,
        payor_id: payorId,
        payee_id: payeeId,
        payout_id: payoutId,
        amount: paymentAmount,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error(`Failed to process payment ${payorId} to ${payeeId} - ${error}`);
  }
}

export async function groupPaymentAmountsByPayor(payoutId: number) {
  return await prisma.$queryRaw`SELECT "Corporation".corp_id, SUM(amount) FROM "Payment" 
        JOIN ("PayorAccount" JOIN "Corporation" ON "PayorAccount".holder_id = "Corporation".id)
        ON "Payment".payor_id = "PayorAccount".id WHERE payout_id = ${payoutId} GROUP BY "Corporation".corp_id`;
}

export async function getPaymentsByBranch(payoutId: number) {
  return await prisma.$queryRaw`SELECT "Individual".branch_id, SUM(amount) FROM "Payment" 
        JOIN ("PayeeAccount" JOIN "Individual" ON "PayeeAccount".holder_id = "Individual".id)
        ON "Payment".payee_id = "PayeeAccount".id WHERE payout_id = ${payoutId} GROUP BY "Individual".branch_id`;
}

export async function getAllPaymentsByPayoutId(payoutId: number) {
  return await prisma.payment.findMany({
    where: {
      payout_id: payoutId,
    },
  });
}

export async function getUpdatedPayments(payoutId: number) {
  const payments = await getAllPaymentsByPayoutId(payoutId);

  for (let payment of payments) {
    try {
      let methodPayment: any;
      await throttle(async () => {
        methodPayment = await method.payments.get(payment.id);
      });
      if (methodPayment.status !== payment.status) {
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: methodPayment.status,
          },
        });
      }
    } catch (error) {
      console.error(`Unable to update payment ${payment.id}`);
    }
  }
  return getAllPaymentsByPayoutId(payoutId);
}
