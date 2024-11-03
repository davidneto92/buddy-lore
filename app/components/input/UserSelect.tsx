import { User } from '@prisma/client';
import { Form, Link } from '@remix-run/react';
import { useOptionalUser } from '~/util/sessionUtils';

interface ISelectOptions {
  value: string | number
  display: string
}

const getSelectOptions = <T extends string>(items: T[]): string => {
  return ''
}

interface IUserSelectProps {
  /**
   * `name` of the attribute to connect to the Remix `<Form />` component
   */
  name: string
  users: User[]
}

export function UserSelect({ name, users = [] }: IUserSelectProps) {
  return (
    <select name={name}>
      {/* map out names */}
      <option value='cat'>cat</option>
      <option value='dog'>dog</option>
    </select>
  );
}
