import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { me } from "../lib/api"

export const DashboardBox = () => {
  const navigate = useNavigate()
  const [signedIn, setSignedIn] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    me()
      .then(() => {
        if (mounted) setSignedIn(true)
      })
      .catch(() => {
        if (mounted) {
          setSignedIn(false)
          navigate("/auth")
        }
      })
    return () => { mounted = false }
  }, [navigate])

  if (!signedIn) return null

  return (
    <div>
    </div>
  )
}
