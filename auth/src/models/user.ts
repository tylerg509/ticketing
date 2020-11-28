import mongoose from 'mongoose';

// properties for new user
interface IUserAttrs {
    email: string;
    password: string;
}

// properties for user model
interface IUserModel extends mongoose.Model<any> {
    build(attrs: IUserAttrs): any;
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

// add a static method to the user schema for type checking
userSchema.statics.build = (attrs: IUserAttrs) => {
    return new User(attrs)
}

// IUserModels adds typing to the static methods
const User = mongoose.model<any, IUserModel>('User', userSchema);

export { User }