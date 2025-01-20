'use server'

import { Badge } from '@/components/ui/badge'

import { getProfiles } from './actions'
import SelectProfileCard from './select-profile-card'

export default async function Page() {
  const profiles = await getProfiles()
  if (!profiles) {
    return <div>Loading or sthg?</div>
  }
  console.log({ profiles })

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Profile
        </Badge>
      </div>
      <SelectProfileCard profiles={profiles} />
    </div>
  )
}
