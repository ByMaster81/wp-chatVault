import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const chatName = formData.get("chatName") as string;

    if (!file || !chatName) {
      return NextResponse.json({ error: "Eksik dosya veya sohbet adı" }, { status: 400 });
    }

    // Gelen dosya
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Temp klasöründe geçici bir zip dosyası
    const tempZipPath = path.join(os.tmpdir(), `whatsapp-upload-${Date.now()}.zip`);
    fs.writeFileSync(tempZipPath, buffer);

    //hedef klasör
    const targetDir = path.join(process.cwd(), "public", "backups", chatName.trim());

    // Eğer hedef klasör varsa, önce içini temizle (isteğe bağlı) veya üzerine yaz
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Zip dosyasını aç
    const zip = new AdmZip(tempZipPath);
    zip.extractAllTo(targetDir, true); // true = overwrite

    // Geçici zip dosyasını sil
    fs.unlinkSync(tempZipPath);

    return NextResponse.json({ success: true, message: "Sohbet başarıyla yüklendi!" });

  } catch (error) {
    console.error("Upload hatası:", error);
    return NextResponse.json({ error: "Dosya işlenirken bir hata oluştu" }, { status: 500 });
  }
}
