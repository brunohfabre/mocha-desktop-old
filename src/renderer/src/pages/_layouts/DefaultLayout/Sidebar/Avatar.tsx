import { useState } from 'react'

import { Alert } from '@/components/Alert'
import { Dropdown } from '@/components/Dropdown'
import { useAuthStore } from '@/stores/authStore'
import { useOrganizationStore } from '@/stores/organizationStore'

export function Avatar() {
  const setCredentials = useAuthStore((state) => state.setCredentials)
  const selectOrganization = useOrganizationStore(
    (state) => state.selectOrganization,
  )

  const [signOutAlertVisible, setSignOutAlertVisible] = useState(false)

  function handleSignOut() {
    setCredentials({
      token: '',
      user: null,
    })

    selectOrganization(null)
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

      <div className="flex flex-col items-center gap-2">
        <Dropdown.Root>
          <Dropdown.Trigger>
            <div className="w-14 h-14 flex items-center justify-center">
              <div className="w-10 h-10 bg-zinc-400 rounded-full" />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onClick={() => setSignOutAlertVisible(true)}>
              Sign out
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    </>
  )
}
