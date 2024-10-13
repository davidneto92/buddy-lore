import { LoreEntry } from '@prisma/client';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant'
import { Header } from '~/components/Header';
import { UserDisplay } from '~/components/UserDisplay';
import { UserLoreEntries } from '~/components/UserLoreEntries';
import { getUserById } from '~/models/user.server';
import { requireUserId } from '~/session.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request)
  const { userId } = params || {}
  invariant(userId, 'userId not found')

  const user = await getUserById(userId, true)
  if (!user) {
    throw new Response('User not found', { status: 404 })
  }

  return json({ user })
};

export default function UserDetailsPage() {
  const userData = useLoaderData<typeof loader>();
  const { displayName, email, createdEntries = [], authorOf = [] } = userData.user || {}
  const pageTitle = `Profile for ${displayName}`

  return (
    <>
      <Header subTitle={pageTitle} />
      <UserDisplay email={email} displayName={displayName} />
      <UserLoreEntries
        // issue where the joins in Prisma are casting the DateTime objects to strings
        createdEntries={createdEntries as any as LoreEntry[]}
        authoredEntries={authorOf as any as LoreEntry[]}
      />
    </>
  )
}
