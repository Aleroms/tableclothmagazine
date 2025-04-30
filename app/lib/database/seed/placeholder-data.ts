import path from "path";
import { Article, User, Event, Issue, Showcase } from "../../definitions";
import { readFileSync } from "fs";

function loadMarkdown(articleId: string) {
  return readFileSync(
    path.join(process.cwd(), "content", `${articleId}.mdx`),
    "utf-8"
  );
}
const usersPlaceholder: User[] = [
  {
    id: "c8dbd410-08b4-44e7-805c-cb66e222233c",
    role: "writer",
    auth_level: "team",
    first_name: "Riley",
    last_name: "Park",
    pronouns: "he/him",
    fav_color: "#f6c9de",
  },
  {
    id: "876db4dc-d16d-4f58-82e6-9f5d9210129f",
    role: "writer",
    auth_level: "team",
    first_name: "Adam",
    last_name: "Tan",
  },
  {
    id: "82c2565f-9e51-497c-9802-5ccbcd605174",
    role: "writer",
    auth_level: "team",
    first_name: "Alex",
    last_name: "Grams",
  },
  {
    id: "f6c50bb9-7872-4d0a-9ba6-06eddca6b6ef",
    role: "Writer",
    auth_level: "team",
    first_name: "Ryan",
    last_name: "Chang (Artless)",
    pronouns: "Any",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/user/unfringing-copyright.png",
    fav_color: "#A0DEFF",
    description:
      "CS (Algorithms) major and Math minor. Graduated 2022. Thinking about working in education. [Games Portfolio](https://artlessavian.github.io/) [portfolio](https://artlessavian.github.io/)",
  },
  {
    id: "91a8189c-9b74-461f-920d-08b1ead41561",
    role: "Writer, Editor, Graphic Designer",
    auth_level: "admin",
    first_name: "Victoria",
    last_name: "Winn",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/user/victoriawinn5.png",
    pronouns: "she/her",
  },
  {
    id: "07a0a5bd-e136-4d33-b24a-8545eae10b86",
    role: "writer",
    auth_level: "admin",
    first_name: "Dane",
    last_name: "Carstens",
    pronouns: "he/him",
    fav_color: "#770268",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/user/profile01.jpg",
    description:
      "Dane likes writing code and building gameplay systems, as well as advocating for public transit. For more, visit [danecarstens.net](https://danecarstens.net/)",
  },
  {
    id: "e371d364-b890-4683-8a1f-db885b33e2b1",
    role: "writer",
    auth_level: "team",
    first_name: "Ittai",
    last_name: "Mann",
  },
  {
    id: "24b5cb40-f1f0-4ef6-b27b-df9c50528f45",
    role: "Web Developer",
    auth_level: "admin",
    first_name: "Santiago",
    last_name: "Morales",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/user/IMG_1698.jpg",
    description: `Passionate web developer committed to crafting responsive and accessible web experiences with a focus on quality, innovation, and continuous learning. I love coffee ☕ and coding 👨‍💻 <br/>
      [GitHub](https://github.com/aleroms/) [Linkedin](https://www.linkedin.com/in/santiago-morales-14b466194/) [itch.io](https://aleroms.itch.io)
      `,
    fav_color: "#41b883",
  },
  {
    id: "476cc04f-1ba8-426e-a67e-fa544c791112",
    role: "Editor",
    auth_level: "team",
    first_name: "Nichole",
    last_name: "Wong",
  },
  {
    id: "8da54bee-5368-4350-97f7-f317923966af",
    role: "Graphic Designer / Editor",
    pronouns: "they/them",
    fav_color: "#88D8C0",
    auth_level: "team",
    first_name: "SupriseOrb",
    description:
      "Queer indie game dev and occasional artist. https://supriseorb.carrd.co/",
  },
  {
    id: "b3d32f77-6804-451a-af20-aaa941bc7944",
    role: "Writer",
    pronouns: "he/him",
    fav_color: "#800020",
    auth_level: "team",
    first_name: "Charlie",
    last_name: "Xu",
    description: "game designer and NBA fanatic",
  },
  {
    id: "139a126e-f171-4096-abb4-5c172ad15262",
    role: "Writer",
    pronouns: "she/her",
    auth_level: "team",
    description:
      "Doubled in Computer Game Science and Art. Randomly deep dives to analyze and investigate niche stuff, just need a moment to buffer memories. [Site](https://murphypchu.weebly.com/)",
    first_name: "Murphy",
    last_name: "Chu",
  },
  {
    id: "899fcd63-6c4a-4f06-805d-042b9ca49c8e",
    role: "Puzzle Maker",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/user/scoli_pfp.png",
    pronouns: "he/him",
    fav_color: "#AFA3F0",
    first_name: "Noel AM",
    last_name: "Paredes",
    auth_level: "team",
    description:
      "GDIM Major and Informatics Minor. Self-proclaimed gastronomer wit a love for sourdogh. [Itch.io Page](https://goozmabackatitagain.itch.io/)",
  },
];

