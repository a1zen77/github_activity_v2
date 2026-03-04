// src/components/ProfileCard.jsx
//
// Displays a GitHub user's public profile information.
// Receives the `userData` object directly from the hook.

export function ProfileCard({ user }) {
  if (!user) return null

  return (
    <div className="profile-card">
      <div className="profile-top">
        <img
          className="profile-avatar"
          src={user.avatarUrl}
          alt={`${user.login}'s avatar`}
        />
        <div className="profile-identity">
          {user.name && <h2 className="profile-name">{user.name}</h2>}
          <a
            className="profile-login"
            href={user.url}
            target="_blank"
            rel="noreferrer"
          >
            @{user.login}
          </a>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-value">{user.followers.totalCount.toLocaleString()}</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-value">{user.following.totalCount.toLocaleString()}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat">
          <span className="stat-value">{user.repositories.totalCount.toLocaleString()}</span>
          <span className="stat-label">Repos</span>
        </div>
      </div>

      <div className="profile-meta">
        {user.company  && <span className="meta-item">🏢 {user.company}</span>}
        {user.location && <span className="meta-item">📍 {user.location}</span>}
        {user.email    && <span className="meta-item">✉️ {user.email}</span>}
        {user.twitterUsername && (
        <a  
            className="meta-item meta-link"
            href={`https://twitter.com/${user.twitterUsername}`}
            target="_blank"
            rel="noreferrer"
          >
            🐦 @{user.twitterUsername}
          </a>
        )}
      </div>

    </div>
  )
}