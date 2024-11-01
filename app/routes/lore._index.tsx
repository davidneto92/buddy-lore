import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Header } from '~/components/Header';
import { MAIN_TITLE } from '~/constants/pageTitles';
import { getAllLoreEntries } from '~/models/loreEntry.server';
import { requireUserId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request)
  const loreEntries = await getAllLoreEntries()
  return json({ loreEntries })
}

export default function Lore() {
  const data = useLoaderData<typeof loader>()
  const { loreEntries = [] } = data || {}

  return (
    <>
      <Header title={MAIN_TITLE} />
      <main className='flex justify-center'>
        <Link to='/lore/new' className='rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600'>
          Create new entry
        </Link>

        <div className='flex items-center'>
          <table className='table-fixed'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {loreEntries.map(entry => {
                const loreEntryUrl = `/lore/${entry.id}`
                return (
                  <tr key={entry.id}>
                    <td>
                      <Link to={loreEntryUrl} className='flex'>
                        {entry.title}
                      </Link>
                    </td>
                    <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
