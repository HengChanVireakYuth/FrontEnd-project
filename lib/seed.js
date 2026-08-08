// Run with: npm run seed
// Populates your MongoDB database with fake job listings so the site
// has content to show off.

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    type: String,
    category: String,
    salary: String,
    description: String,
    postedDate: Date,
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

const jobs = [
  {
    title: "Frontend Developer",
    company: "Nova Tech",
    location: "Phnom Penh, Cambodia",
    type: "Full-time",
    category: "Engineering",
    salary: "$800 - $1,200",
    description:
      "We're looking for a Frontend Developer skilled in React and Next.js to help build our customer-facing dashboard.",
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "CloudBridge",
    location: "Remote",
    type: "Full-time",
    category: "Engineering",
    salary: "$1,000 - $1,500",
    description:
      "Build and maintain REST APIs using Node.js and MongoDB. Experience with Express is a plus.",
  },
  {
    title: "UI/UX Designer",
    company: "Pixel Studio",
    location: "Phnom Penh, Cambodia",
    type: "Part-time",
    category: "Design",
    salary: "$500 - $700",
    description:
      "Design clean, modern interfaces for web and mobile products. Portfolio required.",
  },
  {
    title: "Marketing Intern",
    company: "Bright Media",
    location: "Siem Reap, Cambodia",
    type: "Internship",
    category: "Marketing",
    salary: "$150 - $250",
    description:
      "Support the marketing team with social media content, campaign tracking, and market research.",
  },
  {
    title: "Full Stack Developer",
    company: "Kampot Labs",
    location: "Remote",
    type: "Contract",
    category: "Engineering",
    salary: "$1,200 - $1,800",
    description:
      "Work across the stack with React, Next.js, Node.js, and MongoDB on a growing SaaS product.",
  },
  {
    title: "Customer Support Specialist",
    company: "HelpDesk Co",
    location: "Phnom Penh, Cambodia",
    type: "Full-time",
    category: "Support",
    salary: "$400 - $600",
    description:
      "Respond to customer inquiries via chat and email, and help maintain our knowledge base.",
  },
  {
    title: "Data Analyst",
    company: "InsightWorks",
    location: "Remote",
    type: "Full-time",
    category: "Data",
    salary: "$900 - $1,300",
    description:
      "Analyze product and business data to help teams make informed decisions. SQL and Excel required.",
  },
  {
    title: "Junior Graphic Designer",
    company: "Pixel Studio",
    location: "Phnom Penh, Cambodia",
    type: "Internship",
    category: "Design",
    salary: "$150 - $300",
    description:
      "Assist the design team with branding assets, social graphics, and print materials.",
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Job.deleteMany({});
  console.log("Cleared existing jobs");

  await Job.insertMany(jobs);
  console.log(`Inserted ${jobs.length} jobs`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
