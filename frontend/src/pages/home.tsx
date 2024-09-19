import React, { useEffect, useState } from 'react'
import { MdDangerous } from 'react-icons/md'
import axiosInstance from 'services/instance'
import './ChatUI.css' // Custom CSS for the chat layout.
import { useSocket } from '@context/SocketContext'

interface User {
  id: string
  createdAt: any
  userDetails: {
    bio: string
    address: string
    phone: string
  }
  email: string
  username: string
}

interface Chat {
  id?: string
  senderId?: string
  receiverId?: string
  content?: string
  createdAt: any
  read: boolean
  sender: {
    email: string
  }
  receiver: {
    email: string
  }
  medias?: Media[] // Added to handle media
}

interface Media {
  id: string
  filePath: string
  mimeType: string
}

interface FormData {
  content: string
  files: FileList | null
}

export default function Home() {
  const socket = useSocket()

  const [formData, setFormData] = useState<FormData>({ content: '', files: null })
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [chats, setChats] = useState<Chat[]>([])

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, files: e.target.files })
  }

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/details')
      console.log('🚀 ~ getAllUsers ~ response:', response)
      setUsers(response.data)
    } catch (error) {
      console.log('🚀 ~ getAllUsers ~ error:', error)
      console.error('Error fetching users:', error)
    }
  }

  // Handle form input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // Submit message form
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!selectedUserId) {
      setErrorMessage('Please select a user to send the message.')
      return
    }
    const data = new FormData()
    data.append('receiverId', selectedUserId)
    data.append('content', formData.content)

    if (formData.files) {
      for (let i = 0; i < formData.files.length; i++) {
        data.append('files', formData.files[i])
      }
    }
    console.log('🚀 ~ handleSubmit ~ selectedUserId:', selectedUserId)
    try {
      const response = await axiosInstance.post(`/chat/send`, data)
      console.log('🚀 ~ handleSubmit ~ response:', response)

      viewChats(selectedUserId) // Refresh chats after sending a message
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
      console.error('Error sending message:', error)
    }
  }

  // Fetch chats for the selected user
  const viewChats = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/chat/${userId}`)
      setChats(response.data)
      console.log('🚀 ~ viewChats ~ response:', response)
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }

  // Handle user selection
  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId)
    viewChats(userId)
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage: Chat) => {
        setChats((prevChats) => [...prevChats, newMessage])
      })

      // Clean up the socket listener when component unmounts
      return () => {
        socket.off('newMessage')
      }
    }
  }, [socket])

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Left Sidebar (Users List) */}
      <div className='w-1/4 bg-white p-6 border-r-2'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Users</h2>
        <div className='space-y-4'>
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedUserId === user.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
              }`}
              onClick={() => handleUserClick(user.id)}
            >
              <p className='text-lg font-medium'>{user.username}</p>
              <p className='text-sm text-gray-500'>{user.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className='w-3/4 flex flex-col justify-between bg-gray-50'>
        {/* Chat Box */}
        <div className='flex-grow p-6 overflow-y-auto'>
          <div className='chat-box bg-white p-6 rounded-lg shadow-lg h-full'>
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`mb-4 p-3 rounded-lg max-w-lg ${
                    chat.senderId === selectedUserId
                      ? 'bg-gray-300 text-gray-700 self-end'
                      : 'bg-blue-500 text-white self-start'
                  }`}
                >
                  <p>{chat.content}</p>
                  {chat.medias?.map((media) => {
                    const isImage = media.mimeType.startsWith('image/')
                    const isVideo = media.mimeType.startsWith('video/')

                    return isImage ? (
                      <img
                        key={media.id}
                        src={media.filePath}
                        alt='media'
                        className='max-w-xs h-auto mt-2 rounded-lg shadow'
                      />
                    ) : isVideo ? (
                      <video
                        key={media.id}
                        src={media.filePath}
                        controls
                        className='max-w-xs h-auto mt-2 rounded-lg shadow'
                      />
                    ) : null
                  })}
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No chats available</p>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} encType='multipart/form-data' className='flex items-center p-6 border-t bg-white'>
          <input
            className='flex-grow h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition'
            name='content'
            type='text'
            placeholder='Enter a message'
            onChange={handleChange}
            value={formData.content}
          />
          <input
            className='ml-4 w-24 h-12 border border-gray-300 rounded-lg focus:outline-none'
            name='files'
            type='file'
            multiple
            onChange={handleFileChange}
          />
          <button className='ml-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}