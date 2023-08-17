import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { Tabs } from '@/components/Tabs'
import { CaretDown } from '@phosphor-icons/react'

import { RequestType } from '../atoms'

interface AuthProps {
  request: RequestType
  onChangeData: (data: Record<string, any>) => void
}

export function Auth({ request, onChangeData }: AuthProps) {
  const [authType, setAuthType] = useState('')
  const [auth, setAuth] = useState<Record<string, string>>({})

  useEffect(() => {
    setAuthType(request.authType ?? 'NONE')
    setAuth(request.auth ?? {})
  }, [request])

  return (
    <Tabs.Content value="auth">
      <div className="flex-1 flex flex-col relative">
        {authType === 'BASIC' && (
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm">
                Username
              </label>

              <input
                type="text"
                id="username"
                placeholder="Username"
                className="bg-red-200 h-10 px-4 text-sm"
                value={auth.username}
                onChange={(event) => {
                  onChangeData({
                    auth: {
                      ...auth,
                      username: event.target.value,
                    },
                  })

                  setAuth({
                    ...auth,
                    username: event.target.value,
                  })
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm">
                Password
              </label>

              <input
                type="text"
                id="password"
                placeholder="Password"
                className="bg-red-200 h-10 px-4 text-sm"
                value={auth.password}
                onChange={(event) => {
                  onChangeData({
                    auth: {
                      ...auth,
                      password: event.target.value,
                    },
                  })

                  setAuth({
                    ...auth,
                    password: event.target.value,
                  })
                }}
              />
            </div>
          </div>
        )}

        {authType === 'BEARER' && (
          <div className="p-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="token" className="text-sm">
                Token
              </label>

              <input
                type="text"
                id="token"
                placeholder="Token"
                className="bg-red-200 h-10 px-4 text-sm"
                value={auth.token}
                onChange={(event) => {
                  onChangeData({
                    auth: {
                      token: event.target.value,
                    },
                  })

                  setAuth({
                    token: event.target.value,
                  })
                }}
              />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-[30px]">
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button type="button">
                {authType} <CaretDown className="ml-2" />
              </Button>
            </Dropdown.Trigger>

            <Dropdown.Content align="end">
              <Dropdown.Item
                onClick={() => {
                  onChangeData({
                    authType: 'NONE',
                    auth: {},
                  })

                  setAuthType('NONE')
                }}
              >
                NONE
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => {
                  onChangeData({
                    authType: 'BASIC',
                    auth: {},
                  })

                  setAuthType('BASIC')
                }}
              >
                BASIC
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => {
                  onChangeData({
                    authType: 'BEARER',
                    auth: {},
                  })

                  setAuthType('BEARER')
                }}
              >
                BEARER
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </div>
    </Tabs.Content>
  )
}
