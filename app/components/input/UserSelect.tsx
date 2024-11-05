import type { User } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import { Form, Link } from '@remix-run/react';
import { ComponentPropsWithoutRef } from 'react';
import { getUserSelectItems } from '~/components/input/util';

interface IUserSelectProps extends ComponentPropsWithoutRef<'select'> {
  users: SerializeFrom<User>[]
  // todo: customize placeholder string for first entry
}

export function UserSelect({ users = [], ...selectProps }: IUserSelectProps) {
  const options = getUserSelectItems(users)

  return (
    <select {...selectProps}>
      <option defaultChecked value="">Select an author</option>
      {options.map(({ key, value, display }) => (
        <option key={key} value={value}>{display}</option>
      ))}
    </select>
  );
}
