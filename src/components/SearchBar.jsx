// src/components/SearchBar.jsx
//
// Controlled input + submit button.
// Calls onSearch(username) when the form is submitted.

import { useState } from 'react'

export function SearchBar({ onSearch, isLoading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Search a GitHub username..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
        autoComplete="off"
        spellCheck="false"
      />
      <button
        className="search-button"
        type="submit"
        disabled={isLoading || !value.trim()}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}