// src/utils/graphqlFetch.js
//
// A thin wrapper around fetch() for the GitHub GraphQL API.
// Every query in this app goes through this single function.
// No Apollo, Relay, or urql — raw HTTP only.

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

/**
 * Send a GraphQL request to the GitHub API.
 *
 * @param {string} query      - The GraphQL query string
 * @param {object} variables  - Variables to inject into the query
 * @returns {Promise<object>} - The `data` field of the GraphQL response
 * @throws {Error}            - On network failure or GraphQL errors
 */
export async function graphqlFetch(query, variables = {}) {
  const token = import.meta.env.VITE_GITHUB_TOKEN

  if (!token || token === 'your_github_personal_access_token_here') {
    throw new Error(
      'GitHub token not configured. Copy .env.example to .env and set VITE_GITHUB_TOKEN.'
    )
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: HTTP ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  // GraphQL errors come back as HTTP 200 with an `errors` array.
  // A partial response may still exist alongside the errors.
  if (json.errors?.length) {
    const messages = json.errors.map((e) => e.message).join(' | ')
    throw new Error(`GraphQL error: ${messages}`)
  }

  return json.data
}