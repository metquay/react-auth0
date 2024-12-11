import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {Auth0Provider} from '../../index.ts'


const config = {
  clientID: '',
  domain: '',
  redirectUri: '',
  audience: ``,
  scope: '',
  responseType: ''
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Auth0Provider config={config}>
      <App />
    </Auth0Provider>
  </BrowserRouter>,
)
