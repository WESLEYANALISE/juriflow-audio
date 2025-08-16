import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, ExternalLink, Volume2 } from "lucide-react";
import { NewsItem } from "@/pages/Index";

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
}

export const NewsDetail = ({ news, onBack }: NewsDetailProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const openSource = () => {
    // Create an iframe to open the source within the app
    if (news.fonte) {
      window.open(news.fonte, '_blank');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-surface-elevated"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Featured Image */}
      <Card className="overflow-hidden bg-gradient-surface border-border/50">
        <div className="aspect-video bg-surface-elevated flex items-center justify-center">
          {news.capa ? (
            <img
              src={news.capa}
              alt={news.Titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="hidden w-full h-full bg-gradient-primary flex items-center justify-center">
              <Volume2 className="h-12 w-12 text-primary-foreground opacity-60" />
            </div>
          )}
        </div>
      </Card>

      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          {news.Titulo}
        </h1>
      </div>

      {/* Audio Player */}
      {news.audio && (
        <Card className="p-6 bg-gradient-surface border-border/50">
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlay}
              size="lg"
              className="flex-shrink-0 w-12 h-12 rounded-full bg-primary hover:bg-primary/90"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Áudio da notícia</span>
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div
                className="w-full h-2 bg-surface-elevated rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={news.audio}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        </Card>
      )}

      {/* Content */}
      <Card className="p-6 bg-gradient-surface border-border/50">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Resumo da Notícia
        </h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {news["Resumo breve"]}
        </p>
      </Card>

      {/* Source Link */}
      {news.fonte && (
        <Card className="p-6 bg-gradient-surface border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground mb-1">
                Fonte Original
              </h3>
              <p className="text-sm text-muted-foreground">
                Leia a notícia completa na fonte original
              </p>
            </div>
            <Button
              onClick={openSource}
              variant="outline"
              className="border-primary/20 hover:bg-primary/10 hover:border-primary/40"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Fonte
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};