import { nanoid } from "nanoid";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import { createWriteStream } from "fs";
import type { Context, Next } from "hono";

const uploadImage = async (c: Context, next: Next) => {
  const body = await c.req.parseBody();
  const image = body["image"] as File;

  if (!image) {
    return c.json({
      success: false,
      error: "image file is required",
    });
  }

  // Proses file
  const imageFile = await image.arrayBuffer();
  const buffer = Buffer.from(imageFile);
  const uint8Array = new Uint8Array(buffer);
  const fileType = await fileTypeFromBuffer(uint8Array);

  if (!fileType) {
    return c.json({
      success: false,
      error: "Invalid file type",
    });
  }

  const fileName = `${nanoid()}.${fileType.ext}`;

  if (c.req.path == "/api/events") {
    const outputFileName = path.join("./public/image/event", fileName);

    createWriteStream(outputFileName).write(buffer);

    const imagePath = `/image/event/${fileName}`;

    c.set("image", imagePath);
  } else if (c.req.path == "/api/sponsors") {
    const logo = body["logo"] as File;
    if (!logo) {
      return c.json({
        success: false,
        error: "Logo file is required",
      });
    }
    const logoFIle = await logo.arrayBuffer();
    const bufferLogo = Buffer.from(logoFIle);
    const logoUint8Array = new Uint8Array(bufferLogo);
    const fileTypeLogo = await fileTypeFromBuffer(logoUint8Array);

    if (!fileTypeLogo) {
      return c.json({
        success: false,
        error: "Invalid file type",
      });
    }

    const fileNameLogo = `${nanoid()}.${fileTypeLogo.ext}`;

    const outputFileLogo = path.join(
      "./public/image/sponsor/logo",
      fileNameLogo
    );
    const outputFileName = path.join("./public/image/sponsor", fileName);

    createWriteStream(outputFileName).write(buffer);
    createWriteStream(outputFileLogo).write(bufferLogo);

    const logoPath = `/image/sponsor/logo/${fileNameLogo}`;
    const imagePath = `/image/sponsor/${fileName}`;

    c.set("logoSponsor", logoPath);
    c.set("imageSponsor", imagePath);
  }

  await next();
};

export default uploadImage;
