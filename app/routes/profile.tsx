import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Header } from '~/components/Header';
import { getUserById } from '~/models/user.server';
import { requireUserId } from '~/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId)
  invariant(user, 'User not found via userId')
  return json({ user });
};

export default function Profile() {
  const userData = useLoaderData<typeof loader>();
  const { displayName, email } = userData.user || {}

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header subTitle='Your Profile' />

      <div className='flex'>
        <div className='grid grid-cols-2 gap-y-2'>
          <p className='font-semibold'>Display Name</p>
          <p>{displayName}</p>
          <p className='font-semibold'>Email</p>
          <p>{email}</p>
        </div>
      </div>
    </div>
  )
}
