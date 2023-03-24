import { deleteCookie } from 'cookies-next'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  deleteCookie('access_token', {
    req, res
  })
  deleteCookie('refresh_token', {
    req, res
  })

  return res.status(200).end()
}
