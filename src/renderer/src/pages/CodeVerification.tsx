import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../components/Button'
import { LinkButton } from '../components/LinkButton'
import { MaskInput } from '../components/MaskInput'
import { api } from '../lib/api'
import { OrganizationType } from '../services/organizations/types'
import { useAuthStore } from '../stores/authStore'
import { useOrganizationStore } from '../stores/organizationStore'

const codeVerificationFormSchema = z.object({
  code: z.string().length(6).nonempty(),
})

type CodeVerificationFormData = z.infer<typeof codeVerificationFormSchema>

export function CodeVerification() {
  const navigate = useNavigate()
  const location = useLocation()

  const setCredentials = useAuthStore((state) => state.setCredentials)
  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

  const signUpForm = useForm<CodeVerificationFormData>({
    resolver: zodResolver(codeVerificationFormSchema),
  })
  const { handleSubmit } = signUpForm

  const [loading, setLoading] = useState(false)

  async function signUp(data: CodeVerificationFormData) {
    try {
      setLoading(true)

      const { code } = data

      const response = await api.post('/verify', {
        code,
        email: location.state.email,
      })

      const { token, user, organizations } = response.data

      setCredentials({
        token,
        user,
      })

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
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex flex-col max-w-xs w-full gap-8">
        <h1 className="text-3xl font-medium text-center">Check your email</h1>
        <span className="text-zinc-500 text-sm text-center">
          We just sent you a verification code. Please check your inbox.
        </span>

        <FormProvider {...signUpForm}>
          <form
            className="flex-1 flex flex-col gap-8"
            onSubmit={handleSubmit(signUp)}
          >
            <div className="flex flex-col gap-2">
              <MaskInput
                name="code"
                label="Code"
                placeholder="Code"
                mask="code"
              />
            </div>

            <Button isLoading={loading}>Verify</Button>
          </form>
        </FormProvider>

        <p className="text-center text-sm">
          <LinkButton to="/sign-in">Back to login</LinkButton>
        </p>
      </div>
    </div>
  )
}
