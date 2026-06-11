import fs from 'fs';
import path from 'path';
import { TestLog } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'logs');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(id: string) {
  return path.join(DATA_DIR, `${id}.json`);
}

export interface LogDocument {
  id: string;
  name: string;
  author: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  logs: TestLog[];
}

export function listLogs(): Omit<LogDocument, 'logs'>[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  return files
    .map((f) => {
      try {
        const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
        const doc: LogDocument = JSON.parse(raw);
        return { id: doc.id, name: doc.name, author: doc.author, description: doc.description, createdAt: doc.createdAt, updatedAt: doc.updatedAt };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.updatedAt).getTime() - new Date(a!.updatedAt).getTime()) as Omit<LogDocument, 'logs'>[];
}

export function loadLog(id: string): LogDocument | null {
  const filePath = getFilePath(id);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as LogDocument;
  } catch {
    return null;
  }
}

export function saveLog(doc: LogDocument): void {
  ensureDir();
  const filePath = getFilePath(doc.id);
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2), 'utf-8');
}

export function deleteLog(id: string): boolean {
  const filePath = getFilePath(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
