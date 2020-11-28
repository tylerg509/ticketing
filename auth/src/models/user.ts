import mongoose from 'mongoose';

// properties for new user
interface IUserAttrs {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);

// For typechecking in TS
const buildUser = (attrs: IUserAttrs) => {
    return new User(attrs)
}

export { User, buildUser }