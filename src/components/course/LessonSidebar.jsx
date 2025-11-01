
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Play, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LessonSidebar({ lessons, selectedLesson, progress, onSelectLesson }) {
  const getLessonProgress = (lessonId) => {
    return progress.find(p => p.lesson_id === lessonId);
  };

  return (
    <Card className="bg-white border-slate-200 h-fit sticky top-4 shadow-sm">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Play className="w-5 h-5 text-cyan-600" />
          Lecciones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            {lessons.map((lesson, index) => {
              const lessonProgress = getLessonProgress(lesson.id);
              const isSelected = selectedLesson?.id === lesson.id;
              const isCompleted = lessonProgress?.completed;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 border ${
                    isSelected
                      ? 'bg-cyan-50 border-cyan-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isSelected 
                        ? 'bg-cyan-100' 
                        : 'bg-slate-200'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <span className={`text-sm font-semibold ${
                          isSelected ? 'text-cyan-600' : 'text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium mb-1 ${
                        isSelected ? 'text-cyan-600' : 'text-slate-900'
                      }`}>
                        {lesson.title}
                      </h4>
                      
                      {lesson.duration_minutes && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration_minutes} min</span>
                        </div>
                      )}

                      {lessonProgress && !isCompleted && lessonProgress.progress_percentage > 0 && (
                        <div className="mt-2">
                          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 transition-all duration-300"
                              style={{ width: `${lessonProgress.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
