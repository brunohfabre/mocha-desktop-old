import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { CaretLeft } from '@phosphor-icons/react'

import { Button } from '../components/Button'
import { IconButton } from '../components/IconButton'
import { LinkButton } from '../components/LinkButton'
import { MaskInput } from '../components/MaskInput'
import { PasswordInput } from '../components/PasswordInput'
import { TextInput } from '../components/TextInput'
import { api } from '../lib/api'

const signUpFormSchema = z
  .object({
    name: z
      .string()
      .nonempty()
      .transform((name) => {
        return name
          .trim()
          .split(' ')
          .map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1))
          })
          .join(' ')
      }),
    email: z.string().email().nonempty(),
    phone: z.string().nonempty(),
    password: z.string().min(6).nonempty(),
    confirmPassword: z.string().min(6).nonempty(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
  })
  const { handleSubmit } = signUpForm

  const [loading, setLoading] = useState(false)

  async function signUp(data: SignUpFormData) {
    try {
      setLoading(true)

      const { name, email, phone, password, confirmPassword } = data

      await api.post('/users', {
        name,
        email,
        phone,
        password,
        confirmPassword,
      })

      // const { token, user, organizations } = response.data

      // setCredentials({
      //   token,
      //   user,
      // })

      // const findOrganization = organizations.find(
      //   (organization: OrganizationType) => organization.type === 'PERSONAL',
      // )

      // if (findOrganization) {
      //   selectOrganization(findOrganization)
      // }

      navigate('/code-verification', {
        state: {
          email,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      <header className="flex p-4 max-w-5xl w-full mx-auto">
        <IconButton type="button" size="sm" onClick={() => navigate(-1)}>
          <CaretLeft size={14} weight="bold" />
        </IconButton>
      </header>

      <div className="flex flex-col max-w-xs w-full self-center gap-8">
        <h1 className="text-3xl font-medium text-center">Sign up</h1>

        <FormProvider {...signUpForm}>
          <form
            className="flex-1 flex flex-col gap-8"
            onSubmit={handleSubmit(signUp)}
          >
            <div className="flex flex-col gap-2">
              <TextInput name="name" label="Name" placeholder="Name" />
              <TextInput name="email" label="E-mail" placeholder="E-mail" />
              <MaskInput
                name="phone"
                label="Phone"
                placeholder="Phone"
                mask="phone"
              />
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Password"
              />
              <PasswordInput
                name="confirmPassword"
                label="Confirm password"
                placeholder="Confirm password"
              />
            </div>

            <Button isLoading={loading}>Sign up</Button>
          </form>
        </FormProvider>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <LinkButton to="/sign-in">Sign in</LinkButton>
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
