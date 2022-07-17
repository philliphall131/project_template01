import { StateContext } from '../ContextObjs'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({page}) => {
    const { state } = useContext(StateContext);

    if (state.user){
        return page
    }

    return (
        <Navigate to="/signup" replace={true}/>
    )
}

export default Protected