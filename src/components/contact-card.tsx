"use client";

export default function ContactCard({ contact, onEdit, onDelete }) {
  return (
    <div className="border p-4 rounded bg-white dark:bg-gray-800 shadow">
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
            onClick={() => onEdit(contact)}
          >
            Modifier
          </button>
          <button
            className="text-red-600 dark:text-red-400"
            onClick={() => onDelete(contact.id)}
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
          if (!val || (Array.isArray(val) && val.length === 0)) return null;
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
  );
}
