const mongoose = require('mongoose');


const employeeSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female','Other'],
        required: true
    },
    salary: {
        type: Float,
        required: true
    }
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;