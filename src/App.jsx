import { useEffect } from 'react'
import { graphqlFetch, GET_USER, GET_REPOS } from './utils'

function App() {

  useEffect(() => {
    // Test 1: user profile
    graphqlFetch(GET_USER, { login: 'torvalds' })
      .then((data) => console.log('USER:', data.user))
      .catch((err) => console.error('USER ERROR:', err))

    // Test 2: first page of repos
    graphqlFetch(GET_REPOS, { login: 'torvalds', first: 3 })
      .then((data) => console.log('REPOS:', data.user.repositories))
      .catch((err) => console.error('REPOS ERROR:', err))
  }, [])

  return (
    <div className="app">
      <h1>GitHub Explorer</h1>
    </div>
  )
}

export default App