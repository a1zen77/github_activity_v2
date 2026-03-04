// src/hooks/useGitHubSearch.js
//
// Central hook for all GitHub data fetching and state.
// Owns: user data, repos, pagination, loading flags, and errors.
// App.jsx and components never call graphqlFetch directly — they use this hook.

import { useState } from 'react'
import { graphqlFetch, GET_USER, GET_REPOS } from '../utils'

const REPOS_PER_PAGE = 6

export function useGitHubSearch() {

  // ── User state ──────────────────────────────────────────────
  const [userData, setUserData]       = useState(null)
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError]     = useState(null)

  // ── Repo state ───────────────────────────────────────────────
  const [repos, setRepos]             = useState([])
  const [pageInfo, setPageInfo]       = useState(null)
  const [reposLoading, setReposLoading] = useState(false)
  const [reposError, setReposError]   = useState(null)

  // ── Tracked username (needed by loadMoreRepos) ────────────────
  const [currentLogin, setCurrentLogin] = useState(null)


  // ── Action 1: searchUser ──────────────────────────────────────
  //
  // Called when the user submits the search form.
  // Fetches profile and first page of repos in parallel.
  //
  async function searchUser(login) {
    const trimmed = login.trim()
    if (!trimmed) return

    // Reset everything before a new search
    setUserData(null)
    setUserError(null)
    setRepos([])
    setPageInfo(null)
    setReposError(null)
    setCurrentLogin(trimmed)

    // Fetch user profile
    setUserLoading(true)
    try {
      const data = await graphqlFetch(GET_USER, { login: trimmed })

      if (!data.user) {
        // GitHub returns null for user if the username doesn't exist
        throw new Error(`No GitHub user found for "${trimmed}"`)
      }

      setUserData(data.user)
    } catch (err) {
      setUserError(err.message)
    } finally {
      setUserLoading(false)
    }

    // Fetch first page of repos (runs regardless of whether user fetch succeeded)
    setReposLoading(true)
    try {
      const data = await graphqlFetch(GET_REPOS, {
        login: trimmed,
        first: REPOS_PER_PAGE,
        // No `after` on the first page
      })

      if (!data.user) return

      const { nodes, pageInfo: info } = data.user.repositories
      setRepos(nodes)
      setPageInfo(info)
    } catch (err) {
      setReposError(err.message)
    } finally {
      setReposLoading(false)
    }
  }


  // ── Action 2: loadMoreRepos ───────────────────────────────────
  //
  // Called when the user clicks "Load More".
  // Uses pageInfo.endCursor as the `after` variable to get the next page,
  // then MERGES the new repos into the existing array (not replaces).
  //
  async function loadMoreRepos() {
    if (!currentLogin || !pageInfo?.hasNextPage) return

    setReposLoading(true)
    setReposError(null)

    try {
      const data = await graphqlFetch(GET_REPOS, {
        login: currentLogin,
        first: REPOS_PER_PAGE,
        after: pageInfo.endCursor,   // ← this is the cursor from the last page
      })

      if (!data.user) return

      const { nodes, pageInfo: info } = data.user.repositories

      // Append — don't replace. This is the manual merge.
      setRepos((prev) => [...prev, ...nodes])
      setPageInfo(info)
    } catch (err) {
      setReposError(err.message)
    } finally {
      setReposLoading(false)
    }
  }


  // ── Expose everything the UI needs ───────────────────────────
  return {
    // Data
    userData,
    repos,
    pageInfo,

    // Loading flags (separate so UI can show different spinners)
    userLoading,
    reposLoading,

    // Errors (separate so UI can show contextual messages)
    userError,
    reposError,

    // Actions
    searchUser,
    loadMoreRepos,
  }
}