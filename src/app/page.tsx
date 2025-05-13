"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import ContactForm from "@/components/contact-form";
import ContactCard from "@/components/contact-card";

type Contact = {
  id: string;
  contactName: string;
  contactTags: string[];
  contactCompany: string;
  contactRole: string[];
  contactPhoto: string;
  contactEmail: { title: string; value: string }[];
  contactPhone: { title: string; value: string }[];
  contactWebsite: { title: string; value: string }[];
  contactX: { title: string; value: string }[];
  contactTelegram: { title: string; value: string }[];
  contactDiscord: { title: string; value: string }[];
  contactLinkedin: { title: string; value: string }[];
  contactFeeling: string;
  contactIdeas: string[];
  contactDocuments: { title: string; value: string }[];
  contactNotes: string;
};


export default function Home() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<Contact>({
    id: "",
    contactName: "",
    contactTags: [],
    contactCompany: "",
    contactRole: [],
    contactPhoto: "",
    contactEmail: [],
    contactPhone: [],
    contactWebsite: [],
    contactX: [],
    contactTelegram: [],
    contactDiscord: [],
    contactLinkedin: [],
    contactFeeling: "",
    contactIdeas: [],
    contactDocuments: [],
    contactNotes: "",
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("contacts");
    if (stored) setContacts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleAdd = (newContact: Contact) => {
    setContacts([...contacts, { ...newContact, id: uuidv4() }]);
    resetForm();
  };

  const handleUpdate = (updatedContact: Contact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditing(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleEdit = (contact: Contact) => {
    setForm(contact);
    setEditing(true);
  };

  const resetForm = () => {
    setForm({
      id: "",
      contactName: "",
      contactTags: [],
      contactCompany: "",
      contactRole: [],
      contactPhoto: "",
      contactEmail: [],
      contactPhone: [],
      contactWebsite: [],
      contactX: [],
      contactTelegram: [],
      contactDiscord: [],
      contactLinkedin: [],
      contactFeeling: "",
      contactIdeas: [],
      contactDocuments: [],
      contactNotes: "",
    });
  };

  const handleExport = () => {
  const flat = contacts.map((c) => ({
    ...c,
    contactTags: c.contactTags.join("|"),
    contactIdeas: c.contactIdeas.join("|"),
    contactEmail: c.contactEmail.map(e => `${e.title}:${e.value}`).join("|"),
    contactPhone: c.contactPhone.map(e => `${e.title}:${e.value}`).join("|"),
    contactWebsite: c.contactWebsite.map(e => `${e.title}:${e.value}`).join("|"),
    contactX: c.contactX.map(e => `${e.title}:${e.value}`).join("|"),
    contactTelegram: c.contactTelegram.map(e => `${e.title}:${e.value}`).join("|"),
    contactDiscord: c.contactDiscord.map(e => `${e.title}:${e.value}`).join("|"),
    contactLinkedin: c.contactLinkedin.map(e => `${e.title}:${e.value}`).join("|"),
    contactDocuments: c.contactDocuments.map(e => `${e.title}:${e.value}`).join("|"),
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
  const contact: Partial<Contact> = {
    id: uuidv4(),
    contactName: row.contactName,
  };

  if (row.contactCompany) contact.contactCompany = row.contactCompany;
  if (row.contactTags) contact.contactTags = row.contactTags.split("|");
  if (row.contactIdeas) contact.contactIdeas = row.contactIdeas.split("|");
  if (row.contactPhoto) contact.contactPhoto = row.contactPhoto;
  if (row.contactEmail) contact.contactEmail = parsePairs(row.contactEmail);
  if (row.contactPhone) contact.contactPhone = parsePairs(row.contactPhone);
  if (row.contactWebsite) contact.contactWebsite = parsePairs(row.contactWebsite);
  if (row.contactX) contact.contactX = parsePairs(row.contactX);
  if (row.contactTelegram) contact.contactTelegram = parsePairs(row.contactTelegram);
  if (row.contactDiscord) contact.contactDiscord = parsePairs(row.contactDiscord);
  if (row.contactLinkedin) contact.contactLinkedin = parsePairs(row.contactLinkedin);
  if (row.contactDocuments) contact.contactDocuments = parsePairs(row.contactDocuments);
  if (row.contactFeeling) contact.contactFeeling = row.contactFeeling;
  if (row.contactNotes) contact.contactNotes = row.contactNotes;

  contact.contactRole = [];

  return contact as Contact;
});

      setContacts(parsed);
    }
  });
};


  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">LaCrème CRM</h1>
      <input
        type="text"
        placeholder="Recherche globale..."
        className="mb-6 w-full px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex gap-4 mb-4">
  <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded">
    Exporter CSV
  </button>
  <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
    Importer CSV
    <input type="file" accept=".csv" onChange={handleImport} hidden />
  </label>
</div>

      <ContactForm
        form={form}
        setForm={setForm}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editing={editing}
        cancelEdit={() => {
          setEditing(false);
          resetForm();
        }}
      />
      <div className="space-y-4">
        {contacts.filter(c => {
  const q = search.toLowerCase();
  return (
    c.contactName?.toLowerCase().includes(q) ||
    c.contactCompany?.toLowerCase().includes(q) ||
    c.contactTags?.some(tag => tag.toLowerCase().includes(q)) ||
    c.contactEmail?.some(e => e.value.toLowerCase().includes(q)) ||
    c.contactPhone?.some(p => p.value.toLowerCase().includes(q))
  );
}).map(contact => (
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
