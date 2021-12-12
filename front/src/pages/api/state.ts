// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from 'redis'
import * as _ from 'lodash'

const REDIS_NAME = process.env.REDIS_NAME
const redis = createClient({ url: `redis://${REDIS_NAME}:6379` })

console.log(REDIS_NAME)
;(async () => {
    redis.on('error', (err) => console.log('Redis Client Error', err))
    await redis.connect()
})()

declare global {
    interface State {
        factory?: any
        stock?: any
        robots?: any
        historic?: any
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const keys = await redis.keys('*')
    const values = await redis.mGet(keys)
    const data: State = {}

    for (let i = 0; i < keys.length; i++) {
        _.set(data, keys[i].replace(/:/g, '.'), values[i])
    }
    res.status(200).json(data)
}

export { redis }
