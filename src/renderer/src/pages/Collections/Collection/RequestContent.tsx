import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAtom } from 'jotai'

import { collectionAtom, RequestType } from './atoms'
import { Request } from './Request'
import { Response } from './Response'

export function RequestContent() {
  const { requestId } = useParams<{ requestId: string }>()

  const [collection] = useAtom(collectionAtom)

  const [request, setRequest] = useState<RequestType | null>(null)

  useEffect(() => {
    const findRequest = collection.requests?.find(
      (item) => item.id === requestId,
    )

    if (findRequest) {
      setRequest(findRequest)
    }
  }, [requestId, collection])

  if (!request) {
    return <div>no request</div>
  }

  return (
    <div className="flex-1 flex">
      <Request request={request} />

      <Response />
    </div>
  )
}
