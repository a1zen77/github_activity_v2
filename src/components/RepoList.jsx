// src/components/RepoList.jsx
//
// Renders the full list of RepoCards.
// Owns the "Load More" button and its loading/end states.

import { RepoCard } from './RepoCard'

export function RepoList({ repos, pageInfo, onLoadMore, isLoading }) {
  if (!repos.length && !isLoading) return null

  return (
    <section className="repo-list">

      <h3 className="repo-list-title">
        Repositories
        {repos.length > 0 && (
          <span className="repo-list-count">{repos.length} shown</span>
        )}
      </h3>

      <div className="repo-grid">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      <div className="repo-list-footer">
        {isLoading && (
          <p className="loading-text">Loading repos...</p>
        )}

        {!isLoading && pageInfo?.hasNextPage && (
          <button
            className="load-more-button"
            onClick={onLoadMore}
            disabled={isLoading}   // ← add this
          >
            Load more repositories
          </button>
        )}

        {!isLoading && pageInfo && !pageInfo.hasNextPage && repos.length > 0 && (
          <p className="end-of-list">All repositories loaded</p>
        )}
      </div>

    </section>
  )
}