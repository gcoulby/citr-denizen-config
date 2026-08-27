import { afterEach, expect, it } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App'

afterEach(() => {
  window.localStorage.clear()
  document.body.innerHTML = ''
})

it('mounts with the default configuration and shows the generator', () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(<App />)
  })

  expect(container.textContent).toContain('Generator')
  expect(container.textContent).toContain('Caught in the Rain')

  act(() => {
    root.unmount()
  })
})
