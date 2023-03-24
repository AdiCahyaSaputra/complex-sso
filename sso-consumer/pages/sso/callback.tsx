import { setCookie } from 'cookies-next'
import { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const error = 'Yah bang ERROR awokwowko'
  const { query } = ctx

  if (query.code && query.state) {
    return {
      redirect: {
        destination: `http://localhost:8000/callback?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&state=${query.state}&code=${query.code}`,
        permanent: false
      }
    }
  }

  if (!query.error) {
    if (query.access_token && query.refresh_token && query.expires_in) {

      setCookie('access_token', query.access_token, { req: ctx.req, res: ctx.res, maxAge: parseInt(query.expires_in.toString()), httpOnly: true })
      setCookie('refresh_token', query.refresh_token, { req: ctx.req, res: ctx.res, maxAge: 60 * 60 * 24 * 7, httpOnly: true })

      return {
        redirect: {
          destination: 'http://localhost:3000',
          permanent: false
        }
      }
    }
  }

  return {
    props: {
      error
    }
  }
}

type Props = {
  error: string
}

const Callback: NextPage<Props> = ({ error }) => {
  return (
    <main className='h-screen bg-black text-white flex justify-center items-center'>
      <div className='w-4/12'>

        <h1 className='text-2xl font-bold text-red-600 text-center'>{error}</h1>

      </div>
    </main>
  )
}

export default Callback
