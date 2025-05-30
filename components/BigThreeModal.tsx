'use client'

import React, { useState, useEffect } from 'react'
import { X, Dumbbell, Star, Clock, Flame, Target, Trophy, Zap } from 'lucide-react'

interface BigThreeModalProps {
  isOpen: boolean
  onClose: () => void
  onExerciseClick: (exerciseId: string) => void
}

const BigThreeModal: React.FC<BigThreeModalProps> = ({ isOpen, onClose, onExerciseClick }) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  const exercises = [
    {
      name: "스쿼트",
      emoji: "🦵",
      color: "from-red-400 via-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      description: "하체 근력 강화",
      id: "squat",
      difficulty: "⭐⭐⭐",
      calories: "180cal",
      time: "15분",
      muscle: "하체 전체",
      benefit: "하체 근력",
      icon: Target,
      stats: { strength: 95, popularity: 88, beginnerFriendly: 75 }
    },
    {
      name: "벤치프레스",
      emoji: "💪",
      color: "from-blue-400 via-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      description: "상체 근력 발달",
      id: "bench",
      difficulty: "⭐⭐⭐⭐",
      calories: "150cal",
      time: "12분",
      muscle: "가슴, 어깨, 삼두",
      benefit: "상체 근력",
      icon: Trophy,
      stats: { strength: 90, popularity: 95, beginnerFriendly: 65 }
    },
    {
      name: "데드리프트",
      emoji: "🔥",
      color: "from-green-400 via-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      description: "전신 근력 향상",
      id: "deadlift",
      difficulty: "⭐⭐⭐⭐⭐",
      calories: "220cal",
      time: "18분",
      muscle: "전신 근육",
      benefit: "전신 근력",
      icon: Zap,
      stats: { strength: 100, popularity: 85, beginnerFriendly: 50 }
    }
  ]

  const handleExerciseClick = (exerciseId: string) => {
    setSelectedExercise(exerciseId)
    setTimeout(() => {
      onExerciseClick(exerciseId)
      onClose()
    }, 300)
  }

  useEffect(() => {
    if (isOpen) {
      setAnimationPhase(0)
      const timer = setTimeout(() => setAnimationPhase(1), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 with 파티클 효과 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* 파티클 애니메이션 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-3/4 left-3/4 [animation-delay:0.5s]"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-1/2 left-1/2 [animation-delay:1s]"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-1/3 left-2/3 [animation-delay:1.5s]"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-2/3 left-1/3 [animation-delay:2s]"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-1/5 left-4/5 [animation-delay:0.3s]"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-4/5 left-1/5 [animation-delay:0.8s]"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-30 top-3/5 left-3/5 [animation-delay:1.3s]"></div>
        </div>
      </div>
      
      {/* 모달 컨테이너 */}
      <div className={`relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full transition-all duration-500 ${
        animationPhase === 1 ? 'animate-in slide-in-from-bottom-4 zoom-in-95' : 'scale-0'
      }`}>
        
        {/* 네온 테두리 효과 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl blur opacity-60 animate-pulse"></div>
        <div className="relative bg-white rounded-2xl border-4 border-black">
          
          {/* 헤더 */}
          <div className="relative bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 border-b-4 border-black rounded-t-2xl overflow-hidden">
            {/* 헤더 패턴 */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute w-4 h-4 border border-black rotate-45 left-0 top-1/2"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[12%] top-[45%]"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[24%] top-[55%]"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[36%] top-[50%]"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[48%] top-[60%]"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[60%] top-[45%]"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[72%] top-[55%]"></div>
              <div className="absolute w-4 h-4 border border-black rotate-45 left-[84%] top-[50%]"></div>
            </div>
            
            <div className="relative flex items-center justify-between p-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Dumbbell className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-black">
                    💪 BIG 3 운동
                  </h2>
                  <p className="text-xs text-black font-bold opacity-80">핵심 근력 운동</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 bg-red-500 text-white rounded-full border-2 border-black hover:bg-red-600 transition-all duration-200 font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 운동 카드들 */}
          <div className="p-3 space-y-2 bg-gradient-to-br from-gray-50 to-white">
            {exercises.map((exercise, index) => {
              const IconComponent = exercise.icon
              const isSelected = selectedExercise === exercise.id
              const delayClass = index === 0 ? '' : index === 1 ? '[transition-delay:100ms]' : '[transition-delay:200ms]'
              
              return (
                <div
                  key={exercise.name}
                  className={`transform transition-all duration-300 ${delayClass} ${
                    animationPhase === 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <button
                    onClick={() => handleExerciseClick(exercise.id)}
                    className={`w-full group relative bg-gradient-to-br ${exercise.color} p-3 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 cursor-pointer overflow-hidden ${
                      isSelected ? 'animate-pulse scale-105' : 'hover:scale-101'
                    }`}
                  >
                    {/* 메인 컨텐츠 */}
                    <div className="relative flex items-center space-x-3">
                      {/* 운동 아이콘 & 이모지 */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-12 h-12 bg-white rounded-full border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                            <div className="text-xl">{exercise.emoji}</div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                            <IconComponent className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* 운동 정보 */}
                      <div className="flex-1 text-left">
                        <h3 className="text-base font-black text-white drop-shadow-lg mb-1">
                          {exercise.name}
                        </h3>
                        <p className="text-xs text-white font-bold opacity-90 mb-1">
                          {exercise.description}
                        </p>
                        
                        {/* 상세 정보 */}
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-2.5 h-2.5 text-white" />
                            <span className="text-white font-bold">{exercise.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame className="w-2.5 h-2.5 text-white" />
                            <span className="text-white font-bold">{exercise.calories}</span>
                          </div>
                          <span className="text-yellow-300 text-xs">{exercise.difficulty}</span>
                        </div>
                      </div>
                      
                      {/* 우측 정보 */}
                      <div className="flex-shrink-0 text-center">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full border border-white flex items-center justify-center group-hover:animate-bounce">
                          <span className="text-sm font-black text-white">{index + 1}</span>
                        </div>
                        <div className="mt-1 text-sm text-white group-hover:animate-pulse">
                          →
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          {/* 하단 CTA */}
          <div className="relative bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 border-t-4 border-black p-3 rounded-b-2xl">
            <div className="text-center">
              <p className="text-white text-xs font-bold">
                운동을 선택하여 상세 가이드를 확인하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BigThreeModal 