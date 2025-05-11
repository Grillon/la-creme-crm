"use client";

import { useState, useEffect } from "react";

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

const defaultForm = {
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
};

export default function ContactForm({
  form,
  setForm,
  onAdd,
  onUpdate,
  editing,
  cancelEdit,
}) {
  const [visibleFields, setVisibleFields] = useState(
    new Set(["contactTags", "contactRole"])
  );

  useEffect(() => {
    if (!form) setForm(defaultForm);
  }, [form]);

  const renderField = (label, key, multi = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {multi ? (
        <div className="space-y-2">
          {form[key]?.map((val, i) => (
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
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {OPTIONAL_FIELDS.map(({ key, label, multi }) => (
          <button
            key={key}
            type="button"
            title={label.replace(/^[^\s]+\s/, "")}
            onClick={() => {
              setVisibleFields((prev) => new Set(prev).add(key));
              if (multi) {
                setForm((prev) => ({
                  ...prev,
                  [key]: [...(prev[key] || []), ""],
                }));
              } else {
                setForm((prev) => ({ ...prev, [key]: "" }));
              }
            }}
            className="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
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
          return field ? (
            <div key={field.key}>
              {renderField(
                field.label.replace(/^[^\s]+\s/, ""),
                field.key,
                field.multi
              )}
            </div>
          ) : null;
        })}
        <div className="col-span-full flex gap-4">
          {editing ? (
            <button
              type="button"
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => onUpdate(form)}
            >
              Mettre à jour
            </button>
          ) : (
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => onAdd(form)}
            >
              Ajouter
            </button>
          )}
          <button
            type="button"
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded"
            onClick={() => {
              setForm(defaultForm);
              cancelEdit();
            }}
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}
