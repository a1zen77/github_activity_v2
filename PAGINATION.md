# Pagination — Cursor-Based Design

How GitHub Explorer implements cursor-based pagination
using the GitHub GraphQL API and plain React `useState`.

---

## Why cursor-based pagination

GitHub's GraphQL API uses the **Connections pattern** — a widely adopted
GraphQL convention for paginated lists. It does not support offset-based
pagination (`page=2`, `skip=10`) for repository queries.

Cursor-based pagination has two advantages over offset pagination:

1. **Stable results.** If repos are added or removed between page loads,
   offset pagination shifts everything and you skip or repeat items.
   A cursor points to a specific position in the list — it doesn't shift.

2. **Efficient for the server.** The server doesn't need to count and skip
   rows. It seeks directly to the cursor position and reads forward.

The tradeoff: you can't jump to page 5 directly. You must walk forward
one page at a time, which is why the UI uses "Load More" rather than
numbered page buttons.

---

## The Connections pattern

Every paginated list in GitHub's GraphQL API follows the same shape:
```graphql
repositories(first: 6, after: $cursor) {
  nodes {       # the actual items on this page
    id
    name
    ...
  }
  pageInfo {
    endCursor    # opaque string — your position marker
    hasNextPage  # true if more items exist after this page
  }
}
```

`endCursor` is an opaque base64 string like `Y3Vyc29yOnYyOpHOAB...`.
You never decode or construct it — you only store it and pass it back.

---

## State involved

All pagination state lives in `src/hooks/useGitHubSearch.js`:
```js
const [repos,    setRepos]    = useState([])    // accumulated repo list
const [pageInfo, setPageInfo] = useState(null)  // { endCursor, hasNextPage }
const [currentLogin, setCurrentLogin] = useState(null) // needed by loadMoreRepos
```

`repos` grows with every page. It is never replaced during "Load More"
— only during a new search. `pageInfo` is always replaced with the
latest page's info so `endCursor` always points to the next position.

---

## Page 1 — first fetch
```
searchUser("torvalds")
      │
      └─▶ GET_REPOS variables:
            { login: "torvalds", first: 6 }
            no `after` — omitted entirely

      GitHub returns:
        nodes:    [ repo1 ... repo6 ]
        pageInfo: { endCursor: "abc123", hasNextPage: true }

      State after:
        repos    = [ repo1 ... repo6 ]
        pageInfo = { endCursor: "abc123", hasNextPage: true }
```

---

## Page 2+ — load more
```
User clicks "Load More"
      │
      └─▶ loadMoreRepos()

      GET_REPOS variables:
        { login: "torvalds", first: 6, after: "abc123" }
                                        ▲
                               pageInfo.endCursor from state

      GitHub returns:
        nodes:    [ repo7 ... repo12 ]
        pageInfo: { endCursor: "def456", hasNextPage: true }

      State after:
        repos    = [ repo1...repo6, repo7...repo12 ]  ← merged
        pageInfo = { endCursor: "def456", hasNextPage: true }
                                   ▲
                          cursor advances to new position
```

The merge is a single line:
```js
setRepos((prev) => [...prev, ...nodes])
```

Using the functional update form `(prev) => ...` guarantees you're
spreading the latest state even if multiple updates are batched.

---

## Last page
```
      GitHub returns:
        nodes:    [ repo25, repo26 ]
        pageInfo: { endCursor: "ghi789", hasNextPage: false }
                                                      ▲
                                              no more pages

      State after:
        repos    = [ repo1 ... repo26 ]
        pageInfo = { endCursor: "ghi789", hasNextPage: false }

      UI effect:
        "Load More" button disappears
        "All repositories loaded" message appears
```

---

## Resetting on new search

When `searchUser()` is called for a new username, state resets
completely before any fetch fires:
```js
setRepos([])        // clear accumulated list
setPageInfo(null)   // clear cursor — prevents stale cursor leaking
                    // into the new user's loadMoreRepos calls
setCurrentLogin(trimmed)
```

This order matters. If `pageInfo` weren't cleared, a slow in-flight
"Load More" could theoretically write its result into the new user's
list. Clearing first makes the reset synchronous and immediate.

---

## Lessons learned

**1. `$after: String` vs `$after: String!`**
The missing `!` is intentional. Making it optional means the same query
works for both first-page and subsequent-page calls. If it were required,
you'd need two separate queries or always pass `null` explicitly.

**2. Never decode the cursor**
The cursor is an implementation detail of GitHub's API. Its current
format is base64-encoded but that is not guaranteed. Treat it as an
opaque string — store it, pass it back, never inspect it.

**3. Merge with functional update**
`setRepos(prev => [...prev, ...nodes])` is safer than
`setRepos([...repos, ...nodes])`. The latter closes over the `repos`
value at the time the async call started, which may be stale if React
batched updates. The functional form always receives the latest state.

**4. Separate loading flags**
Using `userLoading` and `reposLoading` separately means the profile
skeleton and repo skeleton can appear and disappear independently.
A single `isLoading` flag would force you to show both or neither.

**5. `hasNextPage` is the source of truth**
Don't infer "done" from the node count. A user with exactly 12 repos
and a page size of 6 will return 6 nodes on page 2 with
`hasNextPage: false` — which is correct. Only trust the flag.