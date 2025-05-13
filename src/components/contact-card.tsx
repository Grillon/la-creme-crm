"use client";
import Image from "next/image";
import { Contact } from "@/types/contact";

export default function ContactCard({
  contact,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  onEdit: (c: Contact) => void;
  onDelete: (id: string) => void;
}) {

const renderField = (
  label: string,
  val: string | string[] | { title: string; value: string }[]
) => {

    if (!val || val.length === 0) return null;

    return (
  <div className="mb-2">
    <strong>{label}:</strong>
    {Array.isArray(val) ? (
      <ul className="list-disc list-inside ml-4">
        {val.map((v, i) =>
          typeof v === "object"
            ? <li key={i}><strong>{v.title ? `${v.title}: ` : ""}</strong>{v.value}</li>
            : <li key={i}>{v}</li>
        )}
      </ul>
    ) : (
      <p>{val}</p>
    )}
  </div>
);

  };

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-semibold">{contact.contactName}</h2>
      {contact.contactPhoto && (
        <Image
          src={contact.contactPhoto}
          alt="photo"
          width={96}
          height={96}
          className="rounded-full border mb-2 object-cover"
          unoptimized
        />
      )}
      {renderField("Entreprise", contact.contactCompany)}
      {renderField("Infos", contact.contactInfos)}
      {renderField("Tags", contact.contactTags)}
      {renderField("Emails", contact.contactEmail)}
      {renderField("Téléphones", contact.contactPhone)}
      {renderField("Sites web", contact.contactWebsite)}
      {renderField("Documents", contact.contactDocuments)}
      {renderField("Telegram", contact.contactTelegram)}
      {renderField("Discord", contact.contactDiscord)}
      {renderField("LinkedIn", contact.contactLinkedin)}
      {renderField("X (Twitter)", contact.contactX)}
      {renderField("Feeling", contact.contactFeeling)}
      {renderField("Idées", contact.contactIdeas)}
      {renderField("Notes", contact.contactNotes)}
      <div className="mt-2 flex gap-4">
        <button onClick={() => onEdit(contact)} className="text-blue-500">Modifier</button>
        <button onClick={() => onDelete(contact.id)} className="text-red-500">Supprimer</button>
      </div>
    </div>
  );
}
