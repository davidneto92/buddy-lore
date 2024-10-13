import { User } from '@prisma/client'

interface IUserDisplayProps extends Pick<User, 'displayName' | 'email'> { }

export function UserDisplay({ displayName, email }: IUserDisplayProps) {
  return (
    <div className='flex'>
      <div className='grid grid-cols-2 gap-y-2'>
        <p className='font-semibold'>Display Name</p>
        <p>{displayName}</p>
        <p className='font-semibold'>Email</p>
        <p>{email}</p>
      </div>
    </div>
  )
}
