import fs from 'fs/promises';
import path from 'path';

export interface Message {
  id: string;
  date: string;
  time: string;
  sender: string | null;
  content: string;
  isMedia: boolean;
  mediaUrl?: string; // e.g. /backups/ChatName/IMG-123.jpg
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

// Regex for standard WhatsApp txt format:
// Format: "12.05.2023 14:30 - Sender: Message"
const messageRegex = /^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[aApP][mM])?)\]?\s+-\s+(.*?):\s*(.*)$/;
const systemMessageRegex = /^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s+(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*[aApP][mM])?)\]?\s+-\s+(.*)$/;

export async function getChats(): Promise<{ id: string, name: string }[]> {
  const backupsDir = path.join(process.cwd(), 'public', 'backups');
  try {
    const entries = await fs.readdir(backupsDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(dir => ({
        id: dir.name,
        name: dir.name
      }));
  } catch (error) {
    // If directory doesn't exist yet, return empty
    return [];
  }
}

export async function getChat(chatId: string): Promise<Chat | null> {
  const chatDir = path.join(process.cwd(), 'public', 'backups', chatId);
  try {
    const files = await fs.readdir(chatDir);
    const txtFile = files.find(f => f.endsWith('.txt'));
    
    if (!txtFile) {
      return null;
    }

    const txtContent = await fs.readFile(path.join(chatDir, txtFile), 'utf-8');
    const lines = txtContent.split('\n');
    
    const messages: Message[] = [];
    let currentMessage: Message | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const match = line.match(messageRegex);
      if (match) {
        if (currentMessage) {
          messages.push(currentMessage);
        }
        
        const date = match[1];
        const time = match[2];
        const sender = match[3];
        let content = match[4];
        
        let isMedia = false;
        let mediaUrl = undefined;
        
        // Detection for media files (very basic based on file extensions)
        const mediaMatch = content.match(/([a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|mp4|opus|ogg|mp3|pdf|webp))/i);
        if (mediaMatch) {
          const fileName = mediaMatch[1];
          if (files.includes(fileName)) {
            isMedia = true;
            mediaUrl = `/backups/${chatId}/${fileName}`;
            
            // Metin içindeki o çirkin dosya adını ve "(file attached)" yazısını temizle
            content = content.replace(new RegExp(`^${fileName}\\s*\\(.*?\\)\\s*`), '').trim();
            content = content.replace(new RegExp(`<attached:\\s*${fileName}>\\s*`), '').trim();
            content = content.replace(new RegExp(`^${fileName}\\s*`), '').trim();
          }
        }

        currentMessage = {
          id: `${i}`,
          date,
          time,
          sender,
          content,
          isMedia,
          mediaUrl
        };
      } else {
        const sysMatch = line.match(systemMessageRegex);
        if (sysMatch && !sysMatch[3].includes(':')) {
           if (currentMessage) {
             messages.push(currentMessage);
           }
           currentMessage = {
             id: `${i}`,
             date: sysMatch[1],
             time: sysMatch[2],
             sender: null,
             content: sysMatch[3],
             isMedia: false
           };
        } else if (currentMessage) {
          // Eğer sonraki satırda çirkin bir boş dosya adı falan kalmışsa temizle
          const nextLineMatch = line.match(/([a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|mp4|opus|ogg|mp3|pdf|webp))\s*\(.*?\)/i);
          if (nextLineMatch && files.includes(nextLineMatch[1])) {
             // Sadece dosya adı olan ekstra satırları görmezden gel (bazen Android iki satır yapıyor)
          } else {
             currentMessage.content += '\n' + line;
          }
        }
      }
    }
    
    if (currentMessage) {
      messages.push(currentMessage);
    }

    return {
      id: chatId,
      name: chatId,
      messages
    };

  } catch (error) {
    console.error(`Error reading chat ${chatId}:`, error);
    return null;
  }
}
