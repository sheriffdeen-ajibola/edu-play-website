"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect } from "react"

interface VideoPlayerProps {
  videoId: string
  title: string
  isOpen: boolean
  onClose: () => void
}

export function VideoPlayer({ videoId, title, isOpen, onClose }: VideoPlayerProps) {
  useEffect(() => {
    if (isOpen) {
      console.log("[v0] Opening video player for:", title, "ID:", videoId)
    }
  }, [isOpen, title, videoId])

  if (!videoId) {
    console.error("[v0] No video ID provided to VideoPlayer")
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => console.error("[v0] Error loading YouTube video:", videoId)}
            onLoad={() => console.log("[v0] YouTube video loaded successfully:", videoId)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
