import { StateContext } from '../ContextObjs'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const SignedIn = ({page}) => {
    const { state } = useContext(StateContext);

    if (!state.user){
        return page
    }

    return (
        <Navigate to="/" replace={true}/>
    )
}

export default SignedIn