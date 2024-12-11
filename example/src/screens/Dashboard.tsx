import {withAuthenticationRequired} from '../../../index'


const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default withAuthenticationRequired(Dashboard , {loginRedirectPath : "/"}) 