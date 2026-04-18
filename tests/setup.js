import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";

beforeAll(async () => {
	if (mongoose.connection.readyState === 0) {
		await connectDB();
	}

	await User.deleteMany({});
	await Task.deleteMany({});
});

afterAll(async () => {
	await mongoose.connection.close();
});