import { BlogList } from '@/components/blogs/blog-list'
import { Blog } from '@/types/blog';
import { Api, QueryResponse } from '@/utils/api';
import { notFound } from 'next/navigation';
import React from 'react'


interface BlogsProps {
  searchParams?: Promise<Record<string, string>>;
}

export default async function Blogs({
  searchParams,
}: BlogsProps) {
  const query = ( await searchParams) || {};

  const queryString = new URLSearchParams(query).toString();
  
    const {data} = await Api.get<QueryResponse<Blog>>(`/blogs${queryString ? `?${queryString}` : ''}`);
    
    if (!data) {
      return notFound();
    }

  return (
    <><BlogList
        data={data.data || []}
        filterCount={data.filterCount || 0}
        hasNextPage={data.hasNextPage || false}
        hasPreviousPage={data.hasPreviousPage || false}
        limit={data.limit || 20}
        page={data.page || 1}
        totalCount={data.totalCount || 0}
        totalPages={data.totalPages || 1}
    /></>
  )
}
