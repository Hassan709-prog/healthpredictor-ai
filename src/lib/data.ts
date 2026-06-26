export const symptomsList = [
  "Fever", "Headache", "Cough", "Fatigue", "Vomiting", "Nausea", "Sore Throat",
  "Runny Nose", "Shortness of Breath", "Chest Pain", "Dizziness", "Muscle Pain",
  "Joint Pain", "Loss of Taste", "Loss of Smell", "Diarrhea", "Skin Rash",
  "Sneezing", "Chills", "Sweating", "Abdominal Pain", "Back Pain", "Itching",
  "Blurred Vision", "Anxiety",
];

export const diseases = [
  { id: 1, name: "Influenza", severity: "Moderate", description: "A common viral infection that affects the respiratory system." },
  { id: 2, name: "COVID-19", severity: "High", description: "A respiratory illness caused by SARS-CoV-2." },
  { id: 3, name: "Common Cold", severity: "Low", description: "A mild viral infection of the upper respiratory tract." },
  { id: 4, name: "Migraine", severity: "Moderate", description: "A neurological condition causing intense headaches." },
  { id: 5, name: "Hypertension", severity: "High", description: "A chronic condition with elevated blood pressure." },
  { id: 6, name: "Diabetes Type 2", severity: "High", description: "A long-term metabolic disorder of insulin resistance." },
  { id: 7, name: "Asthma", severity: "Moderate", description: "A chronic respiratory condition causing breathing difficulty." },
  { id: 8, name: "Gastroenteritis", severity: "Low", description: "Inflammation of the stomach and intestines." },
];

export const recommendations = [
  { id: 1, disease: "Influenza", recommendation: "Rest, hydrate, paracetamol for fever. Consult doctor if symptoms persist beyond 7 days." },
  { id: 2, disease: "COVID-19", recommendation: "Isolate, monitor oxygen levels, consult physician immediately." },
  { id: 3, disease: "Common Cold", recommendation: "Warm fluids, rest, decongestants if needed." },
  { id: 4, disease: "Migraine", recommendation: "Avoid triggers, dark quiet room, prescribed analgesics." },
  { id: 5, disease: "Hypertension", recommendation: "Low-sodium diet, regular exercise, blood pressure monitoring." },
];

export const recentPredictions = [
  { id: "P-1042", date: "2026-06-24", symptoms: ["Fever", "Cough", "Fatigue"], disease: "Influenza", confidence: 92 },
  { id: "P-1041", date: "2026-06-20", symptoms: ["Headache", "Nausea"], disease: "Migraine", confidence: 87 },
  { id: "P-1040", date: "2026-06-15", symptoms: ["Sore Throat", "Runny Nose"], disease: "Common Cold", confidence: 78 },
  { id: "P-1039", date: "2026-06-10", symptoms: ["Chest Pain", "Shortness of Breath"], disease: "Asthma", confidence: 81 },
  { id: "P-1038", date: "2026-06-05", symptoms: ["Abdominal Pain", "Diarrhea"], disease: "Gastroenteritis", confidence: 74 },
];

export const users = [
  { id: "U-001", name: "Sarah Johnson", email: "sarah@example.com", age: 32, gender: "Female", joined: "2026-01-12", status: "Active" },
  { id: "U-002", name: "Michael Chen", email: "michael@example.com", age: 45, gender: "Male", joined: "2026-02-03", status: "Active" },
  { id: "U-003", name: "Aisha Patel", email: "aisha@example.com", age: 28, gender: "Female", joined: "2026-02-19", status: "Active" },
  { id: "U-004", name: "David Müller", email: "david@example.com", age: 51, gender: "Male", joined: "2026-03-07", status: "Inactive" },
  { id: "U-005", name: "Sofia Rossi", email: "sofia@example.com", age: 37, gender: "Female", joined: "2026-04-21", status: "Active" },
  { id: "U-006", name: "James Okafor", email: "james@example.com", age: 29, gender: "Male", joined: "2026-05-09", status: "Active" },
];

export const adminPredictions = [
  { id: "P-1042", user: "Sarah Johnson", date: "2026-06-24", symptoms: ["Fever", "Cough"], disease: "Influenza", confidence: 92 },
  { id: "P-1041", user: "Michael Chen", date: "2026-06-20", symptoms: ["Headache"], disease: "Migraine", confidence: 87 },
  { id: "P-1040", user: "Aisha Patel", date: "2026-06-19", symptoms: ["Sore Throat"], disease: "Common Cold", confidence: 78 },
  { id: "P-1039", user: "Sofia Rossi", date: "2026-06-17", symptoms: ["Chest Pain"], disease: "Asthma", confidence: 81 },
  { id: "P-1038", user: "James Okafor", date: "2026-06-15", symptoms: ["Diarrhea"], disease: "Gastroenteritis", confidence: 74 },
  { id: "P-1037", user: "David Müller", date: "2026-06-14", symptoms: ["Fatigue", "Sweating"], disease: "Hypertension", confidence: 69 },
];

export const monthlyStats = [
  { month: "Jan", predictions: 120, users: 45 },
  { month: "Feb", predictions: 180, users: 78 },
  { month: "Mar", predictions: 240, users: 110 },
  { month: "Apr", predictions: 310, users: 142 },
  { month: "May", predictions: 420, users: 188 },
  { month: "Jun", predictions: 512, users: 231 },
];
