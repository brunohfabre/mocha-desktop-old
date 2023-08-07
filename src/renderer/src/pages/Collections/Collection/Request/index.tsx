import { useCallback, useEffect, useRef } from 'react'

import axios, { AxiosError } from 'axios'
import { useAtom } from 'jotai'
import _ from 'lodash'

import { formatBytes } from '@/utils/formatBytes'
import { formatTime } from '@/utils/formatTime'
import { httpStatusCodes } from '@/utils/httpStatusCodes'

import { Button } from '../../../../components/Button'
import { Tabs } from '../../../../components/Tabs'
import { api } from '../../../../lib/api'
import { collectionAtom, collectionLoadingAtom } from '../atoms'
import { responseAtom, responseLoadingAtom } from '../Response/atoms'
import { requestSelectedAtom } from './atoms'
import { Auth } from './Auth'
import { Body } from './Body'
import { Headers } from './Headers'
import { Query } from './Query'

export function Request() {
  const methodRef = useRef<HTMLSelectElement>(null)
  const routeRef = useRef<HTMLInputElement>(null)

  const [collection, setCollection] = useAtom(collectionAtom)
  const [requestSelected] = useAtom(requestSelectedAtom)
  const [, setCollectionLoading] = useAtom(collectionLoadingAtom)
  const [, setResponseLoading] = useAtom(responseLoadingAtom)
  const [, setResponse] = useAtom(responseAtom)

  useEffect(() => {
    if (methodRef.current && routeRef.current) {
      methodRef.current.value = requestSelected?.method ?? 'GET'
      routeRef.current.value = requestSelected?.route ?? ''
    }
  }, [requestSelected])

  async function updateRequest(data: { [key: string]: any }) {
    try {
      setCollectionLoading(true)

      await api.put(`/requests/${requestSelected?.id}`, data)
    } finally {
      setCollectionLoading(false)
    }
  }

  const debounceMethod = useCallback(_.debounce(updateRequest, 750), [
    requestSelected,
  ])
  const debounceRoute = useCallback(_.debounce(updateRequest, 750), [
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

  // useEffect(() => {
  //   if (requestSelected) {
  //     reset(requestSelected)
  //   }
  // }, [reset, requestSelected])

  // useEffect(() => {
  //   const subscription = watch((data: any) => {
  //     debounceRequest(data)

  //     queryClient.setQueryData(
  //       ['collections', collectionId],
  //       (prevState: any) => ({
  //         ...prevState,
  //         requests: prevState.requests.map((request: RequestType) =>
  //           request.id === data.id ? data : request,
  //         ),
  //       }),
  //     )
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [watch, debounceRequest, collectionId, queryClient])

  // async function sendRequest(data: RequestFormData) {
  //   try {
  //     setResponseLoading(true)
  //     const startMillis = Date.now()

  //     const { method, route, body, headers, query } = data

  //     await axios({
  //       method,
  //       url: route,
  //       data: body,
  //       headers: headers?.reduce(
  //         (acc, item) => ({ ...acc, [item.name]: item.value }),
  //         {},
  //       ),
  //       params: query?.reduce(
  //         (acc, item) => ({ ...acc, [item.name]: item.value }),
  //         {},
  //       ),
  //       withCredentials: true,
  //     })
  //       .then((response) => {
  //         const responseTime = Date.now() - startMillis

  //         setResponseData({
  //           response,
  //           time: responseTime,
  //         })
  //       })
  //       .catch((err) => {
  //         const responseTime = Date.now() - startMillis

  //         setResponseData({
  //           response: err.response,
  //           time: responseTime,
  //         })
  //       })
  //   } finally {
  //     setResponseLoading(false)
  //   }
  // }

  async function handleSend() {
    const requestToSend = collection.requests.find(
      (item) => item.id === requestSelected?.id,
    )

    if (!requestToSend) {
      return
    }

    const startMillis = Date.now()

    setResponseLoading(true)

    console.log(requestToSend)

    axios({
      method: requestToSend.method,
      url: requestToSend.route,
      headers: {
        Authorization:
          requestToSend.authType === 'BEARER'
            ? `Bearer ${requestToSend.auth?.token}`
            : '',
      },
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
        setResponseLoading(false)
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const time = formatTime(Date.now() - startMillis)
          const status = error.response
            ? `${error.response.status} ${
                httpStatusCodes[error.response.status]
              }`
            : 'Error'
          const size = '0 B'

          setResponse({
            response: error,
            time,
            status,
            size,
            code: String(error.response?.status ?? 0),
          })
          setResponseLoading(false)
        }
      })
  }

  return (
    <div className="flex-1 flex flex-col border-r border-red-500 overflow-auto">
      <header className="flex">
        <select
          ref={methodRef}
          className="bg-red-200 h-10 px-4 text-sm"
          onChange={(event) => {
            updateLocal({ method: event.target.value })
            debounceMethod({ method: event.target.value })
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          ref={routeRef}
          type="text"
          className="bg-red-200 h-10 px-4 text-sm flex-1"
          placeholder="https://my-api.com/v1/users"
          onChange={(event) => {
            updateLocal({ route: event.target.value })
            debounceRoute({ route: event.target.value })
          }}
        />

        <Button type="button" onClick={handleSend}>
          SEND
        </Button>
      </header>

      <Tabs.Root defaultValue="body">
        <Tabs.List>
          <Tabs.Item value="body">Body</Tabs.Item>
          <Tabs.Item value="auth">Auth</Tabs.Item>
          <Tabs.Item value="headers">Headers</Tabs.Item>
          <Tabs.Item value="query">Query</Tabs.Item>
        </Tabs.List>

        {/* <Body /> */}
        <Auth />
        {/* <Headers />
        <Query /> */}
      </Tabs.Root>
    </div>
  )
}
