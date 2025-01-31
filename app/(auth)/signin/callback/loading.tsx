import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <React.Fragment>
        Redirecting <Loader2 className='animate-spin'/>
    </React.Fragment>
  )
}

export default loading