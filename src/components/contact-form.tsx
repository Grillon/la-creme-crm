"use client";

import { useState, useEffect } from "react";

const OPTIONAL_FIELDS = [
  { label: "📧 Email", key: "contactEmail", multi: true },
  { label: "📱 Téléphone", key: "contactPhone", multi: true },
  { label: "🌐 Site web", key: "contactWebsite", multi: true },
  { label: "📁 Documents", key: "contactDocuments", multi: true },
  { label: "💬 Telegram", key: "contactTelegram", multi: true },
  { label: "💼 LinkedIn", key: "contactLinkedin", multi: true },
  { label: "🐦 X", key: "contactX", multi: true },
  { label: "🕹 Discord", key: "contactDiscord", multi: true }
];

export default function ContactForm({ form, setForm, onAdd, onUpdate, editing, cancelEdit }) {
  const [visibleFields, setVisibleFields] = useState(new Set());

  useEffect(() => {
  Object.entries(form).forEach(([key, val]) => {
    if (Array.isArray(val) && val.length > 0) {
      setVisibleFields(prev => new Set(prev).add(key));
    }
  });
}, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();
    editing ? onUpdate(form) : onAdd(form);
  };

  const renderField = (label, key, multi = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {multi ? (
        <div className="space-y-2">
          {form[key].map((entry, i) => (
            <div key={`${key}-${i}`} className="flex gap-2">
              <input
                className="border rounded px-2 py-1 w-1/3 bg-white dark:bg-gray-800 dark:text-white"
                placeholder="Label"
                value={entry.title}
                onChange={(e) => {
                  const updated = [...form[key]];
                  updated[i].title = e.target.value;
                  setForm({ ...form, [key]: updated });
                }}
              />
              <input
                className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-800 dark:text-white"
                placeholder="Valeur"
                value={entry.value}
                onChange={(e) => {
                  const updated = [...form[key]];
                  updated[i].value = e.target.value;
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
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2 mb-4 flex-wrap">
        {OPTIONAL_FIELDS.map(({ label, key, multi }) => (
          <button
            type="button"
            key={key}
            onClick={() => {
              setVisibleFields(prev => new Set(prev).add(key));
              setForm(prev => ({
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
      {renderField("Photo (URL)", "contactPhoto")}
      {renderField("Nom", "contactName")}
      {renderField("Entreprise", "contactCompany")}
      {[...visibleFields].map(fieldKey => {
        const field = OPTIONAL_FIELDS.find(f => f.key === fieldKey);
        return field ? (
          <div key={field.key}>
            {renderField(field.label.replace(/^[^\s]+\s/, ""), field.key, field.multi)}
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
