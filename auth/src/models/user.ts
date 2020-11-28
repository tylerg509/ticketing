import mongoose from 'mongoose';
import { Password } from '../services/password';
// properties for new user
interface IUserAttrs {
    email: string;
    password: string;
}

// properties for user model
interface IUserModel extends mongoose.Model<IUserDoc> {
    build(attrs: IUserAttrs): IUserDoc;
}

// properties for user document that you want to use
interface IUserDoc extends mongoose.Document {
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

// if you use an arrow function 'this' would reference the entire docuemnt instead of the function
// pre save = a middleware function within mongoose. Every time you try to save something run this function
// mongoose does not support async await very well so we use the done callback to handle async code
userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done()
})

// add a static method to the user schema for type checking
userSchema.statics.build = (attrs: IUserAttrs) => {
    return new User(attrs)
}

// IUserModels adds typing to the static methods
const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User }