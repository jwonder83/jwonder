'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, Bot } from 'lucide-react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '헤이~ 뭔가 도움이 필요하다구? 🎯',
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // 실제 API 호출 (OpenAI 예시)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error('API 요청 실패')
      }

      const data = await response.json()
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || '죄송해요, 응답을 생성할 수 없어요 😅',
        isUser: false,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('챗봇 에러:', error)
      
      // 에러 시 폴백 응답
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '앗! 잠시 문제가 생겼어요. 다시 시도해주세요! 🔧',
        isUser: false,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const generateBotResponse = (userInput: string): string => {
    const responses = [
      '야호! 그거 완전 쿨한 아이디어야! 🌟',
      '오우~ 재미있는 질문이네! 이런 건 어때? 🎪',
      '와우! 도움이 됐으면 좋겠어~ 또 물어봐! 🎨',
      '음... 그건 좀 더 생각해봐야겠는걸? 🤔💭',
      '대박! 그거 진짜 멋진 생각이야! 고고! 🚀✨',
      '헤헤~ 그런 거라면 내가 딱이지! 🎯',
    ]
    
    if (userInput.includes('안녕') || userInput.includes('하이') || userInput.includes('헬로')) {
      return '헤이헤이! 오늘도 화이팅이야! 🌈✨'
    } else if (userInput.includes('도움')) {
      return '오케이! 뭐든지 말해봐~ 내가 도와줄게! 🦸‍♂️💪'
    } else if (userInput.includes('고마워') || userInput.includes('감사')) {
      return '헤헤~ 별말씀을! 언제든 불러줘! 🤗🎈'
    } else if (userInput.includes('재미')) {
      return '재미? 그거라면 내가 최고지! 뭐 해볼까? 🎮🎪'
    }
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 채팅창 - 카툰 스타일 */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-yellow-50 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col animate-in slide-in-from-bottom-4 duration-500 transform">
          {/* 헤더 - 레트로 카툰 스타일 */}
          <div className="flex items-center justify-between p-4 border-b-4 border-black bg-red-400 rounded-t-2xl relative">
            {/* 카툰 스타일 장식 점들 */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-300 rounded-full border-2 border-black"></div>
            <div className="absolute top-2 right-12 w-2 h-2 bg-blue-300 rounded-full border-2 border-black"></div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-300 rounded-full border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Bot className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  톡톡이 🎪
                </h3>
                <p className="text-sm text-yellow-100 font-semibold">
                  ● 온라인
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-yellow-300 text-black rounded-full border-3 border-black hover:bg-yellow-400 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
              aria-label="채팅창 닫기"
            >
              <X className="w-5 h-5 mx-auto" />
            </button>
          </div>

          {/* 메시지 영역 - 카툰 배경 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-yellow-50 to-blue-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    message.isUser
                      ? 'bg-blue-400 text-white'
                      : 'bg-green-300 text-black'
                  }`}
                >
                  <p className="text-sm font-medium">{message.content}</p>
                  <p className={`text-xs mt-1 font-bold ${
                    message.isUser ? 'text-blue-100' : 'text-green-800'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* 타이핑 인디케이터 - 카툰 스타일 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-pink-300 text-black p-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce border-2 border-black"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce border-2 border-black [animation-delay:0.1s]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce border-2 border-black [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 - 카툰 스타일 */}
          <div className="p-4 border-t-4 border-black bg-purple-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="뭔가 재미있는 얘기 해봐! 🎨"
                className="flex-1 p-3 border-3 border-black rounded-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-3 bg-orange-400 text-black rounded-xl border-3 border-black hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[-2px] hover:translate-y-[-2px] font-bold"
                aria-label="메시지 전송"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토글 버튼 - 올드스쿨 카툰 스타일 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-yellow-400 text-black rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:scale-110 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 flex items-center justify-center group relative"
        aria-label={isOpen ? "채팅창 닫기" : "채팅창 열기"}
      >
        {isOpen ? (
          <X className="w-7 h-7 font-bold" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            {/* 카툰 스타일 알림 표시 */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              <span className="text-xs text-white font-black">!</span>
            </div>
            {/* 장식용 별 */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-pink-400 rounded-full border-2 border-black"></div>
          </>
        )}
      </button>
    </div>
  )
}

export default FloatingChatbot 