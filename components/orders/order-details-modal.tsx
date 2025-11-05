'use client'

import { Order } from '@/types/order.types'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Dialog, DialogContent } from '../ui/dialog';
import OrderDetails from './order-details';

interface Props{
    order:Order
}

export default function OrderDetailsModal({order}:Props) {
  const router = useRouter();
    
    return (
      <Dialog open onOpenChange={() => router.back()}>
        <DialogContent className='w-2xl mx-auto'>
          <OrderDetails order={order}/>
        </DialogContent>
      </Dialog>
    )
}
