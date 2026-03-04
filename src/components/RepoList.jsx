import './RepoList.css'
import { RepoCard } from './RepoCard'

// Skeleton placeholder shown while the first page loads
function RepoCardSkeleton() {
  return (
    <div className="repo-card-skeleton">
      <div className="skeleton skeleton-line skeleton-w-40" />
      <div className="skeleton skeleton-line skeleton-w-80" />
      <div className="skeleton skeleton-line skeleton-w-60" />
    </div>
  )
}

export function RepoList({ repos, pageInfo, onLoadMore, isLoading }) {
  // Show skeletons on the very first load (no repos yet, but loading)
  if (!repos.length && isLoading) {
    return (
      <section className="repo-list">
        <h3 className="repo-list-title">Repositories</h3>
        <div className="repo-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <RepoCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

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
          <p className="loading-text">Loading more...</p>
        )}
        {!isLoading && pageInfo?.hasNextPage && (
          <button className="load-more-button" onClick={onLoadMore}>
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