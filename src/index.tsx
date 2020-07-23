import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

// Import db just for side effects here, to make sure
// the db is set up even if it's not imported later
import './utils/db'
import './utils/setupMonaco'
import store from './store'

import App from './components/App'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
)
