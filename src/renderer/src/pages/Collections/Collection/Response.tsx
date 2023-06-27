import clsx from 'clsx'

import Editor from '@monaco-editor/react'

import { Tabs } from '../../../components/Tabs'
import { useResponseStore } from './stores/responseStore'

const httpStatusCodes = {
  100: 'Continue',
  101: 'Switching protocols',
  102: 'Processing',
  103: 'Early Hints',

  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',

  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found (Previously "Moved Temporarily")',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Switch Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',

  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a Teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',

  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
} as { [key: string]: string }

function formatTime(milliseconds: number = 0) {
  if (milliseconds < 1000) {
    return `${milliseconds} ms`
  }

  if (milliseconds < 1000 * 60) {
    const seconds = milliseconds / 60

    return `${seconds} s`
  }

  return milliseconds
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function Response() {
  const responseData = useResponseStore((state) => state.data)

  function handleEditorDidMount(editor: any) {
    window.addEventListener('resize', () => {
      editor.layout({
        width: 'auto',
        height: 'auto',
      })
    })
  }

  const responseCode = String(responseData?.response.status)
  const responseTime = formatTime(responseData?.time)
  const responseSize = formatBytes(
    encodeURI(JSON.stringify(responseData?.response.data)).split(/%..|./)
      .length,
  )

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <header className="h-10 flex bg-orange-100 items-center px-4 gap-4">
        <span
          className={clsx(
            'text-sm px-2 py-1 font-semibold',
            responseCode[0] === '1' && 'bg-blue-400',
            responseCode[0] === '2' && 'bg-green-400',
            responseCode[0] === '3' && 'bg-violet-400',
            responseCode[0] === '4' && 'bg-amber-400',
            responseCode[0] === '5' && 'bg-red-400',
          )}
        >
          {responseCode}

          {httpStatusCodes[responseCode as string]}
        </span>
        <span className="text-sm">{responseTime}</span>
        <span className="text-sm">{responseSize}</span>
      </header>

      <Tabs.Root defaultValue="preview">
        <Tabs.List>
          <Tabs.Item value="preview">Preview</Tabs.Item>
          <Tabs.Item value="headers">Headers</Tabs.Item>
          <Tabs.Item value="cookies">Cookies</Tabs.Item>
        </Tabs.List>

        <Tabs.Content value="preview">
          <div className="flex-1 flex">
            <Editor
              defaultLanguage="json"
              defaultValue=""
              onMount={handleEditorDidMount}
              value={JSON.stringify(responseData?.response.data, null, 2)}
              options={{
                readOnly: true,

                detectIndentation: false,
                tabSize: 2,
                scrollBeyondLastLine: false,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="headers">
          <p>
            HEADERS - Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Nesciunt sequi quas, inventore earum et accusamus quibusdam iste
            odit quae porro, consectetur minima saepe nihil accusantium
            necessitatibus voluptate maiores quidem rem!
          </p>
        </Tabs.Content>

        <Tabs.Content value="cookies">
          <p>
            COOKIES - Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Nesciunt sequi quas, inventore earum et accusamus quibusdam iste
            odit quae porro, consectetur minima saepe nihil accusantium
            necessitatibus voluptate maiores quidem rem!
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
