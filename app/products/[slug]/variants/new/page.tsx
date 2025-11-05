import { VariantForm } from '@/components/variants/create-variant-form'
import { getProductBySlug } from '@/lib/actions/product.actions';
import React from 'react'

interface Props{
  params: Promise<{slug: string}>
}

export default async function AddVarianPage({params}:Props) {
  const {slug} = await params;

  const res = await getProductBySlug(slug)


  return (
    <>
      <VariantForm product={res.data||null} />
    </>
  )
}
