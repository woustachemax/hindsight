import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Shell } from "../components/Shell"
import { me } from "../lib/api"

export const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    me()
      .then(() => navigate("/dashboard"))
      .catch(() => void 0)
  }, [navigate])

  return (
    <Shell>
      <div></div>
    </Shell>
  )
}
