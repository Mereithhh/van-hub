import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Loader2 className="animate-spin text-white w-12 h-12" />
    </div>
  )
}
