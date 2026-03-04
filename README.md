# GitHub Explorer

A React frontend that queries the **GitHub GraphQL API** using plain
`fetch()` — no Apollo, Relay, or urql. Built phase by phase to
understand GraphQL mechanics from first principles.

---

## Features

- Search any GitHub username
- View profile: avatar, bio, followers, location, company
- Browse repositories sorted by star count
- Cursor-based pagination — "Load More" appends without replacing
- Loading skeletons for profile and repo grid
- Separate error states for user lookup and repo fetching
- Responsive two-column layout

---

## Setup

### 1. Clone and install
```bash
git clone https://github.com/your-username/github-explorer.git
cd github-explorer
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```

Open `.env` and replace the placeholder with a real token:
```
VITE_GITHUB_TOKEN=your_token_here
```

Generate a token at **https://github.com/settings/tokens**  
Required scopes: `read:user`, `public_repo`

> `.env` is listed in `.gitignore` and will never be committed.

### 3. Start the dev server
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Project structure
```
github-explorer/
├── public/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # Controlled input + submit
│   │   ├── SearchBar.css
│   │   ├── ProfileCard.jsx     # Avatar, bio, stats, meta
│   │   ├── ProfileCard.css
│   │   ├── RepoCard.jsx        # Single repo: name, stars, language
│   │   ├── RepoCard.css
│   │   ├── RepoList.jsx        # Grid of RepoCards + Load More
│   │   ├── RepoList.css
│   │   └── index.js            # Barrel export
│   ├── hooks/
│   │   └── useGitHubSearch.js  # All state + fetch logic
│   ├── utils/
│   │   ├── graphqlFetch.js     # fetch() wrapper for GitHub GraphQL
│   │   ├── queries.js          # GET_USER and GET_REPOS query strings
│   │   └── index.js            # Barrel export
│   ├── App.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── QUERIES.md                  # GraphQL query documentation
├── PAGINATION.md               # Pagination design and lessons learned
├── package.json
└── vite.config.js
```

---

## Architecture
```
App.jsx
  │
  ├── useGitHubSearch()         ← all state lives here
  │     ├── graphqlFetch()      ← every API call goes through here
  │     │     └── fetch()       ← plain browser fetch, no libraries
  │     ├── GET_USER query
  │     └── GET_REPOS query
  │
  ├── <SearchBar />             ← fires searchUser(login)
  ├── <ProfileCard />           ← reads userData, userLoading
  └── <RepoList />              ← reads repos, pageInfo, reposLoading
        └── <RepoCard />        ← renders one repo node
```

Data flows in one direction: the hook fetches and owns state,
components receive props and render. No component calls the API directly.

---

## Available scripts

| Command           | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start local dev server       |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |

---

## Further reading

- [QUERIES.md](./QUERIES.md) — GraphQL query documentation
- [PAGINATION.md](./PAGINATION.md) — Cursor pagination deep-dive
- [GitHub GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer) — test queries interactively
- [GraphQL Connections spec](https://relay.dev/graphql/connections.html) — the pagination pattern used by GitHub