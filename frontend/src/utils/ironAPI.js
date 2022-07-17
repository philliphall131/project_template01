import axios from "axios";

let BASE_URL = "http://localhost:8000/api";

const options = (token=null) => {
    if (token) {
        return {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        }
    } else {
        return {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }
    }
    
}

const ironAPI = {}

ironAPI.login = async (loginData) => {
    return await axios.post(`${BASE_URL}/users/login/`, loginData, options())
};

ironAPI.signup = async (signupData) => {
    return await axios.post(`${BASE_URL}/users/`, signupData, options())
};

ironAPI.checkEmail = async (email) => {
    let response = await axios.post(`${BASE_URL}/users/check_email/`, {'email': email}, options())
    if (response && response.data){
        if (response.data.user_exists === 'true') { return false }
    }
    return true
};

ironAPI.getUser = async (id, token) => {
    return await axios.get(`${BASE_URL}/users/${id}/`, options(token));
}

export default ironAPI