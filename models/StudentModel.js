import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
  },
  year: {
    type: Number
  },
  rollNo: {
    type: String,
  },
  registrationNo: {
    type: String,
  },
  stream: {
    type: String,
  },
  course: {
    type: String,
  },
  semester: {
    type: Number,
  },
  present: {
    type: Boolean,
    default: false
  }
});

const Student = mongoose.model('students', StudentSchema);

export default Student;