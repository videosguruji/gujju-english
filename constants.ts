import { Lesson } from './types';

export const GEMINI_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const LESSONS: Lesson[] = [
  {
    id: 'day1',
    day: 1,
    title: 'Introduction',
    gujaratiTitle: 'પરિચય (Introduction)',
    icon: '👋',
    color: 'bg-blue-500',
    locked: false,
    learningOutcomes: [
      'Saying your name in English',
      'Asking "How are you?"',
      'Saying "I am fine"'
    ],
    vocabulary: [
      { gujarati: 'મારું નામ...', english: 'My name is...', pronunciation: 'માય નેમ ઈઝ...' },
      { gujarati: 'તમે કેમ છો?', english: 'How are you?', pronunciation: 'હાઉ આર યુ?' },
      { gujarati: 'હું મજામાં છું', english: 'I am fine', pronunciation: 'આઈ એમ ફાઈન' }
    ],
    systemPrompt: `You are a friendly, encouraging English tutor for a Gujarati child (Day 1).
    YOUR GOAL: Teach the child to introduce themselves using the "Translation Method" (Gujarati -> English).
    
    METHODOLOGY:
    1. ALWAYS explain the English phrase in Gujarati first or immediately after.
    2. Example: "Bolo 'My name is Raj'. Teno matlab 'Maru naam Raj che'."
    3. Example: "Pucho 'How are you?'. Etle ke 'Tame kem cho?'"
    
    LESSON PLAN:
    1. Start with "Namaste! Hello! Kem cho?"
    2. Teach "My name is...". Ask them: "Tamaru naam shu che? English ma bolo 'My name is...'".
    3. Teach "How are you?". Explain it means "Tame kem cho?".
    4. Teach "I am fine". Explain it means "Hu majama chu".
    
    TONE:
    - Very enthusiastic.
    - Use simple Gujarati words (Bolo, Matlab, Saras, Very Good).
    - If they speak Gujarati, translate it to English for them and ask them to repeat.
    `
  },
  {
    id: 'day2',
    day: 2,
    title: 'Family',
    gujaratiTitle: 'મારો પરિવાર (My Family)',
    icon: '👨‍👩‍👦',
    color: 'bg-green-500',
    locked: false,
    learningOutcomes: [
      'Calling Mother and Father in English',
      'Saying "This is my brother/sister"',
      'Saying "I love my family"'
    ],
    vocabulary: [
      { gujarati: 'માતા', english: 'Mother', pronunciation: 'મધર' },
      { gujarati: 'પિતા', english: 'Father', pronunciation: 'ફાધર' },
      { gujarati: 'ભાઈ', english: 'Brother', pronunciation: 'બ્રધર' },
      { gujarati: 'બહેન', english: 'Sister', pronunciation: 'સિસ્ટર' }
    ],
    systemPrompt: `You are a friendly English tutor for a Gujarati child (Day 2).
    YOUR GOAL: Teach words related to Family.
    
    METHODOLOGY:
    - Use Gujarati to explain meanings.
    - "Mummy ne English ma 'Mother' kevay. Bolo 'Mother'."
    - "Pappa ne English ma 'Father' kevay. Bolo 'Father'."
    
    LESSON PLAN:
    1. Ask "Tamara ghare kon kon che?" (Who is at your home?).
    2. Teach Mother, Father, Brother, Sister.
    3. Teach sentence: "This is my Mother" (Aa mari mata che).
    4. Teach sentence: "I love my family" (Hu mara parivar ne prem karu chu).
    
    Keep it fun and ask them to repeat loud and clear.
    `
  },
  {
    id: 'day3',
    day: 3,
    title: 'Food & Eating',
    gujaratiTitle: 'ખોરાક (Food)',
    icon: '🍎',
    color: 'bg-orange-500',
    locked: false,
    learningOutcomes: [
      'Names of fruits (Apple, Banana)',
      'Saying "I am hungry"',
      'Saying "I want water"'
    ],
    vocabulary: [
      { gujarati: 'સફરજન', english: 'Apple', pronunciation: 'એપલ' },
      { gujarati: 'કેળું', english: 'Banana', pronunciation: 'બનાના' },
      { gujarati: 'મને ભૂખ લાગી છે', english: 'I am hungry', pronunciation: 'આઈ એમ હંગ્રી' },
      { gujarati: 'પાણી', english: 'Water', pronunciation: 'વોટર' }
    ],
    systemPrompt: `You are a friendly English tutor for a Gujarati child (Day 3).
    YOUR GOAL: Teach about Food and expressing hunger.
    
    METHODOLOGY:
    - Connect Gujarati food words to English.
    - "Sufferjan khavu che? Sufferjan ne 'Apple' kevay."
    
    LESSON PLAN:
    1. Ask what they like to eat.
    2. Teach Apple, Banana, Milk, Water.
    3. Teach phrase "I am hungry" (Mane bhukh lagi che).
    4. Teach phrase "Give me water" (Mane pani aapo).
    `
  },
  {
    id: 'day4',
    day: 4,
    title: 'Daily Actions',
    gujaratiTitle: 'રોજિંદા કાર્યો (Actions)',
    icon: '🏃',
    color: 'bg-purple-500',
    locked: true,
    learningOutcomes: [
      'Verbs: Eat, Sleep, Play, Run',
      'Simple sentences like "I am playing"'
    ],
    vocabulary: [
      { gujarati: 'ખાવું', english: 'Eat', pronunciation: 'ઈટ' },
      { gujarati: 'સૂવું', english: 'Sleep', pronunciation: 'સ્લીપ' },
      { gujarati: 'રમવું', english: 'Play', pronunciation: 'પ્લે' }
    ],
    systemPrompt: `You are a friendly English tutor for a Gujarati child (Day 4). Teach Action words.`
  },
  {
    id: 'day5',
    day: 5,
    title: 'Colors & Objects',
    gujaratiTitle: 'રંગો અને વસ્તુઓ (Colors)',
    icon: '🎨',
    color: 'bg-pink-500',
    locked: true,
    learningOutcomes: ['Red, Blue, Green', 'Identify objects by color'],
    vocabulary: [
        { gujarati: 'લાલ', english: 'Red', pronunciation: 'રેડ' },
        { gujarati: 'વાદળી', english: 'Blue', pronunciation: 'બ્લૂ' }
    ],
    systemPrompt: `You are a friendly English tutor for a Gujarati child (Day 5). Teach Colors.`
  }
];
