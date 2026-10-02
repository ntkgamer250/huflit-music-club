export interface QuizQuestion {
  id: number
  question: string
  audioSrc?: string
  genre: string
  hint?: string
  answers: string[]
  correctAnswer: number // Index 0-3
  funFact: string
  melodyNotes?: { note: number; dur: number; type?: OscillatorType }[]
}

// Frequency constants (Hz)
const C4 = 261.63
const D4 = 293.66
const E4 = 329.63
const F4 = 349.23
const G4 = 392.00
const A4 = 440.00
const B4 = 493.88
const C5 = 523.25
const D5 = 587.33
const E5 = 659.25
const F5 = 698.46
const G5 = 783.99
const A5 = 880.00

export const musicQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Giai điệu quen thuộc này là đoạn điệp khúc của bài hát nào?",
    audioSrc: "/assets/music-club/audio/track-01.mp3",
    genre: "V-Pop / Hit 2023",
    hint: "Bài hát triệu view của Tăng Duy Tân với câu hát '...nỗi sầu, hòa vào đêm thâu'",
    answers: [
      "Bên Trên Tầng Lầu",
      "Cắt Đôi Nỗi Sầu",
      "Dạ Vũ",
      "Ngây Thơ"
    ],
    correctAnswer: 1,
    funFact: "'Cắt Đôi Nỗi Sầu' từng làm mưa làm gió trên mọi bảng xếp hạng âm nhạc Việt Nam với điệp khúc cực kỳ bắt tai!",
    melodyNotes: [
      { note: E4, dur: 0.28 },
      { note: G4, dur: 0.28 },
      { note: A4, dur: 0.4 },
      { note: A4, dur: 0.28 },
      { note: G4, dur: 0.28 },
      { note: E4, dur: 0.35 },
      { note: D4, dur: 0.28 },
      { note: E4, dur: 0.55 },
      { note: G4, dur: 0.3 },
      { note: E4, dur: 0.6 },
    ]
  },
  {
    id: 2,
    question: "Giai điệu Acoustic lãng mạn dưới đây là ca khúc nổi tiếng nào của Hoàng Dũng?",
    audioSrc: "/assets/music-club/audio/track-02.mp3",
    genre: "Ballad / Indie Pop",
    hint: "Lời bài hát nhắc về một cô gái đẹp như tranh vẽ, 'em ngày xưa đâu rồi...'",
    answers: [
      "Nàng Thơ",
      "Yếu Đuối",
      "Đôi Mươi",
      "Chờ Anh Nhé"
    ],
    correctAnswer: 0,
    funFact: "'Nàng Thơ' là bản hit đưa tên tuổi nhạc sĩ/ca sĩ Hoàng Dũng đến gần hơn với hàng triệu bạn trẻ sinh viên.",
    melodyNotes: [
      { note: C5, dur: 0.35 },
      { note: B4, dur: 0.35 },
      { note: A4, dur: 0.35 },
      { note: G4, dur: 0.5 },
      { note: E4, dur: 0.35 },
      { note: F4, dur: 0.35 },
      { note: G4, dur: 0.6 },
      { note: E4, dur: 0.4 },
      { note: D4, dur: 0.7 },
    ]
  },
  {
    id: 3,
    question: "Giai điệu Synth-Pop Disco đậm chất retro này là bài hát nào của MONO?",
    audioSrc: "/assets/music-club/audio/track-03.mp3",
    genre: "City Pop / R&B",
    hint: "Ca khúc debut bùng nổ với điệp khúc 'Từng giọt nước mắt rơi xuống...'",
    answers: [
      "Em Là",
      "Waiting For You",
      "Anh Không Thể",
      "Lữ Khách Qua Thời Gian"
    ],
    correctAnswer: 1,
    funFact: "'Waiting For You' đã trở thành hiện tượng văn hóa đại chúng nhờ bản phối 80s synth-wave ấn tượng của onionn.",
    melodyNotes: [
      { note: A4, dur: 0.2 },
      { note: C5, dur: 0.2 },
      { note: D5, dur: 0.3 },
      { note: D5, dur: 0.2 },
      { note: C5, dur: 0.2 },
      { note: D5, dur: 0.4 },
      { note: E5, dur: 0.3 },
      { note: D5, dur: 0.25 },
      { note: C5, dur: 0.25 },
      { note: A4, dur: 0.6 },
    ]
  },
  {
    id: 4,
    question: "Giai điệu Pop vui nhộn lan tỏa toàn cầu này của Hoàng Thùy Linh tên là gì?",
    audioSrc: "/assets/music-club/audio/track-04.mp3",
    genre: "Electro-Pop / Dance",
    hint: "Vũ điệu 'tình tang tang tình' viral khắp Châu Á và các nước phương Tây!",
    answers: [
      "Để Mị Nói Cho Mà Nghe",
      "Kẻ Cắp Gặp Bà Già",
      "See Tình",
      "Gieo Quẻ"
    ],
    correctAnswer: 2,
    funFact: "'See Tình' của Hoàng Thùy Linh và DTAP đã tạo nên cơn sốt nhảy cover toàn cầu từ Hàn Quốc đến Brazil!",
    melodyNotes: [
      { note: G4, dur: 0.2 },
      { note: A4, dur: 0.2 },
      { note: C5, dur: 0.25 },
      { note: A4, dur: 0.2 },
      { note: C5, dur: 0.25 },
      { note: D5, dur: 0.4 },
      { note: C5, dur: 0.2 },
      { note: A4, dur: 0.3 },
      { note: G4, dur: 0.5 },
    ]
  },
  {
    id: 5,
    question: "Giai điệu Pop toàn cầu bất hủ của Ed Sheeran với vòng hợp âm Marimba đặc trưng:",
    audioSrc: "/assets/music-club/audio/track-05.mp3",
    genre: "Global Hit / Dancehall Pop",
    hint: "Ca khúc đạt hơn 6 tỷ lượt xem trên YouTube: 'I'm in love with the shape of you...'",
    answers: [
      "Perfect",
      "Shape of You",
      "Bad Habits",
      "Thinking Out Loud"
    ],
    correctAnswer: 1,
    funFact: "Shape of You là một trong những ca khúc được nghe nhiều nhất mọi thời đại trên Spotify với hơn 3.5 tỷ lượt stream.",
    melodyNotes: [
      { note: C5, dur: 0.22 },
      { note: E5, dur: 0.22 },
      { note: G5, dur: 0.25 },
      { note: E5, dur: 0.22 },
      { note: C5, dur: 0.25 },
      { note: E5, dur: 0.22 },
      { note: G5, dur: 0.4 },
      { note: A5, dur: 0.25 },
      { note: G5, dur: 0.5 },
    ]
  }
]
