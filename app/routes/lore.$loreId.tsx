import { json, LoaderFunctionArgs } from '@remix-run/node'
import { isRouteErrorResponse, Link, useLoaderData, useRouteError } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Header } from '~/components/Header'
import { MAIN_TITLE } from '~/constants/pageTitles'
import { getLoreEntry } from '~/models/loreEntry.server'
import { requireUserId } from '~/session.server'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  console.log(params)
  await requireUserId(request)
  invariant(params.loreId, 'loreId not found')

  const loreEntry = await getLoreEntry({ id: params.loreId })
  if (!loreEntry) {
    throw new Response('Entry not found', { status: 404 })
  }

  return json({ loreEntry })
}

export default function LoreEntryDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const { loreEntry } = data || {}
  const { title, authorDate, createdAt, description, examples, creator, author } = loreEntry || {}
  const { displayName: creatorDisplayName, id: creatorId } = creator || {}
  const { displayName: authorDisplayName, id: authorId } = author || {}
  const dateDisplay = new Date(authorDate || createdAt).toLocaleDateString()

  return (
    <>
      <Header title={MAIN_TITLE} />
      <main className='flex justify-center'>
        <div className='flex'>
          <div className='grid grid-cols-2 gap-y-2'>
            <span className='font-semibold'>Title</span>
            <span>{title}</span>

            {authorId && (<>
              <span className='font-semibold'>Author</span>
              <span>
                <Link to={`/users/${authorId}`}>
                  {authorDisplayName}
                </Link>
              </span>
            </>)}

            <span className='font-semibold'>Date created</span>
            <span>{dateDisplay}</span>

            <span className='font-semibold'>Description</span>
            <span>{description}</span>

            {examples.length > 0 && (
              <>
                <span className='font-semibold'>Examples</span>
                <div>
                  <ul>
                    {examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <span className='font-semibold'>Entry created by</span>
            <span>
              <Link to={`/users/${creatorId}`}>
                {creatorDisplayName}
              </Link>
            </span>

          </div>
        </div>
      </main>
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Lore Entry not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
