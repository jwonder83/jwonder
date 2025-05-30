'use client'

import React from 'react'
import { X, Dumbbell } from 'lucide-react'

interface BigThreeModalProps {
  isOpen: boolean
  onClose: () => void
  onExerciseClick: (exerciseId: string) => void
}

const BigThreeModal: React.FC<BigThreeModalProps> = ({ isOpen, onClose, onExerciseClick }) => {
  const exercises = [
    {
      name: "스쿼트",
      emoji: "🦵", 
      color: "bg-red-400",
      description: "하체 근력의 기초!",
      id: "squat"
    },
    {
      name: "벤치프레스", 
      emoji: "💪",
      color: "bg-blue-400",
      description: "상체 근력의 핵심!",
      id: "bench"
    },
    {
      name: "데드리프트",
      emoji: "🔥",
      color: "bg-green-400", 
      description: "전신 근력의 왕!",
      id: "deadlift"
    }
  ]

  const handleExerciseClick = (exerciseId: string) => {
    onExerciseClick(exerciseId)
    onClose() // 모달 닫기
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-yellow-300">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-black">💪 BIG 3 운동</h2>
              <p className="text-sm text-gray-700 font-bold">근력운동의 핵심!</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 bg-red-400 text-black rounded-full border-2 border-black hover:bg-red-500 transition-colors font-bold"
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        {/* 운동 카드들 */}
        <div className="p-4 space-y-3">
          {exercises.map((exercise, index) => (
            <button
              key={exercise.name}
              onClick={() => handleExerciseClick(exercise.id)}
              className={`w-full ${exercise.color} p-4 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 cursor-pointer hover:scale-105`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{exercise.emoji}</div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-black text-black">{exercise.name}</h3>
                  <p className="text-sm font-medium text-black opacity-80">{exercise.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-black text-black opacity-30">
                    {index + 1}
                  </div>
                  <div className="text-xl font-black text-black opacity-50">
                    →
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 하단 메시지 */}
        <div className="p-4 border-t-4 border-black bg-purple-200">
          <p className="text-center text-sm font-bold text-black">
            🎯 운동을 클릭하면 상세 가이드로 이동해요!
          </p>
        </div>
      </div>
    </div>
  )
}

export default BigThreeModal 