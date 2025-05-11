"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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

  const handleAdd = () => {
    if (!form.contactName.trim()) return;
    const newContact = { ...form, id: uuidv4() };
    setContacts([...contacts, newContact]);
    resetForm();
  };

  const handleUpdate = () => {
    setContacts(contacts.map(c => c.id === form.id ? form : c));
    resetForm();
    setEditing(false);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
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

  const handleEdit = (contact) => {
    setForm(contact);
    setEditing(true);
  };

  const renderField = (label, key, multi = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {multi ? (
        <div className="space-y-2">
          {form[key].map((val, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-800 dark:text-white"
                value={val}
                onChange={(e) => {
                  const copy = [...form[key]];
                  copy[i] = e.target.value;
                  setForm({ ...form, [key]: copy });
                }}
              />
              <button
                type="button"
                className="bg-red-500 text-white px-2 rounded"
                onClick={() => {
                  const copy = form[key].filter((_, idx) => idx !== i);
                  setForm({ ...form, [key]: copy });
                }}
              >-</button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => setForm({ ...form, [key]: [...form[key], ""] })}
          >+ Ajouter</button>
        </div>
      ) : (
        <input
          className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-800 dark:text-white"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">LaCrème CRM</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {renderField("Nom", "contactName")}
        {renderField("Société", "contactCompany")}
        {renderField("Feeling", "contactFeeling")}
        {renderField("Notes", "contactNotes")}
        {renderField("Tags", "contactTags", true)}
        {renderField("Rôle", "contactRole", true)}
        {renderField("Email", "contactEmail", true)}
        {renderField("Téléphone", "contactPhone", true)}
        {renderField("Site Web", "contactWebsite", true)}
        {renderField("X", "contactX", true)}
        {renderField("Telegram", "contactTelegram", true)}
        {renderField("Discord", "contactDiscord", true)}
        {renderField("LinkedIn", "contactLinkedin", true)}
        {renderField("Idées", "contactIdeas", true)}
        {renderField("Documents (URL)", "contactDocuments", true)}
        {renderField("Photo (URL)", "contactPhoto")}
        <div className="col-span-full flex gap-4">
          {editing ? (
            <button type="button" className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>Mettre à jour</button>
          ) : (
            <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Ajouter</button>
          )}
          <button type="button" className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded" onClick={resetForm}>Réinitialiser</button>
        </div>
      </form>

      <div className="space-y-4">
        {contacts.map(contact => (
          <div key={contact.id} className="border p-4 rounded bg-white dark:bg-gray-800 shadow">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-xl font-bold">{contact.contactName}</h2>
                {contact.contactCompany && <p className="text-sm text-gray-600 dark:text-gray-300">{contact.contactCompany}</p>}
                {contact.contactRole?.length > 0 && <p className="text-sm text-gray-600 dark:text-gray-300">{contact.contactRole.join(", ")}</p>}
              </div>
              <div className="space-x-2">
                <button className="text-blue-600 dark:text-blue-400" onClick={() => handleEdit(contact)}>Modifier</button>
                <button className="text-red-600 dark:text-red-400" onClick={() => handleDelete(contact.id)}>Supprimer</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(contact).map(([key, val]) => {
                if (key === "id" || key === "contactName" || key === "contactCompany" || key === "contactRole") return null;
                if (!val || (Array.isArray(val) && val.length === 0)) return null;
                return (
                  <div key={key}>
                    <strong>{key.replace("contact", "").replace(/([A-Z])/g, " $1").trim()}:</strong>
                    {Array.isArray(val) ? <ul className="list-disc list-inside">{val.map((v, i) => <li key={i}>{v}</li>)}</ul> : <span> {val}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

