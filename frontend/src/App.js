import './styles/App.css';
import { useEffect, useReducer } from 'react';
import { Routes, Route } from "react-router-dom";
import { StateContext } from './ContextObjs';
import NavBar from './components/NavBar';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Protected from './components/Protected';
import SignedIn from './components/SignedIn';
import ironAPI from './utils/ironAPI';

function App() {

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.data.token,
            user: action.data.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          // store the token
          localStorage.setItem("userToken", action.data.token);
          localStorage.setItem("userId", action.data.user.id);
          return {
            ...prevState,
            isSignout: false,
            userToken: action.data.token,
            user: action.data.user
          };
        case 'SIGN_OUT':
          // reset token to null
          localStorage.removeItem("userToken");
          localStorage.removeItem("userId", null);
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null,
      testUser: null
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userId;
      let data = { user: null, token: null };
      try {
        // Restore token
        userId = localStorage.getItem('userId')
        userToken = localStorage.getItem("userToken");
      } catch (e) {
        console.log('Error retrieving token')
      }
      // If a token was retrieved, validate Token, get user info
      if (userId && userToken){
        let userResponse = await ironAPI.getUser(userId, userToken)
        console.log('userResponse', userResponse)
        if (userResponse && userResponse.data){
          data = { user: userResponse.data, token: userToken }
        } else {
          console.log('Could not retrieve user with credentials stored, try logging in')
        }
      };
      dispatch({ type: 'RESTORE_TOKEN', data });
    };
    bootstrapAsync();
  }, []);

  const stateContext = {
    'state': state,
    'dispatch': dispatch
  }

  if (state.isLoading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <div>
      <StateContext.Provider value={stateContext}>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage name={state.testUser}/>}/>
          <Route path="/signup" element={<SignedIn page={<SignupPage />}/>}/>
          <Route path="/login" element={<SignedIn page={<LoginPage />}/>}/>
          <Route path="/dashboard" element={<Protected page={<Dashboard />}/>}/>
        </Routes>
      </StateContext.Provider>
    </div>
  );
}

export default App;
