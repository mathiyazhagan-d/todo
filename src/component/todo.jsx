import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Grid, Card } from '@mui/material';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ name: '', description: '', status: 'not completed' });
    const [filter, setFilter] = useState('all');
    const [editMode, setEditMode] = useState(null);

    const startEditing = (id) => {
        setEditMode(id);
    };

    const finishEditing = () => {
        setEditMode(null);
    };

    const handleEdit = (id, updatedName, updatedDescription) => {
        const updatedTodos = todos.map(todo =>
            todo.id === id ? { ...todo, name: updatedName, description: updatedDescription } : todo
        );
        setTodos(updatedTodos);

        // Set editMode to null after a brief delay
        setTimeout(() => {
            finishEditing();
        }, 100);
    };

    useEffect(() => {
        // Fetch todos from storage or API when component mounts
        // For simplicity, using localStorage here, but in a real app, you may fetch from an API
        const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(storedTodos);
    }, []);

    useEffect(() => {
        // Save todos to localStorage whenever todos state changes
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    //   const addTodo = () => {
    //     setTodos([...todos, { ...newTodo, id: Date.now() }]);
    //     setNewTodo({ name: '', description: '', status: 'not completed' });
    //   };
    const addTodo = () => {
        // Check if name and description are not empty
        if (!newTodo.name.trim() || !newTodo.description.trim()) {
            alert('Please fill in both Name and Description fields.');
            return;
        }

        setTodos([...todos, { ...newTodo, id: Date.now() }]);
        setNewTodo({ name: '', description: '', status: 'not completed' });
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const updateTodo = (id, updatedTodo) => {
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    };

    const handleStatusChange = (id, newStatus) => {
        updateTodo(id, { ...todos.find(todo => todo.id === id), status: newStatus });
    };

    const filterTodos = () => {
        if (filter === 'completed') {
            return todos.filter(todo => todo.status === 'completed');
        } else if (filter === 'not completed') {
            return todos.filter(todo => todo.status === 'not completed');
        }
        return todos;
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={12} className='text-center margin-20 text-color'>
                    <Typography variant="h4" className='.poppins-bold'>My Todo</Typography>
                </Grid>
            </Grid>

            <Grid container className='container-top'>
                <Grid item xs={1}></Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        value={newTodo.name}
                        onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={newTodo.description}
                        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button className="btn-color-1 bg-green" variant="contained" color="primary" onClick={addTodo}>
                        Add Todo
                    </Button>
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
            <Grid className='top-20'></Grid>
            <Grid container xs={12} className='container-top'>
                <Grid item xs={6} style={{ paddingLeft: "50px" }}>
                    <Typography variant="h4" className='.poppins-bold'>My Todos:</Typography>
                </Grid>
                <Grid item container xs={6}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={3}>
                        <Typography variant="h4" className='.poppins-medium'>Status filter:</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl>
                            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="not completed">Not Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: "space-evenly" }}>
                {filterTodos().map(todo => (
                    <Card sx={{ maxWidth: 500, padding: "20px", margin: "20px" }} className='color-text btn-color-1' key={todo.id} >
                        <div className='top-20' >
                            <Grid container className='container-top'>
                                {editMode === todo.id ? (
                                    <>
                                        <TextField
                                            className='container-top'
                                            label="Name"
                                            variant="outlined"
                                            value={todos.find(t => t.id === todo.id)?.name || ''}
                                            onChange={(e) => handleEdit(todo.id, e.target.value, todos.find(t => t.id === todo.id)?.description || '')}
                                            fullWidth
                                        />
                                        <TextField
                                            className='container-top'
                                            label="Description"
                                            variant="outlined"
                                            value={todos.find(t => t.id === todo.id)?.description || ''}
                                            onChange={(e) => handleEdit(todo.id, todos.find(t => t.id === todo.id)?.name || '', e.target.value)}
                                            fullWidth
                                        />
                                    </>
                                ) : (
                                    <Grid container >
                                        <Grid item xs={12}>
                                            <Typography className='container-top' variant='h5'> Name : {todo.name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography className='container-top' variant='h5'>Description : {todo.description}</Typography>
                                        </Grid>
                                    </Grid>
                                )}
                                <Typography className='container-top' variant='h5'>Status: {todo.status}</Typography>
                                <Grid container xs={12} className='container-top' >
                                    <Grid item xs={4}>
                                        {editMode === todo.id ? (
                                            <Button className="btn-color-1 bg-green" variant="contained" color="primary" onClick={() => finishEditing()}>
                                                Save
                                            </Button>
                                        ) : (
                                            <Button className="btn-color-1 bg-green" variant="contained" color="primary" onClick={() => startEditing(todo.id)}>
                                                Edit
                                            </Button>
                                        )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button className="btn-color-1 bg-red" variant="contained" color="primary" onClick={() => deleteTodo(todo.id)}>
                                            Delete
                                        </Button>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button
                                            className="btn-color-1 bg-orange"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleStatusChange(todo.id, todo.status === 'completed' ? 'not completed' : 'completed')}
                                        >
                                            Change Status
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </Card>
                ))}
            </Grid>

        </div>
    );
};

export default TodoApp;
