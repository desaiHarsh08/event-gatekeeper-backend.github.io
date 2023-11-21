import express from "express";
import StudentModel from "../models/StudentModel.js";
import { body, validationResult } from 'express-validator';

const router = express.Router();

// ROUTE 1: Add a student using POST "/api/student/add". No login requires
router.post('/add', [
    body('name', 'Enter a valid name!').exists(),
    body('rfid', 'Enter a valid rfid!').exists(),
    body('event', 'Enter a valid event!').exists(),
    body('status', 'Enter a valid status!').exists()
], async (req, res) => {
    const { name, rfid, event, status } = req.body;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        // Check for the student entry already exist
        const isExist = await StudentModel.findOne({ rfid });
        console.log(isExist);
        // Return if already exist
        if (isExist !== null) {
            return res.status(400).json({ message: "The given student's entry already exist! " });
        }

        // Create the student
        const student = new StudentModel(
            { name, rfid, event, status }
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
    body('rfid', 'Enter a valid rollNo!').exists()
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rfid } = req.body;
    try {
        // Check for the student entry exist
        const isExist = await StudentModel.findOneAndDelete({ rfid });
        console.log(isExist);
        return res.status(200).json(true);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});


// ROUTE 3: Update a student using POST "/api/student/update". No login requires
router.post('/update', async (req, res) => {

    const { name, rfid, event, status } = req.body;

    try {
        // Check for the student entry exist
        const student = await StudentModel.findOne({ rfid });
        console.log(student);
        // Return if not exist
        if (!student) {
            return res.status(400).json({ message: "The given student not exist! " });
        }

        // Update the student
        student.name = name;
        student.rfid = rfid;
        student.event = event;
        student.status = status;

        const savedStudent = await student.save();

        return res.status(200).json(savedStudent);


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
});


// ROUTE 4: Search a student using POST "/api/student/search". No login requires
router.post('/search', [
    body('rfid', 'Enter a valid rollNo!').exists()
], async (req, res) => {

    const { rfid } = req.body;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check for the student entry exist
        const student = await StudentModel.findOne({ rfid });

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