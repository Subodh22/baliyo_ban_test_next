import React from 'react'
import { trpc } from '../../utils/trpc'

export default function sendNotifications() {
    const {data} = trpc.post.sendNotice.useQuery({token:"dd"})

  return (
    <div>sendNotifications</div>
  )
}
