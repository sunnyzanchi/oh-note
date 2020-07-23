enum TagAction {}

type Tag = {
  name: string
  notes: string[]
}

type State = {
  tags: Tag[]
}

const initialState: State = {
  tags: [],
}

const reducer = (state: State = initialState, action: TagAction): State => {
  console.log('tags', action)
  return state
}

export default reducer
