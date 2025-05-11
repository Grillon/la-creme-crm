"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ContactForm from "@/components/contact-form";
import ContactCard from "@/components/contact-card";

export default function Home() {
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

  const handleUpdate = (updatedContact) => {
    setContacts(
      contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
    setEditing(false);
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

  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setEditing(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">LaCrème CRM</h1>
      <ContactForm
        form={form}
        setForm={setForm}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editing={editing}
        cancelEdit={() => {
          setEditing(false);
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
        }}
      />
      <div className="space-y-4">
        {contacts.map((contact) => (
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
