import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import LogoLight from '../assets/logo-light.svg'
import { Button } from '../components/Button'
import { LinkButton } from '../components/LinkButton'
import { PasswordInput } from '../components/PasswordInput'
import { TextInput } from '../components/TextInput'
import { api } from '../lib/api'
import { useAuthStore } from '../stores/authStore'

const signInFormSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6).nonempty(),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export function SignIn() {
  const navigate = useNavigate()

  const setCredentials = useAuthStore((state) => state.setCredentials)

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
  })
  const { handleSubmit } = signInForm

  const [loading, setLoading] = useState(false)

  async function signIn(data: SignInFormData) {
    try {
      setLoading(true)

      const { email, password } = data

      const response = await api.post('/sessions', { email, password })

      const { token, user } = response.data

      setCredentials({ token, user })

      navigate('/', {
        replace: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      <header className="flex p-4 max-w-5xl w-full mx-auto">
        <div className="h-8 w-8 flex items-center">
          <img src={LogoLight} alt="Mocha" />
        </div>
      </header>

      <div className="max-w-xs w-full self-center flex flex-col gap-8">
        <h1 className="text-3xl font-medium text-center">Sign in</h1>

        <FormProvider {...signInForm}>
          <form onSubmit={handleSubmit(signIn)} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <TextInput name="email" label="E-mail" placeholder="E-mail" />
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Password"
              />
            </div>

            <Button isLoading={loading}>Sign in</Button>
          </form>
        </FormProvider>

        <p className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <LinkButton to="/sign-up">Sign up for free</LinkButton>
        </p>
      </div>

      <footer className="flex p-4 justify-center">
        <span className="text-xs text-zinc-500 max-w-lg text-center">
          By clicking “Continue with Github/Email” above, you acknowledge that
          you have read and understood, and agree to Mocha&apos;s{' '}
          <LinkButton to="/terms-and-conditions">Terms & Conditions</LinkButton>{' '}
          and <LinkButton to="/privacy-policy">Privacy Policy</LinkButton>.
        </span>
      </footer>
    </div>
  )
}
