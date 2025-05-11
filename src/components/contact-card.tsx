"use client";

export default function ContactCard({ contact, onEdit, onDelete }) {
  const renderField = (label, val) =>
    val && val.length > 0 && (
      <p>
        <strong>{label}:</strong>{" "}
        {Array.isArray(val)
          ? val.map((v, i) =>
              typeof v === "object"
                ? <span key={i}>{v.title ? v.title + ": " : ""}{v.value}</span>
                : <span key={i}>{v}</span>
            )
          : val}
      </p>
    );

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-semibold">{contact.contactName}</h2>
      {contact.contactPhoto && (
  <img
    src={contact.contactPhoto}
    alt="photo"
    className="w-24 h-24 object-cover rounded-full border mb-2"
  />
)}

      {renderField("Entreprise", contact.contactCompany)}
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
