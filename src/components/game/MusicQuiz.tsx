import React, { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Award, CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles, HelpCircle } from 'lucide-react'
import { musicQuizQuestions, QuizQuestion } from '../../data/musicQuiz'
import { sound } from '../../lib/audioSynth'
import confetti from 'canvas-confetti'

interface MusicQuizProps {
  isOpen: boolean
  onClose: () => void
  onOpenRegister: () => void
}

export const MusicQuiz: React.FC<MusicQuizProps> = ({ isOpen, onClose, onOpenRegister }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlayingMelody, setIsPlayingMelody] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const currentQuestion: QuizQuestion = musicQuizQuestions[currentIndex]

  const handlePlayMelody = useCallback(() => {
    if (isPlayingMelody) {
      sound.stopMelody()
      setIsPlayingMelody(false)
      return
    }

    if (currentQuestion.melodyNotes) {
      setIsPlayingMelody(true)
      sound.playVinylDrop()
      sound.playSongMelody(currentQuestion.melodyNotes, () => {
        setIsPlayingMelody(false)
      })
    }
  }, [isPlayingMelody, currentQuestion])

  // Automatically play melody when question changes
  useEffect(() => {
    if (isOpen && !isGameOver) {
      const timer = setTimeout(() => {
        handlePlayMelody()
      }, 400)
      return () => {
        clearTimeout(timer)
        sound.stopMelody()
      }
    }
  }, [currentIndex, isOpen, isGameOver, handlePlayMelody])

  if (!isOpen) return null

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted) return
    sound.playClick()
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return

    setIsAnswerSubmitted(true)
    sound.stopMelody()
    setIsPlayingMelody(false)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      sound.playSuccess()
      setScore((prev) => prev + 20)
    } else {
      sound.playError()
    }
  }

  const handleNextQuestion = () => {
    sound.playClick()
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setShowHint(false)

    if (currentIndex + 1 < musicQuizQuestions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsGameOver(true)
      sound.playSuccess()
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#398BFF', '#70D7FF', '#FFB45C', '#ffffff'],
      })
    }
  }

  const handleRestart = () => {
    sound.playClick()
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setShowHint(false)
    setScore(0)
    setIsGameOver(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#050D1A]/90 backdrop-blur-md"
        onClick={() => {
          sound.stopMelody()
          onClose()
        }}
      />

      {/* Quiz Card Modal */}
      <div className="relative w-full max-w-2xl p-5 sm:p-8 rounded-3xl bg-[#071A33]/95 border border-[#70D7FF]/35 shadow-[0_25px_60px_rgba(5,13,26,0.95),0_0_50px_rgba(57,139,255,0.3)] text-[#F4F7FB] z-10 my-6">
        {/* Header with Exit */}
        <div className="flex items-center justify-between border-b border-[#70D7FF]/20 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#398BFF]/20 border border-[#70D7FF]/40 flex items-center justify-center text-[#70D7FF]">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#70D7FF] uppercase">
                Music Club Mini Game
              </span>
              <h3 className="font-serif-display text-lg sm:text-xl text-white">
                Đoán Tên Bài Hát & Giai Điệu
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-[#0E2A4D] border border-[#70D7FF]/30 text-xs font-mono text-[#70D7FF]">
              Điểm: <span className="font-bold text-white">{score}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.stopMelody()
                onClose()
              }}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#91A4BB] hover:text-white transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {isGameOver ? (
          /* RESULT SCREEN */
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#70D7FF]/15 border-2 border-[#70D7FF] flex items-center justify-center text-[#70D7FF] shadow-[0_0_30px_rgba(112,215,255,0.5)]">
              <Award className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase tracking-widest text-[#70D7FF] font-semibold">
              Hoàn Thành Thử Thách!
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl text-white mt-1 mb-2">
              {score >= 80 ? 'Đôi Tai Vàng Của CLB! 🌟' : 'Tuyệt Vời! Tiếp Tục Đam Mê! 🎵'}
            </h3>
            <p className="text-sm text-[#91A4BB] mb-6">
              Bạn đã đạt <span className="text-2xl font-bold text-[#70D7FF]">{score}</span> / 100 điểm thử thách âm nhạc.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleRestart}
                className="btn-secondary-glow flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#F4F7FB] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.stopMelody()
                  onClose()
                  onOpenRegister()
                }}
                className="btn-primary-glow flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white cursor-pointer"
              >
                <span>Đăng ký CTV Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* QUESTION VIEW */
          <div>
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-[#91A4BB] mb-2 font-mono">
              <span>Câu hỏi {currentIndex + 1} / {musicQuizQuestions.length}</span>
              <span className="text-[#70D7FF]">{currentQuestion.genre}</span>
            </div>
            <div className="w-full h-1.5 bg-[#050D1A] rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-[#398BFF] to-[#70D7FF] transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / musicQuizQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Title */}
            <h4 className="font-sans font-semibold text-base sm:text-lg text-white mb-4">
              {currentQuestion.question}
            </h4>

            {/* Audio Melody Player Bar */}
            <div className="p-4 rounded-2xl bg-[#050D1A]/90 border border-[#70D7FF]/25 flex items-center justify-between gap-4 mb-5 shadow-inner">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayMelody}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all cursor-pointer shadow-lg ${
                    isPlayingMelody
                      ? 'bg-[#70D7FF] text-[#050D1A] shadow-[0_0_20px_#70D7FF] animate-pulse'
                      : 'bg-[#398BFF] hover:bg-[#5CA4FF] shadow-[0_0_15px_rgba(57,139,255,0.6)]'
                  }`}
                >
                  {isPlayingMelody ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {isPlayingMelody ? 'Đang phát đoạn giai điệu synth...' : 'Bấm để nghe giai điệu'}
                  </p>
                  <p className="text-[11px] text-[#91A4BB]">
                    Được tổng hợp trực tiếp bằng Web Audio API
                  </p>
                </div>
              </div>

              {/* Animated waveform visualizer */}
              <div className="flex items-center gap-1 h-6">
                {[12, 24, 18, 28, 14, 22, 10, 26, 16].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-[#70D7FF] transition-all duration-150 ${
                      isPlayingMelody ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{
                      height: isPlayingMelody ? `${h}px` : '6px',
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Hint toggle */}
            <div className="mb-4">
              {showHint ? (
                <div className="p-3 rounded-xl bg-[#0E2A4D]/60 border border-[#70D7FF]/20 text-xs text-[#70D7FF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Gợi ý: {currentQuestion.hint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick()
                    setShowHint(true)
                  }}
                  className="text-xs text-[#91A4BB] hover:text-[#70D7FF] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Xem gợi ý (-0 điểm)</span>
                </button>
              )}
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = isAnswerSubmitted && index === currentQuestion.correctAnswer
                const isWrong = isAnswerSubmitted && isSelected && index !== currentQuestion.correctAnswer

                let borderBg = 'bg-[#050D1A]/70 border-[#70D7FF]/20 hover:border-[#70D7FF]/50 hover:bg-[#0E2A4D]/40'

                if (isCorrect) {
                  borderBg = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                } else if (isWrong) {
                  borderBg = 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                } else if (isSelected) {
                  borderBg = 'bg-[#0E2A4D] border-[#70D7FF] shadow-[0_0_15px_rgba(112,215,255,0.4)]'
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectAnswer(index)}
                    className={`p-3.5 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${borderBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-[#91A4BB]">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{answer}</span>
                    </div>

                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                )
              })}
            </div>

            {/* Fun fact after submission */}
            {isAnswerSubmitted && (
              <div className="p-3.5 mb-5 rounded-xl bg-[#0E2A4D]/50 border border-[#70D7FF]/20 text-xs text-[#91A4BB] animate-in fade-in">
                <span className="font-semibold text-[#70D7FF]">💡 Bạn có biết: </span>
                {currentQuestion.funFact}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#70D7FF]/15">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedAnswer === null}
                  onClick={handleSubmitAnswer}
                  className={`px-7 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all ${
                    selectedAnswer !== null
                      ? 'btn-primary-glow text-white cursor-pointer'
                      : 'bg-white/10 text-[#91A4BB] cursor-not-allowed'
                  }`}
                >
                  Xác Nhận Đáp Án
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="btn-primary-glow flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer"
                >
                  <span>{currentIndex + 1 === musicQuizQuestions.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
