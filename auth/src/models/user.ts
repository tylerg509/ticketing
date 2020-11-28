import mongoose from 'mongoose';

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

// add a static method to the user schema for type checking
userSchema.statics.build = (attrs: IUserAttrs) => {
    return new User(attrs)
}

// IUserModels adds typing to the static methods
const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User }