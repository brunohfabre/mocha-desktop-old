import { useCallback, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import axios from 'axios'
import _ from 'lodash'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../../../../components/Button'
import { Select } from '../../../../components/Select'
import { Tabs } from '../../../../components/Tabs'
import { TextInput } from '../../../../components/TextInput'
import { useRequestStore } from '../stores/requestStore'
import { useResponseStore } from '../stores/responseStore'
import { Auth } from './Auth'
import { Body } from './Body'
import { Headers } from './Headers'
import { Query } from './Query'

import { RequestType } from '..'

const requestFormSchema = z.object({
  method: z.string().nonempty(),
  route: z.string().optional(),
  body: z.string().nullable(),
  headers: z
    .array(
      z.object({
        name: z.string().nonempty(),
        value: z.string().nonempty(),
      }),
    )
    .optional(),
  query: z
    .array(
      z.object({
        name: z.string().nonempty(),
        value: z.string().nonempty(),
      }),
    )
    .optional(),
})

type RequestFormData = z.infer<typeof requestFormSchema>

interface RequestProps {
  updateRequest: (data: RequestType) => void
}

export function Request({ updateRequest }: RequestProps) {
  const requestSelected = useRequestStore((state) => state.request)
  const setResponseLoading = useResponseStore(
    (state) => state.setResponseLoading,
  )
  const setResponseData = useResponseStore((state) => state.setResponseData)

  const collectionForm = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
  })
  const { handleSubmit, reset, watch } = collectionForm

  useEffect(() => {
    if (requestSelected) {
      reset(requestSelected)
    }
  }, [reset, requestSelected])

  const debounceRequest = useCallback(
    _.debounce((nextValue) => updateRequest(nextValue), 750),
    [requestSelected],
  )

  useEffect(() => {
    const subscription = watch((data) => {
      debounceRequest(data)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch, debounceRequest])

  async function sendRequest(data: RequestFormData) {
    try {
      setResponseLoading(true)
      const startMillis = Date.now()

      const { method, route, body, headers, query } = data

      await axios({
        method,
        url: route,
        data: body,
        headers: headers?.reduce(
          (acc, item) => ({ ...acc, [item.name]: item.value }),
          {},
        ),
        params: query?.reduce(
          (acc, item) => ({ ...acc, [item.name]: item.value }),
          {},
        ),
        withCredentials: true,
      })
        .then((response) => {
          const responseTime = Date.now() - startMillis

          setResponseData({
            response,
            time: responseTime,
          })
        })
        .catch((err) => {
          const responseTime = Date.now() - startMillis

          setResponseData({
            response: err.response,
            time: responseTime,
          })
        })
    } finally {
      setResponseLoading(false)
    }
  }

  return (
    <FormProvider {...collectionForm}>
      <form
        className="flex-1 flex flex-col border-r border-red-500 overflow-auto"
        onSubmit={handleSubmit(sendRequest)}
      >
        <header className="flex">
          <Select
            name="method"
            options={[
              { value: 'GET', label: 'GET' },
              {
                value: 'POST',
                label: 'POST',
              },
              {
                value: 'PUT',
                label: 'PUT',
              },
              {
                value: 'PATCH',
                label: 'PATCH',
              },
              {
                value: 'DELETE',
                label: 'DELETE',
              },
            ]}
          />

          <div className="flex-1">
            <TextInput name="route" placeholder="Route" />
          </div>

          <Button>SEND</Button>
        </header>

        <Tabs.Root defaultValue="body">
          <Tabs.List>
            <Tabs.Item value="body">Body</Tabs.Item>
            <Tabs.Item value="auth">Auth</Tabs.Item>
            <Tabs.Item value="headers">Headers</Tabs.Item>
            <Tabs.Item value="query">Query</Tabs.Item>
          </Tabs.List>

          <Body />
          <Auth />
          <Headers />
          <Query />
        </Tabs.Root>
      </form>
    </FormProvider>
  )
}
