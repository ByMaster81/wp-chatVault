import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sohbet ID (isim) belirtilmedi." }, { status: 400 });
    }

    // ID, public/backups içindeki klasör ismidir.
    // Güvenlik: ../ gibi üst dizinlere çıkılmasını engelle.
    const safeId = path.basename(id);
    const targetDir = path.join(process.cwd(), "public", "backups", safeId);

    if (!fs.existsSync(targetDir)) {
      return NextResponse.json({ error: "Sohbet bulunamadı." }, { status: 404 });
    }

    // Klasörü ve içindeki her şeyi tamamen sil
    fs.rmSync(targetDir, { recursive: true, force: true });

    return NextResponse.json({ success: true, message: "Sohbet silindi." });

  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: "Silme işlemi sırasında bir hata oluştu" }, { status: 500 });
  }
}
