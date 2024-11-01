import { LoreEntry } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'
import { Link } from '@remix-run/react'

interface IUserDisplayProps {
  createdEntries: SerializeFrom<LoreEntry>[]
  authoredEntries?: SerializeFrom<LoreEntry>[]
}

function LoreEntriesList({ loreEntries }: { loreEntries: IUserDisplayProps['createdEntries'] }) {
  return (
    <ul>
      {loreEntries.map(({ id, title }) => {
        const loreEntryUrl = `/lore/${id}`
        return (
          <li key={id}>
            <Link to={loreEntryUrl} className='flex'>
              {title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function UserLoreEntries({ createdEntries = [], authoredEntries = [] }: IUserDisplayProps) {
  return (
    <div className='flex'>
      <div className='grid grid-cols-2 gap-y-2'>
        <p className='font-semibold'>Recently created entries</p>
        <LoreEntriesList loreEntries={createdEntries} />
        {authoredEntries.length > 0 && (
          <>
            <p className='font-semibold'>Recently attributed as author</p>
            <LoreEntriesList loreEntries={authoredEntries} />
          </>
        )}
      </div>
    </div>
  )
}
