import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { authOptions, isAdmRequest } from "./auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";

const bucketName = "next-ecommerce-adm";

const handle = async (req, res) => {
  await mongooseConnect();
  await isAdmRequest(req, res, authOptions);

  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, async (errors, fields, files) => {
      if (errors) reject;
      resolve({ fields, files });
      console.log(files.length);
    });
  });
  console.log("length: ", files.file.length);

  const client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
    },
  });

  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({ links });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handle;
