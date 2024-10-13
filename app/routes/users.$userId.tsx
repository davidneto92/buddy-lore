import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant'
import { Header } from '~/components/Header';
import { UserDisplay } from '~/components/UserDisplay';
import { getUserById } from '~/models/user.server';
import { requireUserId } from '~/session.server';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request)
  const { userId } = params || {}
  invariant(userId, 'userId not found')

  const user = await getUserById(userId)
  if (!user) {
    throw new Response('User not found', { status: 404 })
  }

  return json({ user })
};

export default function UserDetailsPage() {
  const userData = useLoaderData<typeof loader>();
  const { displayName, email } = userData.user || {}
  const pageTitle = `Profile for ${displayName}`
  return (
    <>
      <Header subTitle={pageTitle} />
      <UserDisplay email={email} displayName={displayName} />
    </>
  )
}
