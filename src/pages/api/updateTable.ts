// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../helpers/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await prisma.table.update({
    where: { id: req.body.id },
    data: {
      disabled: req.body.disabled,
      users: req.body.disabled
        ? {
            set: [],
          }
        : undefined,
    },
  });
  res.send('');
}
