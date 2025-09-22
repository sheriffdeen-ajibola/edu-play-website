"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Star, Users, BookOpen, Calculator, Atom, Clock, Globe, Code, Settings, X } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { AddVideoForm } from "@/components/add-video-form"
import { VideoList } from "@/components/video-list"
import { VideoManagement } from "@/components/video-management"
import { useVideoStorage } from "@/hooks/use-video-storage"

type ViewMode = "home" | "all-videos" | "management"

export default function HomePage() {
  const { videos, isLoading, addVideo, updateVideo, deleteVideo, getAllSubjects, getVideoCountBySubject } =
    useVideoStorage()

  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewMode>("home")

  const handleVideoClick = (video: any) => {
    console.log("Video clicked:", video.title, "YouTube ID:", video.youtubeId)
    if (!video || !video.youtubeId) {
      console.error("Invalid video data:", video)
      return
    }
    setSelectedVideo(video)
    setIsPlayerOpen(true)
  }

  const handleClosePlayer = () => {
    console.log("Closing video player")
    setIsPlayerOpen(false)
    setSelectedVideo(null)
  }

  const handleAddVideo = (newVideoData: any) => {
    console.log("Adding video from form:", newVideoData.title)
    addVideo(newVideoData)
  }

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Play className="w-4 h-4 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    console.error("[v0] No videos available")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center mx-auto mb-4">
            <X className="w-4 h-4 text-destructive-foreground" />
          </div>
          <p className="text-muted-foreground">No videos available. Try refreshing the page.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  const renderHeader = () => (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">EduPlay</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => handleViewChange("home")}
            className={`transition-colors ${
              currentView === "home" ? "text-foreground" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleViewChange("all-videos")}
            className={`transition-colors ${
              currentView === "all-videos" ? "text-foreground" : "text-muted-foreground hover:text-primary"
            }`}
          >
            All Videos
          </button>
          <button
            onClick={() => handleViewChange("management")}
            className={`transition-colors ${
              currentView === "management" ? "text-foreground" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Manage
          </button>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <AddVideoForm onAddVideo={handleAddVideo} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange("management")}
            className="hidden md:flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage
          </Button>
          <Button variant="ghost" size="sm">
            Log In
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/931f6d92104130d0775a33a6e85ded65-9WcjkRdDOtcaWktTZaOh6CfQz7wIht.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )

  if (currentView === "all-videos") {
    return (
      <div className="min-h-screen bg-background">
        {renderHeader()}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">All Videos</h1>
            <p className="text-muted-foreground">
              Browse our complete collection of educational videos across all subjects.
            </p>
          </div>

          <VideoList videos={videos} onVideoClick={handleVideoClick} />
        </main>

        {selectedVideo && (
          <VideoPlayer
            videoId={selectedVideo.youtubeId}
            title={selectedVideo.title}
            isOpen={isPlayerOpen}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    )
  }

  if (currentView === "management") {
    return (
      <div className="min-h-screen bg-background">
        {renderHeader()}
        <main className="container mx-auto px-4 py-8">
          <VideoManagement
            videos={videos}
            onUpdateVideo={updateVideo}
            onDeleteVideo={deleteVideo}
            onVideoClick={handleVideoClick}
          />
        </main>

        {selectedVideo && (
          <VideoPlayer
            videoId={selectedVideo.youtubeId}
            title={selectedVideo.title}
            isOpen={isPlayerOpen}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    )
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/peaceful-nature-scene-with-plants-and-soft-lightin.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Unlock Your Potential
            <br />
            with Engaging Learning Videos
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-pretty opacity-90">
            Access world-class educational content designed to make learning fun and effective for students of all ages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => handleViewChange("all-videos")}
            >
              Browse Videos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-foreground bg-transparent"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">Featured Videos</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {videos.slice(0, 3).map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="aspect-video bg-muted relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{video.subject}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => handleViewChange("all-videos")}>
              View All Videos
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">Popular Subjects</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Mathematics</h3>
              <p className="text-sm text-muted-foreground">{getVideoCountBySubject("Mathematics")} videos</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Atom className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Science</h3>
              <p className="text-sm text-muted-foreground">{getVideoCountBySubject("Science")} videos</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">History</h3>
              <p className="text-sm text-muted-foreground">{getVideoCountBySubject("History")} videos</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Literature</h3>
              <p className="text-sm text-muted-foreground">{getVideoCountBySubject("Literature")} videos</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Programming</h3>
              <p className="text-sm text-muted-foreground">{getVideoCountBySubject("Programming")} videos</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Hear from thousands of students who have transformed their learning experience with our platform.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/931f6d92104130d0775a33a6e85ded65-9WcjkRdDOtcaWktTZaOh6CfQz7wIht.jpg" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "EduPlay has been a game-changer for my studies. The video explanations are so clear and engaging that I
                actually look forward to learning!"
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/931f6d92104130d0775a33a6e85ded65-9WcjkRdDOtcaWktTZaOh6CfQz7wIht.jpg" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Mike R.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I struggled with math until I found EduPlay. The step-by-step videos helped me understand concepts I
                never thought I could grasp."
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="w-12 h-12 mr-4">
                  <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-mode-images/931f6d92104130d0775a33a6e85ded65-9WcjkRdDOtcaWktTZaOh6CfQz7wIht.jpg" />
                  <AvatarFallback>EL</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Emily L.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The variety of subjects and quality of content is amazing. I've improved my grades significantly since
                using this platform."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-foreground" />
                </div>
                <span className="text-xl font-bold">EduPlay</span>
              </div>
              <p className="text-background/80 text-sm">
                Empowering students worldwide with engaging video content that makes learning accessible and enjoyable.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Browse Videos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Subjects
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Teachers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-background/60">© 2024 EduPlay. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.youtubeId}
          title={selectedVideo.title}
          isOpen={isPlayerOpen}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  )
}
