import { Toaster } from 'react-hot-toast'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { Routes } from './Routes'

import './styles/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen min-w-screen flex flex-col">
        {window.api.platform === 'darwin' && (
          <div className="h-8 region-drag flex items-center justify-center">
            <span className="text-xs font-medium text-zinc-800">Mocha</span>
          </div>
        )}

        <Routes />
      </div>

      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
