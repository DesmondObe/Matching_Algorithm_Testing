import mongoose from "mongoose";
import { User, findUsersWithSimilarInterests } from "./modelsAndServices";

const runApp = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://localhost:27017/test-matching-app");
        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany();
        console.log("Existing data cleared");

        // Seed Users
        const alice = await User.create({
            full_name: "Alice",
            interests: ["swimming", "reading", "coding", "music"],
        });
        const bob = await User.create({
            full_name: "Bob",
            interests: ["swimming", "coding", "music"],
        });
        const charlie = await User.create({
            full_name: "Charlie",
            interests: ["music", "dancing", "traveling"],
        });
        const dave = await User.create({
            full_name: "Dave",
            interests: ["reading", "sports", "photography"],
        });
        const eve = await User.create({
            full_name: "Eve",
            interests: ["music", "swimming", "cooking"],
        });

        // Log all inserted users
        console.log("Users inserted into MongoDB:");
        const allUsers = await User.find();
        allUsers.forEach((user) => {
            console.log(`- ${user.full_name}: ${user.interests.join(", ")}`);
        });

      
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error running the application:", error);
    }
};

runApp();
