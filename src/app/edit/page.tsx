"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Contact } from "@/types/contact";

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

export default function Page() {
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

  const [visibleFields, setVisibleFields] = useState<Set<keyof Contact>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const editing = localStorage.getItem("editing");
    if (editing) {
      const parsed: Contact = JSON.parse(editing);
      setForm(parsed);
    }
  }, []);

  useEffect(() => {
    for (const [key, val] of Object.entries(form)) {
      if (Array.isArray(val) && val.length > 0) {
        setVisibleFields((prev) => new Set(prev).add(key as keyof Contact));
      }
    }
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem("contacts");
    const list: Contact[] = stored ? JSON.parse(stored) : [];

    const updated: Contact[] = form.id
      ? list.map(c => (c.id === form.id ? form : c))
      : [...list, { ...form, id: uuidv4() }];

    localStorage.setItem("contacts", JSON.stringify(updated));
    localStorage.removeItem("editing");
    router.push("/");
  };

  const renderField = (label: string, key: keyof Contact, multi: boolean = true) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {multi ? (
        <div className="space-y-2">
          {Array.isArray(form[key]) &&
            form[key]!.map((entry, i) => (
              <div key={`${key}-${i}`} className="flex gap-2">
                <input
                  className="border rounded px-2 py-1 w-1/3 bg-white dark:bg-gray-800 dark:text-white"
                  placeholder="Label"
                  value={(entry as { title: string; value: string }).title}
                  onChange={(e) => {
		  const updated = [...(form[key] as { title: string; value: string }[])];
                    (updated[i] as { title: string; value: string }).title = e.target.value;
                    setForm({ ...form, [key]: updated });
                  }}
                />
                <input
                  className="border rounded px-2 py-1 w-full bg-white dark:bg-gray-800 dark:text-white"
                  placeholder="Valeur"
                  value={(entry as { title: string; value: string }).value}
                  onChange={(e) => {
		  const updated = [...(form[key] as { title: string; value: string }[])];
                    (updated[i] as { title: string; value: string }).value = e.target.value;
                    setForm({ ...form, [key]: updated });
                  }}
                />
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
		  const updated = [...(form[key] as { title: string; value: string }[])];
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
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto text-black dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">{form.id ? "Modifier" : "Ajouter"} un contact</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {OPTIONAL_FIELDS.map(({ label, key }) => (
          <button
            type="button"
            key={key}
            onClick={() => {
              setVisibleFields((prev) => new Set(prev).add(key));
              setForm((prev) => ({
                ...prev,
		[key]: [...((prev[key] as { title: string; value: string }[]) || []), { title: "", value: "" }],
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
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {form.id ? "Mettre à jour" : "Ajouter"}
        </button>
        <button type="button" onClick={() => router.push("/")} className="text-gray-500">
          Annuler
        </button>
      </div>
    </form>
  );
}
