import { Form, Link } from '@remix-run/react';
import { useOptionalUser } from '~/utils';

interface IHeaderProps {
  title?: string;
  subTitle?: string;
}

export function Header({
  title = 'Cubby Zone',
  subTitle
}: IHeaderProps) {
  const { id: userId } = useOptionalUser() || {};
  const currentUserProfileUrl = `/users/${userId}`
  return (
    <header className='flex items-center justify-between bg-slate-800 p-4 text-white'>
      <h1 className='text-3xl font-bold'>
        <Link to='/'>{title}</Link>
      </h1>
      {subTitle && <p>{subTitle}</p>}
      {userId && (
        <div className='flex flex-row gap-4'>
          <Link
            to={currentUserProfileUrl}
            className='rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600'
          >
            Profile
          </Link>
          <Form action='/logout' method='post'>
            <button
              type='submit'
              className='rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600'
            >
              Logout
            </button>
          </Form>
        </div>
      )}
    </header>
  );
}
