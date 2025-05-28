"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContactCard from "@/components/contact-card";
import { Contact } from "@/types/contact";
import Papa from "papaparse";

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export default function Home() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("contacts");
    if (stored) setContacts(JSON.parse(stored));
  }, []);

  const handleEdit = (contact: Contact) => {
    localStorage.setItem("editing", JSON.stringify(contact));
    router.push("/edit");
  };

  const handleDelete = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));
  };
 
const handleExport = () => {
  const flat = contacts.map(c => ({
    ...c,
    contactTags: c.contactTags?.join("|") || "",
    contactIdeas: c.contactIdeas?.join("|") || "",
    contactEmail: c.contactEmail?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactPhone: c.contactPhone?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactWebsite: c.contactWebsite?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactX: c.contactX?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactTelegram: c.contactTelegram?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactDiscord: c.contactDiscord?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactLinkedin: c.contactLinkedin?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactDocuments: c.contactDocuments?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactInfos: c.contactInfos?.map(e => `${e.title};${e.value}`).join("|") || ""
  }));
  const csv = Papa.unparse(flat);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contacts.csv";
  a.click();
};

const parsePairs = (str: string) =>
  str?.split("|").map(s => {
    const [title, value] = s.split(";");
    return { title, value };
  }) || [];

const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const rows = results.data as Record<string, string>[];
      const parsed = rows.map((row) => {
        const c: Partial<Contact> = {
          id: crypto.randomUUID(),
          contactName: row.contactName,
        };
        if (row.contactCompany) c.contactCompany = row.contactCompany;
        if (row.contactTags) c.contactTags = row.contactTags.split("|");
        if (row.contactIdeas) c.contactIdeas = row.contactIdeas.split("|");
        if (row.contactPhoto) c.contactPhoto = row.contactPhoto;
        if (row.contactEmail) c.contactEmail = parsePairs(row.contactEmail);
        if (row.contactPhone) c.contactPhone = parsePairs(row.contactPhone);
        if (row.contactWebsite) c.contactWebsite = parsePairs(row.contactWebsite);
        if (row.contactX) c.contactX = parsePairs(row.contactX);
        if (row.contactTelegram) c.contactTelegram = parsePairs(row.contactTelegram);
        if (row.contactDiscord) c.contactDiscord = parsePairs(row.contactDiscord);
        if (row.contactLinkedin) c.contactLinkedin = parsePairs(row.contactLinkedin);
        if (row.contactDocuments) c.contactDocuments = parsePairs(row.contactDocuments);
        if (row.contactInfos) c.contactInfos = parsePairs(row.contactInfos);
        if (row.contactFeeling) c.contactFeeling = row.contactFeeling;
        if (row.contactNotes) c.contactNotes = row.contactNotes;
        c.contactRole = [];
        return c as Contact;
      });
      setContacts(parsed);
      localStorage.setItem("contacts", JSON.stringify(parsed));
    }
  });
};

const handleEncryptedExport = async () => {
  const password = prompt("Mot de passe pour chiffrer le fichier ?");
  if (!password) return;

  const flat = contacts.map(c => ({
    ...c,
    contactTags: c.contactTags?.join("|") || "",
    contactIdeas: c.contactIdeas?.join("|") || "",
    contactEmail: c.contactEmail?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactPhone: c.contactPhone?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactWebsite: c.contactWebsite?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactX: c.contactX?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactTelegram: c.contactTelegram?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactDiscord: c.contactDiscord?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactLinkedin: c.contactLinkedin?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactDocuments: c.contactDocuments?.map(e => `${e.title};${e.value}`).join("|") || "",
    contactInfos: c.contactInfos?.map(e => `${e.title};${e.value}`).join("|") || ""
  }));
  const csv = Papa.unparse(flat);

  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt,
    iterations: 100000,
    hash: "SHA-256"
  }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(csv));
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  const blob = new Blob([btoa(String.fromCharCode(...combined))], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "contacts.csv.aes";
  a.click();
};

const handleEncryptedImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const password = prompt("Mot de passe pour déchiffrer le fichier ?");
  if (!password) return;

  const b64 = await file.text();
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const data = bytes.slice(28);

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({
    name: "PBKDF2",
    salt,
    iterations: 100000,
    hash: "SHA-256"
  }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  const csv = dec.decode(decrypted);

  Papa.parse(csv, {
    header: true,
    complete: (results) => {
      const rows = results.data as Record<string, string>[];
      const parsed = rows.map((row) => {
        const c: Partial<Contact> = {
          id: crypto.randomUUID(),
          contactName: row.contactName,
        };
        if (row.contactCompany) c.contactCompany = row.contactCompany;
        if (row.contactTags) c.contactTags = row.contactTags.split("|");
        if (row.contactIdeas) c.contactIdeas = row.contactIdeas.split("|");
        if (row.contactPhoto) c.contactPhoto = row.contactPhoto;
        if (row.contactEmail) c.contactEmail = parsePairs(row.contactEmail);
        if (row.contactPhone) c.contactPhone = parsePairs(row.contactPhone);
        if (row.contactWebsite) c.contactWebsite = parsePairs(row.contactWebsite);
        if (row.contactX) c.contactX = parsePairs(row.contactX);
        if (row.contactTelegram) c.contactTelegram = parsePairs(row.contactTelegram);
        if (row.contactDiscord) c.contactDiscord = parsePairs(row.contactDiscord);
        if (row.contactLinkedin) c.contactLinkedin = parsePairs(row.contactLinkedin);
        if (row.contactDocuments) c.contactDocuments = parsePairs(row.contactDocuments);
        if (row.contactInfos) c.contactInfos = parsePairs(row.contactInfos);
        if (row.contactFeeling) c.contactFeeling = row.contactFeeling;
        if (row.contactNotes) c.contactNotes = row.contactNotes;
        c.contactRole = [];
        return c as Contact;
      });
      setContacts(parsed);
      localStorage.setItem("contacts", JSON.stringify(parsed));
    }
  });
};


const searchTerms = normalizeText(search).split(/\s+/).filter(Boolean);

const visibleContacts = contacts.filter((contact) => {
  const searchableText = [
    contact.contactName,
    contact.contactCompany,
    ...(contact.contactTags || []),
    ...(contact.contactInfos || []).map(i => `${i.title} ${i.value}`),
    ...(contact.contactEmail || []).map(e => `${e.title} ${e.value}`),
    ...(contact.contactPhone || []).map(p => `${p.title} ${p.value}`),
    ...(contact.contactWebsite || []).map(w => `${w.title} ${w.value}`),
    ...(contact.contactX || []).map(x => `${x.title} ${x.value}`),
    ...(contact.contactTelegram || []).map(t => `${t.title} ${t.value}`),
    ...(contact.contactDiscord || []).map(d => `${d.title} ${d.value}`),
    ...(contact.contactLinkedin || []).map(l => `${l.title} ${l.value}`),
    ...(contact.contactDocuments || []).map(d => `${d.title} ${d.value}`),
    contact.contactFeeling,
    contact.contactIdeas,
    contact.contactNotes,
  ]
    .flat()
    .filter(Boolean)
    .join(" ");

  const normalized = normalizeText(searchableText);
  return searchTerms.every((term) => normalized.includes(term));
});



  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">LaCrème CRM</h1>
      <div className="flex gap-4 mb-4">
<div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Mes contacts</h1>
  <span className="text-gray-500">{visibleContacts.length} contact(s)</span>
</div>

  <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
    Exporter CSV
  </button>
  <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
    Importer CSV
    <input type="file" accept=".csv" onChange={handleImport} hidden />
  </label>
<button onClick={handleEncryptedExport} className="bg-purple-600 text-white px-4 py-2 rounded">
  Exporter CSV chiffré
</button>

<label className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer">
  Importer CSV chiffré
  <input type="file" accept=".aes" onChange={handleEncryptedImport} hidden />
</label>

</div>

      <input
        type="text"
        placeholder="Recherche globale..."
        className="mb-6 w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={() => router.push("/edit")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Ajouter un contact
      </button>
      <div className="space-y-4">
      {visibleContacts.map((contact) => (
  <ContactCard
    key={contact.id}
    contact={contact}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
))}
 
      </div>
    </div>
  );
}
