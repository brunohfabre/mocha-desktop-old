import { cloneElement, useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import axios, { AxiosError } from 'axios'
import { useAtom } from 'jotai'
import _ from 'lodash'

import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Tabs } from '@/components/Tabs'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/api'
import { formatBytes } from '@/utils/formatBytes'
import { formatTime } from '@/utils/formatTime'
import { httpStatusCodes } from '@/utils/httpStatusCodes'

import { collectionAtom, collectionLoadingAtom } from '../atoms'
import { responseAtom, responseLoadingAtom } from '../Response/atoms'
import { Auth } from './Auth'
import { Body } from './Body'
import { Headers } from './Headers'
import { Query } from './Query'

type RequestFormData = {
  method: string
  route: string

  bodyType: string
  body: string

  authType: string
  auth: Record<string, any>

  headers: { active: boolean; name: string; value: string }[]

  query: { active: boolean; name: string; value: string }[]
}

export function Request() {
  const { requestId } = useParams<{ requestId: string }>()

  const requestForm = useForm<RequestFormData>()
  const { reset, watch, handleSubmit } = requestForm

  const [collection, setCollection] = useAtom(collectionAtom)
  const [, setCollectionLoading] = useAtom(collectionLoadingAtom)
  const [, setResponseLoading] = useAtom(responseLoadingAtom)
  const [, setResponse] = useAtom(responseAtom)

  const [lastRequestId, setLastRequestId] = useState('')

  useEffect(() => {
    if (requestId !== lastRequestId) {
      const findRequest = collection.requests?.find(
        (item) => item.id === requestId,
      )

      setLastRequestId(requestId)
      reset(findRequest)
    }
  }, [reset, lastRequestId, requestId, collection.requests])

  async function updateRequest(data: Record<string, any>) {
    try {
      setCollectionLoading(true)

      await api.put(`/requests/${data.id}`, data)
    } finally {
      setCollectionLoading(false)
    }
  }

  const debouceRequest = useCallback(_.debounce(updateRequest, 750), [])

  const handleChangeData = useCallback(
    (data: Record<string, any>) => {
      console.log({ requestId, data })

      setCollection((prevState) => ({
        ...prevState,
        requests: prevState.requests.map((item) =>
          item.id === requestId ? { ...item, ...data } : item,
        ),
      }))

      debouceRequest(data)
    },
    [debouceRequest, requestId, setCollection],
  )

  useEffect(() => {
    const subscription = watch((value) => {
      if (requestId === lastRequestId) {
        handleChangeData(value)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [watch, handleChangeData, requestId, lastRequestId])

  function sendRequest(data: RequestFormData) {
    const { method, route, bodyType, body, authType, auth, headers, query } =
      data

    setResponseLoading(true)

    const startMillis = Date.now()

    const requestHeaders: Record<string, any> = {}

    if (authType === 'BEARER') {
      requestHeaders.Authorization = `Bearer ${auth?.token}`
    }
    headers
      .filter((item) => item.active)
      .filter((item) => !!item.name)
      .forEach((item) => {
        requestHeaders[item.name] = item.value
      })

    if (bodyType === 'JSON') {
      requestHeaders['content-type'] = 'application/json'
    }

    const requestQuery: Record<string, any> = {}

    query
      .filter((item) => item.active)
      .filter((item) => !!item.name)
      .forEach((item) => {
        requestQuery[item.name] = item.value
      })

    axios({
      method,
      url: route,
      headers: requestHeaders,
      params: requestQuery,
      data: body,
    })
      .then((response) => {
        const time = formatTime(Date.now() - startMillis)
        const status = httpStatusCodes[response.status]
        const size = formatBytes(
          encodeURI(JSON.stringify(response?.data)).split(/%..|./).length - 1,
        )

        setResponse({
          response,
          time,
          status,
          size,
          code: String(response.status),
        })
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const time = formatTime(Date.now() - startMillis)
          const status = httpStatusCodes[error.response?.status ?? 'error']
          const size = formatBytes(
            encodeURI(JSON.stringify(error.response?.data)).split(/%..|./)
              .length - 1,
          )

          setResponse({
            response: error.response as any,
            time,
            status,
            size,
            code: String(error.response?.status),
          })
        }
      })
      .finally(() => {
        setResponseLoading(false)
      })
  }

  return (
    <FormProvider {...requestForm}>
      <form
        onSubmit={handleSubmit(sendRequest)}
        className="flex-1 flex flex-col border-r border-red-500 overflow-auto"
      >
        <div className="flex">
          <Select
            name="method"
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'DELETE', label: 'DELETE' },
            ]}
          />

          <div className="flex-1">
            <TextInput name="route" placeholder="Route" />
          </div>

          <Button type="submit">SEND</Button>
        </div>

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
