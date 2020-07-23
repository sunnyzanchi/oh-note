import { combineReducers, createStore } from 'redux'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)

let store

// Use redux dev tools in any environment besides production
// @ts-ignore
if (process.env.NODE_ENV !== 'production') {
  store = createStore(
    reducer,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  store = createStore(reducer)
}

export default store
