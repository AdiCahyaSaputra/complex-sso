import { setCookie } from 'cookies-next'
import { IncomingMessage, ServerResponse } from 'http'

type Token = {
  access_token?: string,
  refresh_token?: string
}

type Args = {
  token: Token,
  fetcher(access_token: string): Promise<any>
  req_server: (IncomingMessage & {
    cookies?: {
      [key: string]: string
    } | Partial<{ [key: string]: string }> | undefined
  }) | undefined,
  res_server: ServerResponse<IncomingMessage> | undefined
}

/**
  * Refresh the token if current access_token is expired
  * then retried to fetching data
**/
export const refreshTokenFetcher = async ({ token, fetcher, req_server, res_server }: Args) => {
  if(!token.access_token || !token.refresh_token) return []

  const data = await fetcher(token.access_token)

  if (data.status === 401) {
    const req = await fetch(process.env.BACKEND_URL + '/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: '',
        refresh_token: token.refresh_token,
        grant_type: 'refresh_token',
        scope: ''
      })
    })

    const res = await req.json()

    if (req.ok) {

      setCookie('access_token', res.access_token, { req: req_server, res: res_server, maxAge: parseInt(res.expires_in.toString()), httpOnly: true })
      setCookie('refresh_token', res.refresh_token, { req: req_server, res: res_server, maxAge: 60 * 60 * 24 * 7, httpOnly: true })

      const data = await fetcher(res.access_token)

      return data
    }

    return {
      status: req.status,
      ...res
    }
  }

  return data
}
