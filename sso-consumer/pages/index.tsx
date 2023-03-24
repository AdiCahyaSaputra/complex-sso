import { getUser } from '@/lib/fetch'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormEventHandler } from 'react'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { access_token } = ctx.req.cookies

  const user = await getUser(access_token)

  if (!user) return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }

  return {
    props: {
      user
    }
  }
}

type Props = {
  user: any
}

const Home: NextPage<Props> = ({ user }) => {

  const router = useRouter()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    await fetch('/api/cookie/destroy')

    router.push('/login')
  }

  return (
    <main className='h-screen bg-black text-white flex justify-center items-center'>
      <div>

        <h1 className='text-2xl font-bold'>You&apos;re Logged In</h1>
        {user && (
          <>
            <ul className='my-2 py-4'>
              <li className='font-bold'>{user.name}</li>
              <li className='font-light tracking-wide'>{user.email}</li>
            </ul>
            <form onSubmit={handleSubmit}>
              <button type='submit' className='py-2 px-4 bg-red-700 hover:bg-red-800 font-bold w-full'>Logout</button>
            </form>
          </>
        )}

      </div>
    </main>
  )
}

export default Home
