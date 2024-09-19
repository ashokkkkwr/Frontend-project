import { authLabel } from '@data/localization/common/auth'
import useLang from '@hooks/useLang'
import { useState } from 'react'
import { MdDangerous } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from 'services/instance'
import axios from 'axios'

const Login = () => {
  const { lang } = useLang()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const togglePassword = () => setShowPassword(!showPassword)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    data.append('email', formData.email)
    data.append('password', formData.password)

    try {
      const response = await axiosInstance.post('/user/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log("🚀 ~ handleSubmit ~ response:", response)

      const accessToken = response?.data?.token?.accessToken
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken)
        navigate('/home')
        window.location.reload()
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Sign in to Your Account</h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              {authLabel.enterYourEmail[lang]}
            </label>
            <input
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
              id='email'
              name='email'
              type='email'
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              {authLabel.enterYourPassword[lang]}
            </label>
            <div className='relative'>
              <input
                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500'
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                onChange={handleChange}
              />
              <span
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={togglePassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className='text-red-500 text-sm flex items-center'>
              <MdDangerous className='mr-2' />
              {errorMessage}
            </div>
          )}

          <button
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type='submit'
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className='mt-4 text-center'>
          <Link to='/forgot-password' className='text-sm text-blue-600 hover:underline'>
            Forgot your password?
          </Link>
        </div>
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
