import { GetServerSideProps, NextPage } from 'next'
import { FormEventHandler } from 'react'

const ssoURL = `${process.env.BACKEND_URL}/redirect?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { access_token, refresh_token } = ctx.req.cookies

  if (access_token && refresh_token) return {
    redirect: {
      destination: '/',
      permanent: false
    }
  }

  return {
    props: {}
  }
}

const Login: NextPage = () => {

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  return (
    <main className='h-screen bg-black text-white flex justify-center items-center'>
      <div className='w-4/12 border-2 border-white p-8'>

        <h1 className='text-2xl font-bold'>You&apos;re not Logged In</h1>

        <form onSubmit={handleSubmit} className='mt-4'>

          <div className='space-y-2 mb-4'>
            <input type='email' name='email' placeholder='Email' className='p-1 outline-none border-2 border-white/60 w-full focus:border-white bg-transparent' />
            <input type='password' name='password' placeholder='Password' className='p-1 outline-none border-2 border-white/60 w-full focus:border-white bg-transparent' />
          </div>

          <button type='submit' className='py-2 px-4 bg-green-700 hover:bg-green-800 font-bold w-full'>Login</button>
          <div className='mt-4 text-center'>
            <a className='text-sky-600 hover:underline' href={ssoURL}>SSO Kah deck?</a>
          </div>
        </form>

      </div>
    </main>
  )
}

export default Login
