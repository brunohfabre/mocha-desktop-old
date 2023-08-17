import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import axios, { AxiosError } from 'axios'
import { useAtom } from 'jotai'
import _ from 'lodash'

import { Button } from '@/components/Button'
import { Tabs } from '@/components/Tabs'
import { api } from '@/lib/api'
import { formatBytes } from '@/utils/formatBytes'
import { formatTime } from '@/utils/formatTime'
import { httpStatusCodes } from '@/utils/httpStatusCodes'

import { collectionAtom, collectionLoadingAtom, RequestType } from '../atoms'
import { responseAtom, responseLoadingAtom } from '../Response/atoms'
import { Auth } from './Auth'
import { Body } from './Body'
import { Headers } from './Headers'
import { Query } from './Query'

interface RequestProps {
  request: RequestType
}

export function Request({ request }: RequestProps) {
  const { requestId } = useParams<{ requestId: string }>()

  const [collection, setCollection] = useAtom(collectionAtom)
  const [, setCollectionLoading] = useAtom(collectionLoadingAtom)
  const [, setResponseLoading] = useAtom(responseLoadingAtom)
  const [, setResponse] = useAtom(responseAtom)

  const [method, setMethod] = useState('')
  const [route, setRoute] = useState('')

  useEffect(() => {
    setMethod(request.method ?? '')
    setRoute(request.route ?? '')
  }, [request])

  async function updateRequest(data: Record<string, any>) {
    try {
      setCollectionLoading(true)

      await api.put(`/requests/${requestId}`, data)
    } finally {
      setCollectionLoading(false)
    }
  }

  const debouceRequest = useCallback(_.debounce(updateRequest, 750), [])

  function handleChangeData(data: Record<string, any>) {
    setCollection((prevState) => ({
      ...prevState,
      requests: prevState.requests.map((item) =>
        item.id === requestId ? { ...item, ...data } : item,
      ),
    }))

    debouceRequest(data)
  }

  function handleSendRequest() {
    setResponseLoading(true)

    const startMillis = Date.now()

    const requestHeaders: Record<string, any> = {}

    // if (authType === 'BEARER') {
    //   requestHeaders = {
    //     Authorization: `Bearer ${auth.token}`,
    //   }
    // }
    // headers
    //   .filter((item) => item.active)
    //   .filter((item) => !!item.name)
    //   .forEach((item) => {
    //     requestHeaders[item.name] = item.value
    //   })

    if (request.bodyType === 'JSON') {
      requestHeaders['content-type'] = 'application/json'
    }

    const requestQuery: Record<string, any> = {}

    // query
    //   .filter((item) => item.active)
    //   .filter((item) => !!item.name)
    //   .forEach((item) => {
    //     requestQuery[item.name] = item.value
    //   })

    axios({
      method,
      url: route,
      headers: requestHeaders,
      params: requestQuery,
      data: request.body,
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
    <div className="flex-1 flex flex-col border-r border-red-500 overflow-auto">
      <form
        onSubmit={(event) => {
          event.preventDefault()

          handleSendRequest()
        }}
        className="flex"
      >
        <select
          value={method}
          onChange={(event) => {
            handleChangeData({
              method: event.target.value,
            })
            setMethod(event.target.value)
          }}
          className="flex px-4 h-10 bg-red-200"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Route here"
          value={route}
          onChange={(event) => {
            handleChangeData({ route: event.target.value })
            setRoute(event.target.value)
          }}
          className="flex-1 flex px-4 h-10 bg-red-200"
        />

        <Button type="submit">SEND</Button>
      </form>

      <Tabs.Root defaultValue="body">
        <Tabs.List>
          <Tabs.Item value="body">Body</Tabs.Item>
          <Tabs.Item value="auth">Auth</Tabs.Item>
          <Tabs.Item value="headers">Headers</Tabs.Item>
          <Tabs.Item value="query">Query</Tabs.Item>
        </Tabs.List>

        <Body request={request} onChangeData={handleChangeData} />
        <Auth request={request} onChangeData={handleChangeData} />
        {/* <Headers request={request} onChangeData={handleChangeData} /> */}
        {/*  <Query /> */}
      </Tabs.Root>
    </div>
  )
}
