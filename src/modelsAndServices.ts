import mongoose, { Schema, Document } from "mongoose";

// ** Models **
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; // Explicitly typed
    full_name: string;
    interests: string[];
}

const UserSchema = new Schema({
    full_name: { type: String, required: true },
    interests: { type: [String], required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);

// ** Services **
export const findUsersWithSimilarInterests = async (userId: string) => {
    const currentUser = await User.findById(userId);
    if (!currentUser) throw new Error("User not found");

    const users = await User.aggregate([
        // Exclude current user
        { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
        // Add shared interests
        {
            $addFields: {
                sharedInterests: {
                    $setIntersection: ["$interests", currentUser.interests],
                },
            },
        },
        // Add similarity score
        {
            $addFields: {
                similarityScore: { $size: "$sharedInterests" },
            },
        },
        // Only include users with at least one shared interest
        { $match: { similarityScore: { $gt: 0 } } },
        // Sort by similarity score (highest first)
        { $sort: { similarityScore: -1 } },
    ]);

    return users;
};
