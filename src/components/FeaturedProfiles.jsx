// src/components/FeaturedProfiles.jsx
//
// Shown on the landing page before any search is made.
// Clicking a card triggers onSelect(login) which fires a search.

import './FeaturedProfiles.css'

const FEATURED_USERS = [
  // Row 1
  {
    login: 'torvalds',
    name: 'Linus Torvalds',
    description: 'Creator of Linux & Git',
    avatar: 'https://avatars.githubusercontent.com/u/1024025',
  },
  {
    login: 'gaearon',
    name: 'Dan Abramov',
    description: 'Co-creator of Redux, React core team',
    avatar: 'https://avatars.githubusercontent.com/u/810438',
  },
  {
    login: 'sindresorhus',
    name: 'Sindre Sorhus',
    description: 'Thousands of open source packages',
    avatar: 'https://avatars.githubusercontent.com/u/170270',
  },
  {
    login: 'tj',
    name: 'TJ Holowaychuk',
    description: 'Creator of Express, Koa, and more',
    avatar: 'https://avatars.githubusercontent.com/u/25254',
  },
  // Row 2
  {
    login: 'yyx990803',
    name: 'Evan You',
    description: 'Creator of Vue.js and Vite',
    avatar: 'https://avatars.githubusercontent.com/u/499550',
  },
  {
    login: 'addyosmani',
    name: 'Addy Osmani',
    description: 'Engineering manager at Google Chrome',
    avatar: 'https://avatars.githubusercontent.com/u/110953',
  },
  {
    login: 'taylorotwell',
    name: 'Taylor Otwell',
    description: 'Creator of Laravel',
    avatar: 'https://avatars.githubusercontent.com/u/463230',
  },
  {
    login: 'dhh',
    name: 'DHH',
    description: 'Creator of Ruby on Rails',
    avatar: 'https://avatars.githubusercontent.com/u/2741',
  },
  // Row 3
  {
    login: 'antirez',
    name: 'Salvatore Sanfilippo',
    description: 'Creator of Redis',
    avatar: 'https://avatars.githubusercontent.com/u/65632',
  },
  {
    login: 'kennethreitz',
    name: 'Kenneth Reitz',
    description: 'Creator of Requests & Pipenv',
    avatar: 'https://avatars.githubusercontent.com/u/119893',
  },
  {
    login: 'getify',
    name: 'Kyle Simpson',
    description: 'Author of You Don\'t Know JS',
    avatar: 'https://avatars.githubusercontent.com/u/150330',
  },
  {
    login: 'nickvdyck',
    name: 'Nick Van Dyck',
    description: 'Open source contributor',
    avatar: 'https://avatars.githubusercontent.com/u/5946706',
  },
]

export function FeaturedProfiles({ onSelect }) {
  return (
    <div className="featured">
      <p className="featured-label">— or explore a featured profile —</p>
      <div className="featured-grid">
        {FEATURED_USERS.map((user) => (
          <button
            key={user.login}
            className="featured-card"
            onClick={() => onSelect(user.login)}
          >
            <img
              className="featured-avatar"
              src={user.avatar}
              alt={user.name}
            />
            <div className="featured-info">
              <span className="featured-name">{user.name}</span>
              <span className="featured-login">@{user.login}</span>
              <span className="featured-description">{user.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}