// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../helpers/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.json(await prisma.user.findMany());
}
