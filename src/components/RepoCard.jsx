// src/components/RepoCard.jsx
//
// Displays a single repository.
// Receives one repo node from the repositories.nodes array.

export function RepoCard({ repo }) {
  return (
    <div className={`repo-card ${repo.isArchived ? 'repo-card--archived' : ''}`}>

      <div className="repo-card-header">
        <a
          className="repo-name"
          href={repo.url}
          target="_blank"
          rel="noreferrer"
        >
          {repo.name}
        </a>
        <div className="repo-badges">
          {repo.isArchived && <span className="badge badge--archived">Archived</span>}
          {repo.isFork     && <span className="badge badge--fork">Fork</span>}
        </div>
      </div>

      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      <div className="repo-card-footer">
        {repo.primaryLanguage && (
          <span className="repo-language">
            <span
              className="language-dot"
              style={{ backgroundColor: repo.primaryLanguage.color ?? '#888' }}
            />
            {repo.primaryLanguage.name}
          </span>
        )}

        <span className="repo-stat">
          ⭐ {repo.stargazerCount.toLocaleString()}
        </span>

        <span className="repo-stat">
          🍴 {repo.forkCount.toLocaleString()}
        </span>

        <span className="repo-updated">
          Updated {formatRelativeTime(repo.updatedAt)}
        </span>
      </div>

    </div>
  )
}

// Formats an ISO timestamp as a relative string e.g. "3 days ago"
function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 1000 / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)
  const months  = Math.floor(days / 30)
  const years   = Math.floor(days / 365)

  if (minutes < 60)  return `${minutes}m ago`
  if (hours   < 24)  return `${hours}h ago`
  if (days    < 30)  return `${days}d ago`
  if (months  < 12)  return `${months}mo ago`
  return `${years}y ago`
}