const carouselPlaceholder = [
  {
    to: "/issues/1",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/issue/1/issue1.png",
    release_date: new Date(2024, 9, 2), // October 2, 2024
  },
  {
    to: "/issues/2",
    img_url: "/issueCover/issue2.png",
    release_date: new Date(2025, 0, 15), // January 15, 2025
  },
  {
    to: "/issues/3",
    img_url: "/issueCover/issue3.png",
    release_date: new Date(2025, 3, 21), // April 21, 2025
  },
];

const articlePlaceholder: Article[] = [
  {
    id: "7a5c4ef5-86e1-408b-8020-991fa1c98b02",
    issue_id: 1,
    writer_id: usersPlaceholder[4].id,
    title: "Interview with Alex Grams: Interning as a Gameplay Programmer",
    markdown: loadMarkdown("7a5c4ef5-86e1-408b-8020-991fa1c98b02"),
    release_date: new Date(2024, 9, 2),
  },
  {
    id: "e501eb04-7f4a-46dc-a8a3-c9290ab6593e",
    issue_id: 1,
    writer_id: usersPlaceholder[4].id,
    title: "Who Wants to be Reincarnated: Postmortem",
    markdown: loadMarkdown("e501eb04-7f4a-46dc-a8a3-c9290ab6593e"),
    release_date: new Date(2024, 9, 2),
  },
  {
    id: "0b286ba5-9dc1-4695-96e5-0c59c217d6d9",
    issue_id: 1,
    writer_id: usersPlaceholder[6].id,
    title: "OK... So What is a Game Engine",
    markdown: loadMarkdown("0b286ba5-9dc1-4695-96e5-0c59c217d6d9"),
    release_date: new Date(2024, 9, 2),
  },
  {
    id: "9655c0f5-c24e-4a3c-a505-edac29ca8fb2",
    issue_id: 1,
    writer_id: usersPlaceholder[4].id,
    title:
      "Interview with Dane Carstens: Designing for Virtual Reality with 'Save The Castle!'",
    markdown: loadMarkdown("9655c0f5-c24e-4a3c-a505-edac29ca8fb2"),
    release_date: new Date(2024, 9, 2),
  },
  {
    id: "a0cd9865-2a03-4637-a2dd-60f6e63bf674",
    issue_id: 1,
    writer_id: usersPlaceholder[3].id,
    title: "Optimizing Monster Hunter Armor with Linear Programming",
    markdown: loadMarkdown("a0cd9865-2a03-4637-a2dd-60f6e63bf674"),
    release_date: new Date(2024, 9, 2),
  },
  {
    id: "988d45d5-4961-4f89-93b6-49e68225e404",
    issue_id: 2,
    writer_id: usersPlaceholder[5].id,
    title: "Playing Games on Easy is Allowed!",
    markdown: loadMarkdown("988d45d5-4961-4f89-93b6-49e68225e404"),
    release_date: new Date(2025, 0, 15),
  },
  {
    id: "0513f24f-ca51-4be3-b2fb-953e542f6456",
    issue_id: 2,
    writer_id: usersPlaceholder[0].id,
    title: "Reflections on Designing for After-school Enrichment",
    markdown: loadMarkdown("0513f24f-ca51-4be3-b2fb-953e542f6456"),
    release_date: new Date(2025, 0, 15),
  },
  {
    id: "988f476d-487f-45af-953f-87bb7626d703",
    issue_id: 2,
    writer_id: usersPlaceholder[1].id,
    title: "Game Jamming to Game Making",
    markdown: loadMarkdown("988f476d-487f-45af-953f-87bb7626d703"),
    release_date: new Date(2025, 0, 15),
  },
  {
    id: "8b13fa22-64ba-493f-b928-d9fd67b65480",
    issue_id: 2,
    writer_id: usersPlaceholder[2].id,
    title:
      "Explaining Divide and Conquer, Dynamic Programming, and Greedy Algorithms",
    release_date: new Date(2025, 0, 15),
    markdown: loadMarkdown("8b13fa22-64ba-493f-b928-d9fd67b65480"),
  },
];

