"use client";

import { useState, useEffect } from "react";

const OPTIONAL_FIELDS: { label: string; key: keyof Contact }[] = [
  { label: "📧 Email", key: "contactEmail" },
  { label: "📱 Téléphone", key: "contactPhone" },
  { label: "🌐 Site web", key: "contactWebsite" },
  { label: "📁 Documents", key: "contactDocuments" },
  { label: "💬 Telegram", key: "contactTelegram" },
  { label: "💼 LinkedIn", key: "contactLinkedin" },
  { label: "🐦 X", key: "contactX" },
  { label: "🕹 Discord", key: "contactDiscord" },
];

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

export default function ContactForm({
  form,
  setForm,
  onAdd,
  onUpdate,
  editing,
  cancelEdit,
}: {
  form: Contact;
  setForm: React.Dispatch<React.SetStateAction<Contact>>;
  onAdd: (c: Contact) => void;
  onUpdate: (c: Contact) => void;
  editing: boolean;
  cancelEdit: () => void;
}) {

  const [visibleFields, setVisibleFields] = useState(new Set());
    useEffect(() => {
    for (const [key, val] of Object.entries(form)) {
      if (Array.isArray(val) && val.length > 0) {
        setVisibleFields((prev) => new Set(prev).add(key));
      }
    }
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
	  e.preventDefault();
if (editing) {
  onUpdate(form);
} else {
  onAdd(form);
}

  };

  const renderField = (
  label: string,
  key: keyof Contact,
  multi: boolean = true
) => (

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {multi ? (
        <div className="space-y-2">
	{Array.isArray(form[key]) &&
  form[key].map((entry, i) => (

            <div key={`${key}-${i}`} className="flex gap-2">
              <input
                className="border rounded px-2 py-1 w-1/3 bg-white dark:bg-gray-800 dark:text-white"
                placeholder="Label"
                value={entry.title}
                onChange={(e) => {
                  const updated = [...form[key]];
		  (updated[i] as { title: string; value: string }).title = e.target.value;
                  setForm({ ...form, [key]: updated });
                }}
              />
              <input
                className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-800 dark:text-white"
                placeholder="Valeur"
                value={entry.value}
                onChange={(e) => {
                  const updated = [...form[key]];
		  (updated[i] as { title: string; value: string }).value = e.target.value;
                  setForm({ ...form, [key]: updated });
                }}
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => {
                  const updated = [...form[key]];
                  updated.splice(i, 1);
                  setForm({ ...form, [key]: updated });
                }}
              >
                −
              </button>
            </div>
          ))}
        </div>
      ) : (
        <input
          className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-800 dark:text-white"
	  value={form[key] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2 mb-4 flex-wrap">
      {OPTIONAL_FIELDS.map(({ label, key }) => (
          <button
            type="button"
            key={key}
            onClick={() => {
              setVisibleFields((prev) => new Set(prev).add(key));
              setForm((prev) => ({
                ...prev,
                [key]: [...(prev[key] || []), { title: "", value: "" }],
              }));
            }}
            className="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title={label}
          >
            {label.split(" ")[0]}
          </button>
        ))}
      </div>
      {renderField("Nom", "contactName", false)}
      {renderField("Entreprise", "contactCompany", false)}
      {[...visibleFields].map((fieldKey) => {
        const field = OPTIONAL_FIELDS.find((f) => f.key === fieldKey);
        return field ? (
          <div key={field.key}>
            {renderField(field.label.replace(/^[^\s]+\s/, ""), field.key, true)}
          </div>
        ) : null;
      })}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? "Mettre à jour" : "Ajouter"}
        </button>
        {editing && (
          <button type="button" onClick={cancelEdit} className="text-gray-500">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

