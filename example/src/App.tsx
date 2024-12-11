import { Route, Routes } from "react-router-dom"
import { Dashboard, Home } from "./screens"
import { useAuth0 } from "../../index"
import { useEffect } from "react"

function App() {

  const {user , isAuthenticated , isLoading} = useAuth0()

  useEffect(() => {
    console.log(user)
    console.log(isAuthenticated)
    console.log(isLoading)
  }, [isLoading])
  
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
  )
}

export default App
