import { useNavigate } from 'react-router-dom'
import { CaretLeft } from '@phosphor-icons/react'
import { IconButton } from '../components/IconButton'

export function TermsAndConditions() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex p-4 max-w-5xl w-full mx-auto">
        <IconButton type="button" onClick={() => navigate(-1)}>
          <CaretLeft size={16} weight="bold" />
        </IconButton>
      </header>

      <h1>Terms And Conditions</h1>
    </div>
  )
}
