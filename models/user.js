import {mongoose, Schema} from 'mongoose';
import pkg from 'validator';
const {isEmail} = pkg;
export default mongoose.model('User', new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: [isEmail, 'Invalid email'],
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate: {
            validator: (value) => value.length > 6,
            message: 'Password length must be greater than 6'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}));