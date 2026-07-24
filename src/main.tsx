import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ExecuteCodeProvider } from './context/execute-code/ExecuteCodeContext'
import { FetchLanguagesProvider } from './context/fetch-languages/FetchLanguagesContext'
import { FetchCodeSnippetsProvider } from './context/fetch-code-snippets/FetchCodeSnippetsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FetchLanguagesProvider>
      <FetchCodeSnippetsProvider>
        <ExecuteCodeProvider>
          <App />
        </ExecuteCodeProvider>
      </FetchCodeSnippetsProvider>
    </FetchLanguagesProvider>
  </StrictMode>,
)
