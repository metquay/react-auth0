import { useAuth0 } from "../../../index"

const Home = () => {

  const {login , isAuthenticated , logout , isLoading} = useAuth0()

  if(isLoading){
    return(
      <div>Loading...</div>
    )
  }
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={()=>logout()}>Logout</button>
      ) : (
        <button onClick={async()=>await login({email : "aravind@tracefii.tech" , password : "Kevin@99"})}>Login</button>
      )}
    </div>
  )
}

export default Home