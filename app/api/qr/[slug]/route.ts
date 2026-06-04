import { buildPublicUrl } from "@/lib/utils";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const url = buildPublicUrl(params.slug);

  const pngBuffer = await QRCode.toBuffer(url, {
    type: "png",
    margin: 1,
    width: 640,
  });

  return new NextResponse(new Uint8Array(pngBuffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${params.slug}.png"`,
    },
  });
}