import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

const handler = async (req, res) => {
  await mongooseConnect();
  res.json(await Order.find().sort({ createdAt: -1 }));
};

export default handler;
