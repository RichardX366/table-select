// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../helpers/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await prisma.user.update({
    where: { id: req.body.id },
    data: {
      table: req.body.table ? { connect: { id: req.body.table } } : undefined,
      role: req.body.role,
    },
  });
  res.send('');
}
