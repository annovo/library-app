import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN_USER, CURRENT_USER } from '../queries'

const Login = ({ show, setPage, onError, setUser}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { refetch } =useQuery(CURRENT_USER)
  const [loginUser, result] = useMutation(LOGIN_USER, {
    onError: error => {
      if(error.graphQLErrors[0] && error.graphQLErrors[0].message){
        onError(error.graphQLErrors[0].message)
      } else {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      localStorage.setItem('library-app-user', token)
      setUser(token)
      refetch()
    }
  }, [result.data]) //eslint-disable-line

  const handleLogin = e => {
    e.preventDefault()
    loginUser({ variables: {username, password} })

    setUsername('')
    setPassword('')
    setPage('authors')
  }

  if(!show) {
    return null
  }

  return(
    <form onSubmit = {handleLogin}>
      <br/>
      username: 
      <input 
        value={username}
        onChange = {({target}) => setUsername(target.value)}
      />
      <br/>
      password: 
      <input 
        type = 'password' 
        value ={password} 
        onChange = {({target})=>setPassword(target.value)} 
      />
      <br />
      <button type = 'submit'>login</button>
    </form>
  )
}

export default Login