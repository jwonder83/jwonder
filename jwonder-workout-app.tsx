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
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Award,
  Heart,
  MessageCircle,
  Share2,
  Bookmark
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

// 운동 기록 관련 인터페이스 추가
interface WorkoutSet {
  id: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: number;
  name: string;
  sets: WorkoutSet[];
  targetSets: number;
  targetReps: string;
  restTime: number; // 분 단위
}

interface WorkoutRecord {
  id: number;
  date: string;
  exercises: WorkoutExercise[];
  totalDuration: number; // 분 단위
  notes: string;
  completed: boolean;
}

interface UserData {
  programs: Program[];
  nutrition: any[];
  oneRMRecords: OneRMRecord[];
  workoutRecords: WorkoutRecord[];
}

const JwonderWorkOut = () => {
  const [cards, setCards] = useState<Card[]>([
    { id: 'squat', title: '스쿼트', icon: '🦵', size: 'large', category: 'squat', color: 'bg-gradient-to-br from-emerald-300 via-teal-400 to-green-500' },
    { id: 'bench', title: '벤치프레스', icon: '🏋️', size: 'large', category: 'bench', color: 'bg-gradient-to-br from-red-400 via-orange-500 to-amber-600' },
    { id: 'deadlift', title: '데드리프트', icon: '💥', size: 'wide', category: 'deadlift', color: 'bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600' },
    
    // 운동 프로그램 개별 카드들
    { id: 'beginner', title: '프로그램', icon: '📚', size: 'small', category: 'beginner', color: 'bg-gradient-to-br from-blue-300 via-sky-400 to-cyan-500' },
    { id: 'strength', title: '근력 향상', icon: '💪', size: 'medium', category: 'strength', color: 'bg-gradient-to-br from-yellow-300 via-lime-400 to-chartreuse-500' },
    { id: 'hypertrophy', title: '근비대', icon: '🔥', size: 'small', category: 'hypertrophy', color: 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-600' },
    
    // 식단 & 영양 개별 카드들
    { id: 'goals', title: '목표 설정', icon: '🏆', size: 'medium', category: 'goals', color: 'bg-gradient-to-br from-amber-300 via-orange-400 to-red-500' },
    { id: 'nutrition-calc', title: '영양 계산기', icon: '⚖️', size: 'wide', category: 'nutrition-calc', color: 'bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500' },
    { id: 'meals', title: '식단 추천', icon: '🍽️', size: 'small', category: 'meals', color: 'bg-gradient-to-br from-fuchsia-300 via-purple-400 to-violet-500' },
    
    // 1RM 계산기
    { id: 'calculator', title: '1RM 계산기', icon: '🔢', size: 'large', category: 'calculator', color: 'bg-gradient-to-br from-slate-300 via-gray-400 to-zinc-500' },
    
    // 기타 카드들
    { id: 'workout-log', title: '운동 기록', icon: '📝', size: 'medium', category: 'workout-log', color: 'bg-gradient-to-br from-teal-300 via-cyan-400 to-sky-500' },
    { id: 'faq', title: 'FAQ', icon: '❓', size: 'small', category: 'faq', color: 'bg-gradient-to-br from-indigo-300 via-blue-400 to-purple-500' },
  ]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  
  
  const [userData, setUserData] = useState<UserData>({
    programs: [],
    nutrition: [],
    oneRMRecords: [],
    workoutRecords: []
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
    activityLevel: 'moderate'
  });
  const [nutritionResults, setNutritionResults] = useState<{
    bmr: number;
    tdee: number;
    weightLoss: { calories: number; protein: number; carbs: number; fat: number };
    maintenance: { calories: number; protein: number; carbs: number; fat: number };
    weightGain: { calories: number; protein: number; carbs: number; fat: number };
  } | null>(null);

  // 운동 기록 상태 추가
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutRecord | null>(null);
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    targetSets: 3,
    targetReps: '8-12',
    restTime: 2
  });
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  // 상담 신청 관련 상태들
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    experience: '',
    goal: '',
    message: ''
  });
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);

  // 영양 계산기 목표 선택 상태
  const [selectedGoal, setSelectedGoal] = useState<'weightLoss' | 'maintenance' | 'weightGain'>('maintenance');

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
    
    if (!age || !height || !weight || !activityLevel) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    // 활동량 문자열을 숫자로 변환
    const activityMap = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };
    
    const activityNum = activityMap[activityLevel as keyof typeof activityMap] || 1.55;

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
      activityLevel: 'moderate'
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

  // 운동 기록 관련 함수들
  const startNewWorkout = () => { 
    const newWorkout = { 
      id: Date.now(), 
      date: new Date().toISOString().split('T')[0], 
      exercises: [], 
      totalDuration: 0, 
      notes: '', 
      completed: false 
    }; 
    setCurrentWorkout(newWorkout); 
    setIsWorkoutActive(true); 
    setWorkoutTimer(0); 
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

              {/* 유튜브 영상 섹션 추가 */}
              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">📹</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎬</div>
                
                <h3 className="text-2xl font-black text-black mb-6 flex items-center cartoon-text">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                    <span className="text-white text-xl">📺</span>
                  </div>
                  스쿼트 완벽 가이드 영상
                  <div className="ml-3 text-red-600 font-black text-sm">WATCH!</div>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-4 cartoon-text">기본 스쿼트 자세</h4>
                    <div className="bg-black rounded-2xl overflow-hidden border-2 border-black">
                      <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/Dy28eq2PjcM"
                        title="스쿼트 기본 자세"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-3">올바른 스쿼트 자세와 호흡법을 배워보세요!</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-300 to-cyan-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-4 cartoon-text">고급 스쿼트 테크닉</h4>
                    <div className="bg-black rounded-2xl overflow-hidden border-2 border-black">
                      <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/gsNoPYwWXeM"
                        title="고급 스쿼트 테크닉"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-3">더 깊고 안전한 스쿼트를 위한 고급 기술들!</p>
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

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-red-600 cartoon-text mb-4 text-center">🔥 체중 감량</h3>
                  <div className="space-y-4">
                    <div className="bg-red-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] transition-all duration-200">
                      <h4 className="font-black text-red-800 mb-2">🌅 아침</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🥚 계란 스크램블</li>
                        <li>🍞 토스트 2장</li>
                        <li>🧃 과일 주스</li>
                      </ul>
                    </div>
                    <div className="bg-sky-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] transition-all duration-200">
                      <h4 className="font-black text-sky-800 mb-2">🌞 점심</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🍱 균형잡힌 도시락</li>
                        <li>🍚 현미밥</li>
                        <li>🍜 된장국</li>
                      </ul>
                    </div>
                    <div className="bg-cyan-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(6,182,212,1)] transition-all duration-200">
                      <h4 className="font-black text-cyan-800 mb-2">🌙 저녁</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🍗 닭고기 볶음</li>
                        <li>🥬 야채 무침</li>
                        <li>🍲 미역국</li>
                      </ul>
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

              {/* 유튜브 영상 섹션 추가 */}
              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">📹</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎬</div>
                
                <h3 className="text-2xl font-black text-black mb-6 flex items-center cartoon-text">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                    <span className="text-white text-xl">📺</span>
                  </div>
                  벤치프레스 완벽 가이드 영상
                  <div className="ml-3 text-red-600 font-black text-sm">WATCH!</div>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-red-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-4 cartoon-text">기본 벤치프레스 자세</h4>
                    <div className="bg-black rounded-2xl overflow-hidden border-2 border-black">
                      <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/rT7DgCr-3pg"
                        title="벤치프레스 기본 자세"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-3">올바른 벤치프레스 자세와 그립 방법을 배워보세요!</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-300 to-red-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-4 cartoon-text">고급 벤치프레스 테크닉</h4>
                    <div className="bg-black rounded-2xl overflow-hidden border-2 border-black">
                      <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/esQi683XR44"
                        title="고급 벤치프레스 테크닉"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-3">파워리프팅 기법과 최대중량을 위한 고급 테크닉!</p>
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
                  <p className="text-purple-800 font-bold text-xl">🔥 등 근력의 황제! 🔥</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-red-500/60 rotate-12 animate-pulse">DEADLIFT!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    올바른 자세
                  </h3>
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">1</span>
                    </div>
                      <span className="font-semibold">발을 바벨 밑에 두고 엉덩이폭으로 벌리기</span>
                  </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">2</span>
                    </div>
                      <span className="font-semibold">허리는 중립을 유지하고 가슴을 펴기</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">3</span>
                    </div>
                      <span className="font-semibold">바벨은 정강이에 가깝게 유지</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">4</span>
                  </div>
                      <span className="font-semibold">엉덩이와 무릎을 동시에 펴서 들어올리기</span>
                    </li>
              </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    주요 효과
                  </h3>
                  <ul className="space-y-4 text-gray-800">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-violet-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">💪</span>
                    </div>
                      <span className="font-semibold">광배근, 승모근, 기립근 강화</span>
                  </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-violet-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">🔥</span>
                    </div>
                      <span className="font-semibold">햄스트링, 둔근 개발</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-violet-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">⚡</span>
                    </div>
                      <span className="font-semibold">후면 사슬 전체 강화</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-violet-500 rounded-full border-2 border-black mt-1 mr-4 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">✨</span>
                  </div>
                      <span className="font-semibold">그립력 및 코어 안정성 향상</span>
                    </li>
              </ul>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-spin-slow">🏆</div>
                <div className="absolute bottom-2 left-2 text-xl animate-bounce">📚</div>
                
                <h3 className="text-2xl font-black text-black mb-6 flex items-center cartoon-text">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  데드리프트 변형
                  <div className="ml-3 text-red-600 font-black text-sm">VARIETY!</div>
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-red-300 to-pink-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">컨벤셔널</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">일반적인 데드리프트<br/>엉덩이 폭 스탠스</p>
                      <div className="mt-2 text-2xl">🦵</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-300 to-violet-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">수모</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">넓은 스탠스<br/>대퇴사두근 더 개입</p>
                      <div className="mt-2 text-2xl">🦵</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-violet-300 to-indigo-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">루마니안</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <p className="font-bold text-gray-800">햄스트링 집중<br/>탑 포지션 시작</p>
                      <div className="mt-2 text-2xl">🦵</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 유튜브 영상 섹션 추가 */}
              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">📹</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎬</div>
                
                <h3 className="text-2xl font-black text-black mb-6 flex items-center cartoon-text">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                    <span className="text-white text-xl">📺</span>
                  </div>
                  데드리프트 완벽 가이드 영상
                  <div className="ml-3 text-red-600 font-black text-sm">WATCH!</div>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-300 to-violet-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-4 cartoon-text">기본 데드리프트 자세</h4>
                    <div className="bg-black rounded-2xl overflow-hidden border-2 border-black">
                      <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/r4MzxtBKyNE"
                        title="데드리프트 기본 자세"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-3">올바른 데드리프트 셋업과 실행 방법을 배워보세요!</p>
                  </div>
                  <div className="bg-gradient-to-br from-violet-300 to-purple-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-4 cartoon-text">고급 데드리프트 테크닉</h4>
                    <div className="bg-black rounded-2xl overflow-hidden border-2 border-black">
                      <iframe
                        width="100%"
                        height="200"
                        src="https://www.youtube.com/embed/VL5Ab0T07e4"
                        title="고급 데드리프트 테크닉"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                    <p className="text-sm font-bold text-gray-800 mt-3">더 강한 데드리프트를 위한 고급 기술들!</p>
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
                      <span className="text-white font-bold text-sm">🔥</span>
                    </div>
                    <span>충분한 워밍업 필수</span>
            </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🦵</span>
                    </div>
                    <span>허리 중립 자세 유지</span>
          </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">⚖️</span>
                    </div>
                    <span>점진적인 중량 증가</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-black mr-4 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">⚠️</span>
                    </div>
                    <span>올바른 호흡법 준수</span>
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
            <div className="absolute top-16 right-20 text-3xl text-emerald-400/40 animate-bounce">📋</div>
            <div className="absolute bottom-24 left-16 text-2xl text-teal-400/40 animate-pulse">📊</div>
            <div className="absolute top-1/3 left-12 text-xl text-cyan-400/40 animate-ping">✅</div>
            
            <div className="bg-gradient-to-br from-emerald-200/90 to-teal-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-emerald-200 to-teal-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon">
                  <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">운동 기록</h2>
                  <p className="text-emerald-800 font-bold text-xl">📈 실시간 운동 추적! 📈</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border-4 border-black shadow-cartoon relative z-10 mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏃‍♂️</div>
                  <h3 className="text-3xl font-black text-black mb-4 cartoon-text">운동 기록하기</h3>
                  <p className="text-gray-600 font-semibold mb-6 text-lg">오늘의 운동을 기록해보세요!</p>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="운동 이름 (예: 스쿼트)"
                        className="w-full p-4 border-3 border-black rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        id="exercise-name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="중량 (kg)"
                        className="p-4 border-3 border-black rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        id="exercise-weight"
                      />
                      <input
                        type="number"
                        placeholder="반복수"
                        className="p-4 border-3 border-black rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        id="exercise-reps"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="세트 수"
                        className="w-full p-4 border-3 border-black rounded-2xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        id="exercise-sets"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const name = (document.getElementById('exercise-name') as HTMLInputElement)?.value;
                        const weight = (document.getElementById('exercise-weight') as HTMLInputElement)?.value;
                        const reps = (document.getElementById('exercise-reps') as HTMLInputElement)?.value;
                        const sets = (document.getElementById('exercise-sets') as HTMLInputElement)?.value;
                        
                        if (name && weight && reps && sets) {
                          const newRecord = {
                            id: Date.now(),
                            date: new Date().toISOString().split('T')[0],
                            exercises: [{
                              id: Date.now(),
                              name: name,
                              sets: Array.from({length: parseInt(sets)}, (_, i) => ({
                                id: Date.now() + i,
                                weight: parseFloat(weight),
                                reps: parseInt(reps),
                                completed: true
                              })),
                              targetSets: parseInt(sets),
                              targetReps: reps,
                              restTime: 2
                            }],
                            totalDuration: 30,
                            notes: '',
                            completed: true
                          };
                          
                          setUserData(prev => ({
                            ...prev,
                            workoutRecords: [...prev.workoutRecords, newRecord]
                          }));
                          
                          (document.getElementById('exercise-name') as HTMLInputElement).value = '';
                          (document.getElementById('exercise-weight') as HTMLInputElement).value = '';
                          (document.getElementById('exercise-reps') as HTMLInputElement).value = '';
                          (document.getElementById('exercise-sets') as HTMLInputElement).value = '';
                          
                          alert('운동 기록이 저장되었습니다! 🎉');
                        } else {
                          alert('모든 필드를 입력해주세요.');
                        }
                      }}
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-2xl py-4 px-8 rounded-3xl border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transform hover:scale-105 transition-all duration-300 w-full"
                    >
                      💾 운동 기록 저장
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon">
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  최근 운동 기록
                </h3>
                
                {userData.workoutRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-gray-600 font-semibold text-lg">아직 운동 기록이 없습니다.</p>
                    <p className="text-gray-500 font-medium">첫 운동을 기록해보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData.workoutRecords.slice(-5).reverse().map((record) => (
                      <div key={record.id} className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-4 border-3 border-black">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-black">
                              📅 {record.date}
                            </span>
                            <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-black">
                              🏋️ {record.exercises.length}개 운동
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setUserData(prev => ({
                                ...prev,
                                workoutRecords: prev.workoutRecords.filter(r => r.id !== record.id)
                              }));
                            }}
                            className="bg-red-500 text-white font-black px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-all"
                          >
                            🗑️ 삭제
                          </button>
                        </div>
                        <div className="space-y-2">
                          {record.exercises.map((exercise) => (
                            <div key={exercise.id} className="bg-white rounded-xl p-3 border-2 border-gray-300">
                              <div className="flex justify-between items-center">
                                <span className="font-black text-gray-800">{exercise.name}</span>
                                <span className="text-sm font-semibold text-gray-600">
                                  {exercise.sets[0]?.weight}kg × {exercise.sets[0]?.reps}회 × {exercise.sets.length}세트
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {userData.workoutRecords.length > 0 && (
                <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-black mb-6 cartoon-text">📊 운동 통계</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-300 to-cyan-400 rounded-2xl p-4 border-3 border-black text-center">
                      <div className="text-3xl mb-2">📈</div>
                      <h4 className="font-black text-black text-lg mb-2">총 운동 일수</h4>
                      <p className="text-2xl font-black text-blue-600">{userData.workoutRecords.length}일</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-2xl p-4 border-3 border-black text-center">
                      <div className="text-3xl mb-2">🏋️</div>
                      <h4 className="font-black text-black text-lg mb-2">총 운동 수</h4>
                      <p className="text-2xl font-black text-green-600">
                        {userData.workoutRecords.reduce((total, record) => total + record.exercises.length, 0)}개
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-300 to-pink-400 rounded-2xl p-4 border-3 border-black text-center">
                      <div className="text-3xl mb-2">💪</div>
                      <h4 className="font-black text-black text-lg mb-2">최근 활동</h4>
                      <p className="text-lg font-black text-purple-600">
                        {userData.workoutRecords.length > 0 ? 
                          `${Math.ceil((Date.now() - new Date(userData.workoutRecords[userData.workoutRecords.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))}일 전` 
                          : '기록 없음'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-20 left-16 text-3xl text-violet-400/40 animate-bounce">❓</div>
            <div className="absolute bottom-20 right-20 text-2xl text-purple-400/40 animate-pulse">💡</div>
            <div className="absolute top-1/2 right-12 text-xl text-indigo-400/40 animate-ping">✨</div>
            
            <div className="bg-gradient-to-br from-violet-200/90 to-purple-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-violet-200 to-purple-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <span className="text-4xl">❓</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">자주 묻는 질문</h2>
                  <p className="text-violet-800 font-bold text-xl">💡 궁금한 것들을 해결해드려요! 💡</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-blue-500/60 rotate-12 animate-pulse">HELP!</div>
                </div>
              </div>

              {/* FAQ 섹션들 */}
              <div className="space-y-6 relative z-10">
                {/* 운동 기초 FAQ */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <span className="text-white text-sm">🏃</span>
                    </div>
                    운동 기초
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        운동을 처음 시작하는데 어떻게 해야 하나요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 가벼운 유산소 운동(걷기, 조깅)부터 시작하여 몸을 적응시키고, 점차 근력 운동을 추가하세요. 무리하지 말고 본인의 체력에 맞게 천천히 강도를 높이는 것이 중요합니다! 💪
                      </p>
                        </div>
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        몇 번 정도 운동해야 효과가 있나요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 초보자는 주 3회 정도가 적당합니다. 하루 운동하고 하루 쉬는 패턴으로 근육 회복 시간을 충분히 주세요. 일주일에 150분 이상의 중강도 운동이 권장됩니다! 🎯
                      </p>
                        </div>
                      </div>
                    </div>

                {/* 3대 운동 FAQ */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <span className="text-white text-sm">🏋️</span>
                      </div>
                    3대 운동
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        3대 운동이 뭔가요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 스쿼트(하체), 벤치프레스(가슴), 데드리프트(등)를 말합니다. 이 세 운동은 전신 근육을 효과적으로 단련할 수 있는 가장 기본적이고 중요한 복합 운동들입니다! 🦵💪🔥
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        3대 운동만 해도 충분한가요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 3대 운동은 훌륭한 기초이지만, 보조 운동들도 함께 하는 것이 좋습니다. 상황에 따라 덤벨 운동, 풀업, 딥스 등을 추가하여 균형잡힌 발달을 도모하세요! ⚖️
                      </p>
                    </div>
                  </div>
                </div>

                {/* 식단 FAQ */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <span className="text-white text-sm">🍽️</span>
                    </div>
                    식단 & 영양
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        운동 전후로 뭘 먹어야 하나요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 운동 전(1-2시간)에는 탄수화물 위주로, 운동 후 30분 내에는 단백질과 탄수화물을 3:1 비율로 섭취하세요. 바나나, 닭가슴살, 현미밥 등이 좋은 선택입니다! 🍌🍗🍚
                      </p>
                          </div>
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        단백질은 얼마나 먹어야 하나요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 일반인은 체중 1kg당 0.8-1.2g, 근력 운동을 하는 분은 1.6-2.2g 정도가 권장됩니다. 예를 들어 70kg 남성이라면 하루 112-154g 정도의 단백질이 필요합니다! 📊
                      </p>
                          </div>
                        </div>
                          </div>

                {/* 부상 예방 FAQ */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <span className="text-white text-sm">🛡️</span>
                          </div>
                    부상 예방
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        워밍업이 꼭 필요한가요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 절대적으로 필요합니다! 5-10분간의 가벼운 유산소와 동적 스트레칭으로 근육 온도를 높이고 관절 가동성을 증가시켜 부상을 예방하세요! 🔥
                      </p>
                        </div>
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        운동 중 통증이 있으면 어떻게 해야 하나요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 즉시 운동을 중단하고 휴식을 취하세요. 근육피로와 부상은 다릅니다. 48시간 후에도 통증이 지속되면 전문의와 상담하는 것이 좋습니다! ⚠️
                      </p>
                      </div>
                    </div>
                  </div>

                {/* 운동 효과 FAQ */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <span className="text-white text-sm">📈</span>
                    </div>
                    운동 효과
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        운동 효과는 언제부터 나타나나요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 체력 향상은 2-3주, 근육량 증가는 6-8주, 체형 변화는 12주 정도 소요됩니다. 꾸준함이 가장 중요하니 포기하지 마세요! 시간은 당신의 편입니다! ⏰💪
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-gray-800 text-lg mb-2 flex items-center">
                        <span className="text-green-600 mr-2">Q:</span>
                        체중이 늘었는데 운동을 잘못하고 있는 건가요?
                      </h4>
                      <p className="text-gray-700 font-semibold pl-6">
                        <span className="text-blue-600 font-black">A:</span> 걱정하지 마세요! 근육이 지방보다 무겁기 때문에 초기에는 체중이 늘 수 있습니다. 체중보다는 체지방률과 몸의 라인 변화에 집중하세요! 근육은 자산입니다! 💎
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ 하단 도움말 */}
              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">💌</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🤝</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text text-center">더 궁금한 것이 있으신가요?</h3>
                
                {!showConsultationForm ? (
                    <div className="text-center">
                    <div className="bg-gradient-to-r from-violet-300 to-purple-300 rounded-3xl p-6 border-4 border-black shadow-cartoon inline-block transform hover:scale-105 transition-all">
                      <div className="text-4xl mb-3">🎯</div>
                      <p className="font-black text-black text-lg mb-2">개인 맞춤 상담</p>
                      <p className="text-gray-700 font-semibold text-sm mb-4">
                        전문 트레이너와 1:1 상담을 통해<br/>
                        당신만의 운동 계획을 세워보세요!
                      </p>
                      <div 
                        className="bg-white rounded-2xl py-2 px-4 border-2 border-black cursor-pointer hover:bg-purple-50 transition-all"
                        onClick={() => setShowConsultationForm(true)}
                      >
                        <span className="font-black text-purple-600">상담 신청하기 →</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-3xl p-6 border-4 border-black shadow-cartoon">
                    <h4 className="text-xl font-black text-black cartoon-text mb-4 text-center">🎯 상담 신청서</h4>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이름 *</label>
                        <input
                          type="text"
                          value={consultationForm.name}
                          onChange={(e) => handleConsultationFormChange('name', e.target.value)}
                          className="w-full p-3 border-2 border-black rounded-xl font-semibold"
                          placeholder="홍길동"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">나이</label>
                        <input
                          type="text"
                          value={consultationForm.age}
                          onChange={(e) => handleConsultationFormChange('age', e.target.value)}
                          className="w-full p-3 border-2 border-black rounded-xl font-semibold"
                          placeholder="25"
                        />
                    </div>
                  </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이메일 *</label>
                        <input
                          type="email"
                          value={consultationForm.email}
                          onChange={(e) => handleConsultationFormChange('email', e.target.value)}
                          className="w-full p-3 border-2 border-black rounded-xl font-semibold"
                          placeholder="example@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">전화번호 *</label>
                        <input
                          type="tel"
                          value={consultationForm.phone}
                          onChange={(e) => handleConsultationFormChange('phone', e.target.value)}
                          className="w-full p-3 border-2 border-black rounded-xl font-semibold"
                          placeholder="010-1234-5678"
                        />
                    </div>
                  </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">운동 경험</label>
                        <select
                          value={consultationForm.experience}
                          onChange={(e) => handleConsultationFormChange('experience', e.target.value)}
                          className="w-full p-3 border-2 border-black rounded-xl font-semibold"
                          aria-label="운동 경험 선택"
                        >
                          <option value="">선택해주세요</option>
                          <option value="처음">처음 시작</option>
                          <option value="초급">초급 (6개월 미만)</option>
                          <option value="중급">중급 (6개월-2년)</option>
                          <option value="고급">고급 (2년 이상)</option>
                        </select>
                </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">운동 목표</label>
                        <select
                          value={consultationForm.goal}
                          onChange={(e) => handleConsultationFormChange('goal', e.target.value)}
                          className="w-full p-3 border-2 border-black rounded-xl font-semibold"
                          aria-label="운동 목표 선택"
                        >
                          <option value="">선택해주세요</option>
                          <option value="체중감량">체중 감량</option>
                          <option value="근력향상">근력 향상</option>
                          <option value="근비대">근비대 (벌크업)</option>
                          <option value="체력향상">체력 향상</option>
                          <option value="재활">재활 운동</option>
                          <option value="기타">기타</option>
                        </select>
              </div>
            </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-1">상담 내용</label>
                      <textarea
                        value={consultationForm.message}
                        onChange={(e) => handleConsultationFormChange('message', e.target.value)}
                        className="w-full p-3 border-2 border-black rounded-xl font-semibold h-24 resize-none"
                        placeholder="궁금한 점이나 상담받고 싶은 내용을 자유롭게 작성해주세요!"
                      />
          </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={submitConsultation}
                        disabled={isSubmittingConsultation}
                        className="bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black py-3 px-6 rounded-2xl border-3 border-black shadow-cartoon hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSubmittingConsultation ? '신청 중...' : '📩 상담 신청하기'}
                      </button>
                      <button
                        onClick={resetConsultationForm}
                        className="bg-gray-300 text-black font-black py-3 px-6 rounded-2xl border-3 border-black shadow-cartoon hover:scale-105 transition-all"
                      >
                        취소
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 text-center mt-3">
                      * 필수 입력 항목 | 신청 후 1-2일 내 연락드립니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'beginner':
        return (
          <div className="p-6 space-y-6 relative">
            {/* 카툰풍 배경 장식 요소들 */}
            <div className="absolute top-10 left-14 text-3xl text-blue-400/40 animate-bounce">📋</div>
            <div className="absolute bottom-16 right-18 text-2xl text-purple-400/40 animate-pulse">💪</div>
            <div className="absolute top-1/3 right-10 text-xl text-indigo-400/40 animate-ping">⚡</div>
            
            <div className="bg-gradient-to-br from-blue-200/90 to-purple-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              {/* 카툰풍 말풍선 꼬리 */}
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-blue-200 to-purple-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 카툰풍 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-300/30 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">운동 프로그램</h2>
                  <p className="text-blue-800 font-bold text-xl">💪 체계적인 훈련으로 목표 달성! 💪</p>
                  {/* 카툰풍 효과음 */}
                  <div className="absolute -top-2 right-4 text-2xl font-black text-green-500/60 rotate-12 animate-pulse">POWER!</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                {/* 초보자 프로그램 */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    초보자 프로그램
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">Full Body A 🏃</h4>
                      <p className="font-semibold text-gray-800">스쿼트, 벤치프레스, 로우</p>
                      <p className="text-sm text-gray-600 font-medium">3세트 × 8-12회</p>
                            </div>
                    <div className="bg-gradient-to-r from-emerald-300 to-teal-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">Full Body B 🤸</h4>
                      <p className="font-semibold text-gray-800">데드리프트, 밀리터리프레스</p>
                      <p className="text-sm text-gray-600 font-medium">3세트 × 8-12회</p>
                          </div>
                    <div className="bg-gradient-to-r from-teal-300 to-cyan-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">주간 스케줄 📅</h4>
                      <p className="font-semibold text-gray-800">월수금 - A/B 번갈아가며</p>
                      <p className="text-sm text-gray-600 font-medium">총 12주 프로그램</p>
                          </div>
                        </div>
                            </div>

                {/* 중급자 프로그램 */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <Zap className="w-5 h-5 text-white" />
                          </div>
                    중급자 프로그램
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">상체의 날 💪</h4>
                      <p className="font-semibold text-gray-800">벤치, 로우, 딥스, 풀업</p>
                      <p className="text-sm text-gray-600 font-medium">4세트 × 6-10회</p>
                          </div>
                    <div className="bg-gradient-to-r from-red-300 to-pink-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">하체의 날 🦵</h4>
                      <p className="font-semibold text-gray-800">스쿼트, 데드, 런지</p>
                      <p className="text-sm text-gray-600 font-medium">4세트 × 6-10회</p>
                        </div>
                    <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">Push/Pull 분할 🔄</h4>
                      <p className="font-semibold text-gray-800">주 6일 훈련</p>
                      <p className="text-sm text-gray-600 font-medium">16주 프로그램</p>
                    </div>
                  </div>
                </div>

                {/* 고급자 프로그램 */}
                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon hover:shadow-cartoon-hover transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-black mb-4 flex items-center cartoon-text">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 border-2 border-black">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    고급자 프로그램
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-300 to-rose-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">피어의딩 🔥</h4>
                      <p className="font-semibold text-gray-800">강도 변화와 볼륨 조절</p>
                      <p className="text-sm text-gray-600 font-medium">5세트 × 3-8회</p>
                        </div>
                    <div className="bg-gradient-to-r from-rose-300 to-pink-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">DUP 트레이닝 📊</h4>
                      <p className="font-semibold text-gray-800">일일 언듈레이팅</p>
                      <p className="text-sm text-gray-600 font-medium">파워/근력/근비대</p>
                        </div>
                    <div className="bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">경기 준비 🏆</h4>
                      <p className="font-semibold text-gray-800">파워리프팅 특화</p>
                      <p className="text-sm text-gray-600 font-medium">20주 맥시사이클</p>
                      </div>
                    </div>
                        </div>
                      </div>

              {/* 특수 프로그램 섹션 */}
              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                {/* 카툰풍 장식 */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce">⭐</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">🎯</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">특수 목적 프로그램</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-violet-300 to-purple-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">홈트레이닝 🏠</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2 text-sm">
                        <li>• 맨몸 운동</li>
                        <li>• 밴드 활용</li>
                        <li>• 최소 장비</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-300 to-indigo-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">컷팅 프로그램 ✂️</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2 text-sm">
                        <li>• 고반복 훈련</li>
                        <li>• HIIT 포함</li>
                        <li>• 체지방 감소</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-300 to-emerald-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">벌킹 프로그램 📈</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2 text-sm">
                        <li>• 고중량 포커스</li>
                        <li>• 컴파운드 위주</li>
                        <li>• 근육량 증가</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-3xl p-6 border-4 border-black shadow-cartoon transform hover:scale-105 hover:rotate-2 transition-all duration-300">
                    <h4 className="font-black text-black text-xl mb-3 cartoon-text">재활 트레이닝 🩹</h4>
                    <div className="bg-white rounded-2xl p-4 border-2 border-black">
                      <ul className="font-bold text-gray-800 space-y-2 text-sm">
                        <li>• 부상 예방</li>
                        <li>• 기능성 운동</li>
                        <li>• 점진적 강화</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 프로그램 선택 가이드 */}
              <div className="mt-6 bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative overflow-hidden">
                <div className="absolute top-2 right-2 text-2xl animate-bounce">🤔</div>
                <div className="absolute bottom-2 left-2 text-xl animate-pulse">💡</div>
                
                <h3 className="text-2xl font-black text-black mb-6 cartoon-text">프로그램 선택 가이드</h3>
                <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-300 to-cyan-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">운동 경험별 🎯</h4>
                      <ul className="font-semibold text-gray-800 space-y-1 text-sm">
                        <li>• 0-6개월: 초보자 프로그램</li>
                        <li>• 6개월-2년: 중급자 프로그램</li>
                        <li>• 2년 이상: 고급자 프로그램</li>
                      </ul>
                      </div>
                    <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">시간별 선택 ⏰</h4>
                      <ul className="font-semibold text-gray-800 space-y-1 text-sm">
                        <li>• 주 3일: Full Body</li>
                        <li>• 주 4-5일: Upper/Lower</li>
                        <li>• 주 6일: Push/Pull/Legs</li>
                      </ul>
                        </div>
                      </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-300 to-emerald-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">목표별 추천 🎪</h4>
                      <ul className="font-semibold text-gray-800 space-y-1 text-sm">
                        <li>• 근력 향상: 고급자 + 저반복</li>
                        <li>• 근육량: 중급자 + 중반복</li>
                        <li>• 체중 감량: 컷팅 + 고반복</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-orange-300 to-red-300 rounded-2xl p-4 border-3 border-black">
                      <h4 className="font-black text-black text-lg mb-2">환경별 선택 🏋️</h4>
                      <ul className="font-semibold text-gray-800 space-y-1 text-sm">
                        <li>• 헬스장: 모든 프로그램</li>
                        <li>• 홈짐: 홈트레이닝</li>
                        <li>• 부상 있음: 재활 트레이닝</li>
                      </ul>
                  </div>
                      </div>
                        </div>
                      </div>
                    </div>
                  </div>
        );
      case 'strength':
        return (
          <div className="p-6 space-y-6 relative">
            <div className="absolute top-20 left-16 text-3xl text-orange-400/40 animate-bounce">💪</div>
            <div className="absolute bottom-20 right-20 text-2xl text-amber-400/40 animate-pulse">🔥</div>
            <div className="absolute top-1/2 right-12 text-xl text-yellow-400/40 animate-ping">⚡</div>
            
            <div className="bg-gradient-to-br from-orange-200/90 to-amber-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-orange-200 to-amber-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <span className="text-4xl">💪</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">근력 향상 프로그램</h2>
                  <p className="text-orange-800 font-bold text-xl">🔥 강한 힘을 키우자! 🔥</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-orange-600 cartoon-text mb-4">🎯 근력 훈련 원리</h3>
                  <ul className="space-y-3 text-gray-800 font-semibold">
                    <li className="flex items-start"><span className="text-orange-500 mr-2 text-lg">📊</span>고중량 저반복 (1-5회)</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2 text-lg">⏱️</span>긴 휴식시간 (3-5분)</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2 text-lg">🎪</span>복합운동 위주</li>
                    <li className="flex items-start"><span className="text-orange-500 mr-2 text-lg">📈</span>점진적 과부하</li>
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-orange-600 cartoon-text mb-4">🚀 주요 운동</h3>
                  <div className="space-y-3">
                    <div className="bg-orange-100 rounded-2xl p-3 border-2 border-orange-300">
                      <p className="font-black text-orange-800">🏋️ 스쿼트 - 하체의 왕</p>
                    </div>
                    <div className="bg-amber-100 rounded-2xl p-3 border-2 border-amber-300">
                      <p className="font-black text-amber-800">🤲 데드리프트 - 전신 파워</p>
                    </div>
                    <div className="bg-yellow-100 rounded-2xl p-3 border-2 border-yellow-300">
                      <p className="font-black text-yellow-800">💺 벤치프레스 - 상체 근력</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-orange-300 to-amber-300 rounded-3xl p-6 border-4 border-black shadow-cartoon">
                <h3 className="text-2xl font-black text-black cartoon-text mb-4 text-center">📅 주간 프로그램</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-4 border-2 border-black text-center">
                    <h4 className="font-black text-orange-600 mb-2">월/수/금</h4>
                    <p className="text-sm text-gray-700 font-semibold">주요 복합운동<br/>3-5세트 × 1-5회</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-black text-center">
                    <h4 className="font-black text-amber-600 mb-2">화/목/토</h4>
                    <p className="text-sm text-gray-700 font-semibold">보조운동<br/>가벼운 유산소</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-black text-center">
                    <h4 className="font-black text-yellow-600 mb-2">일요일</h4>
                    <p className="text-sm text-gray-700 font-semibold">완전휴식<br/>근육 회복</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'hypertrophy':
        return (
          <div className="p-6 space-y-6 relative">
            <div className="absolute top-20 left-16 text-3xl text-rose-400/40 animate-bounce">🔥</div>
            <div className="absolute bottom-20 right-20 text-2xl text-pink-400/40 animate-pulse">💪</div>
            <div className="absolute top-1/2 right-12 text-xl text-fuchsia-400/40 animate-ping">✨</div>
            
            <div className="bg-gradient-to-br from-rose-200/90 to-pink-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-rose-200 to-pink-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <span className="text-4xl">🔥</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">근비대 프로그램</h2>
                  <p className="text-rose-800 font-bold text-xl">🔥 근육을 키우자! 🔥</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-rose-600 cartoon-text mb-4">🎯 근비대 원리</h3>
                  <ul className="space-y-3 text-gray-800 font-semibold">
                    <li className="flex items-start"><span className="text-rose-500 mr-2 text-lg">📊</span>중간중량 중반복 (6-12회)</li>
                    <li className="flex items-start"><span className="text-rose-500 mr-2 text-lg">⏱️</span>중간 휴식시간 (1-3분)</li>
                    <li className="flex items-start"><span className="text-rose-500 mr-2 text-lg">🎪</span>고볼륨 훈련</li>
                    <li className="flex items-start"><span className="text-rose-500 mr-2 text-lg">📈</span>근육 긴장 시간 증가</li>
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-rose-600 cartoon-text mb-4">🚀 필수 영양소</h3>
                  <div className="space-y-3">
                    <div className="bg-rose-100 rounded-2xl p-3 border-2 border-rose-300">
                      <p className="font-black text-rose-800">🥩 단백질 - 체중×2g</p>
                    </div>
                    <div className="bg-pink-100 rounded-2xl p-3 border-2 border-pink-300">
                      <p className="font-black text-pink-800">🍚 탄수화물 - 에너지원</p>
                    </div>
                    <div className="bg-fuchsia-100 rounded-2xl p-3 border-2 border-fuchsia-300">
                      <p className="font-black text-fuchsia-800">💧 수분 - 충분한 수분 섭취</p>
                    </div>
                  </div>
                </div>
                </div>
                
              <div className="mt-6 bg-gradient-to-r from-rose-300 to-pink-300 rounded-3xl p-6 border-4 border-black shadow-cartoon">
                <h3 className="text-2xl font-black text-black cartoon-text mb-4 text-center">📅 분할 훈련</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border-2 border-black">
                    <h4 className="font-black text-rose-600 mb-3 text-center">상체 집중일</h4>
                    <ul className="text-sm text-gray-700 font-semibold space-y-1">
                      <li>• 가슴 - 4세트</li>
                      <li>• 등 - 4세트</li>
                      <li>• 어깨 - 3세트</li>
                      <li>• 팔 - 3세트</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-black">
                    <h4 className="font-black text-pink-600 mb-3 text-center">하체 집중일</h4>
                    <ul className="text-sm text-gray-700 font-semibold space-y-1">
                      <li>• 스쿼트 - 4세트</li>
                      <li>• 데드리프트 - 4세트</li>
                      <li>• 런지 - 3세트</li>
                      <li>• 종아리 - 3세트</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'nutrition-calc':
        return (
          <div className="p-6 space-y-6 relative">
            <div className="absolute top-20 left-16 text-3xl text-lime-400/40 animate-bounce">🧮</div>
            <div className="absolute bottom-20 right-20 text-2xl text-green-400/40 animate-pulse">📊</div>
            <div className="absolute top-1/2 right-12 text-xl text-emerald-400/40 animate-ping">✨</div>
            
            <div className="bg-gradient-to-br from-lime-200/90 to-green-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-lime-200 to-green-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Calculator className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">영양 계산기</h2>
                  <p className="text-green-800 font-bold text-xl">🥗 나만의 영양 계획! 🥗</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-green-600 cartoon-text mb-4">📊 기본 정보 입력</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">성별</label>
                        <select 
                          value={nutritionForm.gender}
                          onChange={(e) => handleNutritionFormChange('gender', e.target.value)}
                          className="w-full p-2 border-2 border-green-300 rounded-xl font-semibold"
                          aria-label="성별 선택"
                        >
                          <option value="">선택</option>
                          <option value="male">남성</option>
                          <option value="female">여성</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">나이</label>
                        <input
                          type="number"
                          value={nutritionForm.age}
                          onChange={(e) => handleNutritionFormChange('age', e.target.value)}
                          className="w-full p-2 border-2 border-green-300 rounded-xl font-semibold"
                          placeholder="25"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">체중 (kg)</label>
                        <input
                          type="number"
                          value={nutritionForm.weight}
                          onChange={(e) => handleNutritionFormChange('weight', e.target.value)}
                          className="w-full p-2 border-2 border-green-300 rounded-xl font-semibold"
                          placeholder="70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">신장 (cm)</label>
                        <input
                          type="number"
                          value={nutritionForm.height}
                          onChange={(e) => handleNutritionFormChange('height', e.target.value)}
                          className="w-full p-2 border-2 border-green-300 rounded-xl font-semibold"
                          placeholder="175"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">활동량</label>
                      <select 
                        value={nutritionForm.activityLevel}
                        onChange={(e) => handleNutritionFormChange('activityLevel', e.target.value)}
                        className="w-full p-2 border-2 border-green-300 rounded-xl font-semibold"
                        aria-label="활동량 선택"
                      >
                        <option value="">선택해주세요</option>
                        <option value="sedentary">좌식 생활 (운동 거의 안함)</option>
                        <option value="light">가벼운 활동 (주 1-3회 운동)</option>
                        <option value="moderate">보통 활동 (주 3-5회 운동)</option>
                        <option value="active">활발한 활동 (주 6-7회 운동)</option>
                        <option value="very_active">매우 활발 (하루 2회 운동)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">목표</label>
                      <select
                        value={selectedGoal}
                        onChange={(e) => setSelectedGoal(e.target.value as 'weightLoss' | 'maintenance' | 'weightGain')}
                        className="w-full p-2 border-2 border-green-300 rounded-xl font-semibold"
                        aria-label="목표 선택"
                      >
                        <option value="weightLoss">체중 감량</option>
                        <option value="maintenance">체중 유지</option>
                        <option value="weightGain">체중 증가</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-green-600 cartoon-text mb-4">🎯 영양 계산 결과</h3>
                  {nutritionResults ? (
                    <div className="space-y-4">
                      <div className="bg-lime-100 rounded-2xl p-4 border-2 border-lime-300">
                        <h4 className="font-black text-lime-800 mb-2">📊 일일 칼로리</h4>
                        <p className="text-2xl font-black text-green-600">{nutritionResults[selectedGoal].calories} kcal</p>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-green-100 rounded-xl p-3 border-2 border-green-300">
                          <span className="font-bold text-green-800">🥩 단백질: {nutritionResults[selectedGoal].protein}g</span>
                        </div>
                        <div className="bg-emerald-100 rounded-xl p-3 border-2 border-emerald-300">
                          <span className="font-bold text-emerald-800">🍚 탄수화물: {nutritionResults[selectedGoal].carbs}g</span>
                        </div>
                        <div className="bg-teal-100 rounded-xl p-3 border-2 border-teal-300">
                          <span className="font-bold text-teal-800">🥑 지방: {nutritionResults[selectedGoal].fat}g</span>
                        </div>
                      </div>
                      <div className="mt-4 bg-blue-50 rounded-2xl p-3 border-2 border-blue-200">
                        <p className="text-sm text-blue-700 font-semibold text-center">
                          {selectedGoal === 'weightLoss' && '🔥 체중 감량을 위한 영양소'}
                          {selectedGoal === 'maintenance' && '⚖️ 체중 유지를 위한 영양소'}  
                          {selectedGoal === 'weightGain' && '💪 체중 증가를 위한 영양소'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="font-semibold">정보를 입력하고<br/>계산해보세요!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={calculateNutrition}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-3 px-8 rounded-2xl border-3 border-black shadow-cartoon hover:scale-105 transition-all"
                >
                  🧮 영양소 계산하기
                </button>
                <button
                  onClick={resetNutritionCalculator}
                  className="bg-gray-300 text-black font-black py-3 px-6 rounded-2xl border-3 border-black shadow-cartoon hover:scale-105 transition-all"
                >
                  다시 입력
                </button>
              </div>
            </div>
          </div>
        );
      case 'meals':
        return (
          <div className="p-6 space-y-6 relative">
            <div className="absolute top-20 left-16 text-3xl text-violet-400/40 animate-bounce">🍽️</div>
            <div className="absolute bottom-20 right-20 text-2xl text-purple-400/40 animate-pulse">🥗</div>
            <div className="absolute top-1/2 right-12 text-xl text-indigo-400/40 animate-ping">✨</div>
            
            <div className="bg-gradient-to-br from-violet-200/90 to-purple-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-violet-200 to-purple-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <span className="text-4xl">🍽️</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">식단 추천</h2>
                  <p className="text-violet-800 font-bold text-xl">🥗 맛있고 건강한 식단! 🥗</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-red-600 cartoon-text mb-4 text-center">🔥 체중 감량</h3>
                  <div className="space-y-4">
                    <div className="bg-red-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] transition-all duration-200">
                      <h4 className="font-black text-red-800 mb-2">🌅 아침</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🥣 오트밀 + 베리류</li>
                        <li>🥛 그릭요거트</li>
                        <li>🥜 아몬드 한 줌</li>
                      </ul>
                    </div>
                    <div className="bg-orange-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(251,146,60,1)] transition-all duration-200">
                      <h4 className="font-black text-orange-800 mb-2">🌞 점심</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🥗 닭가슴살 샐러드</li>
                        <li>🍚 현미밥 반공기</li>
                        <li>🍲 채소 스프</li>
                      </ul>
                    </div>
                    <div className="bg-green-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] transition-all duration-200">
                      <h4 className="font-black text-green-800 mb-2">🌙 저녁</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🐟 생선구이</li>
                        <li>🥦 스팀 브로콜리</li>
                        <li>🍅 토마토 샐러드</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-blue-600 cartoon-text mb-4 text-center">⚖️ 체중 유지</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] transition-all duration-200">
                      <h4 className="font-black text-blue-800 mb-2">🌅 아침</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🥚 계란 스크램블</li>
                        <li>🍞 토스트 2장</li>
                        <li>🧃 과일 주스</li>
                      </ul>
                    </div>
                    <div className="bg-sky-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] transition-all duration-200">
                      <h4 className="font-black text-sky-800 mb-2">🌞 점심</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🍱 균형잡힌 도시락</li>
                        <li>🍚 현미밥</li>
                        <li>🍜 된장국</li>
                      </ul>
                    </div>
                    <div className="bg-cyan-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(6,182,212,1)] transition-all duration-200">
                      <h4 className="font-black text-cyan-800 mb-2">🌙 저녁</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🍗 닭고기 볶음</li>
                        <li>🥬 야채 무침</li>
                        <li>🍲 미역국</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300 transform hover:scale-105">
                  <h3 className="text-2xl font-black text-green-600 cartoon-text mb-4 text-center">💪 체중 증가</h3>
                  <div className="space-y-4">
                    <div className="bg-green-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] transition-all duration-200">
                      <h4 className="font-black text-green-800 mb-2">🌅 아침</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🥞 바나나 팬케이크</li>
                        <li>🥤 프로틴 쉐이크</li>
                        <li>🥜 견과류 믹스</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] transition-all duration-200">
                      <h4 className="font-black text-emerald-800 mb-2">🌞 점심</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🍖 소고기 덮밥</li>
                        <li>🥘 김치찌개</li>
                        <li>🍙 치즈 김밥</li>
                      </ul>
                    </div>
                    <div className="bg-teal-100 rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(20,184,166,1)] transition-all duration-200">
                      <h4 className="font-black text-teal-800 mb-2">🌙 저녁</h4>
                      <ul className="text-sm text-gray-800 font-bold space-y-1">
                        <li>🐟 연어 스테이크</li>
                        <li>🥑 아보카도 샐러드</li>
                        <li>🍠 고구마</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-violet-300 to-purple-300 rounded-3xl p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300">
                <h3 className="text-2xl font-black text-black cartoon-text mb-4 text-center">🥤 간식 & 팁</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(139,92,246,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <h4 className="font-black text-violet-600 mb-3">✨ 건강한 간식</h4>
                    <ul className="text-sm text-gray-800 font-bold space-y-1">
                      <li>🥜 견과류 (아몬드, 호두)</li>
                      <li>🍎 신선한 과일</li>
                      <li>🥕 채소 스틱</li>
                      <li>🧀 치즈와 크래커</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(147,51,234,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                    <h4 className="font-black text-purple-600 mb-3">💡 식단 팁</h4>
                    <ul className="text-sm text-gray-800 font-bold space-y-1">
                      <li>💧 하루 2L 이상 물 마시기</li>
                      <li>⏰ 규칙적인 식사 시간</li>
                      <li>🍽️ 천천히 씹어 먹기</li>
                      <li>📊 영양소 균형 맞추기</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'calculator':
        return (
          <div className="p-6 space-y-6 relative">
            <div className="absolute top-20 left-16 text-3xl text-cyan-400/40 animate-bounce">🧮</div>
            <div className="absolute bottom-20 right-20 text-2xl text-blue-400/40 animate-pulse">💪</div>
            <div className="absolute top-1/2 right-12 text-xl text-indigo-400/40 animate-ping">⚡</div>
            
            <div className="bg-gradient-to-br from-cyan-200/90 to-blue-300/90 backdrop-blur-xl rounded-3xl p-8 border-4 border-black shadow-cartoon relative overflow-hidden">
              <div className="absolute -top-4 left-12 w-8 h-8 bg-gradient-to-br from-cyan-200 to-blue-300 border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mr-6 border-4 border-black shadow-cartoon transform hover:rotate-3 transition-all duration-300">
                  <Calculator className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-black cartoon-text mb-2">1RM 계산기</h2>
                  <p className="text-cyan-800 font-bold text-xl">🏋️ 최대 근력을 계산하자! 🏋️</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-cyan-600 cartoon-text mb-4">🎯 1RM 계산</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">중량 (kg)</label>
                      <input
                        type="number"
                        value={calcWeight}
                        onChange={(e) => setCalcWeight(e.target.value)}
                        className="w-full p-3 border-2 border-cyan-300 rounded-xl font-semibold text-center text-lg"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">반복수 (회)</label>
                      <input
                        type="number"
                        value={calcReps}
                        onChange={(e) => setCalcReps(e.target.value)}
                        className="w-full p-3 border-2 border-cyan-300 rounded-xl font-semibold text-center text-lg"
                        placeholder="5"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={calculateOneRM}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-3 px-6 rounded-2xl border-3 border-black shadow-cartoon hover:scale-105 transition-all"
                      >
                        🧮 계산하기
                      </button>
                      <button
                        onClick={resetCalculator}
                        className="bg-gray-300 text-black font-black py-3 px-4 rounded-2xl border-3 border-black shadow-cartoon hover:scale-105 transition-all"
                      >
                        리셋
                      </button>
                    </div>
                    {calcResult && (
                      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 border-2 border-cyan-300 text-center">
                        <h4 className="font-black text-cyan-800 mb-2">🎯 예상 1RM</h4>
                        <p className="text-3xl font-black text-blue-600">{calcResult} kg</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border-3 border-black shadow-cartoon">
                  <h3 className="text-2xl font-black text-cyan-600 cartoon-text mb-4">📊 트레이닝 중량표</h3>
                  {calcResult ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {[50, 60, 70, 75, 80, 85, 90, 95, 100].map(percentage => (
                        <div key={percentage} className="flex justify-between items-center bg-cyan-50 rounded-xl p-3 border-2 border-cyan-200">
                          <span className="font-bold text-cyan-800">{percentage}%</span>
                          <span className="font-black text-blue-600">{Math.round(calcResult * percentage / 100)} kg</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">📈</div>
                      <p className="font-semibold">1RM을 계산하면<br/>트레이닝 중량표가<br/>나타납니다!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-3xl p-6 border-4 border-black shadow-cartoon">
                <h3 className="text-2xl font-black text-black cartoon-text mb-4 text-center">💡 1RM 계산 가이드</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-4 border-2 border-black text-center">
                    <h4 className="font-black text-cyan-600 mb-2">📏 사용법</h4>
                    <p className="text-sm text-gray-700 font-semibold">최근에 수행한<br/>중량과 반복수를<br/>입력하세요</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-black text-center">
                    <h4 className="font-black text-blue-600 mb-2">⚠️ 주의사항</h4>
                    <p className="text-sm text-gray-700 font-semibold">반드시 충분한<br/>웜업 후에<br/>측정하세요</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-black text-center">
                    <h4 className="font-black text-indigo-600 mb-2">📈 활용법</h4>
                    <p className="text-sm text-gray-700 font-semibold">80-90%로<br/>근력 훈련<br/>70-80%로 파워</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // 상담 신청 관련 함수들
  const handleConsultationFormChange = (field: string, value: string) => {
    setConsultationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetConsultationForm = () => {
    setConsultationForm({
      name: '',
      email: '',
      phone: '',
      age: '',
      experience: '',
      goal: '',
      message: ''
    });
    setShowConsultationForm(false);
  };

  const submitConsultation = async () => {
    // 필수 필드 검증
    if (!consultationForm.name || !consultationForm.email || !consultationForm.phone) {
      alert('이름, 이메일, 전화번호는 필수 입력 항목입니다.');
      return;
    }

    // 이메일 유효성 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(consultationForm.email)) {
      alert('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsSubmittingConsultation(true);

    try {
      // FormSubmit.co를 사용한 실제 메일 발송 (무료 서비스)
      const formData = new FormData();
      formData.append('name', consultationForm.name);
      formData.append('email', consultationForm.email);
      formData.append('phone', consultationForm.phone);
      formData.append('age', consultationForm.age || '미입력');
      formData.append('experience', consultationForm.experience || '미입력');
      formData.append('goal', consultationForm.goal || '미입력');
      formData.append('message', consultationForm.message || '별도 문의사항 없음');
      formData.append('submit_time', new Date().toLocaleString('ko-KR'));
      formData.append('_subject', `JWONDER 운동 상담 신청 - ${consultationForm.name}`);
      formData.append('_captcha', 'false'); // 캡차 비활성화
      formData.append('_template', 'table'); // 깔끔한 테이블 형식

      // FormSubmit API 호출
      const response = await fetch('https://formsubmit.co/jvic83@naver.com', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('상담 신청이 완료되었습니다! jvic83@naver.com으로 메일이 발송되었습니다. 빠른 시일 내에 연락드리겠습니다. 💪');
        resetConsultationForm();
      } else {
        throw new Error('메일 발송 실패');
      }
      
    } catch (error) {
      console.error('상담 신청 중 오류:', error);
      
      // 실패시 fallback으로 mailto 사용
      const emailContent = `
새로운 상담 신청이 있습니다.

📋 신청자 정보:
- 이름: ${consultationForm.name}
- 이메일: ${consultationForm.email}
- 전화번호: ${consultationForm.phone}
- 나이: ${consultationForm.age || '미입력'}
- 운동 경험: ${consultationForm.experience || '미입력'}
- 운동 목표: ${consultationForm.goal || '미입력'}

💬 상담 내용:
${consultationForm.message || '별도 문의사항 없음'}

신청 시간: ${new Date().toLocaleString('ko-KR')}
      `.trim();

      const mailtoLink = `mailto:jvic83@naver.com?subject=JWONDER 운동 상담 신청 - ${consultationForm.name}&body=${encodeURIComponent(emailContent)}`;
      window.location.href = mailtoLink;
      
      alert('상담 신청이 완료되었습니다! 메일 클라이언트가 열립니다. 💪');
      resetConsultationForm();
      
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('JwonderWorkOut 컴포넌트가 마운트되었습니다.');
  }, []);

  // 페이지 로드 시 모달 자동 열기
  useEffect(() => {
    const timer = setTimeout(() => {
    }, 1500); // 1.5초 후 모달 열기

    return () => clearTimeout(timer);
  }, []);

  if (selectedCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 relative overflow-hidden">
        {/* 올드스쿨 카툰 스타일 배경 장식 요소들 */}
        <div className="absolute inset-0">
          {/* 클래식 카툰풍 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/60 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-radial from-pink-200/40 via-transparent to-transparent"></div>
          
          {/* 올드스쿨 카툰 스타일 점 패턴 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-10 left-10 w-4 h-4 bg-red-400 rounded-full"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="absolute bottom-32 left-24 w-5 h-5 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-48 right-16 w-3 h-3 bg-purple-400 rounded-full"></div>
            <div className="absolute top-40 left-1/3 w-4 h-4 bg-orange-400 rounded-full"></div>
            <div className="absolute top-60 right-1/3 w-3 h-3 bg-cyan-400 rounded-full"></div>
          </div>
          
          {/* 클래식 카툰풍 효과음 텍스트들 */}
          <div className="absolute top-16 left-8 text-6xl font-black text-red-400/25 rotate-12 select-none pointer-events-none animate-pulse">WORKOUT!</div>
          <div className="absolute top-32 right-12 text-4xl font-black text-blue-400/25 -rotate-12 select-none pointer-events-none animate-bounce">STRONG!</div>
          <div className="absolute bottom-32 left-16 text-5xl font-black text-green-400/25 rotate-45 select-none pointer-events-none animate-pulse">POWER!</div>
          <div className="absolute bottom-16 right-32 text-3xl font-black text-purple-400/25 -rotate-45 select-none pointer-events-none animate-bounce">FIT!</div>
          
          {/* 올드스쿨 카툰 스타일 장식 요소들 */}
          <div className="absolute top-24 right-1/3 w-12 h-12 border-4 border-yellow-400/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-24 left-1/3 w-10 h-10 border-4 border-pink-400/30 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-8 w-6 h-6 bg-blue-400/30 transform rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-8 w-8 h-8 bg-green-400/30 transform rotate-12 animate-bounce"></div>
        </div>

        {/* 기존 카툰 스타일 네비게이션 */}
        <div className="max-w-6xl mx-auto mb-8 relative z-10 p-4">
          <div className="relative">
            <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative">
              {/* 말풍선 꼬리 */}
              <div className="absolute -top-4 left-8 w-8 h-8 bg-white border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              <div className="flex justify-between items-center">
                <div 
                  title="메인 페이지로 이동" 
                  className="flex items-center space-x-4 cursor-pointer hover:scale-105 transition-all duration-300 rounded-2xl p-2 hover:bg-yellow-100"
                  onClick={() => setSelectedCard(null)}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-cartoon border-4 border-black">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-black cartoon-text">JWONDER</h1>
                    <p className="text-black font-bold text-lg">💪 Work Out! 💪</p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 선택된 카드의 콘텐츠 */}
        {renderCardContent()}
        
        {/* 카툰 스타일 풋터 */}
        <footer className="relative z-10 mt-16 pb-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative">
              {/* 말풍선 꼬리 */}
              <div className="absolute -top-4 left-8 w-8 h-8 bg-white border-l-4 border-t-4 border-black transform rotate-45"></div>
              
              {/* 간단한 풋터 콘텐츠 */}
              <div className="text-center">
                {/* 브랜드 섹션 */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-cartoon border-3 border-black">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-black cartoon-text">JWONDER FITNESS</h3>
                </div>
                
                {/* 소셜 아이콘들 */}
                <div className="flex justify-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-cartoon border-2 border-black cursor-pointer hover:scale-110 transition-all duration-300">
                    <span className="text-white text-sm">📘</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-600 rounded-full flex items-center justify-center shadow-cartoon border-2 border-black cursor-pointer hover:scale-110 transition-all duration-300">
                    <span className="text-white text-sm">📷</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-cartoon border-2 border-black cursor-pointer hover:scale-110 transition-all duration-300">
                    <span className="text-white text-sm">💬</span>
                  </div>
                </div>

                {/* 카피라이트 */}
                <p className="text-gray-600 font-semibold text-xs">
                  © 2024 JWONDER Fitness. 
                  <span className="text-orange-600 ml-1">🎪 Made with ❤️ 💪</span>
                </p>
              </div>

              {/* 카툰풍 장식 효과 */}
              <div className="absolute -top-2 -right-2 text-lg font-black text-orange-500/60 rotate-12 animate-pulse">💪</div>
              <div className="absolute -bottom-2 -left-2 text-lg font-black text-blue-500/60 -rotate-12 animate-bounce">🎪</div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // 메인 대시보드 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 relative overflow-hidden">
      {/* 올드스쿨 카툰 스타일 배경 장식 요소들 */}
      <div className="absolute inset-0">
        {/* 클래식 카툰풍 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-radial from-pink-200/40 via-transparent to-transparent"></div>
        
        {/* 올드스쿨 카툰 스타일 점 패턴 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-10 left-10 w-4 h-4 bg-red-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="absolute bottom-32 left-24 w-5 h-5 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-48 right-16 w-3 h-3 bg-purple-400 rounded-full"></div>
          <div className="absolute top-40 left-1/3 w-4 h-4 bg-orange-400 rounded-full"></div>
          <div className="absolute top-60 right-1/3 w-3 h-3 bg-cyan-400 rounded-full"></div>
        </div>
        
        {/* 클래식 카툰풍 효과음 텍스트들 - 더 크고 대담한 스타일 */}
        <div className="absolute top-16 left-8 text-7xl font-black text-red-400/30 rotate-12 select-none pointer-events-none animate-pulse transform hover:scale-110 transition-all duration-300">BOOM!</div>
        <div className="absolute top-32 right-12 text-5xl font-black text-blue-400/30 -rotate-12 select-none pointer-events-none animate-bounce transform hover:scale-110 transition-all duration-300">POW!</div>
        <div className="absolute bottom-32 left-16 text-6xl font-black text-green-400/30 rotate-45 select-none pointer-events-none animate-pulse transform hover:scale-110 transition-all duration-300">ZAP!</div>
        <div className="absolute bottom-16 right-32 text-4xl font-black text-purple-400/30 -rotate-45 select-none pointer-events-none animate-bounce transform hover:scale-110 transition-all duration-300">WHAM!</div>
        <div className="absolute top-1/2 left-1/4 text-5xl font-black text-orange-400/20 rotate-12 select-none pointer-events-none animate-ping transform hover:scale-110 transition-all duration-300">KAPOW!</div>
        <div className="absolute top-1/3 right-1/4 text-4xl font-black text-cyan-400/20 -rotate-12 select-none pointer-events-none animate-pulse transform hover:scale-110 transition-all duration-300">BANG!</div>
        
        {/* 올드스쿨 카툰 스타일 장식 요소들 */}
        <div className="absolute top-24 right-1/3 w-16 h-16 border-4 border-yellow-400/40 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-24 left-1/3 w-12 h-12 border-4 border-pink-400/40 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-8 w-8 h-8 bg-blue-400/40 transform rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-8 w-10 h-10 bg-green-400/40 transform rotate-12 animate-bounce"></div>
      </div>

      {/* 기존 카툰 스타일 네비게이션 */}
      <div className="max-w-6xl mx-auto mb-8 relative z-10 p-4">
        <div className="relative">
          <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative">
            {/* 말풍선 꼬리 */}
            <div className="absolute -bottom-4 left-8 w-8 h-8 bg-white border-l-4 border-b-4 border-black transform rotate-45"></div>
            
            <div className="flex justify-between items-center">
              <div 
                title="메인 페이지로 이동" 
                className="flex items-center space-x-4 cursor-pointer hover:scale-105 transition-all duration-300 rounded-2xl p-2 hover:bg-yellow-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-cartoon border-4 border-black">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-black cartoon-text">JWONDER</h1>
                  <p className="text-black font-bold text-lg">💪 Work Out! 💪</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-fr">
            {cards.map((card) => (
              <div
                key={card.id}
                data-card-id={card.id}
                className={`
                  ${getCardSizeClass(card.size)}
                  ${card.color}
                  ${draggedCard?.id === card.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                  rounded-3xl p-6 border-4 border-black shadow-cartoon 
                  hover:shadow-cartoon-hover transition-all duration-300 
                  cursor-pointer transform hover:scale-105 hover:-rotate-2
                  flex flex-col items-center justify-center text-center
                  select-none relative overflow-hidden
                `}
                draggable
                onDragStart={(e) => handleDragStart(e, card)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, card)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, card)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                onClick={() => handleCardClick(card)}
              >
                {/* 올드스쿨 카툰풍 광택 효과 - 더 강하게 */}
                <div className="absolute top-2 left-2 w-10 h-10 bg-white/50 rounded-full blur-sm"></div>
                <div className="absolute top-1 left-1 w-6 h-6 bg-white/70 rounded-full"></div>
                
                {/* 아이콘 */}
                <div className={`${getIconSize(card.size)} flex items-center justify-center relative z-10`}>
                  <span className="drop-shadow-lg filter brightness-110">{card.icon}</span>
                </div>
                
                {/* 제목 */}
                <h3 className={`${getTextSize(card.size)} font-black text-black cartoon-text drop-shadow-lg relative z-10`}>
                  {card.title}
                </h3>
                
                {/* 올드스쿨 카툰풍 테두리 하이라이트 - 더 두껍게 */}
                <div className="absolute inset-1 border-3 border-white/40 rounded-2xl pointer-events-none"></div>
                <div className="absolute inset-2 border-2 border-black/20 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 카툰 스타일 풋터 */}
      <footer className="relative z-10 mt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-cartoon relative">
            {/* 말풍선 꼬리 */}
            <div className="absolute -top-4 left-8 w-8 h-8 bg-white border-l-4 border-t-4 border-black transform rotate-45"></div>
            
            {/* 간단한 풋터 콘텐츠 */}
            <div className="text-center">
              {/* 브랜드 섹션 */}
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-cartoon border-3 border-black">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-black cartoon-text">JWONDER WorkOut</h3>
              </div>
              
              {/* 소셜 아이콘들 */}
              <div className="flex justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-cartoon border-2 border-black cursor-pointer hover:scale-110 transition-all duration-300">
                  <span className="text-white text-sm">📘</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-600 rounded-full flex items-center justify-center shadow-cartoon border-2 border-black cursor-pointer hover:scale-110 transition-all duration-300">
                  <span className="text-white text-sm">📷</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-cartoon border-2 border-black cursor-pointer hover:scale-110 transition-all duration-300">
                  <span className="text-white text-sm">💬</span>
                </div>
              </div>

              {/* 카피라이트 */}
              <p className="text-gray-600 font-semibold text-xs">
                © 2025 JWONDER Workout. 
                <span className="text-orange-600 ml-1">🎪 Made with JWONDER 💪</span>
              </p>
            </div>

            {/* 카툰풍 장식 효과 */}
            <div className="absolute -top-2 -right-2 text-lg font-black text-orange-500/60 rotate-12 animate-pulse">💪</div>
            <div className="absolute -bottom-2 -left-2 text-lg font-black text-blue-500/60 -rotate-12 animate-bounce">🎪</div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default JwonderWorkOut;
