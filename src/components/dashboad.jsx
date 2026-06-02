import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')

    navigate('/login')
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={logout}>
        Déconnexion
      </button>
    </div>
  )
}

export default DashboardPage