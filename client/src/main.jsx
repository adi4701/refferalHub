import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, toast } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      }
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#0a0a0a',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '6px',
            background: '#fff',
            color: '#0a0a0a',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
