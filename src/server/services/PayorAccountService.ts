import { prisma, method, throttle } from '../config';
import { fetchCorpEntity } from './CorporationService';

// ----------------------------------------------------------------------

async function getPayorAccount(holderId: string, routingNumber: string, accountNumber: string) {
  return await prisma.payorAccount.findFirst({
    where: {
      holder_id: holderId,
      routing_number: routingNumber,
      account_number: accountNumber,
    },
  });
}

async function createPayorAccount(
  methodEntityId: string,
  holderId: string,
  routingNumber: string,
  accountNumber: string
) {
  return await prisma.payorAccount.create({
    data: {
      id: methodEntityId,
      holder_id: holderId,
      routing_number: routingNumber,
      account_number: accountNumber,
    },
  });
}

/**
 * ----------------------------------------------------------------------
 * @Public
 * ----------------------------------------------------------------------
 */

export async function fetchPayorAccount(payor: any) {
  const corpEntity = await fetchCorpEntity(payor);
  const routingNumber = payor.ABARouting[0];
  const accountNumber = payor.AccountNumber[0];

  let payorAccount: any = await getPayorAccount(corpEntity.id, routingNumber, accountNumber);
  if (!payorAccount) {
    let methodPayorAccount: any;
    await throttle(async () => {
      methodPayorAccount = await method.accounts.create({
        holder_id: corpEntity.id,
        ach: {
          routing: routingNumber,
          number: accountNumber,
          type: 'checking',
        },
      });
    });

    payorAccount = createPayorAccount(
      methodPayorAccount.id,
      corpEntity.id,
      routingNumber,
      accountNumber
    );
  }

  return payorAccount;
}
