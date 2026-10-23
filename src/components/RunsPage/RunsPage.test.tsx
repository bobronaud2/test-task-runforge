import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchRuns } from '../../api/runsApi'
import { testRuns } from '../../test/runFixtures'
import { RunsPage } from './RunsPage'

vi.mock('../../api/runsApi', () => ({
  fetchRuns: vi.fn(),
  isErrorSimulationEnabled: () => false,
}))

const mockedFetchRuns = vi.mocked(fetchRuns)

async function renderLoadedPage() {
  const user = userEvent.setup()
  render(<RunsPage />)
  const list = await screen.findByRole('list', { name: 'Запуски' })
  return { user, list }
}

function waitForDetailsToClose() {
  return waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
  )
}

function getRunNames(list: HTMLElement) {
  return within(list)
    .getAllByRole('listitem')
    .map(
      (item) =>
        testRuns.find((run) => item.textContent?.startsWith(run.name))?.name,
    )
}

describe('RunsPage', () => {
  beforeEach(() => {
    mockedFetchRuns.mockReset()
    mockedFetchRuns.mockResolvedValue(testRuns)
  })

  it('shows a loading state and then the list of runs', async () => {
    render(<RunsPage />)

    expect(screen.getByRole('status')).toHaveTextContent('Загружаем запуски')
    const list = await screen.findByRole('list', { name: 'Запуски' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(testRuns.length)
    expect(screen.getByText('Показано 4 из 4')).toBeInTheDocument()
  })

  it('filters runs by status and highlights the active filter', async () => {
    const { user, list } = await renderLoadedPage()

    await user.click(screen.getByRole('button', { name: 'Failed' }))

    expect(screen.getByRole('button', { name: 'Failed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(getRunNames(list)).toEqual(['Add metrics endpoint'])
    expect(window.location.search).toBe('?status=failed')
  })

  it('searches by repository together with the status filter', async () => {
    const { user, list } = await renderLoadedPage()

    await user.type(screen.getByRole('searchbox'), 'acme/api')
    expect(getRunNames(list)).toEqual([
      'Upgrade dependencies',
      'Add metrics endpoint',
    ])

    await user.click(screen.getByRole('button', { name: 'Running' }))
    expect(getRunNames(list)).toEqual(['Upgrade dependencies'])
  })

  it('shows an empty state and resets filters', async () => {
    const { user } = await renderLoadedPage()

    await user.type(screen.getByRole('searchbox'), 'nothing matches this')
    expect(
      screen.getByRole('heading', { name: 'Ничего не найдено' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(
      within(screen.getByRole('list', { name: 'Запуски' })).getAllByRole(
        'listitem',
      ),
    ).toHaveLength(testRuns.length)
  })

  it('opens run details with logs and result and returns to the list', async () => {
    const { user } = await renderLoadedPage()

    await user.click(screen.getByRole('button', { name: /Fix login bug/ }))

    const dialog = screen.getByRole('dialog', { name: 'Fix login bug' })
    expect(within(dialog).getByText('Opened PR #1')).toBeInTheDocument()
    expect(within(dialog).getByText(/Tests passed/)).toBeInTheDocument()
    expect(within(dialog).getByText('2 мин 5 с')).toBeInTheDocument()

    await user.click(
      within(dialog).getByRole('button', { name: /К списку запусков/ }),
    )
    await waitForDetailsToClose()
    expect(window.location.search).toBe('')
  })

  it('closes details with the browser back button', async () => {
    const { user } = await renderLoadedPage()

    await user.click(screen.getByRole('button', { name: /Fix login bug/ }))
    expect(window.location.search).toBe('?run=run_1')

    window.history.back()

    await waitForDetailsToClose()
    expect(window.location.search).toBe('')
  })

  it('closes details with Escape and shows a placeholder when there is no result', async () => {
    const { user } = await renderLoadedPage()

    await user.click(
      screen.getByRole('button', { name: /Upgrade dependencies/ }),
    )
    const dialog = screen.getByRole('dialog', { name: 'Upgrade dependencies' })
    expect(
      within(dialog).getByText('Результат появится после завершения запуска.'),
    ).toBeInTheDocument()
    expect(within(dialog).getAllByText('—').length).toBeGreaterThan(0)

    await user.keyboard('{Escape}')
    await waitForDetailsToClose()
  })

  it('opens details from the run id in the URL', async () => {
    window.history.replaceState(null, '', '/?run=run_3')
    render(<RunsPage />)

    expect(
      await screen.findByRole('dialog', { name: 'Add metrics endpoint' }),
    ).toBeInTheDocument()
  })

  it('closes details opened from a direct link without leaving the page', async () => {
    window.history.replaceState(null, '', '/?status=failed&run=run_3')
    const user = userEvent.setup()
    render(<RunsPage />)

    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')

    await waitForDetailsToClose()
    expect(window.location.search).toBe('?status=failed')
  })

  it('shows an error and retries the request', async () => {
    mockedFetchRuns.mockRejectedValueOnce(new Error('Сервер не ответил'))
    const user = userEvent.setup()
    render(<RunsPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Сервер не ответил',
    )

    await user.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(
      await screen.findByRole('list', { name: 'Запуски' }),
    ).toBeInTheDocument()
    expect(mockedFetchRuns).toHaveBeenCalledTimes(2)
  })
})
