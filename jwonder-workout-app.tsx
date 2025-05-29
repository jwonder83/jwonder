"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Dumbbell, 
  Star, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  Apple,
  X,
  Users,
  Calendar
} from 'lucide-react';

// 타입 정의
interface Card {
  id: string;
  title: string;
  icon: string; // LucideIcon에서 string으로 변경
  size: string;
  category: string;
  color: string;
}

interface Exercise {
  name: string;
  steps: string[];
  tips: string[];
  benefits: string[];
}

interface Program {
  name: string;
  difficulty: string;
  duration: string;
  purpose: string;
  exercises: string[];
  schedule: string[];
  tips: string[];
}

interface NutritionGoal {
  protein: number;
  carbs: number;
  fat: number;
  name: string;
}

interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snack: string[];
}

interface UserStats {
  weight: string;
  height: string;
  age: string;
  activity: string;
}

interface OneRMRecord {
  id: number;
  exercise: string;
  oneRM: number;
  date: string;
}

interface UserData {
  programs: Program[];
  nutrition: any[];
  oneRMRecords: OneRMRecord[];
}

const JwonderWorkOut = () => {
  const [cards, setCards] = useState<Card[]>([
    // 3대운동 개별 카드들 - 다양한 사이즈 적용
    { id: 'squat', title: '스쿼트', icon: '🏋️‍♂️', size: 'large', category: 'squat', color: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600' },
    { id: 'bench', title: '벤치프레스', icon: '💪', size: 'large', category: 'bench', color: 'bg-gradient-to-br from-red-400 via-red-500 to-red-600' },
    { id: 'deadlift', title: '데드리프트', icon: '🔥', size: 'wide', category: 'deadlift', color: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600' },
    
    // 운동 프로그램 개별 카드들
    { id: 'beginner', title: '프로그램', icon: '🌱', size: 'small', category: 'beginner', color: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600' },
    { id: 'strength', title: '근력 향상', icon: '⚡', size: 'medium', category: 'strength', color: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500' },
    { id: 'hypertrophy', title: '근비대', icon: '💎', size: 'small', category: 'hypertrophy', color: 'bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500' },
    
    // 식단 & 영양 개별 카드들
    { id: 'goals', title: '목표 설정', icon: '🎯', size: 'medium', category: 'goals', color: 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500' },
    { id: 'nutrition-calc', title: '영양 계산기', icon: '🥗', size: 'wide', category: 'nutrition-calc', color: 'bg-gradient-to-br from-lime-400 via-green-500 to-emerald-500' },
    { id: 'meals', title: '식단 추천', icon: '🍎', size: 'small', category: 'meals', color: 'bg-gradient-to-br from-indigo-400 via-purple-500 to-violet-500' },
    
    // 1RM 계산기
    { id: 'calculator', title: '1RM 계산기', icon: '📊', size: 'large', category: 'calculator', color: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500' },
    
    // 새로운 카드 섹션들
    { id: 'workout-log', title: '운동 기록', icon: '📋', size: 'medium', category: 'workout-log', color: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600' },
    { id: 'community', title: '커뮤니티', icon: '👥', size: 'small', category: 'community', color: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600' },
  ]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const [userData, setUserData] = useState<UserData>({
    programs: [],
    nutrition: [],
    oneRMRecords: []
  });

  // 1RM 계산기 상태
  const [calcWeight, setCalcWeight] = useState<string>('');
  const [calcReps, setCalcReps] = useState<string>('');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // 영양 계산기 상태 추가
  const [nutritionForm, setNutritionForm] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    activityLevel: '1.55'
  });
  const [nutritionResults, setNutritionResults] = useState<{
    bmr: number;
    tdee: number;
    weightLoss: { calories: number; protein: number; carbs: number; fat: number };
    maintenance: { calories: number; protein: number; carbs: number; fat: number };
    weightGain: { calories: number; protein: number; carbs: number; fat: number };
  } | null>(null);

  // BMR 계산 함수 (Mifflin-St Jeor 공식)
  const calculateBMR = (gender: string, weight: number, height: number, age: number): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // 매크로 영양소 계산 함수
  const calculateMacros = (calories: number, goal: 'loss' | 'maintenance' | 'gain') => {
    let proteinRatio, carbsRatio, fatRatio;
    
    switch (goal) {
      case 'loss':
        proteinRatio = 0.30;
        carbsRatio = 0.40;
        fatRatio = 0.30;
        break;
      case 'maintenance':
        proteinRatio = 0.25;
        carbsRatio = 0.45;
        fatRatio = 0.30;
        break;
      case 'gain':
        proteinRatio = 0.25;
        carbsRatio = 0.50;
        fatRatio = 0.25;
        break;
      default:
        proteinRatio = 0.25;
        carbsRatio = 0.45;
        fatRatio = 0.30;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4), // 1g 단백질 = 4kcal
      carbs: Math.round((calories * carbsRatio) / 4), // 1g 탄수화물 = 4kcal
      fat: Math.round((calories * fatRatio) / 9) // 1g 지방 = 9kcal
    };
  };

  // 영양 계산 함수
  const calculateNutrition = () => {
    const { gender, age, height, weight, activityLevel } = nutritionForm;
    
    if (!age || !height || !weight) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const activityNum = parseFloat(activityLevel);

    if (ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      alert('올바른 값을 입력해주세요.');
      return;
    }

    // BMR 계산
    const bmr = calculateBMR(gender, weightNum, heightNum, ageNum);
    
    // TDEE 계산
    const tdee = bmr * activityNum;

    // 목표별 칼로리 계산
    const weightLossCalories = Math.round(tdee - 500); // 주당 0.5kg 감량
    const maintenanceCalories = Math.round(tdee);
    const weightGainCalories = Math.round(tdee + 400); // 주당 0.3-0.5kg 증량

    // 각 목표별 매크로 계산
    const weightLoss = {
      calories: weightLossCalories,
      ...calculateMacros(weightLossCalories, 'loss')
    };

    const maintenance = {
      calories: maintenanceCalories,
      ...calculateMacros(maintenanceCalories, 'maintenance')
    };

    const weightGain = {
      calories: weightGainCalories,
      ...calculateMacros(weightGainCalories, 'gain')
    };

    setNutritionResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss,
      maintenance,
      weightGain
    });
  };

  // 영양 계산기 리셋 함수
  const resetNutritionCalculator = () => {
    setNutritionForm({
      gender: 'male',
      age: '',
      height: '',
      weight: '',
      activityLevel: '1.55'
    });
    setNutritionResults(null);
  };

  // 영양 폼 입력 핸들러
  const handleNutritionFormChange = (field: string, value: string) => {
    setNutritionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 1RM 계산 함수 (Brzycki 공식)
  const calculateOneRM = () => {
    const weight = parseFloat(calcWeight);
    const reps = parseInt(calcReps);
    
    if (!weight || !reps || weight <= 0 || reps <= 0 || reps > 15) {
      alert('올바른 중량(kg)과 반복수(1-15회)를 입력해주세요.');
      return;
    }
    
    // Brzycki 공식: 1RM = 중량 ÷ (1.0278 - 0.0278 × 반복수)
    const oneRM = weight / (1.0278 - 0.0278 * reps);
    setCalcResult(Math.round(oneRM * 10) / 10); // 소수점 첫째자리까지
  };

  // 입력 필드 리셋
  const resetCalculator = () => {
    setCalcWeight('');
    setCalcReps('');
    setCalcResult(null);
  };

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('JwonderWorkOut 컴포넌트가 마운트되었습니다.');
  }, []);

  // 카드 클릭 핸들러
  const handleCardClick = (card: Card) => {
    if (!isDragging) {
      console.log('카드 클릭됨:', card.title);
      setSelectedCard(card);
    }
  };

  // 데스크톱 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    console.log('드래그 시작:', card.title);
    setDraggedCard(card);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
    
    // 드래그 이미지 설정
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg) scale(0.9)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 50);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCard: Card) => {
    e.preventDefault();
    console.log('드롭 이벤트:', targetCard.title);
    
    if (!draggedCard || draggedCard.id === targetCard.id) {
      return;
    }

    const draggedIndex = cards.findIndex(card => card.id === draggedCard.id);
    const targetIndex = cards.findIndex(card => card.id === targetCard.id);

    const newCards = [...cards];
    const [removed] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, removed);

    setCards(newCards);
    setDraggedCard(null);
    setIsDragging(false);
    console.log('카드 순서 변경 완료');
  };

  const handleDragEnd = () => {
    console.log('드래그 종료');
    setDraggedCard(null);
    setTimeout(() => setIsDragging(false), 100);
  };

  // 모바일 터치 드래그 핸들러
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, card: Card) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedCard(card);
    setDraggedElement(element);
    setIsDragging(false);
    
    // 터치 시작 시 시각적 피드백
    element.style.transition = 'transform 0.1s ease';
    element.style.transform = 'scale(0.98)';
    
    console.log('터치 시작:', card.title, { x: touch.clientX, y: touch.clientY });
    
    // 짧은 지연 후 드래그 준비
    setTimeout(() => {
      if (element && draggedCard?.id === card.id) {
        element.style.transition = 'none';
      }
    }, 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartPos || !draggedCard || !draggedElement) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.x;
    const deltaY = touch.clientY - touchStartPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // 5px 이상 움직이면 드래그로 인식
    if (distance > 5 && !isDragging) {
      setIsDragging(true);
      console.log('드래그 시작됨:', draggedCard.title);
      
      // 드래그 시작 시 스타일 적용
      draggedElement.style.position = 'relative';
      draggedElement.style.zIndex = '9999';
      draggedElement.style.pointerEvents = 'none';
      draggedElement.style.opacity = '0.9';
      draggedElement.style.transform = 'scale(1.05) rotate(3deg)';
      draggedElement.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
    }
    
    if (isDragging) {
      // 드래그 중 요소 이동
      draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05) rotate(3deg)`;
      
      // 드롭 대상 하이라이트
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const cardBelow = elementBelow?.closest('[data-card-id]') as HTMLElement;
      
      // 모든 카드의 하이라이트 제거
      document.querySelectorAll('[data-card-id]').forEach(el => {
        (el as HTMLElement).style.backgroundColor = '';
        (el as HTMLElement).style.outline = '';
      });
      
      // 드롭 대상 하이라이트
      if (cardBelow && cardBelow !== draggedElement) {
        cardBelow.style.outline = '3px solid #3b82f6';
        cardBelow.style.outlineOffset = '2px';
        cardBelow.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggedCard || !draggedElement) {
      resetTouchState();
      return;
    }

    // 드래그가 아닌 경우 클릭으로 처리
    if (!isDragging) {
      console.log('터치 클릭으로 처리:', draggedCard.title);
      
      // 클릭 애니메이션
      draggedElement.style.transform = 'scale(1.02)';
      setTimeout(() => {
        if (draggedElement) {
          draggedElement.style.transform = '';
          draggedElement.style.transition = '';
        }
      }, 150);
      
      setTimeout(() => handleCardClick(draggedCard), 100);
      resetTouchState();
      return;
    }

    // 드래그 종료 처리
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    let targetElement = elementBelow?.closest('[data-card-id]') as HTMLElement;
    
    // 드롭 성공 여부 확인
    let dropSuccess = false;
    
    if (targetElement && targetElement !== draggedElement) {
      const targetCardId = targetElement.getAttribute('data-card-id');
      const targetCard = cards.find(card => card.id === targetCardId);
      
      if (targetCard && targetCard.id !== draggedCard.id) {
        const draggedIndex = cards.findIndex(card => card.id === draggedCard.id);
        const targetIndex = cards.findIndex(card => card.id === targetCard.id);

        const newCards = [...cards];
        const [removed] = newCards.splice(draggedIndex, 1);
        newCards.splice(targetIndex, 0, removed);

        setCards(newCards);
        dropSuccess = true;
        console.log('터치 드래그로 카드 순서 변경 완료:', draggedCard.title, '→', targetCard.title);
        
        // 성공 피드백
        targetElement.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
        setTimeout(() => {
          if (targetElement) {
            targetElement.style.backgroundColor = '';
          }
        }, 500);
      }
    }
    
    // 드래그 실패 시 원래 위치로 애니메이션
    if (!dropSuccess) {
      draggedElement.style.transition = 'transform 0.3s ease';
      draggedElement.style.transform = '';
      console.log('드래그 취소됨');
    }

    // 모든 하이라이트 제거
    document.querySelectorAll('[data-card-id]').forEach(el => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.outlineOffset = '';
      (el as HTMLElement).style.backgroundColor = '';
    });

    // 상태 초기화
    setTimeout(() => resetTouchState(), dropSuccess ? 0 : 300);
  };

  // 터치 취소 핸들러
  const handleTouchCancel = () => {
    console.log('터치 취소됨');
    if (draggedElement) {
      draggedElement.style.transition = 'transform 0.3s ease';
      draggedElement.style.transform = '';
    }
    
    // 모든 하이라이트 제거
    document.querySelectorAll('[data-card-id]').forEach(el => {
      (el as HTMLElement).style.outline = '';
      (el as HTMLElement).style.backgroundColor = '';
    });
    
    setTimeout(() => resetTouchState(), 300);
  };

  // 터치 상태 초기화 함수
  const resetTouchState = () => {
    if (draggedElement) {
      draggedElement.style.position = '';
      draggedElement.style.zIndex = '';
      draggedElement.style.pointerEvents = '';
      draggedElement.style.opacity = '';
      draggedElement.style.transform = '';
      draggedElement.style.transition = '';
      draggedElement.style.boxShadow = '';
    }
    
    setTouchStartPos(null);
    setDraggedCard(null);
    setDraggedElement(null);
    setIsDragging(false);
  };

  // 카드 크기 클래스 - 더 작은 사이즈로 조정
  const getCardSizeClass = (size: string) => {
    switch (size) {
      case 'xlarge':
        return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2'; // 3→2로 더 축소
      case 'large':
        return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'; // 2×2→2×1로 축소
      case 'wide':
        return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'; // 3→2로 더 축소
      case 'medium':
        return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'; // 1→2로 확대
      case 'small':
      default:
        return 'col-span-2 row-span-1 md:col-span-2 md:row-span-1'; // 1×1에서 2×1로 확대
    }
  };

  // 카드 아이콘 크기 조정 - 이모지에 맞게 수정
  const getIconSize = (size: string) => {
    switch (size) {
      case 'xlarge':
        return 'w-16 h-16 mb-2 text-6xl'; // 이모지용 텍스트 크기
      case 'large':
        return 'w-14 h-14 mb-2 text-5xl'; // 이모지용 텍스트 크기
      case 'wide':
        return 'w-14 h-14 mb-2 text-5xl'; // 이모지용 텍스트 크기
      case 'medium':
        return 'w-12 h-12 mb-2 text-4xl'; // 이모지용 텍스트 크기
      case 'small':
      default:
        return 'w-10 h-10 mb-2 text-3xl'; // 이모지용 텍스트 크기
    }
  };

  // 카드 텍스트 크기 조정 - 더 작게
  const getTextSize = (size: string) => {
    switch (size) {
      case 'xlarge':
        return 'text-base'; // xl→base로 더 축소
      case 'large':
        return 'text-sm'; // lg→sm으로 더 축소
      case 'wide':
        return 'text-sm'; // base→sm으로 더 축소
      case 'medium':
        return 'text-xs'; // sm→xs로 더 축소
      case 'small':
      default:
        return 'text-xs'; // xs 유지
    }
  };

  // 각 카드별 세부페이지 렌더링 함수
  const renderCardContent = () => {
    if (!selectedCard) return null;

    switch (selectedCard.category) {
      case 'squat':
    return (
      <div className="p-6 space-y-6 relative">
        {/* 카툰풍 배경 장식 요소들 */}
        <div className="absolute top-10 right-20 text-3xl text-blue-400/40 animate-bounce">💪</div>
        <div className="absolute bottom-20 left-16 text-2xl text-yellow-400/40 animate-pulse">⭐</div>
        <div className="absolute top-1/2 right-10 text-xl text-green-400/40 animate-ping">✨</div>
        
            <div className="bg-gradient-to-br from-blue-200/90 to-indigo-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-blue-200 to-indigo-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Dumbbell className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
            <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">스쿼트 가이드</h2>
                  <p className="text-blue-800 font-bold text-xl">💥 하체 근력의 왕! 💥</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-red-500/60 rotate-12 animate-pulse">SQUAT!</div>
                </div>
            </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    올바른 자세
                  </h3>
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <span className="font-semibold">발을 어깨너비로 벌리고 발끝을 약간 바깥쪽으로</span>
                  </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <span className="font-semibold">무릎이 발끝 방향으로 나가도록 주의</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <span className="font-semibold">허리는 자연스러운 아치를 유지</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">4</span>
                      </div>
                      <span className="font-semibold">엉덩이를 뒤로 빼면서 앉는 동작</span>
                    </li>
              </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    주요 효과
                  </h3>
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">💪</span>
                      </div>
                      <span className="font-semibold">대퇴사두근, 햄스트링, 둔근 강화</span>
                  </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">🔥</span>
                      </div>
                      <span className="font-semibold">코어 안정성 향상</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">⚡</span>
                      </div>
                      <span className="font-semibold">전신 근력 및 파워 증진</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">✨</span>
                      </div>
                      <span className="font-semibold">일상생활 기능성 향상</span>
                    </li>
              </ul>
            </div>
          </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-spin-slow">🏆</div>
                <div className="absolute bottom-2 left-2 text-xl animate-bounce">📚</div>
                
                <h3 className="text-2xl font-black text-black mb-6 flex items-center cartoon-text">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  초보자 프로그램
                  <div className="ml-3 text-green-600 font-black text-sm">START!</div>
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">1주차</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">3세트 × 8-10회<br/>자체중량 연습</p>
                      <div className="mt-2 text-2xl">🌱</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-300 to-cyan-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">2-3주차</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">3세트 × 6-8회<br/>가벼운 중량 추가</p>
                      <div className="mt-2 text-2xl">🌿</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">4주차+</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">3-4세트 × 5-6회<br/>점진적 중량 증가</p>
                      <div className="mt-2 text-2xl">🌳</div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    );

      case 'bench':
    return (
      <div className="p-6 space-y-6 relative">
        {/* 카툰풍 배경 장식 요소들 */}
        <div className="absolute top-16 left-20 text-3xl text-red-400/40 animate-bounce">🔥</div>
        <div className="absolute bottom-24 right-16 text-2xl text-orange-400/40 animate-pulse">💥</div>
        <div className="absolute top-1/3 left-10 text-xl text-pink-400/40 animate-ping">⚡</div>
        
            <div className="bg-gradient-to-br from-red-200/90 to-pink-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-red-200 to-pink-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Dumbbell className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">벤치프레스 가이드</h2>
                  <p className="text-red-800 font-bold text-xl">🚀 상체 근력의 킹! 🚀</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-blue-500/60 rotate-12 animate-pulse">PRESS!</div>
                </div>
            </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    올바른 자세
                  </h3>
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <span className="font-semibold">어깨뼈를 뒤로 모으고 가슴을 펴기</span>
                  </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <span className="font-semibold">발은 바닥에 단단히 고정</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <span className="font-semibold">바벨은 가슴 중앙 부분에 터치</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">4</span>
                      </div>
                      <span className="font-semibold">팔꿈치는 45도 각도 유지</span>
                    </li>
              </ul>
            </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    발전 단계
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">초급 🌱</h4>
                      <p className="font-semibold text-gray-800">자체중량 푸시업 → 인클라인 벤치</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">중급 🔥</h4>
                      <p className="font-semibold text-gray-800">플랫 벤치프레스 → 디클라인</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">고급 💪</h4>
                      <p className="font-semibold text-gray-800">파워리프팅 기법 → 최대중량</p>
                    </div>
                  </div>
                </div>
            </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">⚠️</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🛡️</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">안전 수칙</h3>
                <div className="grid md:grid-cols-2 gap-6 font-bold text-gray-800">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🤝</span>
                    </div>
                    <span>항상 스포터와 함께 운동</span>
            </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🔥</span>
                    </div>
                    <span>충분한 워밍업 필수</span>
          </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🛡️</span>
                    </div>
                    <span>세이프티 바 설정</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">⚠️</span>
                    </div>
                    <span>무리한 중량 금지</span>
                  </div>
                </div>
              </div>
        </div>
      </div>
    );

      case 'deadlift':
    return (
      <div className="p-6 space-y-6 relative">
        {/* 카툰풍 배경 장식 요소들 */}
        <div className="absolute top-12 right-24 text-3xl text-purple-400/40 animate-bounce">💀</div>
        <div className="absolute bottom-16 left-20 text-2xl text-violet-400/40 animate-pulse">⚡</div>
        <div className="absolute top-1/4 left-12 text-xl text-pink-400/40 animate-ping">💥</div>
        
            <div className="bg-gradient-to-br from-purple-200/90 to-violet-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-purple-200 to-violet-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Dumbbell className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
            <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">데드리프트 가이드</h2>
                  <p className="text-purple-800 font-bold text-xl">⚡ 전신 근력의 킹! ⚡</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-orange-500/60 rotate-12 animate-pulse">LIFT!</div>
                </div>
            </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    기본 자세
                  </h3>
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <span className="font-semibold">발은 어깨너비, 바벨에 가깝게</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <span className="font-semibold">무릎을 굽혀 바벨을 잡기</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <span className="font-semibold">가슴을 펴고 어깨를 뒤로</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">4</span>
                      </div>
                      <span className="font-semibold">허리는 중립 자세 유지</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    주요 근육
                  </h3>
                  <div className="space-y-4 text-gray-800">
                    <div className="flex justify-between items-center p-3 bg-purple-100 rounded-2xl border-2 border-black">
                      <span className="font-bold">햄스트링</span>
                      <div className="w-20 bg-gray-300 rounded-full h-3 border border-black">
                        <div className="bg-purple-500 h-3 rounded-full w-full border-r border-black"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-100 rounded-2xl border-2 border-black">
                      <span className="font-bold">둔근</span>
                      <div className="w-20 bg-gray-300 rounded-full h-3 border border-black">
                        <div className="bg-purple-500 h-3 rounded-full w-5/6 border-r border-black"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-100 rounded-2xl border-2 border-black">
                      <span className="font-bold">척추기립근</span>
                      <div className="w-20 bg-gray-300 rounded-full h-3 border border-black">
                        <div className="bg-purple-500 h-3 rounded-full w-4/5 border-r border-black"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-100 rounded-2xl border-2 border-black">
                      <span className="font-bold">승모근</span>
                      <div className="w-20 bg-gray-300 rounded-full h-3 border border-black">
                        <div className="bg-purple-500 h-3 rounded-full w-3/4 border-r border-black"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">🏋️</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">💪</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">데드리프트 변형</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">컨벤셔널</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">가장 기본적인 형태<br/>전신 근력 발달</p>
                      <div className="mt-2 text-2xl">🔥</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-300 to-purple-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">스모</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">넓은 스탠스<br/>대퇴사두근 강화</p>
                      <div className="mt-2 text-2xl">💥</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-300 to-blue-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">루마니안</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">햄스트링 집중<br/>유연성 향상</p>
                      <div className="mt-2 text-2xl">⚡</div>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>
    );

      case 'nutrition-calc':
    return (
      <div className="p-6 space-y-6 relative">
        {/* 카툰풍 배경 장식 요소들 */}
        <div className="absolute top-16 right-20 text-3xl text-lime-400/40 animate-bounce">🥗</div>
        <div className="absolute bottom-24 left-18 text-2xl text-green-400/40 animate-pulse">📊</div>
        <div className="absolute top-1/3 left-8 text-xl text-emerald-400/40 animate-ping">⚡</div>
        
        <div className="bg-gradient-to-br from-lime-200/90 to-green-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
          {/* 카툰풍 말풍선 꼬리 */}
          <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-lime-200 to-green-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
          
          {/* 카툰풍 배경 패턴 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="flex items-center mb-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
              <Calculator className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-black cartoon-text mb-2">영양 계산기</h2>
              <p className="text-green-800 font-bold text-xl">🥗 개인 맞춤 칼로리! 🥗</p>
              {/* 카툰풍 효과음 */}
              <div className="absolute -top-2 right-4 text-2xl font-black text-orange-500/60 rotate-12 animate-pulse">CALC!</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                  <Target className="w-5 h-5 text-white" />
                </div>
                기초대사율 계산
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-black text-black mb-2 cartoon-text">성별 👫</label>
                  <select 
                    className="w-full bg-lime-100 border-3 border-black rounded-2xl px-4 py-3 text-black font-bold focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-cartoon" 
                    aria-label="성별 선택"
                    value={nutritionForm.gender}
                    onChange={(e) => handleNutritionFormChange('gender', e.target.value)}
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-black text-black mb-2 cartoon-text">나이 🎂</label>
                  <input
                    type="number"
                    className="w-full bg-lime-100 border-3 border-black rounded-2xl px-4 py-3 text-black font-bold placeholder-gray-600 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-cartoon"
                    placeholder="예: 25"
                    value={nutritionForm.age}
                    onChange={(e) => handleNutritionFormChange('age', e.target.value)}
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-lg font-black text-black mb-2 cartoon-text">신장 (cm) 📏</label>
                  <input
                    type="number"
                    className="w-full bg-lime-100 border-3 border-black rounded-2xl px-4 py-3 text-black font-bold placeholder-gray-600 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-cartoon"
                    placeholder="예: 175"
                    value={nutritionForm.height}
                    onChange={(e) => handleNutritionFormChange('height', e.target.value)}
                    min="100"
                    max="250"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-lg font-black text-black mb-2 cartoon-text">체중 (kg) ⚖️</label>
                  <input 
                    type="number"
                    className="w-full bg-lime-100 border-3 border-black rounded-2xl px-4 py-3 text-black font-bold placeholder-gray-600 focus:outline-none focus:border-green-500 focus:bg-white transition-all shadow-cartoon"
                    placeholder="예: 70"
                    value={nutritionForm.weight}
                    onChange={(e) => handleNutritionFormChange('weight', e.target.value)}
                    min="30"
                    max="300"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
              <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                  <Apple className="w-5 h-5 text-white" />
                </div>
                활동 수준
              </h3>
              <div className="space-y-3">
                <div 
                  className={`rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all cursor-pointer ${
                    nutritionForm.activityLevel === '1.2' 
                      ? 'bg-gradient-to-r from-red-400 to-orange-400 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-r from-red-300 to-orange-300'
                  }`}
                  onClick={() => handleNutritionFormChange('activityLevel', '1.2')}
                >
                  <h4 className="font-black text-black text-lg mb-1">좌식 생활 (1.2) 🪑</h4>
                  <p className="text-sm font-bold text-gray-800">운동 거의 안함</p>
                </div>
                <div 
                  className={`rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all cursor-pointer ${
                    nutritionForm.activityLevel === '1.375' 
                      ? 'bg-gradient-to-r from-orange-400 to-yellow-400 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-r from-orange-300 to-yellow-300'
                  }`}
                  onClick={() => handleNutritionFormChange('activityLevel', '1.375')}
                >
                  <h4 className="font-black text-black text-lg mb-1">가벼운 활동 (1.375) 🚶</h4>
                  <p className="text-sm font-bold text-gray-800">주 1-3회 가벼운 운동</p>
                </div>
                <div 
                  className={`rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all cursor-pointer ${
                    nutritionForm.activityLevel === '1.55' 
                      ? 'bg-gradient-to-r from-yellow-400 to-green-400 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-r from-yellow-300 to-green-300'
                  }`}
                  onClick={() => handleNutritionFormChange('activityLevel', '1.55')}
                >
                  <h4 className="font-black text-black text-lg mb-1">보통 활동 (1.55) 🏃</h4>
                  <p className="text-sm font-bold text-gray-800">주 3-5회 중간 강도</p>
                </div>
                <div 
                  className={`rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all cursor-pointer ${
                    nutritionForm.activityLevel === '1.725' 
                      ? 'bg-gradient-to-r from-green-400 to-teal-400 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-r from-green-300 to-teal-300'
                  }`}
                  onClick={() => handleNutritionFormChange('activityLevel', '1.725')}
                >
                  <h4 className="font-black text-black text-lg mb-1">활발한 활동 (1.725) 💪</h4>
                  <p className="text-sm font-bold text-gray-800">주 6-7회 고강도</p>
                </div>
                <div 
                  className={`rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all cursor-pointer ${
                    nutritionForm.activityLevel === '1.9' 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 ring-4 ring-yellow-400' 
                      : 'bg-gradient-to-r from-blue-300 to-purple-300'
                  }`}
                  onClick={() => handleNutritionFormChange('activityLevel', '1.9')}
                >
                  <h4 className="font-black text-black text-lg mb-1">매우 활발 (1.9) 🔥</h4>
                  <p className="text-sm font-bold text-gray-800">하루 2회 또는 육체노동</p>
                </div>
              </div>
            </div>
          </div>

          {/* BMR/TDEE 결과 표시 */}
          {nutritionResults && (
            <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon">
              <h3 className="text-2xl font-black text-black mb-4 cartoon-text">기초 정보</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-300 to-cyan-300 rounded-2xl p-4 border-3 border-black">
                  <h4 className="font-black text-black text-lg mb-2">기초대사율 (BMR)</h4>
                  <p className="text-2xl font-black text-black">{nutritionResults.bmr} kcal</p>
                  <p className="text-sm font-bold text-gray-800">가만히 있을 때 소모되는 칼로리</p>
                </div>
                <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-4 border-3 border-black">
                  <h4 className="font-black text-black text-lg mb-2">총 일일 소모량 (TDEE)</h4>
                  <p className="text-2xl font-black text-black">{nutritionResults.tdee} kcal</p>
                  <p className="text-sm font-bold text-gray-800">활동 포함 총 소모 칼로리</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
            {/* 카툰풍 장식 */}
            <div className="absolute top-2 right-2 text-2xl animate-bounce">🎯</div>
            <div className="absolute bottom-2 left-2 text-xl animate-pulse">📈</div>
            
            <h3 className="text-2xl font-black text-black mb-6 cartoon-text">목표별 칼로리 & 매크로</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                <h4 className="font-black text-black text-xl mb-3 cartoon-text">체중 감량 📉</h4>
                <div className="bg-white rounded-2xl p-4 border-2 border-black">
                  <div className="space-y-3 text-lg font-bold">
                    <div className="flex justify-between">
                      <span className="text-gray-800">칼로리:</span>
                      <span className="text-red-600">{nutritionResults ? nutritionResults.weightLoss.calories : '--'} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">단백질:</span>
                      <span className="text-red-600">{nutritionResults ? nutritionResults.weightLoss.protein : '--'} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">탄수화물:</span>
                      <span className="text-red-600">{nutritionResults ? nutritionResults.weightLoss.carbs : '--'} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">지방:</span>
                      <span className="text-red-600">{nutritionResults ? nutritionResults.weightLoss.fat : '--'} g</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                <h4 className="font-black text-black text-xl mb-3 cartoon-text">체중 유지 ⚖️</h4>
                <div className="bg-white rounded-2xl p-4 border-2 border-black">
                  <div className="space-y-3 text-lg font-bold">
                    <div className="flex justify-between">
                      <span className="text-gray-800">칼로리:</span>
                      <span className="text-green-600">{nutritionResults ? nutritionResults.maintenance.calories : '--'} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">단백질:</span>
                      <span className="text-green-600">{nutritionResults ? nutritionResults.maintenance.protein : '--'} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">탄수화물:</span>
                      <span className="text-green-600">{nutritionResults ? nutritionResults.maintenance.carbs : '--'} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">지방:</span>
                      <span className="text-green-600">{nutritionResults ? nutritionResults.maintenance.fat : '--'} g</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-300 to-purple-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                <h4 className="font-black text-black text-xl mb-3 cartoon-text">근육 증가 📈</h4>
                <div className="bg-white rounded-2xl p-4 border-2 border-black">
                  <div className="space-y-3 text-lg font-bold">
                    <div className="flex justify-between">
                      <span className="text-gray-800">칼로리:</span>
                      <span className="text-purple-600">{nutritionResults ? nutritionResults.weightGain.calories : '--'} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">단백질:</span>
                      <span className="text-purple-600">{nutritionResults ? nutritionResults.weightGain.protein : '--'} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">탄수화물:</span>
                      <span className="text-purple-600">{nutritionResults ? nutritionResults.weightGain.carbs : '--'} g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">지방:</span>
                      <span className="text-purple-600">{nutritionResults ? nutritionResults.weightGain.fat : '--'} g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button 
                onClick={calculateNutrition}
                className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover cartoon-text text-xl"
              >
                계산하기! 🚀
              </button>
              <button 
                onClick={resetNutritionCalculator}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover"
                title="초기화"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );

      case 'meals':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-14 left-16 text-3xl text-rose-400/40 animate-bounce">🍎</div>
            <div className="absolute bottom-20 right-18 text-2xl text-pink-400/40 animate-pulse">🥗</div>
            <div className="absolute top-1/3 right-10 text-xl text-red-400/40 animate-ping">✨</div>
            
            <div className="bg-gradient-to-br from-rose-200/90 to-pink-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-rose-200 to-pink-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Apple className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">식단 추천</h2>
                  <p className="text-rose-800 font-bold text-xl">🍽️ 건강한 식단! 🍽️</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-green-500/60 rotate-12 animate-pulse">MEAL!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    체중 감량 식단
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">아침 🌅</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 오트밀 + 베리류</li>
                        <li>• 그릭요거트</li>
                        <li>• 아몬드 (10개)</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">점심 ☀️</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 닭가슴살 샐러드</li>
                        <li>• 현미밥 (1/2공기)</li>
                        <li>• 브로콜리, 당근</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-purple-300 to-blue-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">저녁 🌙</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 생선구이</li>
                        <li>• 채소 스프</li>
                        <li>• 고구마 (소)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    근육 증가 식단
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">아침 🌅</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 계란 3개 + 토스트</li>
                        <li>• 바나나</li>
                        <li>• 우유 (200ml)</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-300 to-teal-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">점심 ☀️</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 소고기 스테이크</li>
                        <li>• 현미밥 (1공기)</li>
                        <li>• 아보카도 샐러드</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-teal-300 to-cyan-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">저녁 🌙</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 연어구이</li>
                        <li>• 퀴노아</li>
                        <li>• 견과류 믹스</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    균형 잡힌 식단
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">아침 🌅</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 통곡물 시리얼</li>
                        <li>• 저지방 우유</li>
                        <li>• 과일 (사과/오렌지)</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">점심 ☀️</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 현미 비빔밥</li>
                        <li>• 된장국</li>
                        <li>• 김치, 나물</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">저녁 🌙</h4>
                      <ul className="text-sm font-bold text-gray-800 space-y-1">
                        <li>• 두부 스테이크</li>
                        <li>• 잡곡밥</li>
                        <li>• 계절 채소</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    영양소별 식품 가이드
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-300 to-orange-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">단백질 🥩</h4>
                      <p className="text-sm font-bold text-gray-800">닭가슴살, 계란, 생선, 두부, 콩류, 그릭요거트</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-300 to-blue-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">탄수화물 🍚</h4>
                      <p className="text-sm font-bold text-gray-800">현미, 귀리, 고구마, 퀴노아, 과일, 채소</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-300 to-green-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">지방 🥑</h4>
                      <p className="text-sm font-bold text-gray-800">아보카도, 견과류, 올리브오일, 연어, 아마씨</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    식단 관리 팁
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">⏰</span>
                      </div>
                      <div>
                        <h4 className="font-black text-black text-lg cartoon-text">식사 타이밍</h4>
                        <p className="text-sm font-bold text-gray-800">운동 전 2-3시간, 운동 후 30분 내 단백질 섭취</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">💧</span>
                      </div>
                      <div>
                        <h4 className="font-black text-black text-lg cartoon-text">수분 섭취</h4>
                        <p className="text-sm font-bold text-gray-800">하루 2-3L, 운동 시 추가 500-1000ml</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📝</span>
                      </div>
                      <div>
                        <h4 className="font-black text-black text-lg cartoon-text">식단 기록</h4>
                        <p className="text-sm font-bold text-gray-800">앱 활용하여 칼로리와 영양소 추적</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">⚠️</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">💡</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">주의사항 및 권장사항</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-black text-green-700 mb-4 text-xl cartoon-text">✅ 권장 식품</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm font-bold">
                      <div className="bg-green-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">신선한 채소 🥬</div>
                      <div className="bg-green-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">저지방 단백질 🐟</div>
                      <div className="bg-green-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">통곡물 🌾</div>
                      <div className="bg-green-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">건강한 지방 🥑</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-red-700 mb-4 text-xl cartoon-text">❌ 제한 식품</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm font-bold">
                      <div className="bg-red-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">가공식품 🏭</div>
                      <div className="bg-red-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">단순당 🍭</div>
                      <div className="bg-red-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">트랜스지방 🚫</div>
                      <div className="bg-red-200 rounded-2xl p-3 border-2 border-black text-center hover:scale-105 transition-all">과도한 나트륨 🧂</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-20 right-16 text-3xl text-indigo-400/40 animate-bounce">🔢</div>
            <div className="absolute bottom-32 left-24 text-2xl text-pink-400/40 animate-pulse">📊</div>
            <div className="absolute top-1/3 right-8 text-xl text-cyan-400/40 animate-ping">💪</div>
            
            <div className="bg-gradient-to-br from-indigo-200/90 to-pink-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-indigo-200 to-pink-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Calculator className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">1RM 계산기</h2>
                  <p className="text-indigo-800 font-bold text-xl">🎯 최대 중량을 찾아라! 🎯</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-green-500/60 rotate-12 animate-pulse">CALC!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 cartoon-text">계산 방법</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">Brzycki 공식 🧮</h4>
                      <p className="font-semibold text-gray-800">1RM = 중량 ÷ (1.0278 - 0.0278 × 반복수)</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">Epley 공식 📐</h4>
                      <p className="font-semibold text-gray-800">1RM = 중량 × (1 + 반복수 ÷ 30)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 cartoon-text">훈련 강도 가이드</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">근력 (1-5회) 💪</span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full font-black border border-black">85-100%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">파워 (1-3회) ⚡</span>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-black border border-black">80-90%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">근비대 (6-12회) 🔥</span>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full font-black border border-black">65-85%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">근지구력 (12+회) 🏃</span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full font-black border border-black">50-65%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-spin-slow">⚙️</div>
                <div className="absolute bottom-2 left-2 text-xl animate-bounce">🎲</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">간단 계산기</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-lg font-black text-black mb-2 cartoon-text">중량 (kg) 🏋️</label>
                    <input
                      type="number"
                      className="w-full bg-yellow-100 border-3 border-black rounded-2xl px-4 py-3 text-black font-bold placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-cartoon"
                      placeholder="예: 100"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-black text-black mb-2 cartoon-text">반복수 🔢</label>
                    <input
                      type="number"
                      className="w-full bg-yellow-100 border-3 border-black rounded-2xl px-4 py-3 text-black font-bold placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-cartoon"
                      placeholder="예: 5"
                      value={calcReps}
                      onChange={(e) => setCalcReps(e.target.value)}
                      min="1"
                      max="15"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button 
                      onClick={calculateOneRM}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-black py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-105 border-3 border-black shadow-cartoon hover:shadow-cartoon-hover cartoon-text"
                    >
                      계산하기! 💥
                    </button>
                    <button 
                      onClick={resetCalculator}
                      className="bg-red-500 hover:bg-red-600 text-white font-black py-3 px-3 rounded-2xl transition-all duration-300 hover:scale-105 border-3 border-black shadow-cartoon"
                      title="초기화"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 p-6 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-3xl border-4 border-black shadow-cartoon">
                  <p className="text-center mb-4">
                    <span className="text-black font-bold text-xl cartoon-text">예상 1RM: </span>
                    <span className="text-4xl font-black text-black cartoon-text">
                      {calcResult ? `${calcResult} kg` : '-- kg'}
                    </span>
                    <span className="text-2xl">🎯</span>
                  </p>
                  {calcResult && (
                    <div className="mt-4 pt-4 border-t-4 border-black">
                      <p className="text-lg font-black text-black text-center mb-4 cartoon-text">훈련 강도별 중량 💪</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between p-2 bg-red-200 rounded-xl border-2 border-black">
                          <span className="font-bold text-red-800">근력 (85%):</span>
                          <span className="font-black text-black">{Math.round(calcResult * 0.85)} kg</span>
                        </div>
                        <div className="flex justify-between p-2 bg-orange-200 rounded-xl border-2 border-black">
                          <span className="font-bold text-orange-800">파워 (80%):</span>
                          <span className="font-black text-black">{Math.round(calcResult * 0.8)} kg</span>
                        </div>
                        <div className="flex justify-between p-2 bg-yellow-200 rounded-xl border-2 border-black">
                          <span className="font-bold text-yellow-800">근비대 (75%):</span>
                          <span className="font-black text-black">{Math.round(calcResult * 0.75)} kg</span>
                        </div>
                        <div className="flex justify-between p-2 bg-green-200 rounded-xl border-2 border-black">
                          <span className="font-bold text-green-800">근지구력 (60%):</span>
                          <span className="font-black text-black">{Math.round(calcResult * 0.6)} kg</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'beginner':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-16 left-16 text-3xl text-green-400/40 animate-bounce">🌱</div>
            <div className="absolute bottom-20 right-20 text-2xl text-emerald-400/40 animate-pulse">🎯</div>
            <div className="absolute top-1/2 right-12 text-xl text-lime-400/40 animate-ping">✨</div>
            
            <div className="bg-gradient-to-br from-green-200/90 to-emerald-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-green-200 to-emerald-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Target className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">프로그램</h2>
                  <p className="text-green-800 font-bold text-xl">🌟 운동의 시작! 🌟</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-blue-500/60 rotate-12 animate-pulse">START!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    8주 프로그램
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">1-2주차: 기초 적응 🌱</h4>
                      <ul className="font-semibold text-gray-800 space-y-1">
                        <li>• 자체중량 운동 위주</li>
                        <li>• 주 3회, 전신 운동</li>
                        <li>• 올바른 자세 익히기</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-blue-300 to-green-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">3-4주차: 중량 도입 🌿</h4>
                      <ul className="font-semibold text-gray-800 space-y-1">
                        <li>• 가벼운 덤벨/바벨 사용</li>
                        <li>• 복합운동 중심</li>
                        <li>• 점진적 부하 증가</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-purple-300 to-blue-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">5-8주차: 강화 🌳</h4>
                      <ul className="font-semibold text-gray-800 space-y-1">
                        <li>• 중량 점진적 증가</li>
                        <li>• 운동 다양성 확대</li>
                        <li>• 개인별 맞춤 조정</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    주요 운동
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">스쿼트 🦵</span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full font-black text-sm border border-black">하체 기초</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">푸시업 💪</span>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-black text-sm border border-black">상체 기초</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">플랭크 🔥</span>
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full font-black text-sm border border-black">코어 기초</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-100 rounded-2xl border-2 border-black">
                      <span className="font-bold text-gray-800">데드버그 ⚡</span>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-black text-sm border border-black">안정성</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">⚠️</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">💡</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">초보자 주의사항</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-black text-green-700 mb-4 text-xl cartoon-text">✅ 해야 할 것</h4>
                    <ul className="space-y-3 font-semibold text-gray-800">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✓</span>
                        </div>
                        충분한 휴식과 수면
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✓</span>
                        </div>
                        점진적인 강도 증가
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✓</span>
                        </div>
                        올바른 자세 우선
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-black text-red-700 mb-4 text-xl cartoon-text">❌ 피해야 할 것</h4>
                    <ul className="space-y-3 font-semibold text-gray-800">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✗</span>
                        </div>
                        과도한 중량 사용
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✗</span>
                        </div>
                        매일 같은 부위 운동
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">✗</span>
                        </div>
                        워밍업 생략
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'strength':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-14 right-18 text-3xl text-orange-400/40 animate-bounce">💪</div>
            <div className="absolute bottom-28 left-22 text-2xl text-amber-400/40 animate-pulse">🏆</div>
            <div className="absolute top-1/3 left-8 text-xl text-yellow-400/40 animate-ping">⚡</div>
            
            <div className="bg-gradient-to-br from-orange-200/90 to-amber-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-orange-200 to-amber-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <TrendingUp className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">근력 향상</h2>
                  <p className="text-orange-800 font-bold text-xl">🔥 최대 근력의 왕! 🔥</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-red-500/60 rotate-12 animate-pulse">POWER!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    훈련 원칙
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">고중량 저반복 🏋️</h4>
                      <p className="font-semibold text-gray-800">1-5회 반복으로 85-100% 1RM 사용</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">충분한 휴식 ⏰</h4>
                      <p className="font-semibold text-gray-800">세트 간 3-5분, 운동 간 48-72시간</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">점진적 과부하 📈</h4>
                      <p className="font-semibold text-gray-800">매주 2.5-5kg씩 중량 증가</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Dumbbell className="w-5 h-5 text-white" />
                    </div>
                    주간 스케줄
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg">월요일 - 상체 💪</h4>
                      <p className="font-semibold text-gray-800">벤치프레스, 로우, 오버헤드프레스</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-300 to-blue-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg">수요일 - 하체 🦵</h4>
                      <p className="font-semibold text-gray-800">스쿼트, 데드리프트, 런지</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg">금요일 - 전신 🔥</h4>
                      <p className="font-semibold text-gray-800">복합운동 중심 고강도</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">📊</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎯</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">12주 프로그레션</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-orange-300 to-red-400 rounded-3xl p-4 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-lg mb-2 cartoon-text">1-3주</h4>
                    <div className="bg-white rounded-2xl p-3 border-2 border-black">
                      <p className="font-bold text-gray-800">기초 적응<br/>5×5 프로그램</p>
                      <div className="mt-2 text-2xl">🌱</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-300 to-pink-400 rounded-3xl p-4 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-lg mb-2 cartoon-text">4-6주</h4>
                    <div className="bg-white rounded-2xl p-3 border-2 border-black">
                      <p className="font-bold text-gray-800">강도 증가<br/>3×5 프로그램</p>
                      <div className="mt-2 text-2xl">🔥</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-300 to-purple-400 rounded-3xl p-4 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-lg mb-2 cartoon-text">7-9주</h4>
                    <div className="bg-white rounded-2xl p-3 border-2 border-black">
                      <p className="font-bold text-gray-800">최대 근력<br/>1×3 프로그램</p>
                      <div className="mt-2 text-2xl">💪</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-300 to-indigo-400 rounded-3xl p-4 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-lg mb-2 cartoon-text">10-12주</h4>
                    <div className="bg-white rounded-2xl p-3 border-2 border-black">
                      <p className="font-bold text-gray-800">피킹<br/>1RM 테스트</p>
                      <div className="mt-2 text-2xl">🏆</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hypertrophy':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-18 right-14 text-3xl text-cyan-400/40 animate-bounce">💎</div>
            <div className="absolute bottom-22 left-18 text-2xl text-teal-400/40 animate-pulse">🔥</div>
            <div className="absolute top-1/4 right-6 text-xl text-blue-400/40 animate-ping">⭐</div>
            
            <div className="bg-gradient-to-br from-cyan-200/90 to-teal-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-cyan-200 to-teal-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Users className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">근비대</h2>
                  <p className="text-cyan-800 font-bold text-xl">💪 근육량 증가의 마스터! 💪</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-pink-500/60 rotate-12 animate-pulse">GROW!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    핵심 원리
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-cyan-300 to-blue-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">중량 × 볼륨 📊</h4>
                      <p className="font-semibold text-gray-800">6-12회 반복, 65-85% 1RM</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">근육 긴장 시간 ⏱️</h4>
                      <p className="font-semibold text-gray-800">40-70초 TUT (Time Under Tension)</p>
                    </div>
                    <div className="bg-gradient-to-r from-teal-300 to-cyan-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">점진적 과부하 📈</h4>
                      <p className="font-semibold text-gray-800">중량, 반복수, 세트수 증가</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    주간 분할
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg">월/목 - 상체 푸시 💪</h4>
                      <p className="font-semibold text-gray-800">가슴, 어깨, 삼두</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-300 to-cyan-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg">화/금 - 상체 풀 🔙</h4>
                      <p className="font-semibold text-gray-800">등, 이두, 후면삼각근</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-300 to-teal-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg">수/토 - 하체 🦵</h4>
                      <p className="font-semibold text-gray-800">대퇴사두근, 햄스트링, 둔근</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">💡</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎯</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">근비대 최적화 팁</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-cyan-300 to-blue-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">영양 🍗</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2">
                        <li>• 칼로리 잉여 (+300-500kcal)</li>
                        <li>• 단백질 2g/kg 체중</li>
                        <li>• 충분한 탄수화물</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-300 to-purple-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">휴식 😴</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2">
                        <li>• 7-9시간 수면</li>
                        <li>• 근육군별 48-72시간</li>
                        <li>• 스트레스 관리</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-300 to-green-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">훈련 🏋️</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2">
                        <li>• 다양한 각도</li>
                        <li>• 풀 레인지 모션</li>
                        <li>• 마인드-머슬 커넥션</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-10 left-14 text-3xl text-yellow-400/40 animate-bounce">🎯</div>
            <div className="absolute bottom-16 right-18 text-2xl text-orange-400/40 animate-pulse">🏆</div>
            <div className="absolute top-1/3 right-10 text-xl text-amber-400/40 animate-ping">⭐</div>
            
            <div className="bg-gradient-to-br from-yellow-200/90 to-orange-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-yellow-200 to-orange-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Star className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">목표 설정</h2>
                  <p className="text-yellow-800 font-bold text-xl">🌟 SMART 목표로 성공! 🌟</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-green-500/60 rotate-12 animate-pulse">GOAL!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    SMART 목표 설정
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">S - Specific (구체적) 🎯</h4>
                      <p className="font-semibold text-gray-800">"살 빼기" → "체지방 5% 감소"</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">M - Measurable (측정가능) 📊</h4>
                      <p className="font-semibold text-gray-800">수치로 측정 가능한 목표</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">A - Achievable (달성가능) ✅</h4>
                      <p className="font-semibold text-gray-800">현실적이고 달성 가능한 목표</p>
                    </div>
                    <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">R - Relevant (관련성) 🔗</h4>
                      <p className="font-semibold text-gray-800">개인의 상황과 관련된 목표</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-300 to-blue-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">T - Time-bound (시간제한) ⏰</h4>
                      <p className="font-semibold text-gray-800">명확한 기한 설정</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    목표 유형별 가이드
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">체중 감량 🏃</h4>
                      <p className="font-semibold text-gray-800">주 0.5-1kg, 월 2-4kg 감량</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-300 to-cyan-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">근육 증가 💪</h4>
                      <p className="font-semibold text-gray-800">월 0.5-1kg 근육량 증가</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">근력 향상 🏋️</h4>
                      <p className="font-semibold text-gray-800">월 5-10% 1RM 증가</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">🚀</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">💡</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">목표 달성 전략</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">단계별 계획 📋</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2">
                        <li>• 큰 목표를 작은 단위로</li>
                        <li>• 주간/월간 마일스톤</li>
                        <li>• 정기적인 점검</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-300 to-red-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">진행 추적 📊</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2">
                        <li>• 운동 일지 작성</li>
                        <li>• 체중/체성분 측정</li>
                        <li>• 사진 기록</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">동기 유지 🔥</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2">
                        <li>• 작은 성취 축하</li>
                        <li>• 운동 파트너</li>
                        <li>• 보상 시스템</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'workout-log':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-16 right-20 text-3xl text-emerald-400/40 animate-bounce">📋</div>
            <div className="absolute bottom-24 left-16 text-2xl text-teal-400/40 animate-pulse">📊</div>
            <div className="absolute top-1/3 left-12 text-xl text-cyan-400/40 animate-ping">✅</div>
            
            <div className="bg-gradient-to-br from-emerald-200/90 to-teal-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-emerald-200 to-teal-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">운동 기록</h2>
                  <p className="text-emerald-800 font-bold text-xl">📈 진행상황을 추적하세요! 📈</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-green-500/60 rotate-12 animate-pulse">TRACK!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    운동 일지
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-300 to-teal-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">오늘의 운동 💪</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-white rounded-xl border-2 border-black">
                          <span className="font-bold text-gray-800">스쿼트</span>
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-black">3세트 완료</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-xl border-2 border-black">
                          <span className="font-bold text-gray-800">벤치프레스</span>
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-black">2세트 진행중</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-teal-300 to-cyan-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">이번 주 통계 📊</h4>
                      <div className="text-sm font-semibold text-gray-800">
                        <p>• 총 운동 일수: 4일</p>
                        <p>• 총 세트 수: 32세트</p>
                        <p>• 평균 운동 시간: 65분</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    진행 상황
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-3">근력 향상 🏆</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-gray-800">스쿼트 1RM</span>
                            <span className="font-black text-green-600">+15kg ⬆️</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-3 border-2 border-black">
                            <div className="bg-green-500 h-full rounded-full border-r-2 border-black" style={{width: '75%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-gray-800">벤치프레스 1RM</span>
                            <span className="font-black text-blue-600">+8kg ⬆️</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-3 border-2 border-black">
                            <div className="bg-blue-500 h-full rounded-full border-r-2 border-black" style={{width: '60%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">📈</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎯</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">운동 목표 및 성취</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <h4 className="font-black text-black text-lg mb-2">이달의 목표</h4>
                      <p className="font-bold text-gray-800">20회 운동 완료</p>
                      <div className="mt-3 bg-white rounded-2xl p-2 border-2 border-black">
                        <span className="text-orange-600 font-black">16/20 완료</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <h4 className="font-black text-black text-lg mb-2">성취 배지</h4>
                      <p className="font-bold text-gray-800">연속 출석 7일</p>
                      <div className="mt-3 bg-white rounded-2xl p-2 border-2 border-black">
                        <span className="text-green-600 font-black">달성!</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🔥</div>
                      <h4 className="font-black text-black text-lg mb-2">연속 기록</h4>
                      <p className="font-bold text-gray-800">운동 스트릭</p>
                      <div className="mt-3 bg-white rounded-2xl p-2 border-2 border-black">
                        <span className="text-purple-600 font-black">7일째 🔥</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-20 left-16 text-3xl text-violet-400/40 animate-bounce">👥</div>
            <div className="absolute bottom-20 right-20 text-2xl text-purple-400/40 animate-pulse">🏆</div>
            <div className="absolute top-1/2 right-12 text-xl text-indigo-400/40 animate-ping">💬</div>
            
            <div className="bg-gradient-to-br from-violet-200/90 to-purple-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-violet-200 to-purple-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Users className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">커뮤니티</h2>
                  <p className="text-violet-800 font-bold text-xl">🤝 함께 운동해요! 🤝</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-blue-500/60 rotate-12 animate-pulse">CONNECT!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    운동 친구
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-violet-300 to-purple-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-3">온라인 친구들 👫</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded-xl border-2 border-black">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full mr-2 border-2 border-black flex items-center justify-center">
                              <span className="text-white font-bold text-xs">K</span>
                            </div>
                            <span className="font-bold text-gray-800">김헬스</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-bold">온라인</span>
                            <span className="text-sm">🔥 15일</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded-xl border-2 border-black">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full mr-2 border-2 border-black flex items-center justify-center">
                              <span className="text-white font-bold text-xs">P</span>
                            </div>
                            <span className="font-bold text-gray-800">박근육</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">운동중</span>
                            <span className="text-sm">💪 22일</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    챌린지
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">이번 주 챌린지 🏃‍♂️</h4>
                      <div className="bg-white rounded-xl p-3 border-2 border-black">
                        <p className="font-bold text-gray-800 mb-2">30일 스쿼트 챌린지</p>
                        <div className="w-full bg-gray-300 rounded-full h-3 border-2 border-black mb-2">
                          <div className="bg-orange-500 h-full rounded-full border-r-2 border-black" style={{width: '40%'}}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-600">12/30일 완료</span>
                          <span className="font-black text-orange-600">참여자 1,234명</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                      <h4 className="font-black text-black text-lg mb-2">팀 챌린지 💪</h4>
                      <div className="bg-white rounded-xl p-3 border-2 border-black">
                        <p className="font-bold text-gray-800 mb-2">주간 총 운동시간 경쟁</p>
                        <div className="text-center">
                          <span className="text-2xl font-black text-green-600">2위</span>
                          <p className="text-sm font-bold text-gray-600">우리 팀: 285분</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">💬</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🌟</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">커뮤니티 피드</h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                        <span className="text-white font-bold">김</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800"><span className="text-blue-600">김헬스</span>님이 데드리프트 100kg 달성! 🎉</p>
                        <p className="text-sm text-gray-600 mt-1">2시간 전</p>
                        <div className="mt-2 flex space-x-2">
                          <span className="bg-red-300 text-red-800 px-2 py-1 rounded-full text-xs font-bold">❤️ 12</span>
                          <span className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">👏 8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-2xl p-4 border-3 border-black transform hover:scale-105 transition-all">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                        <span className="text-white font-bold">박</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800"><span className="text-green-600">박근육</span>님이 새로운 운동 루틴을 공유했습니다! 💪</p>
                        <p className="text-sm text-gray-600 mt-1">5시간 전</p>
                        <div className="mt-2 flex space-x-2">
                          <span className="bg-red-300 text-red-800 px-2 py-1 rounded-full text-xs font-bold">❤️ 25</span>
                          <span className="bg-blue-300 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">💬 7</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-20 right-20 text-4xl text-purple-400/40 animate-bounce">🤔</div>
            <div className="absolute bottom-20 left-20 text-3xl text-pink-400/40 animate-pulse">❓</div>
            <div className="absolute top-1/2 left-1/2 text-2xl text-blue-400/40 animate-ping transform -translate-x-1/2 -translate-y-1/2">✨</div>
            
            <div className="bg-gradient-to-br from-purple-200/90 to-pink-300/90 backdrop-blur-xl rounded-3xl p-12 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-purple-200 to-pink-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black shadow-cartoon transform hover:rotate-12 transition-all duration-300">
                  <span className="text-4xl">🎭</span>
                </div>
                <h2 className="text-5xl font-black text-black cartoon-text mb-4">OOPS!</h2>
                <p className="text-2xl font-bold text-purple-800 mb-6">🎪 준비 중인 콘텐츠입니다! 🎪</p>
                <div className="text-xl text-gray-800 font-semibold">
                  <p className="mb-2">이 페이지는 아직 개발 중이에요! 😅</p>
                  <p>곧 멋진 콘텐츠로 찾아뵐게요! 🚀</p>
                </div>
                
                {/* 카툰풍 효과음 */}
                <div className="absolute -top-8 -right-4 text-3xl font-black text-orange-500/60 rotate-12 animate-pulse">COMING SOON!</div>
                <div className="absolute -bottom-4 -left-8 text-2xl font-black text-blue-500/60 -rotate-12 animate-bounce">STAY TUNED!</div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (selectedCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 relative overflow-hidden">
        {/* 카툰 스타일 배경 장식 요소들 */}
        <div className="absolute inset-0">
          {/* 카툰풍 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-300/50 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-radial from-cyan-200/40 via-transparent to-transparent"></div>
          
          {/* 카툰 스타일 점 패턴 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-cartoon-dots"></div>
          
          {/* 카툰풍 효과음 텍스트들 */}
          <div className="absolute top-32 left-20 text-6xl font-black text-red-500/20 rotate-12 select-none pointer-events-none">POW!</div>
          <div className="absolute top-60 right-32 text-4xl font-black text-blue-500/20 -rotate-12 select-none pointer-events-none">BAM!</div>
};

export default JwonderWorkOut; 