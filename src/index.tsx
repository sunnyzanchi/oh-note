import React from 'react'
import { render } from 'react-dom'

import './utils/setupMonaco'
import App from './components/App'

render(<App />, document.querySelector('#app'))
