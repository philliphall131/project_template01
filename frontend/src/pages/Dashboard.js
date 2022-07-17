import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { StateContext } from '../ContextObjs';


const Dashboard = () => {
  const { state } = useContext(StateContext);

  useEffect(()=>{
    loadPrograms()
  }, [])

  const loadPrograms = () => {
    return
  }

  return (
    <div className="dash-body">
      <div className="dash-content">
        <h1 className="dash-title">HAVE YOU LIFTED TODAY, {state.user.first_name}?</h1>
        <Link to="/dashboard">
          <button className="dash-button">Workout Schedule</button>
        </Link>
        <Link to="/dashboard">
          <button className="dash-button">Create/Edit Programs</button>
        </Link>
        <Link to="/dashboard">
          <button className="dash-button">History/Maxes</button>
        </Link>
        <Link to="/dashboard">
          <button className="dash-button">Account</button>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard