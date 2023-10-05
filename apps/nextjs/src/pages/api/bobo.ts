 
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from 'zod';
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { postRouter } from "@acme/api/src/router/post";
import { PrismaClient } from "@acme/db";

const prisma = new PrismaClient()
const bobo = async (req: NextApiRequest, res: NextApiResponse) => {
    // const users = await prisma.workoutCeleb.findMany();

  try {
    const users = await prisma.workoutCeleb.findMany();
//     const input = req.body;
//     const validationResult = z.object({
//         token: z.string()
//     }).safeParse(input);

//     if (!validationResult.success) {
//         return res.status(400).json({ error: 'Invalid input' });
//     }

//     const result = await postRouter.sendNotice({
//       input: validationResult.data,
//       ctx: {}, // You can pass any context you need here
//       rawInput: validationResult.data,
//       path: 'sendNotice',
//       type: 'query'
//   });
    return res.status(200).json(users);

} catch (error:any) {
    return res.status(500).json({ error: error.message });
}
}

export default verifySignature(bobo);
export const config = {
  api: {
    bodyParser: false,
  },
};
