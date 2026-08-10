import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/mongodb";
import Application from "../../../models/Application";
import "../../../models/User";
import "../../../models/Job";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user.isAdmin) {
    return res.status(403).json({ message: "Admins only" });
  }

  await dbConnect();

  const applications = await Application.find({})
    .populate("job", "title company")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json(applications);
}
