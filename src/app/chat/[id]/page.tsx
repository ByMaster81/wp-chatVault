import { getChat } from "@/lib/whatsapp-parser";
import ChatArea from "@/components/ChatArea";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  // In Next.js 15, params is a Promise, we need to await it
  const { id } = await params;
  
  // URL decode the id (folder name might contain spaces)
  const decodedId = decodeURIComponent(id);
  const chat = await getChat(decodedId);

  if (!chat) {
    notFound();
  }

  return <ChatArea chat={chat} />;
}
