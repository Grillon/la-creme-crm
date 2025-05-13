"use client";

import { useState, useEffect } from "react";
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
        {contacts.filter(c => {
          const q = search.toLowerCase();
          return (
            c.contactName.toLowerCase().includes(q) ||
            c.contactCompany.toLowerCase().includes(q) ||
            c.contactTags.some(tag => tag.toLowerCase().includes(q)) ||
            c.contactEmail.some(e => e.value.toLowerCase().includes(q)) ||
            c.contactPhone.some(p => p.value.toLowerCase().includes(q))
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
