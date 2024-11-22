import mongoose from "mongoose";
import { User, findUsersWithSimilarInterests } from "../src/modelsAndServices";

// Override `console.log` to prevent Jest from attaching metadata
const log = (message: string) => process.stdout.write(`${message}\n`);

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test-matching-app");
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe("Matching Service", () => {
    beforeEach(async () => {
        await User.deleteMany();
    });

    it("lists all users and their interests, and finds users with common interests", async () => {
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

        // Log All Users and Their Interests
        const allUsers = await User.find();
        log("\nAll Users and Their Interests:");
        allUsers.forEach((user) => {
            log(`- ${user.full_name}: ${user.interests.join(", ")}`);
        });

        // Find and Log Matches for Alice
        const matches = await findUsersWithSimilarInterests(alice._id.toString());
        log(`\nUsers with common interests with ${alice.full_name}:`);
        if (matches.length === 0) {
            log("  No matches found.");
        } else {
            matches.forEach((match) => {
                log(`  - ${match.full_name}`);
                log(`    Shared Interests: ${match.sharedInterests.join(", ")}`);
            });
        }

        // Assertions
        expect(allUsers).toHaveLength(5); // Ensure all users are created

        // Check matches for Alice
        expect(matches).toHaveLength(4); // Bob, Charlie, Eve, Dave
        expect(matches[0].full_name).toBe("Bob");
        expect(matches[0].sharedInterests).toEqual(["swimming", "coding", "music"].sort());

        expect(matches[1].full_name).toBe("Eve");
        expect(matches[1].sharedInterests).toEqual(["music", "swimming"].sort());

        expect(matches[2].full_name).toBe("Charlie");
        expect(matches[2].sharedInterests).toEqual(["music"]);

        expect(matches[3].full_name).toBe("Dave");
        expect(matches[3].sharedInterests).toEqual(["reading"]);
    });
});
