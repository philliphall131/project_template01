import { useContext } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import ironAPI from '../utils/ironAPI.js';
import { useNavigate } from "react-router-dom";
import { StateContext } from '../ContextObjs';
import '../styles/Form.css';

const SignupPage = () => {
  let navigate = useNavigate();
  const { state, dispatch } = useContext(StateContext);

  const validationSchema = yup.object().shape({
    email: yup.string()
      .required('Email is required')
      .email('Not a valid email')
      .test('checkEmail', 'User with this email already exists',
        async (value) => (await ironAPI.checkEmail(value))),
    first_name: yup.string()
      .required('First name is required')
      .max(50, 'First name length must be less than 50 characters'),
    last_name: yup.string()
      .required('Last name is required')
      .max(50, 'Last name length must be less than 50 characters'),
    password: yup.string()
      .required('Password is required')
      .min(4, 'Password length should be at least 4 characters'),
    password2: yup.string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })

  const initialValues = {
    email:'',
    first_name:'',
    last_name:'',
    password:'',
    password2:''
  };

  const formatErrors = (errors) => {
    let returnString = ''
    for (let i=0; i<errors.length; i++){
      returnString += errors[i] + "\n"
    }
    return returnString
  }

  const onSubmit = (values, { setSubmitting, setFieldError })=> {
    ironAPI.signup(values)
      .then((response)=>{
        dispatch({ type: 'SIGN_IN', data: response.data });
        navigate("/dashboard", { replace: true });
      })
      .catch(error=>{
        let errors = error.response.data
        let errorFields = Object.keys(errors)
        for (let i=0; i<errorFields.length; i++){
          if (Object.keys(initialValues).includes(errorFields[i])){
            setFieldError(errorFields[i], formatErrors(errors[errorFields[i]]))
          } else {
            setFieldError('general', formatErrors(errors[errorFields[i]]))
          }
        }
        setSubmitting(false)
      })
      .finally(()=>{
        setSubmitting(false)
      })
  }

  return (
    <Formik 
      validateOnBlur={false}
      validateOnChange={false} 
      {...{initialValues, onSubmit, validationSchema }}
    >
      {({ 
        handleSubmit, 
        handleBlur, 
        handleChange, 
        values, 
        errors, 
        isSubmitting, 
        touched 
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
            <div className="form-body">
            <Form.Group className="form-inputs" controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                    type="text" 
                    name="email"
                    value={values.email}
                    placeholder="Enter your email" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="form-inputs" controlId="formFirstName">
                <Form.Label>First Name:</Form.Label>
                <Form.Control 
                    type="text" 
                    name="first_name"
                    value={values.first_name}
                    placeholder="Enter your first name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.first_name && !!errors.first_name} 
                />
                <Form.Control.Feedback type="invalid">
                    {errors.first_name}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="form-inputs" controlId="formLastName">
                <Form.Label>Last Name:</Form.Label>
                <Form.Control  
                    type="text"
                    name="last_name" 
                    value={values.last_name}
                    placeholder="Enter your last name" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.last_name && !!errors.last_name} 
                />
                <Form.Control.Feedback type="invalid">
                    {errors.last_name}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="form-inputs" controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password" 
                    name= "password"
                    value={values.password}
                    placeholder="Password" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="form-inputs" controlId="formPassword2">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                    type="password" 
                    name="password2"
                    value={values.password2}
                    placeholder="Re-type password" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password2 && !!errors.password2}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.password2}
                </Form.Control.Feedback>
            </Form.Group>
             <button className="submit-button mt-2" type="submit" disabled={isSubmitting}> 
                Submit
            </button>
            </div>
        </Form>
      )}
    </Formik>
  )
}

export default SignupPage