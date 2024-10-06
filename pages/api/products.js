import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { authOptions, isAdmRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdmRequest(req, res, authOptions);

  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;
    const newProduct = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(newProduct);
  }

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "PUT") {
    const { title, description, price, _id, images, category, properties } =
      req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
