import { useCallback, useRef, useState } from 'react'

import { useAtom } from 'jotai'
import _ from 'lodash'

import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { Tabs } from '@/components/Tabs'
import { api } from '@/lib/api'
import { CaretDown } from '@phosphor-icons/react'

import { collectionAtom, collectionLoadingAtom } from '../atoms'
import { requestSelectedAtom } from './atoms'

export function Auth() {
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const tokenInputRef = useRef<HTMLInputElement>(null)

  const [requestSelected] = useAtom(requestSelectedAtom)
  const [, setCollection] = useAtom(collectionAtom)
  const [, setCollectionLoading] = useAtom(collectionLoadingAtom)

  const [authType, setAuthType] = useState(requestSelected?.authType)

  async function updateRequest(data: { [key: string]: any }) {
    try {
      setCollectionLoading(true)

      await api.put(`/requests/${requestSelected?.id}`, data)
    } finally {
      setCollectionLoading(false)
    }
  }

  const debounceAuthType = useCallback(_.debounce(updateRequest, 750), [
    requestSelected,
  ])
  const debounceAuth = useCallback(_.debounce(updateRequest, 750), [
    requestSelected,
  ])

  function updateLocal(data: { [key: string]: any }) {
    setCollection((prevState) => ({
      ...prevState,
      requests: prevState.requests.map((item) =>
        item.id === requestSelected?.id ? { ...item, ...data } : item,
      ),
    }))
  }

  return (
    <Tabs.Content value="auth">
      <div className="flex-1 flex flex-col relative">
        {authType === 'BASIC' && (
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm">
                Username
              </label>
              <input
                ref={usernameInputRef}
                type="text"
                id="username"
                className="bg-red-200 h-10 px-4 text-sm"
                placeholder="Username"
                defaultValue={requestSelected?.auth?.username}
                onChange={(event) => {
                  const value = {
                    auth: {
                      token: '',
                      username: event.target.value,
                    },
                  }

                  updateLocal(value)
                  debounceAuth(value)
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                ref={passwordInputRef}
                type="text"
                id="password"
                className="bg-red-200 h-10 px-4 text-sm"
                placeholder="Password"
                defaultValue={requestSelected?.auth?.password}
                onChange={(event) => {
                  const value = {
                    auth: {
                      token: '',
                      password: event.target.value,
                    },
                  }

                  updateLocal(value)
                  debounceAuth(value)
                }}
              />
            </div>
          </div>
        )}

        {authType === 'BEARER' && (
          <div className="p-4">
            <div className="flex flex-col">
              <label htmlFor="token" className="text-sm">
                Token
              </label>
              <input
                ref={tokenInputRef}
                type="text"
                id="token"
                className="bg-red-200 h-10 px-4 text-sm"
                placeholder="Token"
                defaultValue={requestSelected?.auth?.token}
                onChange={(event) => {
                  console.log(event.target.value)

                  const value = {
                    auth: {
                      username: '',
                      password: '',
                      token: event.target.value,
                    },
                  }

                  updateLocal(value)
                  debounceAuth(value)
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
                  setAuthType('NONE')

                  const value = {
                    authType: 'NONE',
                    auth: {},
                  }
                  updateLocal(value)
                  debounceAuthType(value)
                }}
              >
                NONE
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => {
                  setAuthType('BASIC')
                  const value = {
                    authType: 'BASIC',
                    auth: {},
                  }
                  updateLocal(value)
                  debounceAuthType(value)
                }}
              >
                BASIC
              </Dropdown.Item>

              <Dropdown.Item
                onClick={() => {
                  setAuthType('BEARER')
                  const value = {
                    authType: 'BEARER',
                    auth: {},
                  }
                  updateLocal(value)
                  debounceAuthType(value)
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
