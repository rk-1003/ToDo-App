import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Home = () => {
    const [tab,setTab] = useState(1)
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const handleTabs = (tab) => {
        setTab(tab);
        //console.log(tab);
    };

    const handleAddTask = (e) => {
        e.preventDefault(); 
        //console.log(task); 
         axios.post('http://localhost:5000/new-task', { task })
         .then((res) => {
            setTodos(res.data);
            setTask(''); // Clear 
         })
    }

    useEffect(() => {
        axios.get('http://localhost:5000/read-tasks')
            .then((res) => {
                console.log(res.data);
                setTodos(res.data);
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    const handleEdit = (id, task) => {
        setIsEdit(true);
        setTask(task);
        setUpdatedTask(task);
        setUpdateId(id);
    }

    const [updateId, setUpdateId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState('');

    const updateTask = () => {
        axios.post('http://localhost:5000/update-task', { updateId, updatedTask })
        .then(res =>{
            setTodos(res.data);
            setTask('');
            setIsEdit(false);
            setUpdateId(null);
            setUpdatedTask('');
        })
    }

    const handleDelete = (id) => {
        axios.post('http://localhost:5000/delete-task', { id })
        .then(res => {
            setTodos(res.data);
        })
    }

    const handleComplete = (id) => {
        axios.post('http://localhost:5000/complete-task', { id })
        .then(res => {
            setTodos(res.data);
        })
    }

    
  return (
    <div className='bg-blue-50 min-h-screen w-screen'>
      <div className='flex flex-col w-full min-h-screen justify-center items-center'>
        <div>
          <h2 className='font-bold text-2xl mb-4 text-blue-600'>ToDo List</h2>
        </div>

        <div className='flex gap-3 bg-white p-4 rounded-lg shadow-md border border-gray-200'>
          <input
            value={isEdit ? updatedTask : task}
            onChange={e=> {
              if (isEdit) {
                setUpdatedTask(e.target.value);
              } else {
                setTask(e.target.value);
              }
            }}
            type="text"
            placeholder="Add a new task"
            className='w-64 p-2 outline-none border border-blue-300 rounded-md text-black'
          />
          
            {isEdit ? <button className='bg-blue-600 text-white px-4 rounded-md ' onClick={updateTask}>Update Task</button> : <button className='bg-blue-600 text-white px-4 rounded-md ' onClick={handleAddTask}>Add Task</button>}
          
        </div>

        <div className='flex text-sm w-80 justify-evenly mt-4'>
            <p onClick={()=>handleTabs(1)} className={`${tab === 1 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>All</p>
            <p onClick={()=>handleTabs(2)} className={`${tab === 2 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Active</p>
            <p onClick={()=>handleTabs(3)} className={`${tab === 3 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Completed</p>
        </div>

        {
          tab == 1 && todos?.map(todo=> (
            <div className='flex justify-between bg-gray-50 p-3 w-80 mt-3 rounded-md border border-gray-300 shadow-sm'> 
                <div>
                    <p className='text-lg font-semibold text-black'>{todo.task}</p>
                    <p className='text-xs text-gray-700'>{new Date(todo.createdAt).toLocaleDateString()}</p>
                    <p className='text-sm text-gray-800'>Status: {todo.status}</p>
                </div>

                <div className='flex flex-col text-sm justify-start items-start'>
                    <button className=' text-blue-600 cursor-pointer' onClick={()=>handleEdit(todo.id, todo.task)}>Edit</button>
                    <button className=' text-red-500 cursor-pointer' onClick={()=> handleDelete(todo.id)}>Delete</button>
                    <button className=' text-green-600 cursor-pointer' onClick={()=>handleComplete(todo.id)}>Complete</button>
                </div>

            </div>
          ))  
        }

         {
          tab == 2 && todos?.filter(todo => todo.status === 'Active').map(todo=> (
            <div className='flex justify-between bg-gray-50 p-3 w-80 mt-3 rounded-md border border-gray-300 shadow-sm'> 
                <div>
                    <p className='text-lg font-semibold text-black'>{todo.task}</p>
                    <p className='text-xs text-gray-700'>{new Date(todo.createdAt).toLocaleDateString()}</p>
                    <p className='text-sm text-gray-800'>Status: {todo.status}</p>
                </div>

                <div className='flex flex-col text-sm justify-start items-start'>
                    <button className=' text-blue-600 cursor-pointer' onClick={()=>handleEdit(todo.id, todo.task)}>Edit</button>
                    <button className=' text-red-500 cursor-pointer' onClick={()=> handleDelete(todo.id)}>Delete</button>
                    <button className=' text-green-600 cursor-pointer' onClick={()=>handleComplete(todo.id)}>Complete</button>
                </div>

            </div>
          ))  
        }

         {
          tab == 3 && todos?.filter(todo => todo.status === 'Completed').map(todo=> (
            <div className='flex justify-between bg-gray-50 p-3 w-80 mt-3 rounded-md border border-gray-300 shadow-sm'> 
                <div>
                    <p className='text-lg font-semibold text-black'>{todo.task}</p>
                    <p className='text-xs text-gray-700'>{new Date(todo.createdAt).toLocaleDateString()}</p>
                    <p className='text-sm text-gray-800'>Status: {todo.status}</p>
                </div>

                <div className='flex flex-col text-sm justify-center items-center'>
                    <button className=' text-red-500 cursor-pointer' onClick={()=> handleDelete(todo.id)}>Delete</button>
                </div>

            </div>
          ))  
        }
      </div>
    </div>
  );
};

export default Home;
