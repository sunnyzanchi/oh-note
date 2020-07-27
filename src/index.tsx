import React from 'react'
import { render } from 'react-dom'

// Import db just for side effects here, to make sure
// the db is set up even if it's not imported later
import './utils/db'
import './utils/setupMonaco'

import App from './components/App'

render(<App />, document.querySelector('#app'))
