import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './App/Routes.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120000,   //  Data is fresh for 2 minutes
      cacheTime: 300000,  // Unused data is removed after 5 minutes
      retry: 1,  // Retry failed requests once before showing an error
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </QueryClientProvider>
  )
}

export default App
