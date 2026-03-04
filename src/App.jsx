// src/App.jsx

import { useGitHubSearch } from './hooks/useGitHubSearch'

function App() {
  const {
    userData,
    repos,
    pageInfo,
    userLoading,
    reposLoading,
    userError,
    reposError,
    searchUser,
    loadMoreRepos,
  } = useGitHubSearch()

  return (
    <div className="app">
      <header className="app-header">
        <h1>GitHub Explorer</h1>
      </header>

      <main className="app-main">

        {/* Temporary search input — replaced by <SearchBar /> in Phase 3 */}
        <input
          type="text"
          placeholder="GitHub username"
          onKeyDown={(e) => e.key === 'Enter' && searchUser(e.target.value)}
        />

        {/* User loading / error / data */}
        {userLoading && <p>Loading user...</p>}
        {userError   && <p style={{ color: 'red' }}>User error: {userError}</p>}
        {userData    && (
          <div>
            <img src={userData.avatarUrl} alt={userData.login} width={80} />
            <p>{userData.name} (@{userData.login})</p>
            <p>{userData.bio}</p>
            <p>Followers: {userData.followers.totalCount}</p>
          </div>
        )}

        {/* Repos loading / error / data */}
        {reposLoading && <p>Loading repos...</p>}
        {reposError   && <p style={{ color: 'red' }}>Repos error: {reposError}</p>}
        {repos.length > 0 && (
          <ul>
            {repos.map((repo) => (
              <li key={repo.id}>
                <a href={repo.url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
                {' '}⭐ {repo.stargazerCount}
              </li>
            ))}
          </ul>
        )}

        {/* Load More — only shown when there are more pages */}
        {pageInfo?.hasNextPage && !reposLoading && (
          <button onClick={loadMoreRepos}>Load More</button>
        )}

      </main>
    </div>
  )
}

export default App