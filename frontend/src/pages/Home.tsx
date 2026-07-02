import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Shell } from "../components/Shell"
import { me } from "../lib/api"

export const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (token) {
      window.history.replaceState({}, "", "/")
      me()
        .then(() => navigate("/dashboard"))
        .catch(() => void 0)
      return
    }

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