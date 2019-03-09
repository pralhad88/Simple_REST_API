const express = require('express');
const app = express();

app.use(express.json());
var fs = require('fs');
const PORT = 5000;

const courses = fs.readFileSync("courses.json");
const COURSES = JSON.parse(courses);


app.get('/courses', (req,res) => {
    return res.json(COURSES);
});

app.post('/courses', (req, res) => {
    const courses = fs.readFileSync("courses.json");
    const COURSES = JSON.parse(courses);
    if (!req.body.name || !req.body.description) {
        return res.json({"ErrorMsg": "Apna JSON check karo."})
    }

    var dic = req.body;
    dic['id'] = COURSES.length+1;
    COURSES.push(dic);

    // write to file
    fs.writeFile("courses.json", JSON.stringify(COURSES, null, 2), function(err, data){
        return res.json(dic);
    });
});

app.get("/courses/:id", (req, res) => {
    var get_id = req.params.id;
    var data = COURSES[get_id - 1]
    
    if (COURSES.length < get_id){
        return res.json({"ErrorMsg": "Apne joo id dali hai vo sahi nahi hai."})
    };   
    return res.send(data) 
});

app.put("/courses/:id", (req, res) => {
    var newData = req.body;
    var get_id = req.params.id;
    const courses = fs.readFileSync("courses.json");
    const COURSES = JSON.parse(courses);
    var data = COURSES[get_id-1]
    data['name'] = req.body.name
    data['description'] = req.body.description
    COURSES.splice(get_id-1, 1, data)
    // for (i = 0; i < COURSES.length; i++){
    //     if (get_id == COURSES[i]['id']){
    //         if(newData.hasOwnProperty('name')){
    //             COURSES[i]["name"] = req.body.name;
    //         }
    //         if (newData.hasOwnProperty('description')){
    //             COURSES[i]["description"] = req.body.description;
    //         }
    //     }
    // }
    // console.log(COURSES);
    fs.writeFile("courses.json", JSON.stringify(COURSES, null, 2), (err, data) => {
        return res.send(COURSES)
    });
});

app.get("/courses/:id/exercises", (req, res) => {
    var get_id = req.params.id
    var data = fs.readFileSync(__dirname + '/exercises.json');
    var data1 = JSON.parse(data);
    var num_exercises = data1[get_id-1][String(get_id)]
    return res.json(num_exercises);
});

app.post("/courses/:id/exercises", (req,res) => {
    var data = fs.readFileSync(__dirname + '/exercises.json');
    var data1 = JSON.parse(data);
    var get_id = req.params.id
    
    var num_exercises = data1[get_id-1][String(get_id)]
    console.log(num_exercises);
    
    var dic = req.body;
    dic['id'] = num_exercises.length+1;
    dic["courseId"] = get_id;
    
    num_exercises.push(dic);
    
    fs.writeFile("exercises.json", JSON.stringify(data1, null, 2), (err, data) => {
        
    });
    return res.json(dic);
});

app.put("/courses/:id/exercises/:id2", (req, res) => {
    var course_id = req.params.id;
    var exercises_id = req.params.id2;
    var data = fs.readFileSync(__dirname + '/exercises.json');
    var data1 = JSON.parse(data);
    var num_exercises = data1[course_id-1][String(course_id)]
    var edit_exercise = num_exercises[exercises_id -1]
    
    edit_exercise['name'] = req.body.name;
    edit_exercise["content"] = req.body.content;
    edit_exercise["hint"] = req.body.hint;

    num_exercises.splice(exercises_id-1, 1, edit_exercise);
    fs.writeFile("exercises.json", JSON.stringify(data1, null, 2), (err, data) => {
        
    });
    return res.send(num_exercises);
})

app.get("/courses/:id/exercises/:id2/submissions",(req, res) => {
    var course_id = req.params.id;
    var exercises_id = req.params.id2;
    var data = fs.readFileSync("submission.json");
    var data1 = JSON.parse(data);
    var Submission_details = data1[course_id - 1][String(course_id)][exercises_id - 1];
    return res.json(Submission_details);
});

app.post('/courses/:id/exercises/:id2/submissions', (req,res) => {
    
    var course_id = req.params.id;
    var exercises_id = req.params.id2;
    
    var data = fs.readFileSync("submission.json");
    var data1 = JSON.parse(data);
    var Sumbmission_post = data1[course_id - 1][String(course_id)];
    
    var dic = req.body;
    dic["Ex_id"] = parseInt(exercises_id);
    dic['user_id'] = data1[course_id - 1][String(course_id)].length + 1;
    dic["cource_id"] = parseInt(course_id);
    
    Sumbmission_post.push(dic);

    fs.writeFile("submission.json", JSON.stringify(data1, null, 2), (err, data) => {
        return res.json(Sumbmission_post);
    });
});

var server = app.listen(PORT, () => {
    var host = server.address().address
    var port = server.address().port
    console.log((host, port));
    
});