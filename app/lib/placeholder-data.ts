import { Article, User } from "./definitions";

const carouselPlaceholder = [
  {
    to: "/issues/1",
    img_url: "/issueCover/issue1.png",
    release_date: new Date("2024-10-02"),
  },
  {
    to: "/issues/2",
    img_url: "/issueCover/issue2.png",
    release_date: new Date("2025-01-15"),
  },
  {
    to: "/issues/3",
    img_url: "/issueCover/issue3.png",
    release_date: new Date("2025-04-21"),
  },
];

const articlePlaceholder: Article[] = [
  {
    id: "1",
    issue_id: "2",
    writer: {
      id: "1",
      role: "",
      auth_level: "writer",
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
      auth_level: "writer",
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
      auth_level: "writer",
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
      auth_level: "writer",
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
      auth_level: "admin",
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
      auth_level: "admin",
      first_name: "Victoria",
      last_name: "Winn",
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
      auth_level: "admin",
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
      auth_level: "writer",
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

const issuesPlaceholder = [
  {
    id: "1",
    name: "Issue 1",
    img_url: "/issueCover/issue1.png",
    release_date: new Date("2024-10-02"),
    description:
      "Some text that describes the issue and mentions anything that the user might want to know about the issue.",
    editor_id: "5",
    editors_note:
      "Hello everyone! Welcome to the very first issue of The Tablecloth! I want to sincerely thank everyone who worked on this issue. Thank you to Ittai and Ryan for their excellent technical articles. Thank you to Dane and Alex for sharing your amazing work. Thank you to SupriseOrb for putting all the pieces together and laying them out so beautifully! (Also a bonus thank you to Riley for coming up with the name!)",
  },
  {
    id: "2",
    name: "Issue 2",
    img_url: "/issueCover/issue2.png",
    release_date: new Date("2025-01-15"),
    description:
      "Some text that describes the issue and mentions anything that the user might want to know about the issue.",
    editor_id: "5",
    editors_note:
      "Hello everyone! Welcome to the second issue of The Tablecloth! I am so happy we were able to do another one of these (especially with the busy holiday season!). Thank you to everyone who worked on this issue: Dane and Alex have returned not as interviewees, but as writers themselves! Riley and Adam join us with articles based on their personal game development experience. We also have several more puzzles thanks to Murphy and Noel. A huge shoutout to Nichole who helped edit every article and playtested every puzzle. And last but not least, thank you to SupriseOrb for once again laying out the magazine and giving it such a beautiful design. I hope you all enjoy this issue, and thank you for supporting this next release!",
  },
  {
    id: "3",
    name: "Issue 3",
    img_url: "/issueCover/issue3.png",
    release_date: new Date("2025-03-15"),
    description:
      "Some text that describes the issue and mentions anything that the user might want to know about the issue.",
    editor_id: "5",
    editors_note:
      "Hello everyone! Welcome to the second issue of The Tablecloth! I am so happy we were able to do another one of these (especially with the busy holiday season!). Thank you to everyone who worked on this issue: Dane and Alex have returned not as interviewees, but as writers themselves! Riley and Adam join us with articles based on their personal game development experience. We also have several more puzzles thanks to Murphy and Noel. A huge shoutout to Nichole who helped edit every article and playtested every puzzle. And last but not least, thank you to SupriseOrb for once again laying out the magazine and giving it such a beautiful design. I hope you all enjoy this issue, and thank you for supporting this next release!",
  },
];

const usersPlaceholder: User[] = [
  {
    id: "1",
    role: "writer",
    auth_level: "writer",
    first_name: "Riley",
    last_name: "Park",
  },
  {
    id: "2",
    role: "writer",
    auth_level: "writer",
    first_name: "Adam",
    last_name: "Tan",
  },
  {
    id: "3",
    role: "writer",
    auth_level: "writer",
    first_name: "Alex",
    last_name: "Grams",
  },
  {
    id: "4",
    role: "",
    auth_level: "writer",
    first_name: "Ryan",
    last_name: "Chang",
  },
  {
    id: "5",
    role: "Writer, Editor, Graphic Designer",
    auth_level: "admin",
    first_name: "Victoria",
    last_name: "Winn",
    img_url: "/user/victoriawinn5.png",
    pronouns: "she/her",
  },
  {
    id: "7",
    role: "writer",
    auth_level: "admin",
    first_name: "Dane",
    last_name: "Carstens",
  },
  {
    id: "8",
    role: "writer",
    auth_level: "writer",
    first_name: "Ittai",
    last_name: "Mann",
  },
  {
    id: "9",
    role: "Web Developer",
    auth_level: "admin",
    first_name: "Santiago",
    last_name: "Morales",
  },
  {
    id: "10",
    role: "Editor",
    auth_level: "writer",
    first_name: "Nichole",
    last_name: "Wong",
  },
];

export {
  carouselPlaceholder,
  articlePlaceholder,
  showcasePlaceholder,
  eventsPlaceholder,
  issuesPlaceholder,
  usersPlaceholder,
};
