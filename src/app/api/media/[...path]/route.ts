import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: urlPath } = await params;
    // Kötü niyetli üst klasöre çıkma (directory traversal) saldırılarını engelle
    const safePath = urlPath.filter(p => !p.includes('..')).join('/');
    const filePath = path.join(process.cwd(), "public", "backups", safePath);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Media Not Found", { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".mp4") contentType = "video/mp4";
    else if (ext === ".mp3") contentType = "audio/mpeg";
    else if (ext === ".ogg" || ext === ".opus") contentType = "audio/ogg";
    else if (ext === ".pdf") contentType = "application/pdf";

    // Dosyayı oku ve gönder
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    console.error("Media API hatası:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
