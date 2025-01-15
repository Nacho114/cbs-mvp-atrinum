import React from 'react'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

const Loading: React.FC = () => {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-screen w-screen bg-gray-100',
      )}
    >
      <div className="animate-spin">
        <Loader size={48} />
      </div>
    </div>
  )
}

export default Loading
