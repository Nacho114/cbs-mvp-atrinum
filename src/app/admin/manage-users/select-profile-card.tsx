'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Profile } from './actions'
import UserEditorCard from './user-editor-card'

interface SelectProfileCardProps {
  profiles: Profile[]
}

export default function SelectProfileCard({
  profiles,
}: SelectProfileCardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedProfiles, setDisplayedProfiles] = useState(
    profiles.slice(0, 10),
  )
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)

    const filteredProfiles = profiles.filter((profile) =>
      `${profile.firstName} ${profile.lastName}`.toLowerCase().includes(term),
    )

    setDisplayedProfiles(filteredProfiles.slice(0, 10))
  }

  if (selectedProfile) {
    return (
      <UserEditorCard
        profile={selectedProfile}
        onBackAction={() => setSelectedProfile(null)} // Allow user to go back
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <Input
          type="text"
          placeholder="Search by first or last name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedProfiles.map((profile) => (
          <div
            key={profile.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedProfile(profile)} // Set selected profile
            >
              Select
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
