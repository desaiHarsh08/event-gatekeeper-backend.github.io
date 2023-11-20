import express from "express";
import StudentModel from "../models/StudentModel.js";
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ROUTE 1: Add a student using POST "/api/student/add". No login requires
router.post('/add', [
    body('name', 'Enter a valid name').exists(),
    body('stream', 'Enter a valid stream!').exists(),
    body('course', 'Enter a valid course!').exists(),
    body('semester', 'Enter a valid semester!').exists(),
    body('rollNo', 'Enter a valid rollNo!').exists(),
    body('registrationNo', 'Enter a valid registrationNo!').exists(),
    body('year', 'Enter a valid year!').exists(),
    body('present', 'Enter a valid present!').exists(),
], async (req, res) => {
    const { name, stream, course, semester, rollNo, registrationNo, year, present } = req.body;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        // Check for the student entry already exist
        const isExist = await StudentModel.findOne({ semester, rollNo, year });
        console.log(isExist);
        // Return if already exist
        if (isExist !== null) {
            return res.status(400).json({ message: "The given student entry already exist! " });
        }

        // Create the student
        const student = new StudentModel(
            { name, stream: stream.toUpperCase(), course, semester, rollNo, registrationNo, year, present }
        );
        
        const savedStudent = await student.save();
        return res.status(200).json(savedStudent);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});



// ROUTE 2: Delete a student using POST "/api/student/delete". No login requires
router.delete('/delete', [
    body('rollNo', 'Enter a valid rollNo!').exists(),
    body('year', 'Enter a valid year!').exists(),
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rollNo, year } = req.body;
    try {
        // Check for the student entry exist
        const isExist = await StudentModel.findOne({ year, rollNo });
        console.log(isExist);
        // Return if not exist
        if (!isExist) {
            return res.status(400).json({ message: "The given student not exist! " });
        }

        // Delete the student
        await StudentModel.findByIdAndDelete({ _id: isExist._id });
        return res.status(200).json(true);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});


// ROUTE 3: Update a student using POST "/api/student/update". No login requires
router.post('/update', async (req, res) => {

    const { name, stream, course, semester, rollNo, registrationNo, year, present } = req.body;

    try {
        // Check for the student entry exist
        const student = await StudentModel.findOne({ year, rollNo });
        console.log(student);
        // Return if not exist
        if (!student) {
            return res.status(400).json({ message: "The given student not exist! " });
        }

        // Update the student
        student.name = name;
        student.stream = stream;
        student.course = course;
        student.semester = semester;
        student.rollNo = rollNo;
        student.registrationNo = registrationNo;
        student.year = year;
        student.present = present;

        const savedStudent = await student.save();

        return res.status(200).json(savedStudent);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});


// ROUTE 4: Search a student using POST "/api/student/search". No login requires
router.post('/search', [
    body('rollNo', 'Enter a valid rollNo!').exists(),
    body('year', 'Enter a valid year!').exists(),
    body('semester', 'Enter a valid year!').exists(),
], async (req, res) => {

    const { rollNo, year,  semester } = req.body;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check for the student entry exist
        const student = await StudentModel.findOne({ year, rollNo, semester });

        // Return if not exist
        if (!student) {
            return res.status(404).json({ message: "The given student not exist! " });
        }

        return res.status(200).json(student);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});


// ROUTE 5: Delete all students using DELETE "/api/student/delete-all". No login requires
router.delete('/delete-all', async (req, res) => {

    
    try {

        // Delete all the students
        const result = await StudentModel.deleteMany();
        return res.status(200).json(result.deletedCount);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});

export default router;