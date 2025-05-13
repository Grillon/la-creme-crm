export type Contact = {
  id: string;
  contactName: string;
  contactTags: string[];
  contactCompany: string;
  contactRole: string[];
  contactPhoto: string;
  contactInfos: { title: string; value: string }[];
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

