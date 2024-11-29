import { nanoid } from "nanoid";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import { createWriteStream } from "fs";

const uploadImage = async (c, next) => {
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
  const fileType = await fileTypeFromBuffer(buffer);

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
    const fileTypeLogo = await fileTypeFromBuffer(bufferLogo);

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
