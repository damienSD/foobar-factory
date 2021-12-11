// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { redis } from './state'
;(async () => {
    redis.on('error', (err) => console.log('Redis Client Error', err))
    await redis.connect()
})()

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    await redis.lPush('start', '1')
    res.status(200).json({})
}
