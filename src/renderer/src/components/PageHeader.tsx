import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CaretDown, CaretLeft } from '@phosphor-icons/react'

import { useAuthStore } from '../stores/authStore'
import { useProjectStore } from '../stores/projectStore'
import { Alert } from './Alert'
import { Dropdown } from './Dropdown'
import { IconButton } from './IconButton'

interface PageHeaderProps {
  showBackButton?: boolean
}

export function PageHeader({ showBackButton = true }: PageHeaderProps) {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const setCredentials = useAuthStore((state) => state.setCredentials)
  const selectProject = useProjectStore((state) => state.selectProject)

  const [signOutAlertVisible, setSignOutAlertVisible] = useState(false)

  function handleSignOut() {
    setCredentials({
      token: '',
      user: null,
    })

    selectProject(null)
  }

  return (
    <>
      <Alert
        open={signOutAlertVisible}
        onOpenChange={setSignOutAlertVisible}
        title="Sign out"
        description="Really want to sign out?"
        actionText="Yes, sign out"
        onAction={handleSignOut}
      />

      <div className="flex h-12 bg-blue-200 items-center justify-between gap-4 px-2">
        <div>
          {showBackButton && (
            <IconButton type="button" size="sm" onClick={() => navigate(-1)}>
              <CaretLeft size={16} weight="bold" />
            </IconButton>
          )}
        </div>

        <Dropdown.Root>
          <Dropdown.Trigger>
            <div className="h-12 flex items-center gap-2 px-2 hover:bg-blue-300 cursor-pointer">
              <div className="w-8 h-8 bg-zinc-400 rounded-full" />
              <span className="text-sm mr-2">{user?.name}</span>

              <CaretDown size={16} weight="bold" />
            </div>
          </Dropdown.Trigger>

          <Dropdown.Content align="end">
            <Dropdown.Item onClick={() => setSignOutAlertVisible(true)}>
              Sign out
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    </>
  )
}
