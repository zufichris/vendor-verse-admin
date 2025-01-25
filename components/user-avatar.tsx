import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const UserAvatar = ({ src, firstName, lastName, height = 30, width = 30 }: { src: string, firstName?: string, lastName?: string, height?: number, width?: number }) => {
    return (
        <Avatar className='h-8 w-8 uppercase m-0.5'>
            <AvatarImage height={height} width={width} src={src} />
            <AvatarFallback>{getFallback(firstName, lastName)}</AvatarFallback>
        </Avatar>
    )
}

function getFallback(firstName?: string, lastName?: string,): string {
    if (!firstName?.length)
        return ""
    if (lastName?.length) {
        return firstName.charAt(0) + lastName.charAt(0)
    }
    return firstName.charAt(1) + firstName.charAt(Math.floor(Math.random() * (firstName.length - 1)))
}