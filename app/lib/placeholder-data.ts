const carouselPlaceholder = [
  {
    to: "/issue/1",
    img_url: "/issueCover/issue1.png",
    release_date: new Date("2024-10-02"),
  },
  {
    to: "/issue/2",
    img_url: "/issueCover/issue2.png",
    release_date: new Date("2025-01-15"),
  },
  {
    to: "/issue/3",
    img_url: "/issueCover/issue3.png",
    release_date: new Date("2025-04-21"),
  },
];

const articlePlaceholder = [
  {
    id: "1",
    issue_id: "2",
    writer: {
      id: "1",
      role: "",
      auth_level: "",
      first_name: "Riley",
      last_name: "Park",
    },
    title: "Reflections on Designing for After-school Enrichment",
    content: "",
    release_date: new Date("2025-01-15"),
  },
  {
    id: "2",
    issue_id: "2",
    writer: {
      id: "2",
      role: "",
      auth_level: "",
      first_name: "Adam",
      last_name: "Tan",
    },
    title: "Game Jamming to Game Making",
    content: "",
    release_date: new Date("2025-01-15"),
  },
  {
    id: "3",
    issue_id: "2",
    writer: {
      id: "3",
      role: "",
      auth_level: "",
      first_name: "Alex",
      last_name: "Grams",
    },
    title:
      "Explaining Divide and Conquer, Dynamic Programming, and Greedy Algorithms",
    content: "",
    release_date: new Date("2025-01-15"),
  },
  {
    id: "4",
    issue_id: "1",
    writer: {
      id: "4",
      role: "",
      auth_level: "",
      first_name: "Ryan",
      last_name: "Chang",
    },
    title: "Optimizing Monster Hunter Armor with Linear Programming",
    content: "",
    release_date: new Date("2024-10-02"),
  },
  {
    id: "5",
    issue_id: "1",
    writer: {
      id: "5",
      role: "",
      auth_level: "",
      first_name: "Victoria",
      last_name: "Winn",
    },
    title:
      "Interview with Dane Carstens: Designing for Virtual Reality with “Save The Castle!”",
    content: "",
    release_date: new Date("2024-10-02"),
  },
  {
    id: "6",
    issue_id: "1",
    writer: {
      id: "5",
      role: "",
      auth_level: "",
      first_name: "Victoria",
      last_name: "Win",
    },
    title: "Interview with Alex Grams: Interning as a Gameplay Programmer",
    content: "",
    release_date: new Date("2024-10-02"),
  },
  {
    id: "7",
    issue_id: "1",
    writer: {
      id: "7",
      role: "",
      auth_level: "",
      first_name: "Dane",
      last_name: "Carstens",
    },
    title: "Playing Games on Easy is Allowed!",
    content: "",
    release_date: new Date("2024-10-02"),
  },
  {
    id: "8",
    issue_id: "1",
    writer: {
      id: "8",
      role: "",
      auth_level: "",
      first_name: "Ittai",
      last_name: "Mann",
    },
    title: "Ok… So what is a game engine?",
    content: "",
    release_date: new Date("2024-10-02"),
  },
];

const showcasePlaceholder = [
  {
    id: "1",
    img_url: "/showcase/attack.png",
    link: "https://sonicfangameshq.com/forums/showcase/art-attack.2218/",
  },
  {
    id: "2",
    img_url: "/showcase/fighting.png",
    link: "https://saffrona.itch.io/fighting-for-our-dreams-an-esports-visual-novel",
  },
];

const eventsPlaceholder = [
  {
    id: "1",
    startDate: new Date("2024-10-07"),
    title: "VGDC: Pitch Presentations",
  },
  {
    id: "2",
    startDate: new Date("2024-10-14"),
    endDate: new Date("2024-10-21"),
    title: "Steam Next Fest begins",
    notes: 'Keep an eye out for the new "Save the Castle!" demo!',
  },
  {
    id: "3",
    startDate: new Date("2024-10-25"),
    endDate: new Date("2024-10-27"),
    title: "VGDC: Fall Game Jam",
  },
  {
    id: "4",
    startDate: new Date("2024-11-18"),
    title: "VGDC: Playtesting Night",
  },
  {
    id: "5",
    startDate: new Date("2024-12-2"),
    title: "VGDC: Project Showcase",
  },
  {
    id: "6",
    startDate: new Date("2025-01-07"),
    title: "Winter TT Magazine releases!",
  },
  {
    id: "7",
    startDate: new Date("2025-01-20"),
    endDate: new Date("2025-01-26"),
    title: "Global Game Jam",
  },
  {
    id: "8",
    startDate: new Date("2025-02-10"),
    endDate: new Date("2025-02-14"),
    title: "VGDC Game Developer's Week",
  },
  {
    id: "9",
    startDate: new Date("2025-02-11"),
    endDate: new Date("2025-02-13"),
    title: "D.I.C.E Summit",
  },
  {
    id: "10",
    startDate: new Date("2025-02-16"),
    endDate: new Date("2025-02-23"),
    title: "The Table Game Jam",
  },
  {
    id: "11",
    startDate: new Date("2025-02-18"),
    title: "VGDC Playtesting Night",
  },
  {
    id: "12",
    startDate: new Date("2025-02-24"),
    endDate: new Date("2025-03-03"),
    title: "Steam Next Fest",
  },
  {
    id: "13",
    startDate: new Date("2025-03-11"),
    title: "VGDC Project Presentation",
  },
  {
    id: "14",
    startDate: new Date("2025-03-17"),
    endDate: new Date("2025-03-21"),
    title: "GDC",
  },
];

export {
  carouselPlaceholder,
  articlePlaceholder,
  showcasePlaceholder,
  eventsPlaceholder,
};
