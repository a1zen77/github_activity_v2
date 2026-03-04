# GraphQL Queries

Documentation for every query used in GitHub Explorer.
All queries are defined in `src/utils/queries.js` and executed
via the `graphqlFetch()` utility in `src/utils/graphqlFetch.js`.

---

## How queries are sent

GitHub's GraphQL API accepts a single POST endpoint:
```
POST https://api.github.com/graphql
Authorization: bearer YOUR_TOKEN
Content-Type: application/json

{
  "query": "...",
  "variables": { ... }
}
```

There are no GET requests, no REST endpoints, and no URL parameters.
Every operation — no matter how simple — is a POST with a JSON body.
This is standard GraphQL over HTTP.

---

## Query 1 — `GET_USER`

**File:** `src/utils/queries.js`  
**Used by:** `ProfileCard`, triggered from `useGitHubSearch.searchUser()`

### Purpose
Fetches all public profile data for a single GitHub user by their login (username).

### Query string
```graphql
query GetUser($login: String!) {
  user(login: $login) {
    login
    name
    bio
    avatarUrl
    url
    location
    company
    email
    twitterUsername
    createdAt
    followers { totalCount }
    following  { totalCount }
    repositories { totalCount }
  }
}
```

### Variables

| Variable | Type      | Required | Description              |
|----------|-----------|----------|--------------------------|
| `$login` | `String!` | Yes      | The GitHub username      |

### Example call
```js
graphqlFetch(GET_USER, { login: 'torvalds' })
```

### Example response shape
```json
{
  "user": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "bio": "Just a guy...",
    "avatarUrl": "https://avatars.githubusercontent.com/u/1024025",
    "url": "https://github.com/torvalds",
    "location": "Portland, OR",
    "company": "Linux Foundation",
    "email": "",
    "twitterUsername": null,
    "createdAt": "2011-09-04T22:48:FFZ",
    "followers": { "totalCount": 230000 },
    "following":  { "totalCount": 0 },
    "repositories": { "totalCount": 8 }
  }
}
```

### What to know
- `user` returns `null` if the username doesn't exist. The app checks
  for this and surfaces a "User not found" error.
- `email` is an empty string when not set publicly — not `null`.
- `twitterUsername` is `null` when not set — not an empty string.
  Both cases are guarded with `&&` before rendering.
- `repositories.totalCount` counts all public repos and is used for
  the stat in ProfileCard. It is separate from the paginated repo query.

---

## Query 2 — `GET_REPOS`

**File:** `src/utils/queries.js`  
**Used by:** `RepoList`, triggered from `useGitHubSearch.searchUser()`
and `useGitHubSearch.loadMoreRepos()`

### Purpose
Fetches a paginated, star-sorted list of public repositories owned
by a given user. Supports cursor-based pagination.

### Query string
```graphql
query GetRepos($login: String!, $first: Int!, $after: String) {
  user(login: $login) {
    repositories(
      first: $first
      after: $after
      orderBy: { field: STARGAZERS, direction: DESC }
      ownerAffiliations: OWNER
      privacy: PUBLIC
    ) {
      nodes {
        id
        name
        description
        url
        stargazerCount
        forkCount
        isArchived
        isFork
        primaryLanguage { name color }
        updatedAt
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
```

### Variables

| Variable | Type      | Required | Description                                      |
|----------|-----------|----------|--------------------------------------------------|
| `$login` | `String!` | Yes      | The GitHub username                              |
| `$first` | `Int!`    | Yes      | Number of repos per page (app uses `6`)          |
| `$after` | `String`  | No       | Cursor from previous `pageInfo.endCursor`        |

### Example calls
```js
// First page — no cursor
graphqlFetch(GET_REPOS, { login: 'torvalds', first: 6 })

// Subsequent pages — cursor required
graphqlFetch(GET_REPOS, { login: 'torvalds', first: 6, after: 'Y3Vyc29y...' })
```

### Example response shape
```json
{
  "user": {
    "repositories": {
      "nodes": [
        {
          "id": "MDEwOlJlcG9zaXRvcnkx",
          "name": "linux",
          "description": "Linux kernel source tree",
          "url": "https://github.com/torvalds/linux",
          "stargazerCount": 180000,
          "forkCount": 55000,
          "isArchived": false,
          "isFork": false,
          "primaryLanguage": { "name": "C", "color": "#555555" },
          "updatedAt": "2024-01-15T10:30:00Z"
        }
      ],
      "pageInfo": {
        "endCursor": "Y3Vyc29yOnYyOpHOABCD...",
        "hasNextPage": true
      }
    }
  }
}
```

### What to know
- `$after` has no `!` — it is optional. Omitting it entirely on the
  first request is valid and equivalent to passing `null`.
- `orderBy: STARGAZERS` sorts by total star count descending.
  This is applied server-side — no client-side sorting needed.
- `ownerAffiliations: OWNER` excludes repos the user merely
  collaborates on. Without it you'd see every repo they've touched.
- `privacy: PUBLIC` excludes private repos (which the token may or
  may not have access to depending on scopes).
- `primaryLanguage` can be `null` for repos with no detected language
  (READMEs-only, config files, etc.). Always guard before rendering.
- `nodes` may be an empty array on the last page if the total is an
  exact multiple of `$first`. `hasNextPage` will be `false` in that case.