const showcasePlaceholder: Showcase[] = [
  {
    id: "90fe9dca-c14e-41a1-9c55-b7eeefc39315",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/showcase/attack.png",
    link: "https://sonicfangameshq.com/forums/showcase/art-attack.2218/",
    name: "Art Attack",
  },
  {
    id: "a5d190aa-00cd-44be-bea0-8190b0820a09",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/showcase/fighting.png",
    link: "https://saffrona.itch.io/fighting-for-our-dreams-an-esports-visual-novel",
    name: "Fighting for our Dreams an esports visual novel",
  },
];

const eventsPlaceholder: Event[] = [
  {
    id: "ee61c92e-a4ed-4d70-9c15-ede82f58df21",
    issue_id: 1,
    startDate: new Date(2024, 9, 7),
    title: "VGDC: Pitch Presentations",
    duration: "3PM - 7PM",
  },
  {
    id: "8c61d95e-1941-4c8d-9427-3f376370aaee",
    issue_id: 1,
    startDate: new Date(2024, 9, 14),
    endDate: new Date(2024, 9, 21),
    title: "Steam Next Fest",
    notes: 'Keep an eye out for the new "Save the Castle!" demo!',
  },
  {
    id: "9066fdbf-f9eb-473a-8347-685d56f078c6",
    issue_id: 1,
    startDate: new Date(2024, 9, 25),
    endDate: new Date(2024, 9, 27),
    title: "VGDC: Fall Game Jam",
  },
  {
    id: "18f6772a-8498-4ff2-91e2-389c77a6203c",
    issue_id: 1,
    startDate: new Date(2024, 10, 18),
    title: "VGDC: Playtesting Night",
    duration: "5PM - 8PM",
  },
  {
    id: "5e9632bb-9df0-49b4-85bc-577174b44a9f",
    issue_id: 1,
    startDate: new Date(2024, 11, 2),
    title: "VGDC: Project Showcase",
    duration: "6PM - 9PM",
  },
  {
    id: "8a9aa4d6-6291-4074-9013-930f17830761",
    issue_id: 1,
    startDate: new Date(2025, 0, 7),
    title: "Winter TT Magazine releases!",
  },
  {
    id: "a5c727f5-8c76-471b-83e5-80b4eaff35ee",
    issue_id: 1,
    startDate: new Date(2025, 0, 20),
    endDate: new Date(2025, 0, 26),
    title: "Global Game Jam",
  },
  {
    id: "bbea71ee-c222-4b6f-9fcd-6b4efa6c7bf2",
    issue_id: 2,
    startDate: new Date(2025, 1, 10),
    endDate: new Date(2025, 1, 14),
    title: "VGDC Game Developer's Week",
    duration: "8AM - 5PM",
  },
  {
    id: "6db21821-bfd1-4900-82a9-c320751c8ad0",
    issue_id: 2,
    startDate: new Date(2025, 1, 11),
    endDate: new Date(2025, 1, 13),
    title: "D.I.C.E Summit",
    duration: "8AM - 8PM",
    externalLink: "https://www.dicesummit.org/",
  },
  {
    id: "769b29c5-c732-4a44-8844-df0e496d79c8",
    issue_id: 2,
    startDate: new Date(2025, 1, 16),
    endDate: new Date(2025, 1, 23),
    title: "The Table Game Jam",
  },
  {
    id: "33a7c086-f6c2-4823-bef4-8e36ca33eb43",
    issue_id: 2,
    startDate: new Date(2025, 1, 18),
    title: "VGDC Playtesting Night",
    duration: "5PM - 9PM",
  },
  {
    id: "6d60d182-b02b-4173-a50a-a48751da4b81",
    issue_id: 2,
    startDate: new Date(2025, 1, 24),
    endDate: new Date(2025, 2, 3),
    title: "Steam Next Fest",
  },
  {
    id: "c6458080-a90d-44c1-bc5f-53f4445e08b7",
    issue_id: 2,
    startDate: new Date(2025, 2, 11),
    title: "VGDC Project Presentation",
    duration: "4:30PM - 8PM",
  },
  {
    id: "578b7f67-f943-47a8-9e52-5e2c92704e01",
    issue_id: 2,
    startDate: new Date(2025, 2, 17),
    endDate: new Date(2025, 2, 21),
    title: "Game Developer's Conference",
  },
];

