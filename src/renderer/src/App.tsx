import { Toaster } from 'react-hot-toast'
import { Routes } from './Routes'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

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
      <Routes />

      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
