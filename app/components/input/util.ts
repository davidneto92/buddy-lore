import { User } from '@prisma/client'
import { SerializeFrom } from '@remix-run/node'
import { ISelectOptions } from '~/components/input/types'

export const getUserSelectItems = (items: SerializeFrom<User>[]): ISelectOptions[] => {
  return items.map(({ id, displayName }) => ({
    key: id,
    value: id,
    display: displayName,
  }))
}
