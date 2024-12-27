import { type ActionFunctionArgs, type LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { Header } from '~/components/Header'
import { UserSelect } from '~/components/input/UserSelect'
import { MAIN_TITLE } from '~/constants/pageTitles'
import { createLoreEntry } from '~/models/loreEntry.server'
import { getAllUsers } from '~/models/user.server'
import { requireUserId } from '~/session.server'
import { getMaxDateSelect } from '~/util/dateTime'

// loads all users for dropdown
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request)
  const users = await getAllUsers()
  return json({ users })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const isActive = !!formData.get('isActive');
  const authorId = formData.get('authorId') as string;
  const authorDate = formData.get('authorDate') as string;

  const defaultErrors = {
    title: null,
    description: null,
  }

  if (typeof title !== 'string' || title.length === 0) {
    return json(
      { errors: { ...defaultErrors, title: 'Title is required' } },
      { status: 400 },
    );
  }

  if (typeof description !== 'string' || description.length === 0) {
    return json(
      { errors: { ...defaultErrors, description: 'Description is required' } },
      { status: 400 },
    );
  }

  const newLoreEntry = await createLoreEntry({
    title,
    description,
    isActive,
    authorId,
    authorDate: new Date(authorDate),
    creatorId: userId,
  });

  return redirect(`/lore/${newLoreEntry.id}`);
};

export default function LoreEntryCreateNewPage() {
  const data = useLoaderData<typeof loader>()
  const { users = [] } = data || {}

  const actionData = useActionData<typeof action>();

  const minDate = '2000-01-01'
  const maxDate = getMaxDateSelect()

  return (
    <>
      <Header title={MAIN_TITLE} />
      <main className='flex justify-center'>
        <Form
          className='flex flex-col gap-5'
          method='post'
        >
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Title: </span>
              <input
                name="title"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                aria-invalid={actionData?.errors?.title ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.title ? "title-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.title ? (
              <div className="pt-1 text-red-700" id="title-error">
                {actionData.errors.title}
              </div>
            ) : null}
          </div>

          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Description: </span>
              <textarea
                name="description"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                aria-invalid={actionData?.errors?.description ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.description ? "description-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.description ? (
              <div className="pt-1 text-red-700" id="description-error">
                {actionData.errors.description}
              </div>
            ) : null}
          </div>

          <div>
            <label className="inline-flex items-center cursor-pointer">
              <input defaultChecked name='isActive' value='on' type='checkbox' className='sr-only peer' />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3">Active or played out?</span>
            </label>
          </div>

          <div>
            <label className="flex w-full flex-col gap-1" htmlFor='authorId'>
              <span>Author (optional)</span>
              <UserSelect
                name='authorId'
                className='border-2 border-blue-200'
                users={users}
              />
            </label>
          </div>

          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Author date (optional)</span>
              <input
                name="authorDate"
                type='date'
                min={minDate}
                max={maxDate}
                className="flex-1 rounded-md border-2 border-blue-200 px-3 text-lg leading-loose"
              />
            </label>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Submit
            </button>
          </div>

        </Form>
      </main>
    </>
  )
}
