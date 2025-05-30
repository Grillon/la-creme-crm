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
  const IMAGE_PROXY_SECRET = "maSuperCléUltraSecrète"; // ou mettre un token plus sûr
  const isDriveUrl = contact.contactPhoto?.includes("drive.google.com");
  const imageUrl = contact.contactPhoto
    ? isDriveUrl
      ? `/api/image-proxy?url=${encodeURIComponent(contact.contactPhoto)}&token=${IMAGE_PROXY_SECRET}`
      : contact.contactPhoto
    : null;

const renderField = (
  label: string,
  val: string | string[] | { title: string; value: string }[]
) => {
  if (!val || val.length === 0) return null;

  const linkableFields = ["Documents", "LinkedIn", "Sites web", "Telegram", "Discord", "X (Twitter)"];

  if (linkableFields.includes(label) && Array.isArray(val)) {
    return (
      <div className="mb-2">
        <strong>{label}:</strong>
        <ul className="list-disc list-inside ml-4">
          {val.map((entry, i) =>
            typeof entry === "object" && entry.value ? (
              <li key={i}>
                <a
                  href={entry.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {entry.title || entry.value}
                </a>
              </li>
            ) : typeof entry === "string" ? (
              <li key={i}>
                <a
                  href={entry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {entry}
                </a>
              </li>
            ) : null
          )}
        </ul>
      </div>
    );
  }

  // Cas par défaut (non cliquable)
  return (
    <div className="mb-2">
      <strong>{label}:</strong>
      {Array.isArray(val) ? (
        <ul className="list-disc list-inside ml-4">
          {val.map((v, i) =>
            typeof v === "object" ? (
              <li key={i}>
                <strong>{v.title ? `${v.title}: ` : ""}</strong>
                {v.value}
              </li>
            ) : (
              <li key={i}>{v}</li>
            )
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

      {imageUrl && (
        <Image
          src={imageUrl}
          alt="photo"
          width={96}
          height={96}
          className="rounded-full border mb-2 object-cover"
          unoptimized
        />
      )}

      {renderField("Entreprise", contact.contactCompany)}
      {renderField("Tags", contact.contactTags)}
      {renderField("Emails", contact.contactEmail)}
      {renderField("Téléphones", contact.contactPhone)}
      {renderField("Sites web", contact.contactWebsite)}
      {renderField("Documents", contact.contactDocuments)}
      {renderField("Infos", contact.contactInfos)}
      {renderField("Telegram", contact.contactTelegram)}
      {renderField("Discord", contact.contactDiscord)}
      {renderField("LinkedIn", contact.contactLinkedin)}
      {renderField("X (Twitter)", contact.contactX)}
      {renderField("Feeling", contact.contactFeeling)}
      {renderField("Idées", contact.contactIdeas)}
      {renderField("Notes", contact.contactNotes)}

      <div className="mt-2 flex gap-4">
        <button onClick={() => onEdit(contact)} className="text-blue-500">
          Modifier
        </button>
        <button onClick={() => onDelete(contact.id)} className="text-red-500">
          Supprimer
        </button>
      </div>
    </div>
  );
}

