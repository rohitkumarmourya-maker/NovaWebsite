export type LeadershipProfile = {
  id: string
  fullName: string
  designation: string
  bio: string
  photo: string | null
  status: 'pending' | 'published'
}

// Editable dummy variables requested by the owner. Replace with approved profiles.
export const leadershipProfiles: LeadershipProfile[] = [
  { id: 'executive-leadership', fullName: 'Name to be announced', designation: 'Executive Leadership', bio: 'The leadership profile will be shared here once the name, designation and biography are confirmed.', photo: null, status: 'pending' },
  { id: 'board-of-directors', fullName: 'Name to be announced', designation: 'Board of Directors', bio: 'The director profile will be shared here once the name, designation and biography are confirmed.', photo: null, status: 'pending' },
]