const issuesPlaceholder: Issue[] = [
  {
    id: 1,
    name: "Issue 1",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/issue/1/issue1.png",
    release_date: new Date(2024, 9, 2),
    description:
      "Some text that describes the issue and mentions anything that the user might want to know about the issue.",
    editor_id: usersPlaceholder[4].id,
    editors_note:
      "Hello everyone! Welcome to the very first issue of The Tablecloth! I want to sincerely thank everyone who worked on this issue. Thank you to Ittai and Ryan for their excellent technical articles. Thank you to Dane and Alex for sharing your amazing work. Thank you to SupriseOrb for putting all the pieces together and laying them out so beautifully! (Also a bonus thank you to Riley for coming up with the name!)",
  },
  {
    id: 2,
    name: "Issue 2",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/issue/2/issue2.png",
    release_date: new Date(2025, 0, 15),
    description:
      "Some text that describes the issue and mentions anything that the user might want to know about the issue.",
    editor_id: usersPlaceholder[4].id,
    editors_note:
      "Hello everyone! Welcome to the second issue of The Tablecloth! I am so happy we were able to do another one of these (especially with the busy holiday season!). Thank you to everyone who worked on this issue: Dane and Alex have returned not as interviewees, but as writers themselves! Riley and Adam join us with articles based on their personal game development experience. We also have several more puzzles thanks to Murphy and Noel. A huge shoutout to Nichole who helped edit every article and playtested every puzzle. And last but not least, thank you to SupriseOrb for once again laying out the magazine and giving it such a beautiful design. I hope you all enjoy this issue, and thank you for supporting this next release!",
  },
  {
    id: 3,
    name: "Issue 3",
    img_url:
      "https://tablecloth-magazine-local.s3.us-west-1.amazonaws.com/issue/3/issue3.png",
    release_date: new Date(2025, 2, 15), // March 15, 2025
    description:
      "Some text that describes the issue and mentions anything that the user might want to know about the issue.",
    editor_id: usersPlaceholder[4].id,
    editors_note:
      "Hello everyone! Welcome to the second issue of The Tablecloth! I am so happy we were able to do another one of these (especially with the busy holiday season!). Thank you to everyone who worked on this issue: Dane and Alex have returned not as interviewees, but as writers themselves! Riley and Adam join us with articles based on their personal game development experience. We also have several more puzzles thanks to Murphy and Noel. A huge shoutout to Nichole who helped edit every article and playtested every puzzle. And last but not least, thank you to SupriseOrb for once again laying out the magazine and giving it such a beautiful design. I hope you all enjoy this issue, and thank you for supporting this next release!",
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
