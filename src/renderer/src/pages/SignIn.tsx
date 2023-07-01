import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import GitHubMark from '../assets/github-mark.svg'
import LogoLight from '../assets/logo-light.svg'
import { Button } from '../components/Button'
import { LinkButton } from '../components/LinkButton'
import { PasswordInput } from '../components/PasswordInput'
import { TextInput } from '../components/TextInput'
import { api } from '../lib/api'
import { OrganizationType } from '../services/organizations/types'
import { useAuthStore } from '../stores/authStore'
import { useOrganizationStore } from '../stores/organizationStore'

const signInFormSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6).nonempty(),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export function SignIn() {
  const navigate = useNavigate()

  const setCredentials = useAuthStore((state) => state.setCredentials)
  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

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

      const { token, user, organizations } = response.data

      setCredentials({ token, user })

      const findOrganization = organizations.find(
        (organization: OrganizationType) => organization.type === 'PERSONAL',
      )

      if (findOrganization) {
        selectOrganization(findOrganization)
      }

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

        <Button className="gap-2" disabled>
          <img
            src={GitHubMark}
            alt="GitHub mark"
            className="h-[18px] w-[18px]"
          />
          Continue with GitHub
        </Button>

        <div className="flex justify-center">
          <span className="text-sm text-zinc-500">or</span>
        </div>

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
          <a
            className="text-emerald-400 cursor-pointer hover:text-emerald-500"
            onClick={() =>
              window.api.openInBrowser({
                url: 'https://mocha.coddee.com.br/terms-and-conditions',
              })
            }
          >
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a
            className="text-emerald-400 cursor-pointer hover:text-emerald-500"
            onClick={() =>
              window.api.openInBrowser({
                url: 'https://mocha.coddee.com.br/privacy-policy',
              })
            }
          >
            Privacy Policy
          </a>
          .
        </span>
      </footer>
    </div>
  )
}
