import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Header } from '~/components/Header';
import { MAIN_TITLE } from '~/constants/pageTitles';

import { useOptionalUser } from '~/utils';

export const meta: MetaFunction = () => [{ title: MAIN_TITLE }];

export default function Index() {
  // May want to remove this hook since we are already using it in the header
  const user = useOptionalUser();
  return (
    <>
      <Header title={MAIN_TITLE} />
      <main className='flex justify-center'>
        <div className='py-8'>
          {user ? (
            <Link
              to='/lore'
              className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8'
            >
              See all Lore Entries
            </Link>
          ) : (
            <div className='flex flex-col items-center'>
              <div className='p-4 text-center'>
                <p className='font-semibold'>Welcome to Cubby Zone</p>
                <p>A place for the Cubs to keep track of all their lore.</p>
              </div>

              <div className='flex w-2/3 flex-col'>
                <Link
                  to='/join'
                  className='flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8'
                >
                  Sign up
                </Link>
                <Link
                  to='/login'
                  className='flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600'
                >
                  Log In
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
