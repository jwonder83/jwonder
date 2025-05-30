import { GoogleGenerativeAI } from '@google/generative-ai'

// API 키 확인
const apiKey = process.env.GEMINI_API_KEY
console.log('🔑 API 키 상태:', apiKey ? `✅ 설정됨 (${apiKey.substring(0, 10)}...)` : '❌ 없음')

let genAI: GoogleGenerativeAI | null = null

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey)
    console.log('✅ GoogleGenerativeAI 초기화 성공')
  } catch (error) {
    console.error('❌ GoogleGenerativeAI 초기화 실패:', error)
  }
}

export async function POST(request: Request) {
  console.log('🚀 API 요청 시작')
  
  try {
    const { message } = await request.json()
    console.log('💬 받은 메시지:', message)

    if (!message) {
      console.log('❌ 메시지가 없음')
      return Response.json({ error: '메시지가 필요합니다' }, { status: 400 })
    }

    // API 키가 없거나 초기화 실패 시 임시 응답
    if (!genAI) {
      console.log('⚠️ Gemini 사용 불가, 임시 응답 사용')
      const tempResponses = [
        '헤이~ 지금 AI 서버가 좀 바빠서 임시로 내가 답해줄게! 🎪',
        '야호! 뭔가 쿨한 질문이네! (임시 모드) 🌟',
        '오우~ 재미있어! 나중에 더 똑똑해져서 돌아올게! 🤖✨',
        '대박! 그거 좋은 생각이야! (테스트 중) 🚀',
        '헤헤~ 지금은 연습 중이야! 조금만 기다려줘! 🎯'
      ]
      
      const randomResponse = tempResponses[Math.floor(Math.random() * tempResponses.length)]
      
      return Response.json({ 
        response: randomResponse
      })
    }

    console.log('�� Gemini 모델 초기화 중... (gemini-1.5-flash)')
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = `당신은 '톡톡이'라는 이름의 친근하고 활발한 AI 어시스턴트입니다. 
90년대 카툰 캐릭터처럼 밝고 재미있게 대화하며, 이모지를 적절히 사용합니다. 
한국어로 답변하고, 150자 내외로 간결하게 대답해주세요.

사용자: ${message}

톡톡이:`

    console.log('📤 Gemini에 요청 전송 중...')
    const result = await model.generateContent(prompt)
    console.log('📥 Gemini 응답 받음')
    
    const response = result.response.text()
    console.log('✅ 최종 응답:', response)

    return Response.json({ 
      response: response || '음... 뭔가 말이 꼬였네! 다시 말해줄래? 😅'
    })

  } catch (error: unknown) {
    console.error('❌ Gemini API 에러:', error)
    console.error('📊 에러 상세:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // 에러 발생 시 재미있는 폴백 응답
    const errorResponses = [
      '헉! 잠시 머리가 하얘졌어요. 조금 후에 다시 시도해주세요! 🤖💫',
      '앗! 뭔가 꼬였네요! 다시 말해주세요~ 🎪🔧',
      '오잉? 제가 잠깐 딴 생각을 했나봐요! 🤔💭',
      '어머머! 잠시 정신줄을 놓았어요! 다시 해볼까요? 😅⚡'
    ]
    
    const randomError = errorResponses[Math.floor(Math.random() * errorResponses.length)]
    
    return Response.json({ 
      error: 'AI 응답 생성 중 오류가 발생했습니다',
      response: randomError
    }, { status: 500 })
  }
} 