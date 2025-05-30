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
      description: "하체 근력의 기초!",
      id: "squat",
      difficulty: "⭐⭐⭐",
      calories: "180cal",
      time: "15분",
      muscle: "하체 전체",
      benefit: "다리 근력 UP!",
      icon: Target,
      stats: { strength: 95, popularity: 88, beginnerFriendly: 75 }
    },
    {
      name: "벤치프레스",
      emoji: "💪",
      color: "from-blue-400 via-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      description: "상체 근력의 핵심!",
      id: "bench",
      difficulty: "⭐⭐⭐⭐",
      calories: "150cal",
      time: "12분",
      muscle: "가슴, 어깨, 삼두",
      benefit: "상체 파워 UP!",
      icon: Trophy,
      stats: { strength: 90, popularity: 95, beginnerFriendly: 65 }
    },
    {
      name: "데드리프트",
      emoji: "🔥",
      color: "from-green-400 via-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      description: "전신 근력의 왕!",
      id: "deadlift",
      difficulty: "⭐⭐⭐⭐⭐",
      calories: "220cal",
      time: "18분",
      muscle: "전신 근육",
      benefit: "완전체 변신!",
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
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 모달 컨테이너 */}
      <div className={`relative bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl border-6 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full transition-all duration-500 ${
        animationPhase === 1 ? 'animate-in slide-in-from-bottom-4 zoom-in-95' : 'scale-0'
      }`}>
        
        {/* 네온 테두리 효과 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl blur opacity-75 animate-pulse"></div>
        <div className="relative bg-white rounded-3xl border-6 border-black">
          
          {/* 헤더 */}
          <div className="relative bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 border-b-6 border-black rounded-t-3xl overflow-hidden">
            {/* 헤더 패턴 */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 border-2 border-black rotate-45"
                  style={{
                    left: `${i * 8}%`,
                    top: `${Math.sin(i) * 20 + 50}%`
                  }}
                />
              ))}
            </div>
            
            <div className="relative flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                  <Dumbbell className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-black cartoon-text mb-1 drop-shadow-lg">
                    💪 BIG 3 운동
                  </h2>
                  <p className="text-lg text-black font-bold opacity-80">근력운동의 성삼위일체!</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-black fill-current" />
                    <span className="text-sm font-bold">전설의 운동들</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-12 h-12 bg-red-500 text-white rounded-full border-4 border-black hover:bg-red-600 transition-all duration-200 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95"
                aria-label="모달 닫기"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 운동 카드들 */}
          <div className="p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white">
            {exercises.map((exercise, index) => {
              const IconComponent = exercise.icon
              const isSelected = selectedExercise === exercise.id
              
              return (
                <div
                  key={exercise.name}
                  className={`transform transition-all duration-300 ${
                    animationPhase === 1 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <button
                    onClick={() => handleExerciseClick(exercise.id)}
                    className={`w-full group relative bg-gradient-to-br ${exercise.color} p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300 cursor-pointer overflow-hidden ${
                      isSelected ? 'animate-pulse scale-105' : 'hover:scale-102'
                    }`}
                  >
                    {/* 배경 패턴 */}
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-4 h-4 border border-black rotate-45 group-hover:animate-spin"
                          style={{
                            left: `${10 + i * 12}%`,
                            top: `${20 + (i % 2) * 60}%`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* 메인 컨텐츠 */}
                    <div className="relative flex items-center space-x-6">
                      {/* 운동 아이콘 & 이모지 */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                            <div className="text-4xl">{exercise.emoji}</div>
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* 운동 정보 */}
                      <div className="flex-1 text-left">
                        <h3 className="text-2xl font-black text-white drop-shadow-lg mb-1">
                          {exercise.name}
                        </h3>
                        <p className="text-white font-bold opacity-90 mb-2">
                          {exercise.description}
                        </p>
                        
                        {/* 상세 정보 */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="text-white font-bold">{exercise.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-white" />
                            <span className="text-white font-bold">{exercise.calories}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-white font-bold opacity-80">{exercise.muscle}</span>
                          </div>
                        </div>
                        
                        {/* 난이도 표시 */}
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-white font-bold text-sm">난이도:</span>
                          <span className="text-yellow-300 text-sm">{exercise.difficulty}</span>
                        </div>
                      </div>
                      
                      {/* 우측 정보 */}
                      <div className="flex-shrink-0 text-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full border-2 border-white flex items-center justify-center mb-2 group-hover:animate-bounce">
                          <span className="text-3xl font-black text-white">{index + 1}</span>
                        </div>
                        <div className="text-white font-black text-sm opacity-80">
                          {exercise.benefit}
                        </div>
                        <div className="mt-2 text-2xl text-white group-hover:animate-pulse">
                          →
                        </div>
                      </div>
                    </div>
                    
                    {/* 진행도 바 */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-xs text-white font-bold">
                        <span>근력효과</span>
                        <span>인기도</span>
                        <span>초심자</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(exercise.stats).map(([key, value]) => (
                          <div key={key} className="bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-1000 ease-out"
                              style={{ 
                                width: animationPhase === 1 ? `${value}%` : '0%',
                                transitionDelay: `${(index * 150) + 500}ms`
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>

          {/* 하단 CTA */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 border-t-6 border-black p-6 rounded-b-3xl overflow-hidden">
            {/* 배경 애니메이션 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-pulse opacity-50"></div>
            
            <div className="relative text-center">
              <p className="text-white text-lg font-black drop-shadow-lg mb-2">
                🎯 운동을 클릭하면 상세 가이드로 순간이동!
              </p>
              <p className="text-white text-sm font-bold opacity-90">
                ✨ 당신의 근육 레벨업이 시작됩니다! ✨
              </p>
              
              {/* 장식 요소 */}
              <div className="flex justify-center space-x-4 mt-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce border border-black"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
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