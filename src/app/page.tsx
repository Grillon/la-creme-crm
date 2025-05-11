"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ContactForm from "@/components/contact-form";
import ContactCard from "@/components/contact-card";

export default function Home() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
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

  const handleAdd = (newContact) => {
    setContacts([...contacts, { ...newContact, id: uuidv4() }]);
    resetForm();
  };

  const handleUpdate = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditing(false);
    resetForm();
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleEdit = (contact) => {
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

  const matches = (contact) => {
    const q = search.toLowerCase();
    return (
      contact.contactName?.toLowerCase().includes(q) ||
      contact.contactCompany?.toLowerCase().includes(q) ||
      contact.contactTags?.some(tag => tag.toLowerCase().includes(q)) ||
      contact.contactEmail?.some(e => e.value?.toLowerCase().includes(q)) ||
      contact.contactPhone?.some(p => p.value?.toLowerCase().includes(q)) ||
      contact.contactWebsite?.some(w => w.value?.toLowerCase().includes(q)) ||
      contact.contactX?.some(x => x.value?.toLowerCase().includes(q)) ||
      contact.contactTelegram?.some(t => t.value?.toLowerCase().includes(q)) ||
      contact.contactDiscord?.some(d => d.value?.toLowerCase().includes(q)) ||
      contact.contactLinkedin?.some(l => l.value?.toLowerCase().includes(q)) ||
      contact.contactIdeas?.some(i => i.value?.toLowerCase().includes(q)) ||
      contact.contactNotes?.toLowerCase().includes(q)
    );
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
        {contacts.filter(matches).map(contact => (
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
