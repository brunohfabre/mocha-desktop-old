import { Request } from './Request'
import { Response } from './Response'

export function RequestContent() {
  return (
    <div className="flex-1 flex">
      <Request />

      <Response />
    </div>
  )
}
