export type RoomType = "classroom" | "lab" | "office" | "auditorium" | "canteen" | "library";
export type SubjectType = "Major" | "Minor" | "MDC" | "AEC" | "SEC" | "VAC";

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  floor: number;
  block: string;
  features: string[];
}

export interface Block {
  id: string;
  name: string;
  fullName: string;
  color: string;
  description: string;
  departments: string[];
  floors: number;
  rooms: Room[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  type: SubjectType;
  credits: number;
  faculty: string;
  semester: number;
  programme: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  roomId: string;
  semester: number;
  section: string;
  batch?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

// Per-day time slots — Mon/Tue/Wed/Fri use 5-period pattern; Thursday has a 6-period pattern
export interface PeriodInfo {
  period: number;
  start: string;
  end: string;
}

export const PERIODS_BY_DAY: Record<string, PeriodInfo[]> = {
  Monday: [
    { period: 1, start: "1:00", end: "1:55" },
    { period: 2, start: "1:55", end: "2:50" },
    { period: 3, start: "2:50", end: "3:45" },
    { period: 4, start: "4:00", end: "4:50" },
    { period: 5, start: "4:50", end: "5:45" },
  ],
  Tuesday: [
    { period: 1, start: "1:00", end: "1:55" },
    { period: 2, start: "1:55", end: "2:50" },
    { period: 3, start: "2:50", end: "3:45" },
    { period: 4, start: "4:00", end: "4:50" },
    { period: 5, start: "4:50", end: "5:45" },
  ],
  Wednesday: [
    { period: 1, start: "1:00", end: "1:55" },
    { period: 2, start: "1:55", end: "2:50" },
    { period: 3, start: "2:50", end: "3:45" },
    { period: 4, start: "4:00", end: "4:50" },
    { period: 5, start: "4:50", end: "5:45" },
  ],
  Thursday: [
    { period: 1, start: "1:00", end: "1:45" },
    { period: 2, start: "1:45", end: "2:30" },
    { period: 3, start: "2:30", end: "3:15" },
    { period: 4, start: "3:15", end: "4:00" },
    { period: 5, start: "4:15", end: "5:00" },
    { period: 6, start: "5:00", end: "5:45" },
  ],
  Friday: [
    { period: 1, start: "1:00", end: "1:55" },
    { period: 2, start: "1:55", end: "2:50" },
    { period: 3, start: "2:50", end: "3:45" },
    { period: 4, start: "4:00", end: "4:50" },
    { period: 5, start: "4:50", end: "5:45" },
  ],
  Saturday: [
    { period: 1, start: "1:00", end: "1:55" },
    { period: 2, start: "1:55", end: "2:50" },
    { period: 3, start: "2:50", end: "3:45" },
    { period: 4, start: "4:00", end: "4:50" },
    { period: 5, start: "4:50", end: "5:45" },
  ],
};

// Backward-compatible: max 6 periods (for reference only — use PERIODS_BY_DAY for rendering)
export const PERIODS: PeriodInfo[] = PERIODS_BY_DAY.Monday;

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const BLOCKS: Block[] = [
  {
    id: "A", name: "Block A", fullName: "Administration Block", color: "#1A2B5E",
    description: "Main administrative hub with principal's office, exam cell, and administrative offices.",
    departments: ["Principal Office", "Examination Cell", "Administrative Office", "Finance Office", "Library"],
    floors: 3,
    rooms: [
      { id: "A001", name: "Principal's Office", type: "office", capacity: 10, floor: 0, block: "A", features: ["AC", "Conference Table"] },
      { id: "A002", name: "Vice Principal Office", type: "office", capacity: 8, floor: 0, block: "A", features: ["AC"] },
      { id: "A003", name: "Examination Cell", type: "office", capacity: 15, floor: 0, block: "A", features: ["AC", "Printer"] },
      { id: "A101", name: "Seminar Hall 1", type: "classroom", capacity: 80, floor: 1, block: "A", features: ["Projector", "AC", "Mic"] },
      { id: "A102", name: "Library Reading Room", type: "library", capacity: 60, floor: 1, block: "A", features: ["WiFi", "AC"] },
      { id: "A201", name: "Classroom A201", type: "classroom", capacity: 60, floor: 2, block: "A", features: ["Projector", "Whiteboard"] },
      { id: "A202", name: "Classroom A202", type: "classroom", capacity: 60, floor: 2, block: "A", features: ["Projector", "Whiteboard"] },
      { id: "A301", name: "Conference Hall", type: "office", capacity: 40, floor: 3, block: "A", features: ["AC", "Projector", "Video Conf"] },
    ],
  },
  {
    id: "B", name: "Block B", fullName: "Arts & Humanities Block", color: "#2D6A4F",
    description: "Home to Arts, Humanities, Social Sciences, and Language departments.",
    departments: ["English", "Malayalam", "History", "Economics", "Political Science", "Sociology"],
    floors: 3,
    rooms: [
      { id: "B101", name: "Classroom B101", type: "classroom", capacity: 60, floor: 1, block: "B", features: ["Projector", "Whiteboard"] },
      { id: "B102", name: "Classroom B102", type: "classroom", capacity: 60, floor: 1, block: "B", features: ["Projector", "Whiteboard"] },
      { id: "B103", name: "Language Lab", type: "lab", capacity: 30, floor: 1, block: "B", features: ["Computers", "Headphones", "AC"] },
      { id: "B201", name: "Classroom B201", type: "classroom", capacity: 55, floor: 2, block: "B", features: ["Projector"] },
      { id: "B202", name: "Classroom B202", type: "classroom", capacity: 55, floor: 2, block: "B", features: ["Projector"] },
      { id: "B203", name: "Seminar Room B203", type: "classroom", capacity: 40, floor: 2, block: "B", features: ["Projector", "AC"] },
      { id: "B301", name: "Classroom B301", type: "classroom", capacity: 60, floor: 3, block: "B", features: ["Projector"] },
      { id: "B302", name: "Classroom B302", type: "classroom", capacity: 60, floor: 3, block: "B", features: ["Projector"] },
    ],
  },
  {
    id: "C", name: "Block C", fullName: "Science Block", color: "#6B46C1",
    description: "Houses Physics, Chemistry, Mathematics, Botany, and Zoology departments with equipped labs.",
    departments: ["Physics", "Chemistry", "Mathematics", "Botany", "Zoology"],
    floors: 3,
    rooms: [
      { id: "C101", name: "Physics Lab", type: "lab", capacity: 30, floor: 1, block: "C", features: ["Equipment", "Safety Kit"] },
      { id: "C102", name: "Chemistry Lab", type: "lab", capacity: 30, floor: 1, block: "C", features: ["Fume Hood", "Safety Kit", "Equipment"] },
      { id: "C103", name: "Classroom C103", type: "classroom", capacity: 60, floor: 1, block: "C", features: ["Projector", "Whiteboard"] },
      { id: "C201", name: "Botany Lab", type: "lab", capacity: 25, floor: 2, block: "C", features: ["Microscopes", "Specimens"] },
      { id: "C202", name: "Zoology Lab", type: "lab", capacity: 25, floor: 2, block: "C", features: ["Microscopes", "Specimens"] },
      { id: "C203", name: "Classroom C203", type: "classroom", capacity: 60, floor: 2, block: "C", features: ["Projector"] },
      { id: "C301", name: "Maths Resource Room", type: "classroom", capacity: 40, floor: 3, block: "C", features: ["Projector", "Whiteboard"] },
      { id: "C302", name: "Classroom C302", type: "classroom", capacity: 60, floor: 3, block: "C", features: ["Projector"] },
    ],
  },
  {
    id: "D", name: "Block D", fullName: "Technology Block", color: "#C05621",
    description: "Computer Science, IT, Electronics, and Commerce departments with modern labs and smart classrooms.",
    departments: ["Computer Application", "Information Technology", "Electronics", "Commerce", "BCA", "B.Voc"],
    floors: 3,
    rooms: [
      { id: "D101", name: "CS Lab 1", type: "lab", capacity: 40, floor: 1, block: "D", features: ["Computers", "AC", "Projector", "WiFi"] },
      { id: "D102", name: "CS Lab 2", type: "lab", capacity: 40, floor: 1, block: "D", features: ["Computers", "AC", "Projector", "WiFi"] },
      { id: "D103", name: "Smart Classroom D103", type: "classroom", capacity: 60, floor: 1, block: "D", features: ["Smart Board", "AC", "Projector"] },
      { id: "D201", name: "IT Lab", type: "lab", capacity: 35, floor: 2, block: "D", features: ["Computers", "AC", "Server Room"] },
      { id: "D202", name: "Electronics Lab", type: "lab", capacity: 30, floor: 2, block: "D", features: ["Equipment", "Oscilloscopes"] },
      { id: "D203", name: "Classroom D203", type: "classroom", capacity: 60, floor: 2, block: "D", features: ["Projector"] },
      { id: "D301", name: "Software Lab 1", type: "lab", capacity: 35, floor: 3, block: "D", features: ["Computers", "AC"] },
      { id: "D302", name: "Software Lab 2", type: "lab", capacity: 35, floor: 3, block: "D", features: ["Computers", "AC"] },
    ],
  },
  {
    id: "E", name: "Block E", fullName: "Common Facilities Block", color: "#B7791F",
    description: "Auditorium, canteen, sports facilities, student union, and NCC/NSS offices.",
    departments: ["Auditorium", "Canteen", "Student Union", "NCC", "NSS", "Sports"],
    floors: 2,
    rooms: [
      { id: "E001", name: "Auditorium", type: "auditorium", capacity: 500, floor: 0, block: "E", features: ["AC", "Stage", "Sound System", "Lighting"] },
      { id: "E002", name: "Mini Auditorium", type: "auditorium", capacity: 120, floor: 0, block: "E", features: ["AC", "Projector", "Sound"] },
      { id: "E003", name: "Main Canteen", type: "canteen", capacity: 200, floor: 0, block: "E", features: ["WiFi", "Multiple Counters"] },
      { id: "E101", name: "Student Union Office", type: "office", capacity: 20, floor: 1, block: "E", features: ["AC"] },
      { id: "E102", name: "NCC Office", type: "office", capacity: 15, floor: 1, block: "E", features: [] },
      { id: "E103", name: "NSS Office", type: "office", capacity: 15, floor: 1, block: "E", features: [] },
      { id: "E201", name: "Common Room (Women)", type: "office", capacity: 50, floor: 2, block: "E", features: ["AC"] },
      { id: "E202", name: "Common Room (Men)", type: "office", capacity: 50, floor: 2, block: "E", features: ["AC"] },
    ],
  },
];

export const SUBJECTS: Subject[] = [
  { id: "CA101", name: "Foundations of AI (Major)", code: "CA1C01", type: "Major", credits: 4, faculty: "Arumina", semester: 1, programme: "BSc CA" },
  { id: "CA102", name: "Foundations of AI (Minor)", code: "CA1C02", type: "Minor", credits: 3, faculty: "Megha", semester: 1, programme: "BSc CA" },
  { id: "CA103", name: "AEC English", code: "AEC1A01", type: "AEC", credits: 2, faculty: "—", semester: 1, programme: "BSc CA" },
  { id: "CA104", name: "AEC Language", code: "AEC1B01", type: "AEC", credits: 2, faculty: "—", semester: 1, programme: "BSc CA" },
  { id: "CA105", name: "DSC Commerce", code: "DSC1C01", type: "MDC", credits: 3, faculty: "—", semester: 1, programme: "BSc CA" },
  { id: "CA106", name: "DSC Science", code: "DSC1S01", type: "MDC", credits: 3, faculty: "—", semester: 1, programme: "BSc CA" },
  { id: "CA107", name: "DSC Arts", code: "DSC1A01", type: "MDC", credits: 3, faculty: "—", semester: 1, programme: "BSc CA" },
  { id: "CA108", name: "MDC — SPSS", code: "MDC1S01", type: "MDC", credits: 3, faculty: "Fathima", semester: 1, programme: "BSc CA" },
  { id: "CA109", name: "Value Education", code: "VAC1A01", type: "VAC", credits: 2, faculty: "—", semester: 1, programme: "BSc CA" },
  { id: "CA201", name: "DBMS (Major)", code: "CA2C01", type: "Major", credits: 4, faculty: "Arumina", semester: 2, programme: "BSc CA" },
  { id: "CA202", name: "Data Science (Major)", code: "CA2C02", type: "Major", credits: 4, faculty: "Janeena", semester: 2, programme: "BSc CA" },
  { id: "CA203", name: "DS using C (Major)", code: "CA2C03", type: "Major", credits: 4, faculty: "Saranya", semester: 2, programme: "BSc CA" },
  { id: "CA204", name: "Minor", code: "CA2M01", type: "Minor", credits: 3, faculty: "Saranya", semester: 2, programme: "BSc CA" },
  { id: "CA205", name: "MDC", code: "CA2D01", type: "MDC", credits: 3, faculty: "—", semester: 2, programme: "BSc CA" },
  { id: "CA206", name: "VAC CODA", code: "VAC2A01", type: "VAC", credits: 2, faculty: "Saranya", semester: 2, programme: "BSc CA" },
  { id: "CA301", name: "Optimization Technique", code: "CA3C01", type: "Major", credits: 4, faculty: "Megha", semester: 3, programme: "BSc CA" },
  { id: "CA302", name: "ANN (Artificial Neural Networks)", code: "CA3C02", type: "Major", credits: 4, faculty: "Fathima", semester: 3, programme: "BSc CA" },
  { id: "CA303", name: "Software Engineering", code: "CA3C03", type: "Major", credits: 3, faculty: "Arumina", semester: 3, programme: "BSc CA" },
  { id: "CA304", name: "Cyber Security", code: "CA3C04", type: "Major", credits: 3, faculty: "Janeena", semester: 3, programme: "BSc CA" },
  { id: "CA305", name: "Operating Systems", code: "CA3C05", type: "Major", credits: 4, faculty: "Saranya", semester: 3, programme: "BSc CA" },
  { id: "CA306", name: "Software Project", code: "CA3P01", type: "Major", credits: 4, faculty: "—", semester: 3, programme: "BSc CA" },
  { id: "CA307", name: "Software Lab", code: "CA3L01", type: "Major", credits: 2, faculty: "—", semester: 3, programme: "BSc CA" },
  { id: "SD101", name: "Python (Major)", code: "SD1C01", type: "Major", credits: 4, faculty: "Fabiya", semester: 1, programme: "BVoc SWD" },
  { id: "SD102", name: "Computer Fundamentals (Major)", code: "SD1C02", type: "Major", credits: 4, faculty: "Nithya", semester: 1, programme: "BVoc SWD" },
  { id: "SD103", name: "Web Designing (Major)", code: "SD1C03", type: "Major", credits: 4, faculty: "Megha", semester: 1, programme: "BVoc SWD" },
  { id: "SD104", name: "B.Voc MDC — IT Tools", code: "SD1D01", type: "MDC", credits: 3, faculty: "Stella", semester: 1, programme: "BVoc SWD" },
  { id: "SD105", name: "B.Voc MPC Web Designing", code: "SD1M01", type: "Minor", credits: 3, faculty: "Fabiya", semester: 1, programme: "BVoc SWD" },
  { id: "SD106", name: "Value Education", code: "VAC1A01", type: "VAC", credits: 2, faculty: "—", semester: 1, programme: "BVoc SWD" },
  { id: "SD201", name: "Advanced OS (Major)", code: "SD2C01", type: "Major", credits: 4, faculty: "Janeena", semester: 2, programme: "BVoc SWD" },
  { id: "SD202", name: "Linux (Major)", code: "SD2C02", type: "Major", credits: 4, faculty: "Fabiya", semester: 2, programme: "BVoc SWD" },
  { id: "SD203", name: "DBMS (Major)", code: "SD2C03", type: "Major", credits: 4, faculty: "Stella", semester: 2, programme: "BVoc SWD" },
  { id: "SD204", name: "B.Voc MPC DBMS", code: "SD2M01", type: "Minor", credits: 3, faculty: "Stella", semester: 2, programme: "BVoc SWD" },
  { id: "SD205", name: "B.Voc MDC", code: "SD2D01", type: "MDC", credits: 3, faculty: "—", semester: 2, programme: "BVoc SWD" },
  { id: "SD206", name: "B.Voc AEC", code: "AEC2A01", type: "AEC", credits: 2, faculty: "—", semester: 2, programme: "BVoc SWD" },
  { id: "SD301", name: "Entrepreneurship", code: "SD3C01", type: "Major", credits: 3, faculty: "—", semester: 3, programme: "BVoc SWD" },
  { id: "SD302", name: "Python (Major)", code: "SD3C02", type: "Major", credits: 4, faculty: "Nithya", semester: 3, programme: "BVoc SWD" },
  { id: "SD303", name: "CN (Computer Networks)", code: "SD3C03", type: "Major", credits: 4, faculty: "Arumina", semester: 3, programme: "BVoc SWD" },
  { id: "SD304", name: "JavaScript", code: "SD3C04", type: "Major", credits: 4, faculty: "Fathima", semester: 3, programme: "BVoc SWD" },
  { id: "SD305", name: "Linux", code: "SD3C05", type: "Major", credits: 3, faculty: "Saranya", semester: 3, programme: "BVoc SWD" },
  { id: "SD306", name: "EVS", code: "SD3C06", type: "Major", credits: 2, faculty: "Janeena", semester: 3, programme: "BVoc SWD" },
];

export const TIMETABLE_SLOTS: TimetableSlot[] = [
  { id: "T001", day: "Monday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA103", roomId: "D103", semester: 1, section: "A" },
  { id: "T002", day: "Monday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA102", roomId: "D103", semester: 1, section: "A" },
  { id: "T003", day: "Monday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA102", roomId: "D103", semester: 1, section: "A" },
  { id: "T004", day: "Monday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA108", roomId: "D103", semester: 1, section: "A" },
  { id: "T005", day: "Monday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T006", day: "Monday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD101", roomId: "D201", semester: 1, section: "A" },
  { id: "T007", day: "Monday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD102", roomId: "D201", semester: 1, section: "A" },
  { id: "T008", day: "Monday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD104", roomId: "D201", semester: 1, section: "A" },
  { id: "T009", day: "Monday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD103", roomId: "D201", semester: 1, section: "A" },
  { id: "T010", day: "Monday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD101", roomId: "D201", semester: 1, section: "A" },
  { id: "T011", day: "Monday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA201", roomId: "D203", semester: 2, section: "A" },
  { id: "T012", day: "Monday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA205", roomId: "D203", semester: 2, section: "A" },
  { id: "T013", day: "Monday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA202", roomId: "D203", semester: 2, section: "A" },
  { id: "T014", day: "Monday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA204", roomId: "D203", semester: 2, section: "A" },
  { id: "T015", day: "Monday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA203", roomId: "D203", semester: 2, section: "A" },
  { id: "T016", day: "Monday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD201", roomId: "D301", semester: 2, section: "A" },
  { id: "T017", day: "Monday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD205", roomId: "D301", semester: 2, section: "A" },
  { id: "T018", day: "Monday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD202", roomId: "D301", semester: 2, section: "A" },
  { id: "T019", day: "Monday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD204", roomId: "D301", semester: 2, section: "A" },
  { id: "T020", day: "Monday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD203", roomId: "D301", semester: 2, section: "A" },
  { id: "T021", day: "Monday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA301", roomId: "D103", semester: 3, section: "A" },
  { id: "T022", day: "Monday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA302", roomId: "D103", semester: 3, section: "A" },
  { id: "T023", day: "Monday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA302", roomId: "D103", semester: 3, section: "A" },
  { id: "T024", day: "Monday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA303", roomId: "D103", semester: 3, section: "A" },
  { id: "T025", day: "Monday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA304", roomId: "D103", semester: 3, section: "A" },
  { id: "T026", day: "Monday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD301", roomId: "D302", semester: 3, section: "A" },
  { id: "T027", day: "Monday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },
  { id: "T028", day: "Monday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD303", roomId: "D302", semester: 3, section: "A" },
  { id: "T029", day: "Monday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD303", roomId: "D302", semester: 3, section: "A" },
  { id: "T030", day: "Monday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD306", roomId: "D302", semester: 3, section: "A" },

  { id: "T031", day: "Tuesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA106", roomId: "D103", semester: 1, section: "A" },
  { id: "T032", day: "Tuesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA102", roomId: "D103", semester: 1, section: "A" },
  { id: "T033", day: "Tuesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA105", roomId: "D103", semester: 1, section: "A" },
  { id: "T034", day: "Tuesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T035", day: "Tuesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T036", day: "Tuesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD101", roomId: "D201", semester: 1, section: "A" },
  { id: "T037", day: "Tuesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD102", roomId: "D201", semester: 1, section: "A" },
  { id: "T038", day: "Tuesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD105", roomId: "D201", semester: 1, section: "A" },
  { id: "T039", day: "Tuesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD103", roomId: "D201", semester: 1, section: "A" },
  { id: "T040", day: "Tuesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD104", roomId: "D201", semester: 1, section: "A" },
  { id: "T041", day: "Tuesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA204", roomId: "D203", semester: 2, section: "A" },
  { id: "T042", day: "Tuesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA201", roomId: "D203", semester: 2, section: "A" },
  { id: "T043", day: "Tuesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA202", roomId: "D203", semester: 2, section: "A" },
  { id: "T044", day: "Tuesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA206", roomId: "D203", semester: 2, section: "A" },
  { id: "T045", day: "Tuesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA203", roomId: "D203", semester: 2, section: "A" },
  { id: "T046", day: "Tuesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD204", roomId: "D301", semester: 2, section: "A" },
  { id: "T047", day: "Tuesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD202", roomId: "D301", semester: 2, section: "A" },
  { id: "T048", day: "Tuesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD203", roomId: "D301", semester: 2, section: "A" },
  { id: "T049", day: "Tuesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD206", roomId: "D301", semester: 2, section: "A" },
  { id: "T050", day: "Tuesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD201", roomId: "D301", semester: 2, section: "A" },
  { id: "T051", day: "Tuesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA301", roomId: "D103", semester: 3, section: "A" },
  { id: "T052", day: "Tuesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA304", roomId: "D103", semester: 3, section: "A" },
  { id: "T053", day: "Tuesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA303", roomId: "D103", semester: 3, section: "A" },
  { id: "T054", day: "Tuesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA302", roomId: "D103", semester: 3, section: "A" },
  { id: "T055", day: "Tuesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA307", roomId: "D103", semester: 3, section: "A" },
  { id: "T056", day: "Tuesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD301", roomId: "D302", semester: 3, section: "A" },
  { id: "T057", day: "Tuesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD306", roomId: "D302", semester: 3, section: "A" },
  { id: "T058", day: "Tuesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD304", roomId: "D302", semester: 3, section: "A" },
  { id: "T059", day: "Tuesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },
  { id: "T060", day: "Tuesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },

  { id: "T061", day: "Wednesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA107", roomId: "D103", semester: 1, section: "A" },
  { id: "T062", day: "Wednesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA108", roomId: "D103", semester: 1, section: "A" },
  { id: "T063", day: "Wednesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA104", roomId: "D103", semester: 1, section: "A" },
  { id: "T064", day: "Wednesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA105", roomId: "D103", semester: 1, section: "A" },
  { id: "T065", day: "Wednesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T066", day: "Wednesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD102", roomId: "D201", semester: 1, section: "A" },
  { id: "T067", day: "Wednesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD103", roomId: "D201", semester: 1, section: "A" },
  { id: "T068", day: "Wednesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD103", roomId: "D201", semester: 1, section: "A" },
  { id: "T069", day: "Wednesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD105", roomId: "D201", semester: 1, section: "A" },
  { id: "T070", day: "Wednesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD105", roomId: "D201", semester: 1, section: "A" },
  { id: "T071", day: "Wednesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA203", roomId: "D203", semester: 2, section: "A" },
  { id: "T072", day: "Wednesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA204", roomId: "D203", semester: 2, section: "A" },
  { id: "T073", day: "Wednesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA204", roomId: "D203", semester: 2, section: "A" },
  { id: "T074", day: "Wednesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA201", roomId: "D203", semester: 2, section: "A" },
  { id: "T075", day: "Wednesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA206", roomId: "D203", semester: 2, section: "A" },
  { id: "T076", day: "Wednesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD202", roomId: "D301", semester: 2, section: "A" },
  { id: "T077", day: "Wednesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD204", roomId: "D301", semester: 2, section: "A" },
  { id: "T078", day: "Wednesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD204", roomId: "D301", semester: 2, section: "A" },
  { id: "T079", day: "Wednesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD201", roomId: "D301", semester: 2, section: "A" },
  { id: "T080", day: "Wednesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD206", roomId: "D301", semester: 2, section: "A" },
  { id: "T081", day: "Wednesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA306", roomId: "D103", semester: 3, section: "A" },
  { id: "T082", day: "Wednesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA303", roomId: "D103", semester: 3, section: "A" },
  { id: "T083", day: "Wednesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA302", roomId: "D103", semester: 3, section: "A" },
  { id: "T084", day: "Wednesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA305", roomId: "D103", semester: 3, section: "A" },
  { id: "T085", day: "Wednesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA304", roomId: "D103", semester: 3, section: "A" },
  { id: "T086", day: "Wednesday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD301", roomId: "D302", semester: 3, section: "A" },
  { id: "T087", day: "Wednesday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD306", roomId: "D302", semester: 3, section: "A" },
  { id: "T088", day: "Wednesday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD305", roomId: "D302", semester: 3, section: "A" },
  { id: "T089", day: "Wednesday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },
  { id: "T090", day: "Wednesday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD304", roomId: "D302", semester: 3, section: "A" },

  // Thursday — uses the 6-period pattern
  { id: "T091", day: "Thursday", period: 1, startTime: "1:00", endTime: "1:45", subjectId: "CA103", roomId: "D103", semester: 1, section: "A" },
  { id: "T092", day: "Thursday", period: 2, startTime: "1:45", endTime: "2:30", subjectId: "CA102", roomId: "D103", semester: 1, section: "A" },
  { id: "T093", day: "Thursday", period: 3, startTime: "2:30", endTime: "3:15", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T094", day: "Thursday", period: 4, startTime: "3:15", endTime: "4:00", subjectId: "CA109", roomId: "D103", semester: 1, section: "A" },
  { id: "T095", day: "Thursday", period: 5, startTime: "4:15", endTime: "5:00", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T096", day: "Thursday", period: 6, startTime: "5:00", endTime: "5:45", subjectId: "CA106", roomId: "D103", semester: 1, section: "A" },
  { id: "T097", day: "Thursday", period: 1, startTime: "1:00", endTime: "1:45", subjectId: "SD101", roomId: "D201", semester: 1, section: "A" },
  { id: "T098", day: "Thursday", period: 2, startTime: "1:45", endTime: "2:30", subjectId: "SD102", roomId: "D201", semester: 1, section: "A" },
  { id: "T099", day: "Thursday", period: 3, startTime: "2:30", endTime: "3:15", subjectId: "SD104", roomId: "D201", semester: 1, section: "A" },
  { id: "T100", day: "Thursday", period: 4, startTime: "3:15", endTime: "4:00", subjectId: "SD106", roomId: "D201", semester: 1, section: "A" },
  { id: "T101", day: "Thursday", period: 5, startTime: "4:15", endTime: "5:00", subjectId: "SD105", roomId: "D201", semester: 1, section: "A" },
  { id: "T102", day: "Thursday", period: 6, startTime: "5:00", endTime: "5:45", subjectId: "SD103", roomId: "D201", semester: 1, section: "A" },
  { id: "T103", day: "Thursday", period: 1, startTime: "1:00", endTime: "1:45", subjectId: "CA202", roomId: "D203", semester: 2, section: "A" },
  { id: "T104", day: "Thursday", period: 2, startTime: "1:45", endTime: "2:30", subjectId: "CA205", roomId: "D203", semester: 2, section: "A" },
  { id: "T105", day: "Thursday", period: 3, startTime: "2:30", endTime: "3:15", subjectId: "CA203", roomId: "D203", semester: 2, section: "A" },
  { id: "T106", day: "Thursday", period: 4, startTime: "3:15", endTime: "4:00", subjectId: "CA109", roomId: "D203", semester: 2, section: "A" },
  { id: "T107", day: "Thursday", period: 5, startTime: "4:15", endTime: "5:00", subjectId: "CA206", roomId: "D203", semester: 2, section: "A" },
  { id: "T108", day: "Thursday", period: 6, startTime: "5:00", endTime: "5:45", subjectId: "CA201", roomId: "D203", semester: 2, section: "A" },
  { id: "T109", day: "Thursday", period: 1, startTime: "1:00", endTime: "1:45", subjectId: "SD206", roomId: "D301", semester: 2, section: "A" },
  { id: "T110", day: "Thursday", period: 2, startTime: "1:45", endTime: "2:30", subjectId: "SD205", roomId: "D301", semester: 2, section: "A" },
  { id: "T111", day: "Thursday", period: 3, startTime: "2:30", endTime: "3:15", subjectId: "SD202", roomId: "D301", semester: 2, section: "A" },
  { id: "T112", day: "Thursday", period: 4, startTime: "3:15", endTime: "4:00", subjectId: "SD106", roomId: "D301", semester: 2, section: "A" },
  { id: "T113", day: "Thursday", period: 5, startTime: "4:15", endTime: "5:00", subjectId: "SD203", roomId: "D301", semester: 2, section: "A" },
  { id: "T114", day: "Thursday", period: 6, startTime: "5:00", endTime: "5:45", subjectId: "SD201", roomId: "D301", semester: 2, section: "A" },
  { id: "T115", day: "Thursday", period: 1, startTime: "1:00", endTime: "1:45", subjectId: "CA301", roomId: "D103", semester: 3, section: "A" },
  { id: "T116", day: "Thursday", period: 2, startTime: "1:45", endTime: "2:30", subjectId: "CA305", roomId: "D103", semester: 3, section: "A" },
  { id: "T117", day: "Thursday", period: 3, startTime: "2:30", endTime: "3:15", subjectId: "CA304", roomId: "D103", semester: 3, section: "A" },
  { id: "T118", day: "Thursday", period: 4, startTime: "3:15", endTime: "4:00", subjectId: "CA109", roomId: "D103", semester: 3, section: "A" },
  { id: "T119", day: "Thursday", period: 5, startTime: "4:15", endTime: "5:00", subjectId: "CA302", roomId: "D103", semester: 3, section: "A" },
  { id: "T120", day: "Thursday", period: 6, startTime: "5:00", endTime: "5:45", subjectId: "CA305", roomId: "D103", semester: 3, section: "A" },
  { id: "T121", day: "Thursday", period: 1, startTime: "1:00", endTime: "1:45", subjectId: "SD301", roomId: "D302", semester: 3, section: "A" },
  { id: "T122", day: "Thursday", period: 2, startTime: "1:45", endTime: "2:30", subjectId: "SD304", roomId: "D302", semester: 3, section: "A" },
  { id: "T123", day: "Thursday", period: 3, startTime: "2:30", endTime: "3:15", subjectId: "SD304", roomId: "D302", semester: 3, section: "A" },
  { id: "T124", day: "Thursday", period: 4, startTime: "3:15", endTime: "4:00", subjectId: "SD106", roomId: "D302", semester: 3, section: "A" },
  { id: "T125", day: "Thursday", period: 5, startTime: "4:15", endTime: "5:00", subjectId: "SD305", roomId: "D302", semester: 3, section: "A" },
  { id: "T126", day: "Thursday", period: 6, startTime: "5:00", endTime: "5:45", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },

  { id: "T127", day: "Friday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA102", roomId: "D103", semester: 1, section: "A" },
  { id: "T128", day: "Friday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA106", roomId: "D103", semester: 1, section: "A" },
  { id: "T129", day: "Friday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA101", roomId: "D103", semester: 1, section: "A" },
  { id: "T130", day: "Friday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA108", roomId: "D103", semester: 1, section: "A" },
  { id: "T131", day: "Friday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA108", roomId: "D103", semester: 1, section: "A" },
  { id: "T132", day: "Friday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD101", roomId: "D201", semester: 1, section: "A" },
  { id: "T133", day: "Friday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD105", roomId: "D201", semester: 1, section: "A" },
  { id: "T134", day: "Friday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA203", roomId: "D203", semester: 2, section: "A" },
  { id: "T135", day: "Friday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA204", roomId: "D203", semester: 2, section: "A" },
  { id: "T136", day: "Friday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA205", roomId: "D203", semester: 2, section: "A" },
  { id: "T137", day: "Friday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA202", roomId: "D203", semester: 2, section: "A" },
  { id: "T138", day: "Friday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA201", roomId: "D203", semester: 2, section: "A" },
  { id: "T139", day: "Friday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD202", roomId: "D301", semester: 2, section: "A" },
  { id: "T140", day: "Friday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD204", roomId: "D301", semester: 2, section: "A" },
  { id: "T141", day: "Friday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD205", roomId: "D301", semester: 2, section: "A" },
  { id: "T142", day: "Friday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD203", roomId: "D301", semester: 2, section: "A" },
  { id: "T143", day: "Friday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD203", roomId: "D301", semester: 2, section: "A" },
  { id: "T144", day: "Friday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "CA303", roomId: "D103", semester: 3, section: "A" },
  { id: "T145", day: "Friday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "CA301", roomId: "D103", semester: 3, section: "A" },
  { id: "T146", day: "Friday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "CA301", roomId: "D103", semester: 3, section: "A" },
  { id: "T147", day: "Friday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "CA305", roomId: "D103", semester: 3, section: "A" },
  { id: "T148", day: "Friday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "CA306", roomId: "D103", semester: 3, section: "A" },
  { id: "T149", day: "Friday", period: 1, startTime: "1:00", endTime: "1:55", subjectId: "SD303", roomId: "D302", semester: 3, section: "A" },
  { id: "T150", day: "Friday", period: 2, startTime: "1:55", endTime: "2:50", subjectId: "SD304", roomId: "D302", semester: 3, section: "A" },
  { id: "T151", day: "Friday", period: 3, startTime: "2:50", endTime: "3:45", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },
  { id: "T152", day: "Friday", period: 4, startTime: "4:00", endTime: "4:50", subjectId: "SD302", roomId: "D302", semester: 3, section: "A" },
  { id: "T153", day: "Friday", period: 5, startTime: "4:50", endTime: "5:45", subjectId: "SD306", roomId: "D302", semester: 3, section: "A" },
];

export const CHAT_KB: { keywords: string[]; response: string }[] = [
  {
    keywords: ["block a", "administration", "principal", "exam cell", "library"],
    response: "Block A is the Administration Block. It houses the Principal's Office, Vice Principal's Office, Examination Cell, Finance Office, and the Library Reading Room.",
  },
  {
    keywords: ["block b", "arts", "english", "malayalam", "history", "economics"],
    response: "Block B is the Arts & Humanities Block. It hosts the departments of English, Malayalam, History, Economics, Political Science, and Sociology.",
  },
  {
    keywords: ["block c", "science", "physics", "chemistry", "maths", "mathematics", "botany", "zoology"],
    response: "Block C is the Science Block with Physics, Chemistry, Mathematics, Botany, and Zoology departments.",
  },
  {
    keywords: ["block d", "computer", "it", "electronics", "commerce", "bca", "bvoc", "lab"],
    response: "Block D is the Technology Block housing Computer Application, B.Voc Software Development, IT, Electronics, and Commerce departments.",
  },
  {
    keywords: ["block e", "auditorium", "canteen", "ncc", "nss", "student union", "sports"],
    response: "Block E is the Common Facilities Block. It has the Main Auditorium (capacity 500), Mini Auditorium (120), Main Canteen, Student Union Office, NCC & NSS offices, and Common Rooms for students.",
  },
  {
    keywords: ["canteen", "food", "eat", "cafeteria"],
    response: "The Main Canteen is in Block E (E003) with a capacity of 200.",
  },
  {
    keywords: ["auditorium", "event", "seminar", "conference"],
    response: "The Main Auditorium (E001) seats 500. The Mini Auditorium (E002) seats 120.",
  },
  {
    keywords: ["fyugp", "four year", "semester", "programme", "undergraduate"],
    response: "FYUGP follows the National Education Policy 2020. Courses include Major, Minor, MDC, AEC, SEC, and VAC.",
  },
  {
    keywords: ["major", "minor", "mdc", "aec", "sec", "vac", "credit"],
    response: "Under FYUGP: Major courses are your primary discipline. Minor courses are from another department. MDC, AEC, SEC, and VAC add breadth and skills.",
  },
  {
    keywords: ["library", "book", "borrow", "reading"],
    response: "The Library Reading Room is in Block A (A102) on the first floor with 60 seats.",
  },
  {
    keywords: ["bsc ca", "bsc computer application", "computer application"],
    response: "BSc Computer Application is a 3-year programme under FYUGP covering AI, DBMS, Data Science, Cyber Security, and more.",
  },
  {
    keywords: ["bvoc", "bvoc swd", "software development"],
    response: "BVoc Software Development is a 3-year vocational programme covering Python, Linux, DBMS, Web Designing, JavaScript, and more.",
  },
  {
    keywords: ["wifi", "internet", "network"],
    response: "WiFi is available across campus. Connect to 'CampusNet' using your college credentials.",
  },
  {
    keywords: ["exam", "examination", "hall ticket", "result"],
    response: "The Examination Cell is in Block A (A003). Hall tickets are issued one week before exams.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    response: "Hello! I'm TeresaBot, your AI guide for St. Teresa's College. I can help you find rooms, understand the FYUGP timetable, learn about BSc CA and BVoc SWD programmes, and answer questions about campus facilities.",
  },
  {
    keywords: ["help", "what can you do", "features"],
    response: "I can help you with:\n• Finding classrooms, labs, and offices across Blocks A–E\n• Understanding FYUGP timetable (BSc CA, BVoc SWD)\n• Campus facilities (canteen, library, auditorium)\n• Admission, exam, and fee information\n\nJust ask me anything!",
  },
];