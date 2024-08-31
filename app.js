const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');

const app = express();

const mysql = require('mysql2')
const res = require('express/lib/response');
const { render } = require('express/lib/response');

const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "root",
    database: 'student_management_system'
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database Connected!");
    }
});

//Set Views File
app.set('views', path.join(__dirname, 'views'));

//Set View Engine
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//
app.get('/', (req, res) => {
    res.render('login_user', {
        title: 'Result Management System',
    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        message: ' ',
    });
});
app.get('/login_user', (req, res) => {
    res.render('login', {
        title: 'Result Management System',
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let sql = 'SELECT * FROM user_table WHERE username = ? AND password = ?';
    let query = connection.query(sql, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            let sql = "SELECT * FROM student";
            let query = connection.query(sql, (err, rows) => {
                if (err) throw err;
                res.render('student_index', {
                    title: 'Student Data',
                    students: rows,

                });
            });
        } else {
            res.render('login', { message: 'Invalid credentials' });
        }
    });
});

app.get('/student_index', (req, res) => {
    let sql = "SELECT * FROM student";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('student_index', {
            title: '',
            students: rows,

        });
    });
});

app.get('/add', (req, res) => {
    res.render('student_add', {
        title: ''
    });
});


app.post('/save', (req, res) => {
    // console.log(req.body.date_of_birth);
    let data = { roll_no: req.body.roll_no, name: req.body.name, date_of_birth: req.body.date_of_birth, score: req.body.score }
    let sql = "INSERT INTO student SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/student_index');
    });
});

app.get('/edit/:studentRollNo', (req, res) => {
    const studentRollNo = req.params.studentRollNo;
    let sql = `Select * from student where roll_no = ${studentRollNo}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('student_edit', {
            title: '',
            student: result[0]
        });
    });
});

app.post('/update', (req, res) => {
    const studentRollNo = req.body.roll_no;
    let sql = "update student SET roll_no='" + req.body.roll_no + "', name='" + req.body.name + "',  date_of_birth='" + req.body.date_of_birth + "',  score='" + req.body.score + "' where roll_no =" + studentRollNo;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/student_index');
    });
});

app.get('/delete/:studentRollNo', (req, res) => {
    const studentRollNo = req.params.studentRollNo;
    let sql = `Delete from student where roll_no=${studentRollNo}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/student_index');
    });
});


app.get('/score_view', (req, res) => {
    res.render('score_view', {
        title: ''
    });
});

app.post('/search', (req, res) => {
    var studentName = req.body.name;
    var studentRollNo = req.body.roll_no;
    let sql = "SELECT * from student where name = '" + studentName + "' and roll_no='" + studentRollNo + "'";
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render('result', {
            results: results
        });
    });
});

app.use(express.static('public'));
app.listen(3000, () => {
    console.log(`http://localhost:3000/`);
});
