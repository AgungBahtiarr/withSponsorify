import { nanoid } from "nanoid";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import { createWriteStream } from "fs";
import type { Context, Next } from "hono";

const uploadProposal = async (c: Context, next: Next) => {
  const body = await c.req.parseBody();
  const proposal = body["proposal"] as File;

  if (!proposal) {
    return c.json({
      success: false,
      error: "Proposal file is required",
    });
  }

  // Proses file
  const proposalFile = await proposal.arrayBuffer();
  const buffer = Buffer.from(proposalFile);
  const uint8Array = new Uint8Array(buffer);
  const fileType = await fileTypeFromBuffer(uint8Array);

  if (!fileType) {
    return c.json({
      success: false,
      error: "Invalid file type",
    });
  }

  const fileName = `${nanoid()}.${fileType.ext}`;
  const outputFileName = path.join("./public/proposal", fileName);

  // Simpan file
  createWriteStream(outputFileName).write(buffer);

  // Path untuk database
  const proposalPath = `/proposal/${fileName}`;

  c.set("proposal", proposalPath);
  await next();
};

export default uploadProposal;
