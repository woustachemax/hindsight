import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, register } from "../lib/api"

const SHADOWS = {
  panel: `
    inset 0 1px 0 rgba(255,255,255,0.04),
    inset 0 -1px 0 rgba(0,0,0,0.6),
    0 18px 40px rgba(0,0,0,0.6)
  `,
  input: `
    inset 0 1px 0 rgba(255,255,255,0.03),
    inset 0 -1px 0 rgba(0,0,0,0.6),
    0 1px 2px rgba(0,0,0,0.4)
  `,
  inputFocus: `
    inset 0 1px 0 rgba(255,255,255,0.06),
    inset 0 -1px 0 rgba(0,0,0,0.7),
    0 0 0 1px rgba(255,255,255,0.1),
    0 0 30px rgba(255,255,255,0.04)
  `,
}

const COLORS = {
  bg: "#080808",
  panel: "#0e0e0e",
  border: "rgba(255,255,255,0.06)",
  text: "#e2e2e2",
  faint: "rgba(255,255,255,0.25)",
  accent: "#a0a0a0",
  accentSoft: "#d4d4d4",
}

const Window = ({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        backgroundColor: COLORS.panel,
        borderColor: COLORS.border,
        boxShadow: SHADOWS.panel,
      }}
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-1">
        <span
          className="font-mono text-[8px] uppercase tracking-[0.28em]"
          style={{ color: COLORS.faint }}
        >
          {title}
        </span>
      </div>

      <div className="relative h-full p-3">
        {children}
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(transparent 50%, rgba(255,255,255,0.08) 50%)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  )
}

