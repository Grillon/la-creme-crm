"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContactCard from "@/components/contact-card";
import { Contact } from "@/types/contact";
import Papa from "papaparse";


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
    contactEmail: c.contactEmail?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactPhone: c.contactPhone?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactWebsite: c.contactWebsite?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactX: c.contactX?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactTelegram: c.contactTelegram?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactDiscord: c.contactDiscord?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactLinkedin: c.contactLinkedin?.map(e => `${e.title}:${e.value}`).join("|") || "",
    contactDocuments: c.contactDocuments?.map(e => `${e.title}:${e.value}`).join("|") || ""
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
    const [title, value] = s.split(":");
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


  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">LaCrème CRM</h1>
      <div className="flex gap-4 mb-4">
  <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
    Exporter CSV
  </button>
  <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
    Importer CSV
    <input type="file" accept=".csv" onChange={handleImport} hidden />
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
        {contacts
          .filter((c) => {
            const q = search.toLowerCase();
            return (
              c.contactName?.toLowerCase().includes(q) ||
              c.contactCompany?.toLowerCase().includes(q) ||
              c.contactTags?.some(tag => tag.toLowerCase().includes(q)) ||
              c.contactEmail?.some(e => e.value.toLowerCase().includes(q)) ||
              c.contactPhone?.some(p => p.value.toLowerCase().includes(q))
            );
          })
          .map((contact) => (
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
