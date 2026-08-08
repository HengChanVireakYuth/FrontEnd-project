import dbConnect from "../../../lib/mongodb";
import Job from "../../../models/Job";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      return res.status(200).json(job);
    } catch (err) {
      return res.status(400).json({ message: "Invalid job id" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
