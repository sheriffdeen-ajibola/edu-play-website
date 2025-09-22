"use client"

import { useState, useEffect } from "react"

interface Video {
  id: string
  title: string
  description: string
  subject: string
  duration: string
  thumbnail: string
  youtubeId: string
}

const STORAGE_KEY = "eduplay-videos"

const defaultVideos: Video[] = [
  {
    id: "1",
    title: "Math Made Easy",
    description: "Learn complex math concepts with our step-by-step visual approach that makes everything clear.",
    subject: "Mathematics",
    duration: "15 min",
    thumbnail: "/math-equations-and-geometric-shapes-educational-co.jpg",
    youtubeId: "OmJ-4B-mS-Y",
  },
  {
    id: "2",
    title: "Science Explorations",
    description: "Discover the wonders of science through engaging experiments and real-world applications.",
    subject: "Science",
    duration: "22 min",
    thumbnail: "/science-laboratory-with-beakers-and-experiments.jpg",
    youtubeId: "d5xw3py8Kbg",
  },
  {
    id: "3",
    title: "Learn React",
    description:
      "Learn modern React basics in the most interactive, hands-on way possible in the full course for beginners.",
    subject: "Programming",
    duration: "18 min",
    thumbnail: "https://i.pinimg.com/736x/84/d4/1f/84d41f2e8078d20a79d9e5d69fa28644.jpg",
    youtubeId: "x4rFhThSX04",
  },
]

export function useVideoStorage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load videos from localStorage on mount
  useEffect(() => {
    console.log("Loading videos from storage...")
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedVideos = JSON.parse(stored)
        console.log("Loaded videos from storage:", parsedVideos.length)
        setVideos(parsedVideos)
      } else {
        // Initialize with default videos if none exist
        console.log("No stored videos found, using defaults")
        setVideos(defaultVideos)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVideos))
      }
    } catch (error) {
      console.error("Failed to load videos from storage:", error)
      setVideos(defaultVideos)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save videos to localStorage whenever videos change
  useEffect(() => {
    if (!isLoading && videos.length > 0) {
      try {
        console.log("Saving videos to storage:", videos.length)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
      } catch (error) {
        console.error("Failed to save videos to storage:", error)
      }
    }
  }, [videos, isLoading])

  const addVideo = (newVideoData: Omit<Video, "id">) => {
    console.log("Adding new video:", newVideoData.title)
    const newVideo: Video = {
      ...newVideoData,
      id: Date.now().toString(),
    }
    setVideos((prev) => [...prev, newVideo])
    return newVideo
  }

  const updateVideo = (id: string, updates: Partial<Omit<Video, "id">>) => {
    setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, ...updates } : video)))
  }

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((video) => video.id !== id))
  }

  const getVideoById = (id: string) => {
    return videos.find((video) => video.id === id)
  }

  const getVideosBySubject = (subject: string) => {
    return videos.filter((video) => video.subject === subject)
  }

  const searchVideos = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(lowercaseQuery) ||
        video.description.toLowerCase().includes(lowercaseQuery) ||
        video.subject.toLowerCase().includes(lowercaseQuery),
    )
  }

  const getAllSubjects = () => {
    return Array.from(new Set(videos.map((video) => video.subject)))
  }

  const getVideoCount = () => videos.length

  const getVideoCountBySubject = (subject: string) => {
    return videos.filter((video) => video.subject === subject).length
  }

  return {
    videos,
    isLoading,
    addVideo,
    updateVideo,
    deleteVideo,
    getVideoById,
    getVideosBySubject,
    searchVideos,
    getAllSubjects,
    getVideoCount,
    getVideoCountBySubject,
  }
}
