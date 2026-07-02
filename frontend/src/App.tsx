import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Auth } from "./pages/Auth"
import { Dashboard } from "./pages/Dashboard"
import { Home } from "./pages/Home"
import { Shell } from "./components/Shell"

function LoadingScreen() {
  return (
    <div className="w-full flex items-center justify-center min-h-[80vh]">
      <div className="flex items-center gap-2.5">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />
        <span
          className="font-mono text-[9px] uppercase tracking-[0.28em]"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          loading
        </span>
      </div>
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      {loading ? (
        <Shell>
          <LoadingScreen />
        </Shell>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
