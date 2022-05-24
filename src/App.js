import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

function App() {
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async() => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async() => {
    const inResponse = await fetch('http://localhost:5000/tasks')
    const data = await inResponse.json()
    return data
  }

  // Fetch Task
  const fetchTask = async(id) => {
    const inResponse = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await inResponse.json()
    return data
  }

  // Add Task
  const addTask = async(task) => {
    // const id = Math.floor(Math.random() * 100000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])

    const inResponse = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await inResponse.json()
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async(id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Toggle Reminder
  const toggleReminder = async(id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const inResponse = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await inResponse.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder} : task))
  }

  return (
    <div className="container">
        <Header onClick={() => setShowAddTask(!showAddTask)} status={showAddTask}/>
        {showAddTask && <AddTask onAdd={addTask}/>} 
        {
          tasks.length > 0 
          ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> 
          : 'No tasks to show'
        } 
           
    </div>
  );
}

export default App;
