import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from './state'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    await redis.lPush('start', '1')
    res.status(200).json({})
}
