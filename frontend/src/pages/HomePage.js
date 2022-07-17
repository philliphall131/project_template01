import { useContext } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { StateContext } from '../ContextObjs';

const HomePage = ({name}) => {
  const { state } = useContext(StateContext);
  return (
    <div className="standard-body">
      <div className="main-content">
        <h1>Home Page</h1>
        <p>{name}</p>
        <Link to={'signup'}><button>Sign Up Page</button></Link>
      </div>
    </div>
  )
}

export default HomePage