"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const OPTIONAL_FIELDS = [
  { key: "contactTags", label: "🏷️ Tags", multi: true },
  { key: "contactRole", label: "👔 Rôle", multi: true },
  { key: "contactEmail", label: "✉️ Email", multi: true },
  { key: "contactPhone", label: "📞 Téléphone", multi: true },
  { key: "contactWebsite", label: "🌐 Site Web", multi: true },
  { key: "contactX", label: "𝕏 X", multi: true },
  { key: "contactTelegram", label: "📲 Telegram", multi: true },
  { key: "contactDiscord", label: "💬 Discord", multi: true },
  { key: "contactLinkedin", label: "🔗 LinkedIn", multi: true },
  { key: "contactIdeas", label: "💡 Idées", multi: true },
  { key: "contactDocuments", label: "📎 Documents (URL)", multi: true },
  { key: "contactPhoto", label: "🖼️ Photo (URL)", multi: false },
];

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
  const [visibleFields, setVisibleFields] = useState(
    new Set(["contactTags", "contactRole"])
  );

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
    setContacts(contacts.map((c) => (c.id === form.id ? form : c)));
    resetForm();
    setEditing(false);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
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
    setVisibleFields(new Set(["contactTags", "contactRole"]));
  };

  const handleEdit = (contact) => {
    setForm(contact);
    const visible = new Set(["contactTags", "contactRole"]);
    for (const [key, val] of Object.entries(contact)) {
      if (
        val &&
        ((Array.isArray(val) && val.length > 0) ||
          (!Array.isArray(val) && val !== ""))
      ) {
        visible.add(key);
      }
    }
    setVisibleFields(visible);
    setEditing(true);
  };

  const renderField = (label, key, multi = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {multi ? (
        <div className="space-y-2">
          {form[key].map((val, i) => (
            <div key={`${key}-${i}`} className="flex gap-2">
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
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => setForm({ ...form, [key]: [...form[key], ""] })}
          >
            + Ajouter
          </button>
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

      <div className="flex flex-wrap gap-2 mb-4">
        {OPTIONAL_FIELDS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            title={label.replace(/^[^\s]+\s/, "")}
            onClick={() => setVisibleFields((prev) => new Set(prev).add(key))}
            className={`text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
              visibleFields.has(key) ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            {label.split(" ")[0]}
          </button>
        ))}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {renderField("Nom", "contactName")}
        {renderField("Société", "contactCompany")}
        {renderField("Feeling", "contactFeeling")}
        {renderField("Notes", "contactNotes")}
        {[...visibleFields].map((fieldKey) => {
          const field = OPTIONAL_FIELDS.find((f) => f.key === fieldKey);
          return field
            ? renderField(
                field.label.replace(/^[^\s]+\s/, ""),
                field.key,
                field.multi
              )
            : null;
        })}
        <div className="col-span-full flex gap-4">
          {editing ? (
            <button
              type="button"
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Mettre à jour
            </button>
          ) : (
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleAdd}
            >
              Ajouter
            </button>
          )}
          <button
            type="button"
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
            onClick={resetForm}
          >
            Réinitialiser
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border p-4 rounded bg-white dark:bg-gray-800 shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-xl font-bold">{contact.contactName}</h2>
                {contact.contactCompany && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {contact.contactCompany}
                  </p>
                )}
                {contact.contactRole?.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {contact.contactRole.join(", ")}
                  </p>
                )}
              </div>
              <div className="space-x-2">
                <button
                  className="text-blue-600 dark:text-blue-400"
                  onClick={() => handleEdit(contact)}
                >
                  Modifier
                </button>
                <button
                  className="text-red-600 dark:text-red-400"
                  onClick={() => handleDelete(contact.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(contact).map(([key, val]) => {
                if (
                  key === "id" ||
                  key === "contactName" ||
                  key === "contactCompany" ||
                  key === "contactRole"
                )
                  return null;
                if (!val || (Array.isArray(val) && val.length === 0))
                  return null;
                return (
                  <div key={key}>
                    <strong>
                      {key
                        .replace("contact", "")
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                      :
                    </strong>
                    {Array.isArray(val) ? (
                      <ul className="list-disc list-inside">
                        {val.map((v, i) => (
                          <li key={`${key}-${i}`}>{v}</li>
                        ))}
                      </ul>
                    ) : (
                      <span> {val}</span>
                    )}
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
