// src/App.jsx

import { useGitHubSearch } from './hooks/useGitHubSearch'
import { SearchBar, ProfileCard, RepoList } from './components'

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

  // True while the very first page of results is loading (not "load more")
  const isInitialLoading = userLoading || (reposLoading && repos.length === 0)

  return (
    <div className="app">

      <header className="app-header">
        <h1 className="app-title">GitHub Explorer</h1>
        <span className="app-subtitle">Search users · Explore repositories</span>
      </header>

      <main className="app-main">

        <SearchBar onSearch={searchUser} isLoading={isInitialLoading} />

        {/* User error */}
        {userError && (
          <div className="error-message">
            <strong>User not found:</strong> {userError}
          </div>
        )}

        {/* User loading */}
        {userLoading && (
          <p className="loading-text">Looking up user...</p>
        )}

        {/* Profile */}
        <ProfileCard user={userData} />

        {/* No repos state — user exists but has no public repos */}
        {userData && !reposLoading && repos.length === 0 && !reposError && (
          <p className="empty-state">
            {userData.login} has no public repositories yet.
          </p>
        )}

        {/* Repo list + pagination */}
        <RepoList
          repos={repos}
          pageInfo={pageInfo}
          onLoadMore={loadMoreRepos}
          isLoading={reposLoading}
        />

      </main>
    </div>
  )
}

export default App