require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

app.use(express.json());
app.use(cors());

const db =  mysql.createConnection({
    // Use environment variables for sensitive information
    host: process.env.host ,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});


app.post('/new-task', (req, res) => {
    console.log(req.body);
    const q = 'INSERT INTO todos (task, createdAt, status) values (?, ?, ?)';
    db.query(q, [req.body.task, new Date(), 'Active'], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Task inserted successfully');
        const updatedTasks = 'SELECT * FROM todos';
        db.query(updatedTasks, (error, newList) => {
            if (error) {
                console.error('Error fetching updated list:', error);
                return res.status(500).json({ error: 'Failed to fetch updated list' });
            }
            res.status(200).json(newList); //  final response
        });
    });
});


app.get('/read-tasks', (req, res) => {
    const q = 'SELECT * FROM todos';
    db.query(q, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Tasks fetched successfully');
        res.status(200).json(result); // This is enough
    });
});

app.post('/update-task', (req, res) => {
    const q = 'UPDATE todos SET task = ? WHERE id = ?';
    db.query(q, [req.body.updatedTask, req.body.updateId], (err, result) =>
        {
            if (err) {
                console.error('Error updating task:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            console.log('Task updated successfully');
            const updatedTasks = 'SELECT * FROM todos';
            db.query(updatedTasks, (e, r) => {
                if (e) {
                    console.error('Error fetching updated list:', e);
                    return res.status(500).json({ e: 'Failed to fetch updated list' });
                }
                res.status(200).json(r); // final response
            });
        }
    );
});

app.post('/delete-task', (req, res) => {
    const q = 'DELETE FROM todos WHERE id = ?';
    db.query(q, [req.body.id], (err, result) => {
        if (err) {
            console.log('Error deleting task:', err);
            return res.status(500).json({ error: 'Database error' });
        } else {
            console.log('Task deleted successfully');
            db.query('SELECT * FROM todos', (e, newList) => {
                if (e) {
                    console.error('Error fetching updated list:', e);
                    return res.status(500).json({ error: 'Failed to fetch updated list' });
                }
                res.status(200).json(newList); // final response
            });
        }
    });
});


app.post('/complete-task', (req, res) => {
    const q = 'UPDATE todos SET status = ? WHERE id = ?';
    db.query(q, ['Completed', req.body.id], (err, result) => {
        if (err) {
            console.error('Error updating task status:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        db.query('SELECT * FROM todos', (e, newList) => {
            if (e) {
                console.error('Error fetching updated list:', e);
                return res.status(500).json({ error: 'Failed to fetch updated list' });
            }
            res.status(200).json(newList);
        });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

