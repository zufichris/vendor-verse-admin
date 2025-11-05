'use client'

import { useAuthStore } from '@/lib/stores/auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { LogOut } from 'lucide-react'

const unAuthenticatedRoutes = [
    '/login',
    '/forgot-password',
    '/verify-otp'
]

export default function Header() {
    const {init, user, logout} = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    

    useEffect(()=>{
        init().then(res =>{
            if (!res && !unAuthenticatedRoutes.includes(pathname)) {
                router.replace(`/login?callbackUrl=${pathname}`)
            }
        }).catch(console.error)



    },[init, pathname])

    const logoutUser = async()=>{
        await logout()
        
        router.replace(`/login?callbackUrl=${pathname}`)
    }

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-between">
            <Link href={"/"} className="text-5xl font-bold">
                LOGO
            </Link>
        </div>
        <div className="flex space-x-4">
            <Link href={"/products"}>Prodcts</Link>
            <Link href={"/categories"}>Categories</Link>
            <Link href={"/users"}>Users</Link>
            <Link href={"/orders"}>Orders</Link>
            <Link href={"/banners"}>Banners</Link>
            {
                user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                              <AvatarImage src={user?.profileImage || ''} />
                              <AvatarFallback>{`${user?.firstName[0]}${user?.lastName[0] || user?.firstName[1]}`.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel className="p-0 font-normal cursor-pointer">
                              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                  <AvatarImage src={user?.profileImage ?? ''} alt={user?.firstName??'profile photo'} />
                                  <AvatarFallback>{`${user?.firstName[0]}${user?.lastName[0] || user?.firstName[1]}`.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                  <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                                  <span className="truncate text-xs">{user?.email}</span>
                                </div>
                              </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup className="p-0 font-normal cursor-pointer">
                                <DropdownMenuItem className='cursor-pointer' onClick={logoutUser}>
                                    <LogOut /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
            
        </div>
    </nav>
  )
}
