import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux';
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
     <>
        <Provider store={store}>
            <CssBaseline ></CssBaseline>
            <div onContextMenu={(e)=> e.preventDefault()}>
              <App  />
            </div>
        </Provider>
      </>
)
