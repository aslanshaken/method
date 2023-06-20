import { prisma, method, throttle } from '../config';
import { fetchIndividualEntity } from './IndividualService';
import { fetchMerchant } from './MerchantService';

// ----------------------------------------------------------------------

async function getPayeeAccount(holderId: string, merchantId: string, loanAccountNumber: string) {
  return await prisma.payeeAccount.findFirst({
    where: {
      holder_id: holderId,
      merchant_id: merchantId,
      loan_account_number: loanAccountNumber,
    },
  });
}

async function createPayeeAccount(
  methodEntityId: string,
  holderId: string,
  merchantId: string,
  loanAccountNumber: string
) {
  return await prisma.payeeAccount.create({
    data: {
      id: methodEntityId,
      holder_id: holderId,
      merchant_id: merchantId,
      loan_account_number: loanAccountNumber,
    },
  });
}

/**
* ----------------------------------------------------------------------
* @Public
* ----------------------------------------------------------------------
*/

export async function fetchPayeeAccount(employee: any, payee: any) {
  const individualEntity = await fetchIndividualEntity(employee);
  const merchant = await fetchMerchant(payee.PlaidId[0]);

  const loanAccountNumber = payee.LoanAccountNumber[0];
  let account = await getPayeeAccount(individualEntity.id, merchant.id, loanAccountNumber);

  if (!account) {
    let methodPayeeAccount: any;
    await throttle(async () => {
      methodPayeeAccount = await method.accounts.create({
        holder_id: individualEntity.id,
        liability: {
          mch_id: merchant.id,
          account_number: loanAccountNumber,
        },
      });
    });
    account = await createPayeeAccount(
      methodPayeeAccount.id,
      individualEntity.id,
      merchant.id,
      loanAccountNumber
    );
  }

  return account;
}
