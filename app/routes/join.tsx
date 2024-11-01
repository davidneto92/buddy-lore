import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { createUser, getUserByEmail } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect } from '~/util/sessionUtils';
import { validateDisplayName, validateEmail } from '~/util/validation';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('displayName');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');

  const defaultErrors = {
    email: null,
    password: null,
    displayName: null
  }

  if (!validateEmail(email)) {
    return json(
      { errors: { ...defaultErrors, email: 'Email is invalid' } },
      { status: 400 },
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { ...defaultErrors, password: 'Password is required' } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { ...defaultErrors, password: 'Password is too short' } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      { errors: { ...defaultErrors, email: 'A user already exists with this email' } },
      { status: 400 },
    );
  }

  if (!validateDisplayName(displayName)) {
    return json(
      { errors: { ...defaultErrors, displayName: 'Display name not provided' } },
      { status: 400 }
    )
  }

  const user = await createUser({ email, displayName }, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: 'Sign Up' }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const actionData = useActionData<typeof action>();
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className='flex min-h-full flex-col justify-center'>
      <div className='mx-auto w-full max-w-md px-8'>
        <Form method='post' className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email address
            </label>
            <div className='mt-1'>
              <input
                ref={emailRef}
                id='email'
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name='email'
                type='email'
                autoComplete='email'
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby='email-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.email ? (
                <div className='pt-1 text-red-700' id='email-error'>
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <div className='mt-1'>
              <input
                ref={passwordRef}
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby='password-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.password ? (
                <div className='pt-1 text-red-700' id='password-error'>
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor='displayName'
              className='block text-sm font-medium text-gray-700'
            >
              Display Name
            </label>
            <div className='mt-1'>
              <input
                ref={displayNameRef}
                id='displayName'
                name='displayName'
                type='text'
                required
                autoComplete="username"
                aria-invalid={actionData?.errors?.displayName ? true : undefined}
                aria-describedby='displayName-error'
                className='w-full rounded border border-gray-500 px-2 py-1 text-lg'
              />
              {actionData?.errors?.displayName ? (
                <div className='pt-1 text-red-700' id='displayName-error'>
                  {actionData.errors.displayName}
                </div>
              ) : null}
            </div>
          </div>

          <input type='hidden' name='redirectTo' value={redirectTo} />
          <button
            type='submit'
            className='w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400'
          >
            Create Account
          </button>
          <div className='flex items-center justify-center'>
            <div className='text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link
                className='text-blue-500 underline'
                to={{
                  pathname: '/login',
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
