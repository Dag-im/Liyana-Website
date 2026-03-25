import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileImage } from '@/components/shared/FileImage'
import { getYouTubeEmbedUrl } from '@/lib/media-utils'
import type { MediaItem } from '@/types/media.types'

type MediaLightboxProps = {
  item: MediaItem
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

export function MediaLightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: MediaLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all animate-in fade-in">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose} 
      />
      
      <div className="relative z-10 flex h-full w-full max-w-6xl items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 h-12 w-12 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-8 w-8" />
        </Button>

        {onPrev && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 h-16 w-16 text-white hover:bg-white/10 sm:-left-20"
            onClick={onPrev}
          >
            <ChevronLeft className="h-12 w-12" />
          </Button>
        )}

        <div className="flex h-full w-full items-center justify-center p-4">
          {item.type === 'video' ? (
            <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
              <iframe
                src={getYouTubeEmbedUrl(item.url) + '?autoplay=1'}
                title={item.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative flex h-full max-h-[90vh] w-full max-w-[90vw] items-center justify-center">
              <FileImage
                path={item.url}
                alt={item.title}
                className="h-full w-full object-contain"
                fallback={
                  <div className="text-white">Image not found</div>
                }
              />
            </div>
          )}
        </div>

        {onNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 h-16 w-16 text-white hover:bg-white/10 sm:-right-20"
            onClick={onNext}
          >
            <ChevronRight className="h-12 w-12" />
          </Button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-white">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="mt-1 text-sm text-white/60">
            {item.type === 'image' ? 'Image' : 'Video'}
          </p>
        </div>
      </div>
    </div>
  )
}