export const AuthForm = () => {
  const navigate = useNavigate()
  const [frame, setFrame] = useState(0)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [signedIn, setSignedIn] = useState(true)
  const [focused, setFocused] = useState<string | null>(null)
  const [hoveredField, setHoveredField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((p) => p + 1)
    }, 700)
    return () => clearInterval(interval)
  }, [])

  const dsrValues = ["0.41", "0.38", "0.44", "0.40"]
  const psrValues = ["0.61", "0.58", "0.63", "0.60"]
  const sharpeValues = ["2.84", "3.01", "2.91", "2.77"]
  const deflatedValues = ["0.72", "0.69", "0.74", "0.71"]

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (signedIn) {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    backgroundColor: "rgba(0,0,0,0.5)",
    color: COLORS.text,
    borderColor:
      focused === field
        ? "rgba(255,255,255,0.15)"
        : hoveredField === field
          ? "rgba(255,255,255,0.09)"
          : COLORS.border,
    boxShadow: focused === field ? SHADOWS.inputFocus : SHADOWS.input,
    transform:
      focused === field || hoveredField === field
        ? "translateY(-1px)"
        : "translateY(0)",
  })

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03), transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        className="absolute left-[-10%] top-[10%] h-80 w-[320px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.03), transparent 70%)", filter: "blur(90px)" }}
      />

      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-[0.92fr_1.08fr]">
        <div className="relative flex items-center justify-center px-10">
          <div className="relative w-full max-w-97.5">
            <div
              className="relative overflow-hidden border px-8 py-8"
              style={{
                backgroundColor: "rgba(14,14,14,0.85)",
                borderColor: COLORS.border,
                boxShadow: SHADOWS.panel,
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="mb-8">
                <div
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: "28px",
                    color: COLORS.accentSoft,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  Hindsight
                </div>
              </div>

              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => { setSignedIn(true); setError(null) }}
                  className="flex-1 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-200"
                  style={{
                    backgroundColor: signedIn ? "rgba(255,255,255,0.05)" : "transparent",
                    borderColor: signedIn ? "rgba(255,255,255,0.12)" : COLORS.border,
                    color: signedIn ? COLORS.accentSoft : "rgba(255,255,255,0.25)",
                  }}
                >
                  sign in
                </button>
                <button
                  onClick={() => { setSignedIn(false); setError(null) }}
                  className="flex-1 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.25em] transition-all duration-200"
                  style={{
                    backgroundColor: !signedIn ? "rgba(255,255,255,0.05)" : "transparent",
                    borderColor: !signedIn ? "rgba(255,255,255,0.12)" : COLORS.border,
                    color: !signedIn ? COLORS.accentSoft : "rgba(255,255,255,0.25)",
                  }}
                >
                  register
                </button>
              </div>

              <div className="space-y-5">
                {!signedIn && (
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      username
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      onMouseEnter={() => setHoveredField("name")}
                      onMouseLeave={() => setHoveredField(null)}
                      className="border px-4 py-3 outline-none transition-all duration-200 font-mono text-sm"
                      style={inputStyle("name")}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onMouseEnter={() => setHoveredField("email")}
                    onMouseLeave={() => setHoveredField(null)}
                    className="border px-4 py-3 outline-none transition-all duration-200 font-mono text-sm"
                    style={inputStyle("email")}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      onMouseEnter={() => setHoveredField("password")}
                      onMouseLeave={() => setHoveredField(null)}
                      className="w-full border px-4 py-3 pr-11 outline-none transition-all duration-200 font-mono text-sm"
                      style={inputStyle("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                    >
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-400/70">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative mt-2 w-full overflow-hidden border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(0,0,0,0.2))",
                    color: COLORS.accentSoft,
                    boxShadow: SHADOWS.panel,
                  }}
                >
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative z-10">
                    {loading
                      ? signedIn ? "authenticating..." : "creating account..."
                      : signedIn ? "authenticate" : "create account"}
                  </span>
                </button>

                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
                  <span
                    className="relative px-3 font-mono text-[8px] uppercase tracking-[0.3em]"
                    style={{ backgroundColor: COLORS.panel, color: "rgba(255,255,255,0.15)" }}
                  >
                    external providers
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
                    window.location.href = `${base}/auth/google/login`
                  }}
                  className="flex w-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.24em] border px-4 py-3 transition-all duration-200"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    color: "rgba(255,255,255,0.4)",
                    boxShadow: SHADOWS.input,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"
                    ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.03)"
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.border
                    ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.2)"
                  }}
                >
                  continue with Google
                </button>
              </div>

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage: "linear-gradient(transparent 50%, rgba(255,255,255,0.08) 50%)",
                  backgroundSize: "100% 4px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden md:flex items-center justify-center p-8">
          <div className="relative grid h-[82%] w-[92%] grid-cols-2 gap-4">

            <Window title="deflated sharpe ratio">
              <div className="flex h-full flex-col justify-between font-mono">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>raw sharpe</span>
                    <span style={{ color: "#d4d4d4" }}>{sharpeValues[frame % sharpeValues.length]}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>deflated</span>
                    <span style={{ color: "#d4d4d4" }}>{deflatedValues[frame % deflatedValues.length]}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>trials run</span>
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>{48 + (frame % 5)}</span>
                  </div>
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      verdict
                    </div>
                    <div className="mt-1 text-[11px] font-mono" style={{ color: "rgba(220,60,60,0.85)" }}>
                      probably overfit
                    </div>
                  </div>
                </div>
                <div className="relative h-16 w-full mt-2">
                  <svg viewBox="0 0 300 60" className="absolute inset-0 h-full w-full">
                    <path
                      d={`M0 ${45 - (frame % 3) * 2} C60 10, 120 50, 180 30 S260 15, 300 ${35 + (frame % 4) * 3}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1.5"
                    />
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="60" stroke="rgba(255,255,255,0.03)" />
                    ))}
                  </svg>
                </div>
              </div>
            </Window>

            <Window title="probabilistic sharpe">
              <div className="flex h-full flex-col justify-between font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>PSR(0)</span>
                    <span>{psrValues[frame % psrValues.length]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DSR</span>
                    <span>{dsrValues[frame % dsrValues.length]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>min TRL</span>
                    <span>{`${3 + (frame % 2)}y ${(frame % 12) + 1}m`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>observations</span>
                    <span>{1258 + (frame % 4) * 3}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/5 overflow-hidden">
                      <div className="h-full transition-all duration-700" style={{ width: `${61 + (frame % 3) * 4}%`, backgroundColor: "rgba(255,255,255,0.35)" }} />
                    </div>
                    <span className="text-[8px] w-6 text-right">PSR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/5 overflow-hidden">
                      <div className="h-full transition-all duration-700" style={{ width: `${41 + (frame % 4) * 3}%`, backgroundColor: "rgba(255,255,255,0.2)" }} />
                    </div>
                    <span className="text-[8px] w-6 text-right">DSR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-white/5 overflow-hidden">
                      <div className="h-full transition-all duration-700" style={{ width: `${78 + (frame % 2) * 5}%`, backgroundColor: "rgba(220,80,80,0.5)" }} />
                    </div>
                    <span className="text-[8px] w-6 text-right">risk</span>
                  </div>
                </div>

                <pre className="text-[9px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {"▁▂▃▅▆▇▅▃▂▁"}
                </pre>
              </div>
            </Window>

            <Window title="submission history">
              <div className="flex h-full flex-col justify-between font-mono text-[9px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                <div className="space-y-2">
                  {[
                    { id: "sub_4f2a", sharpe: "3.12", dsr: "0.38", verdict: "overfit" },
                    { id: "sub_3c1b", sharpe: "1.84", dsr: "0.71", verdict: "borderline" },
                    { id: "sub_2e9d", sharpe: "1.21", dsr: "0.96", verdict: "real edge" },
                  ].map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-2">
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>{s.id}</span>
                      <span>SR {s.sharpe}</span>
                      <span
                        style={{
                          color: s.verdict === "overfit"
                            ? "rgba(220,80,80,0.8)"
                            : s.verdict === "real edge"
                            ? "rgba(100,200,120,0.8)"
                            : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {s.verdict}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-8 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="transition-all duration-500"
                      style={{
                        height: `${8 + ((i + frame) % 6) * 8}px`,
                        opacity: 0.15 + ((i + frame) % 5) * 0.07,
                        backgroundColor: "rgba(255,255,255,0.8)",
                      }}
                    />
                  ))}
                </div>

                <div className="text-[8px] uppercase tracking-[0.2em] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                  effective n trials: {14 + (frame % 4)}
                </div>
              </div>
            </Window>

            <Window title="monte carlo">
              <div className="flex h-full flex-col justify-between font-mono">
                <div>
                  <div className="text-[22px] transition-all duration-300" style={{ color: "#d4d4d4" }}>
                    {`E[max] ${(2.4 + (frame % 4) * 0.06).toFixed(2)}`}
                  </div>
                  <div className="mt-1 text-[8px] uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    expected max sharpe / 10k trials
                  </div>
                </div>

                <div className="relative mt-4 h-24 w-full">
                  <svg viewBox="0 0 300 96" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 90 C30 88, 60 70, 90 45 S150 15, 180 20 S230 40, 270 80 L300 88 L300 96 L0 96 Z"
                      fill="url(#mcGrad)"
                    />
                    <path
                      d="M0 90 C30 88, 60 70, 90 45 S150 15, 180 20 S230 40, 270 80 L300 88"
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={`${150 + (frame % 5) * 4}`}
                      y1="0"
                      x2={`${150 + (frame % 5) * 4}`}
                      y2="96"
                      stroke="rgba(220,80,80,0.5)"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                    />
                    {Array.from({ length: 10 }).map((_, i) => (
                      <line key={i} x1={i * 30} y1="0" x2={i * 30} y2="96" stroke="rgba(255,255,255,0.03)" />
                    ))}
                  </svg>
                </div>

                <div className="flex items-end gap-0.75 mt-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full transition-all duration-500"
                      style={{
                        height: `${10 + ((i + frame) % 7) * 6}px`,
                        opacity: 0.08 + ((i + frame) % 5) * 0.05,
                        backgroundColor: "rgba(255,255,255,0.9)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </Window>

          </div>
        </div>
      </div>
    </div>
  )
}