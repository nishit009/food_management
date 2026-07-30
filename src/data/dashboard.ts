export type QuoteRequest = {
  id: string;
  name: string;
  phone: string;
  menu: string;
  items: number;
  date: string;
};

export const quoteRequests: QuoteRequest[] = [
  { id: "SRC-1042", name: "Lakshmi Narayanan", phone: "+91 98410 22331", menu: "Gold Menu", items: 24, date: "2026-07-21" },
  { id: "SRC-1041", name: "Meenakshi Sundaram", phone: "+91 90031 55210", menu: "Silver Menu", items: 16, date: "2026-07-20" },
  { id: "SRC-1040", name: "Arun Prakash", phone: "+91 99620 78450", menu: "Breakfast Menu", items: 9, date: "2026-07-19" },
  { id: "SRC-1039", name: "Devi Priya", phone: "+91 98844 10093", menu: "Prasadam Menu", items: 11, date: "2026-07-18" },
  { id: "SRC-1038", name: "Karthikeyan R", phone: "+91 94440 66712", menu: "Gold Menu", items: 31, date: "2026-07-17" },
  { id: "SRC-1037", name: "Anitha Raghavan", phone: "+91 90802 34567", menu: "Custom Menu", items: 14, date: "2026-07-16" },
  { id: "SRC-1036", name: "Venkatesh Iyer", phone: "+91 98940 11223", menu: "Silver Menu", items: 18, date: "2026-07-15" },
  { id: "SRC-1035", name: "Shanthi Balan", phone: "+91 90420 88991", menu: "Gold Menu", items: 27, date: "2026-07-14" },
  { id: "SRC-1034", name: "Ramesh Kumar", phone: "+91 99401 33445", menu: "Breakfast Menu", items: 7, date: "2026-07-13" },
  { id: "SRC-1033", name: "Padmavathi S", phone: "+91 96770 55678", menu: "Prasadam Menu", items: 12, date: "2026-07-12" },
  { id: "SRC-1032", name: "Suresh Babu", phone: "+91 98407 99001", menu: "Custom Menu", items: 20, date: "2026-07-11" },
  { id: "SRC-1031", name: "Janaki Raman", phone: "+91 93810 44556", menu: "Silver Menu", items: 15, date: "2026-07-10" },
  { id: "SRC-1030", name: "Vijayalakshmi N", phone: "+91 90256 77889", menu: "Gold Menu", items: 29, date: "2026-07-09" },
  { id: "SRC-1029", name: "Gopalakrishnan", phone: "+91 94441 20304", menu: "Prasadam Menu", items: 10, date: "2026-07-08" },
  { id: "SRC-1028", name: "Bhuvana Devi", phone: "+91 98651 40506", menu: "Custom Menu", items: 13, date: "2026-07-07" },
  { id: "SRC-1027", name: "Sathish Kumar", phone: "+91 99522 60708", menu: "Silver Menu", items: 17, date: "2026-07-06" },
  { id: "SRC-1026", name: "Kalyani Srinivasan", phone: "+91 90031 80910", menu: "Gold Menu", items: 26, date: "2026-07-05" },
  { id: "SRC-1025", name: "Muthu Pandian", phone: "+91 98842 01112", menu: "Breakfast Menu", items: 8, date: "2026-07-04" },
];

export const menuNames = [
  "Prasadam Menu",
  "Breakfast Menu",
  "Silver Menu",
  "Gold Menu",
  "Custom Menu",
];
