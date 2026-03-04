// src/utils/queries.js
//
// All GraphQL query strings for the app.
// These are plain template literal strings — no gql tag needed.
// Each query is exported individually so components import only what they need.


// ─── Query 1: User Profile ────────────────────────────────────────────────────
//
// Fetches public profile data for a given GitHub username.
// Used by: ProfileCard
//
// Variables:
//   $login: String!  — the GitHub username to look up
//
export const GET_USER = `
  query GetUser($login: String!) {
    user(login: $login) {
      login                  # username e.g. "torvalds"
      name                   # display name e.g. "Linus Torvalds"
      bio                    # profile bio text
      avatarUrl              # URL to profile picture
      url                    # link to GitHub profile page
      location               # city/country from profile
      company                # company name from profile
      email                  # public email (empty string if not set)
      twitterUsername        # twitter handle without the @
      createdAt              # ISO timestamp of account creation

      followers {
        totalCount           # total number of followers
      }
      following {
        totalCount           # total number of accounts they follow
      }
      repositories {
        totalCount           # total public repo count (used in ProfileCard stats)
      }
    }
  }
`


// ─── Query 2: Repositories (Paginated) ───────────────────────────────────────
//
// Fetches a page of public repositories for a user, sorted by star count.
// Supports cursor-based pagination via `first` and `after`.
//
// Variables:
//   $login:  String!  — GitHub username
//   $first:  Int!     — how many repos to fetch per page (we'll use 6)
//   $after:  String   — cursor from the previous page's pageInfo.endCursor
//                       null/omitted on the first request
//
// Pagination flow:
//   1. First call: omit $after (or pass null) → gets the first page
//   2. Check pageInfo.hasNextPage — if true, there are more repos
//   3. Next call: pass pageInfo.endCursor as $after → gets the next page
//   4. Repeat until hasNextPage is false
//
export const GET_REPOS = `
  query GetRepos($login: String!, $first: Int!, $after: String) {
    user(login: $login) {
      repositories(
        first: $first
        after: $after
        orderBy: { field: STARGAZERS, direction: DESC }
        ownerAffiliations: OWNER        # only repos they own, not forks they contribute to
        privacy: PUBLIC                 # public repos only
      ) {
        nodes {
          id                            # unique repo ID (good for React keys)
          name                          # repo name e.g. "linux"
          description                   # short description (can be null)
          url                           # link to repo on GitHub
          stargazerCount                # number of stars
          forkCount                     # number of forks
          isArchived                    # whether the repo is archived
          isFork                        # whether this is a fork

          primaryLanguage {
            name                        # language name e.g. "JavaScript"
            color                       # hex color used on GitHub e.g. "#f1e05a"
          }

          updatedAt                     # ISO timestamp of last push
        }

        pageInfo {
          endCursor                     # opaque string — pass as $after on next page
          hasNextPage                   # false when you've reached the last page
        }
      }
    }
  }
`