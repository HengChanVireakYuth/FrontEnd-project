import dbConnect from "../../../lib/mongodb";
import Job from "../../../models/Job";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { search, category, type, location } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(query).sort({ postedDate: -1 });
    return res.status(200).json(jobs);
  }

  if (req.method === "POST") {
    try {
      const job = await Job.create(req.body);
      return res.status(201).json(job);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
