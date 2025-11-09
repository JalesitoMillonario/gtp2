import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, Shield } from "lucide-react";

export default function VideoPlayer({ lesson, progress, onProgressUpdate, onComplete }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isYouTube = lesson.video_url?.includes('youtube.com') || lesson.video_url?.includes('youtu.be');
  const isVimeo = lesson.video_url?.includes('vimeo.com');
  const isLocalVideo = lesson.video_url?.includes('/uploads/videos/');

  const getEmbedUrl = () => {
    if (isYouTube) {
      let videoId = '';
      
      if (lesson.video_url.includes('youtube.com/watch?v=')) {
        videoId = lesson.video_url.split('v=')[1]?.split('&')[0];
      } else if (lesson.video_url.includes('youtu.be/')) {
        videoId = lesson.video_url.split('youtu.be/')[1]?.split('?')[0];
      } else if (lesson.video_url.includes('youtube.com/embed/')) {
        videoId = lesson.video_url.split('embed/')[1]?.split('?')[0];
      }
      
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1`;
    }
    
    if (isVimeo) {
      const videoId = lesson.video_url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?byline=0&portrait=0&title=0`;
    }
    
    return lesson.video_url;
  };

  useEffect(() => {
    if (videoRef.current && (isLocalVideo || (!isYouTube && !isVimeo))) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        const percentage = (video.currentTime / video.duration) * 100;
        onProgressUpdate?.(percentage);
        
        if (percentage > 90 && !progress?.completed) {
          onComplete?.();
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [lesson, progress, isYouTube, isVimeo, isLocalVideo, onComplete, onProgressUpdate]);

  return (
    <Card className="bg-white border-slate-200 overflow-hidden shadow-sm">
      <div className="aspect-video bg-black relative group">
        {isLocalVideo ? (
          // ✅ VIDEO LOCAL (TU VM) - TOTALMENTE PROTEGIDO
          <video
            ref={videoRef}
            src={lesson.video_url}
            controls
            className="w-full h-full"
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        ) : isYouTube || isVimeo ? (
          // YouTube/Vimeo iframe
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={lesson.title}
          />
        ) : (
          // Otros videos
          <video
            ref={videoRef}
            src={lesson.video_url}
            controls
            className="w-full h-full"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}

        {isLocalVideo && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Badge className="bg-green-600 text-white border-0 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Video protegido
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{lesson.title}</h2>
            {lesson.description && (
              <p className="text-slate-600">{lesson.description}</p>

            )}

          </div>

          {progress?.completed && (

            <Badge className="bg-green-500/20 text-green-600 border-green-500/30 flex items-center gap-2">

              <CheckCircle2 className="w-4 h-4" />

              Completada

            </Badge>

          )}

        </div>

        {lesson.duration_minutes > 0 && (

          <div className="flex items-center gap-2 text-sm text-slate-500">

            <Clock className="w-4 h-4" />

            <span>{lesson.duration_minutes} minutos</span>

          </div>

        )}

        {progress && (isLocalVideo || (!isYouTube && !isVimeo)) && (

          <div>

            <div className="flex justify-between text-sm text-slate-500 mb-2">

              <span>Progreso de la lección</span>

              <span>{Math.round(progress.progress_percentage || 0)}%</span>

            </div>

            <Progress 

              value={progress.progress_percentage || 0} 

              className="h-2"

            />

          </div>

        )}

      </CardContent>

    </Card>

  );

}

