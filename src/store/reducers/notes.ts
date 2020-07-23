const actions = {
  TEST: 'TEST',
}

type Note = {
  content: string
  metadata: { [key: string]: any }
  title: string
}

type State = {
  content: string
  title: string
}

const initialState: State = {
  content: '',
  title: 'Untitled',
}

const reducer = (state: State = initialState, action: string): State => {
  console.log('notes', action)

  return state
}

export default reducer
