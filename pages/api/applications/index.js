import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/mongodb";
import Application from "../../../models/Application";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "You must be logged in to apply" });
  }

  const { jobId, message, resumeUrl } = req.body;

  if (!jobId || !message) {
    return res.status(400).json({ message: "A message is required" });
  }

  try {
    await dbConnect();

    const existing = await Application.findOne({
      job: jobId,
      user: session.user.id,
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      user: session.user.id,
      message,
      resumeUrl,
    });

    return res.status(201).json(application);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
