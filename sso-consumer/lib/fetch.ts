export const getUser = async (access_token?: string) => {
  if(!access_token) return null

  const req = await fetch(`${process.env.BACKEND_URL}/api/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${access_token}`
    },
  })

  const res = await req.json()

  return res
}
