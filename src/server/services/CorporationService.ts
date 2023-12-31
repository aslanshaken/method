import { prisma, method, throttle } from '../config';

// ----------------------------------------------------------------------

async function getCorporation(dunkinId: string) {
  return await prisma.corporation.findUnique({
    where: {
      corp_id: dunkinId,
    },
  });
}

async function createCorporation(methodEntityId: string, dunkinId: string) {
  return await prisma.corporation.create({
    data: {
      id: methodEntityId,
      corp_id: dunkinId,
    },
  });
}

/**
* ----------------------------------------------------------------------
* @Public
* ----------------------------------------------------------------------
*/

export async function fetchCorpEntity(payor: any) {
  const payorId = payor.DunkinId[0];
  let corpEntity = await getCorporation(payorId);
  if (!corpEntity) {
    const address = payor.Address[0];
    let methodEntity: any;
    await throttle(async () => {
      methodEntity = await method.entities.create({
        type: 'c_corporation',
        corporation: {
          name: payor.Name[0],
          dba: payor.DBA[0],
          ein: payor.EIN[0],
        },
        address: {
          line1: address.Line1[0],
          line2: null,
          city: address.City[0],
          state: address.State[0],
          zip: '50613', //hard-code zip code because 67485 is an invalid IA code
        },
      });
    });

    corpEntity = await createCorporation(methodEntity.id, payorId);
  }

  return corpEntity;
}
