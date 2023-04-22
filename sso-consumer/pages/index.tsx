import { getUser } from '@/lib/fetch'
import { refreshTokenFetcher } from '@/lib/refresh'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormEventHandler } from 'react'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { access_token, refresh_token } = ctx.req.cookies

  const user = await refreshTokenFetcher({
    token: { access_token, refresh_token },
    fetcher: async (access_token) => {
      const userResponse = await getUser(access_token)
      return userResponse
    },
    req_server: ctx.req,
    res_server: ctx.res
  })

  if (!user || !access_token) return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }

  return {
    props: {
      user,
      access_token
    }
  }
}

type Props = {
  user: any,
  access_token: string
}

const Home: NextPage<Props> = ({ user, access_token }) => {

  const router = useRouter()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    await fetch('/api/cookie/destroy', {
      method: 'POST',
      body: JSON.stringify({
        access_token
      })
    })

    router.push('/login')
  }

  return (
    <main className='h-screen bg-black text-white flex justify-center items-center'>
      <div>

        <h1 className='text-2xl font-bold'>You&apos;re Logged In</h1>
        {user.email && user.name ? (
          <>
            <ul className='my-2 py-4'>
              <li className='font-bold'>{user.name}</li>
              <li className='font-light tracking-wide'>{user.email}</li>
            </ul>
            <form onSubmit={handleSubmit}>
              <button type='submit' className='py-2 px-4 bg-red-700 hover:bg-red-800 font-bold w-full'>Logout</button>
            </form>
          </>
        ): ''}

      </div>
    </main>
  )
}

export default Home
