import { prisma, method, throttle } from '../config';

// ----------------------------------------------------------------------

async function getMerchant(plaidId: string) {
  return await prisma.merchant.findFirst({
    where: {
      plaid_id: plaidId,
    },
  });
}

async function createMerchant(merchantId: string, plaidId: string) {
  return await prisma.merchant.create({
    data: {
      id: merchantId,
      plaid_id: plaidId,
    },
  });
}

/**
 * ----------------------------------------------------------------------
 * @Public
 * ----------------------------------------------------------------------
 */

export async function fetchMerchant(plaidId: string) {
  let merchant = await getMerchant(plaidId);
  if (!merchant) {
    let methodMerchant: any;
    await throttle(async () => {
      methodMerchant = await method.merchants.list({
        'provider_id.plaid': plaidId,
      });
    });

    merchant = await createMerchant(methodMerchant[0].mch_id, plaidId);
  }

  return merchant;
}
