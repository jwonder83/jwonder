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
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
      description: "하체 파워업! 💪",
      id: "squat",
      difficulty: "⭐⭐⭐",
      calories: "180cal",
      time: "15분",
      muscle: "하체 전체",
      benefit: "다리 근력 MAX!",
      icon: Target,
      stats: { strength: 95, popularity: 88, beginnerFriendly: 75 }
    },
    {
      name: "벤치프레스",
      emoji: "💪",
      color: "from-blue-400 via-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      description: "상체 폭발! 🔥",
      id: "bench",
      difficulty: "⭐⭐⭐⭐",
      calories: "150cal",
      time: "12분",
      muscle: "가슴, 어깨, 삼두",
      benefit: "상체 킹왕짱!",
      icon: Trophy,
      stats: { strength: 90, popularity: 95, beginnerFriendly: 65 }
    },
    {
      name: "데드리프트",
      emoji: "🔥",
      color: "from-green-400 via-green-500 to-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-500",
      description: "전신 레전드! ⚡",
      id: "deadlift",
      difficulty: "⭐⭐⭐⭐⭐",
      calories: "220cal",
      time: "18분",
      muscle: "전신 근육",
      benefit: "최강 전사!",
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
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* 파티클 애니메이션 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60 top-1/4 left-1/4 animate-bounce"></div>
          <div className="absolute w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60 top-3/4 left-3/4 [animation-delay:0.5s] animate-pulse"></div>
          <div className="absolute w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60 top-1/2 left-1/2 [animation-delay:1s]"></div>
          <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60 top-1/3 left-2/3 [animation-delay:1.5s] animate-bounce"></div>
          <div className="absolute w-3 h-3 bg-red-400 rounded-full animate-ping opacity-60 top-2/3 left-1/3 [animation-delay:2s] animate-pulse"></div>
          <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60 top-1/5 left-4/5 [animation-delay:0.3s]"></div>
          <div className="absolute w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-60 top-4/5 left-1/5 [animation-delay:0.8s] animate-bounce"></div>
          <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60 top-3/5 left-3/5 [animation-delay:1.3s]"></div>
        </div>
      </div>
      
      {/* 모달 컨테이너 */}
      <div className={`relative bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 rounded-3xl border-6 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md w-full transition-all duration-500 ${
        animationPhase === 1 ? 'animate-in slide-in-from-bottom-4 zoom-in-95 animate-bounce' : 'scale-0'
      }`}>
        
        {/* 네온 테두리 효과 */}
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl blur opacity-75 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 rounded-3xl border-6 border-black">
          
          {/* 헤더 */}
          <div className="relative bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 border-b-6 border-black rounded-t-3xl overflow-hidden">
            {/* 헤더 패턴 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-0 top-1/2 bg-white animate-spin [animation-duration:3s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[12%] top-[45%] bg-yellow-300 animate-spin [animation-duration:4s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[24%] top-[55%] bg-pink-300 animate-spin [animation-duration:3.5s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[36%] top-[50%] bg-blue-300 animate-spin [animation-duration:4.5s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[48%] top-[60%] bg-green-300 animate-spin [animation-duration:3s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[60%] top-[45%] bg-purple-300 animate-spin [animation-duration:4s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[72%] top-[55%] bg-orange-300 animate-spin [animation-duration:3.5s]"></div>
              <div className="absolute w-6 h-6 border-3 border-black rotate-45 left-[84%] top-[50%] bg-red-300 animate-spin [animation-duration:4.5s]"></div>
            </div>
            
            <div className="relative flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                  <Dumbbell className="w-7 h-7 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black drop-shadow-lg">
                    💪 BIG 3 운동
                  </h2>
                  <p className="text-sm text-black font-black opacity-90">근력운동의 킹왕짱!</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-black fill-current animate-pulse" />
                    <span className="text-xs font-black text-red-600">전설의 운동들!</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-12 h-12 bg-red-500 text-white rounded-full border-4 border-black hover:bg-red-600 transition-all duration-200 font-black text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95 animate-pulse"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 운동 카드들 */}
          <div className="p-4 space-y-3 bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100">
            {exercises.map((exercise, index) => {
              const IconComponent = exercise.icon
              const isSelected = selectedExercise === exercise.id
              const delayClass = index === 0 ? '' : index === 1 ? '[transition-delay:150ms]' : '[transition-delay:300ms]'
              
              return (
                <div
                  key={exercise.name}
                  className={`transform transition-all duration-500 ${delayClass} ${
                    animationPhase === 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                  }`}
                >
                  <button
                    onClick={() => handleExerciseClick(exercise.id)}
                    className={`w-full group relative bg-gradient-to-br ${exercise.color} p-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105 ${
                      isSelected ? 'animate-pulse scale-110' : ''
                    }`}
                  >
                    {/* 반짝이는 배경 효과 */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute w-4 h-4 border-2 border-white rotate-45 top-2 left-2 animate-ping"></div>
                      <div className="absolute w-3 h-3 border-2 border-white rotate-45 top-4 right-4 animate-ping [animation-delay:0.5s]"></div>
                      <div className="absolute w-2 h-2 border-2 border-white rotate-45 bottom-3 left-6 animate-ping [animation-delay:1s]"></div>
                      <div className="absolute w-3 h-3 border-2 border-white rotate-45 bottom-2 right-8 animate-ping [animation-delay:1.5s]"></div>
                    </div>
                    
                    {/* 메인 컨텐츠 */}
                    <div className="relative flex items-center space-x-4">
                      {/* 운동 아이콘 & 이모지 */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:animate-bounce">
                            <div className="text-3xl animate-pulse">{exercise.emoji}</div>
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                            <IconComponent className="w-4 h-4 text-yellow-300" />
                          </div>
                        </div>
                      </div>
                      
                      {/* 운동 정보 */}
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-black text-white drop-shadow-lg mb-1">
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-white font-black opacity-90 mb-2">
                          {exercise.description}
                        </p>
                        
                        {/* 상세 정보 */}
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-white font-black text-xs">{exercise.time}</span>
                          </div>
                          <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
                            <Flame className="w-3 h-3 text-white" />
                            <span className="text-white font-black text-xs">{exercise.calories}</span>
                          </div>
                          <span className="text-yellow-300 text-sm font-black">{exercise.difficulty}</span>
                        </div>
                        
                        {/* 혜택 */}
                        <div className="mt-2">
                          <span className="text-yellow-200 text-xs font-black bg-black bg-opacity-20 rounded-full px-2 py-1">
                            {exercise.benefit}
                          </span>
                        </div>
                      </div>
                      
                      {/* 우측 정보 */}
                      <div className="flex-shrink-0 text-center">
                        <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full border-3 border-white flex items-center justify-center group-hover:animate-bounce mb-2">
                          <span className="text-2xl font-black text-white drop-shadow-lg">{index + 1}</span>
                        </div>
                        <div className="text-2xl text-white group-hover:animate-bounce text-center">
                          ➤
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          {/* 하단 CTA */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 border-t-6 border-black p-4 rounded-b-3xl overflow-hidden">
            {/* 반짝이는 배경 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-pulse opacity-50"></div>
            
            <div className="relative text-center">
              <p className="text-white text-base font-black drop-shadow-lg mb-2">
                🎯 운동을 클릭해서 레벨업하자! 🚀
              </p>
              <p className="text-white text-sm font-black opacity-90">
                💥 근육 폭발 가이드 보러가기! 💥
              </p>
              
              {/* 장식 요소 */}
              <div className="flex justify-center space-x-2 mt-3">
                {['⭐', '💪', '🔥', '⚡', '🏆'].map((emoji, i) => (
                  <div
                    key={i}
                    className="text-xl animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BigThreeModal 