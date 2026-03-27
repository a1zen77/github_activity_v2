import { useGitHubSearch } from './hooks/useGitHubSearch'
import { SearchBar, ProfileCard, RepoList, FeaturedProfiles } from './components'

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

  const isEmptyState = !userData && !userLoading && !userError && !reposLoading && repos.length === 0

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">GitHub Explorer</h1>
        <span className="app-subtitle">Search users · Explore repositories</span>
      </header>

      <main className="app-main">
        <SearchBar
          onSearch={searchUser}
          isLoading={userLoading}
        />

        {isEmptyState && (
          <FeaturedProfiles onSelect={searchUser} />
        )}

        {userError && (
          <div className="error-message">
            <strong>User not found —</strong> {userError}
          </div>
        )}

        <ProfileCard user={userData} isLoading={userLoading} />

        {userData && !reposLoading && repos.length === 0 && !reposError && (
          <p className="empty-state">
            {userData.login} has no public repositories yet.
          </p>
        )}

        {reposError && (
          <div className="error-message">
            <strong>Could not load repositories —</strong> {reposError}
          </div>
        )}

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