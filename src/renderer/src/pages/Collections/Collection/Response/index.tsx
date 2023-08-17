import clsx from 'clsx'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'

import { Tabs } from '@/components/Tabs'

import { responseAtom, responseLoadingAtom } from './atoms'

export function Response() {
  const [responseLoading] = useAtom(responseLoadingAtom)
  const [response] = useAtom(responseAtom)

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      {responseLoading && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </div>
      )}

      {!response && (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm">To view response, send a request.</span>
        </div>
      )}

      {!!response && (
        <>
          <header className="h-10 flex bg-orange-100 items-center px-4 gap-4">
            <span
              className={clsx(
                'text-sm px-2 py-1 font-semibold',
                response.code[0] === '1' && 'bg-blue-400',
                response.code[0] === '2' && 'bg-green-400',
                response.code[0] === '3' && 'bg-violet-400',
                response.code[0] === '4' && 'bg-amber-400',
                (response.code[0] === '5' || response.code === '0') &&
                  'bg-red-400',
              )}
            >
              {response.code} {response.status}
            </span>
            <span className="text-sm">{response.time}</span>
            <span className="text-sm">{response.size}</span>
          </header>

          <Tabs.Root defaultValue="preview">
            <Tabs.List>
              <Tabs.Item value="preview">Preview</Tabs.Item>
              <Tabs.Item value="headers">Headers</Tabs.Item>
              <Tabs.Item value="cookies">Cookies</Tabs.Item>
            </Tabs.List>

            <Tabs.Content value="preview">
              <code className="flex-1 flex overflow-auto">
                <pre>{JSON.stringify(response.response?.data, null, 2)}</pre>
              </code>
            </Tabs.Content>

            <Tabs.Content value="headers">
              <p>HEADERS</p>
            </Tabs.Content>

            <Tabs.Content value="cookies">
              <p>COOKIES</p>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}
    </div>
  )
}
