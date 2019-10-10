const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors());

const URI = "mongodb://localhost:27017/studentdp";
const connection = mongoose.connect(URI, { useNewUrlParser: true });
connection.then(() => console.log("Database Connection done"));

const studentSchema = new mongoose.Schema({
  studentID: String,
  studentName: String,
  studentGender: String,
  studentRoom: String
});
const Student = mongoose.model("Student", studentSchema);

app.get('/', (req, res) => {
    const studentId = req.body.studentId;
    console.log(studentId)
    Student.findOne({studentId}).then(result => console.log(result)).catch(err => console.log(err))
})


const hallSchema = new mongoose.Schema({
  hallName: String
});
const Hall = mongoose.model("Hall", hallSchema);

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  hallName: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});
const Room = mongoose.model("Room", roomSchema);



app.post("/halls", (req, res) => {
  try {
    let newHall = new Hall(req.body);
    newHall.save();
    res.json(newHall);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/halls", cors(), (req, res) => {
  Hall.find((err, halls) => {
    if (err) res.status(500).json(err);

    res.json(halls);
  });
});

app.get("/halls/:id", (req, res) => {
  Hall.findById(req.params.id, (err, hall) => {
    if (err) res.status(500).json(err);

    res.json(hall);
  });
});
app.post("/rooms", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
app.get("/rooms", (req, res) => {
  Room.find((err, rooms) => {
    if (err) res.status(500).json(err);
    res.json(rooms);
  });
});

app.listen(5000, () => {
  console.log("Web server started");
});
