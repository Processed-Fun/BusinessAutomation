// Product catalog for Perfectly Balanced Dice Co.
// Every die is one of a kind. These are the twelve we agreed to photograph.

const PRODUCTS = [
  {
    id: "riverbed-three",
    name: "The Riverbed Three",
    die: "d3",
    material: "Creek stone",
    weight: "1.8 lb",
    dims: "Roughly 4 in across, depends on the rock",
    price: 48,
    purchase: "cart",
    tagline: "Three sides. We are fairly sure.",
    blurb: "A lump of unaltered creek stone with three faces numbered in grease pencil. We pull them from the riverbed, count the flattish parts, and stop at three. Sides identified on delivery.",
    specs: [
      "Faces: 3, located on arrival",
      "Numbering: grease pencil, reapply as needed",
      "Roll radius: 8 to 30 inches",
      "Water damage: pre-existing"
    ],
    fairness: "No."
  },
  {
    id: "skipping-stone",
    name: "The Skipping Stone",
    die: "d2",
    material: "Flat river stone",
    weight: "0.7 lb",
    dims: "5 in x 4 in x 0.75 in",
    price: 39,
    purchase: "cart",
    tagline: "Heads, tails, or gone.",
    blurb: "A coin flip in stone form. One side says 1, the other says 2, and if you throw it anywhere near water it will skip four times and resolve nothing. Best used indoors, far from ponds.",
    specs: [
      "Faces: 2, plus an edge it has landed on twice",
      "Numbering: chiseled",
      "Skips: 4 to 6 on calm water",
      "Outcome retrieval: wading"
    ],
    fairness: "No."
  },
  {
    id: "fencepost",
    name: "The Fencepost",
    die: "d4",
    material: "Reclaimed barn wood",
    weight: "11 lb",
    dims: "26 in long, 5 in square",
    price: 180,
    purchase: "cart",
    tagline: "Four sides. One direction.",
    blurb: "A 26 inch length of barn post with a number routed into each long face. It does not tumble. It rolls one way, down whatever slope it finds, and the number on top when it hits the wall is your result.",
    specs: [
      "Faces: 4 long, 2 unnumbered ends",
      "Roll pattern: linear",
      "Recommended lane: 10 ft, cleared",
      "Splinters: included"
    ],
    fairness: "No."
  },
  {
    id: "wobbler",
    name: "The Wobbler",
    die: "d5",
    material: "Found plastic",
    weight: "2.2 lb",
    dims: "6 in across, varies by angle",
    price: 75,
    purchase: "cart",
    tagline: "Results pending.",
    blurb: "Five faces of a plastic we did not make and cannot fully identify. The bottom is slightly round, so it settles the way a dropped bowl settles, in stages, over most of a minute. Many customers simply call the roll early.",
    specs: [
      "Faces: 5",
      "Settling time: 40 to 70 seconds",
      "Material origin: found",
      "Dishwasher safe: it has survived one"
    ],
    fairness: "No."
  },
  {
    id: "splinter",
    name: "The Splinter",
    die: "d7",
    material: "Pine",
    weight: "0.9 lb",
    dims: "Fist sized",
    price: 64,
    purchase: "cart",
    tagline: "Seven faces. Eight outcomes.",
    blurb: "A fist sized pine wedge with seven numbered faces and one face we did not number because we do not discuss it. It lands on the eighth face about a third of the time. House rules vary.",
    specs: [
      "Faces: 7 numbered, 1 unnumbered",
      "Eighth face frequency: approx. 34%",
      "Grain: proud",
      "Sanding: refused"
    ],
    fairness: "No."
  },
  {
    id: "cinder",
    name: "The Cinder",
    die: "d9",
    material: "Kiln brick",
    weight: "5.5 lb",
    dims: "7 in x 5 in x 4 in",
    price: 110,
    purchase: "cart",
    tagline: "Fired once. Rolled never, cleanly.",
    blurb: "Nine faces cut from a decommissioned kiln brick. It lands with a sound your table will remember and your downstairs neighbor will describe to you. Leaves a fine red dust we consider part of the experience.",
    specs: [
      "Faces: 9",
      "Landing report: audible at 60 ft",
      "Dust: fine, red, ongoing",
      "Heat rating: 2,300 F, untested since"
    ],
    fairness: "No."
  },
  {
    id: "stump",
    name: "The Stump",
    die: "d11",
    material: "Whole oak stump",
    weight: "130 lb",
    dims: "22 in tall, 19 in across",
    price: 1900,
    purchase: "freight",
    tagline: "The sides are wherever the bark stops.",
    blurb: "An entire oak stump with eleven numbers burned into whatever surfaces presented themselves. Rolling it is a two person job and a landscaping decision. Between games it is a stool.",
    specs: [
      "Faces: 11, opinions differ",
      "Crew to roll: 2, ideally 3",
      "Seating capacity: 1 adult",
      "Rings: 74, count them yourself"
    ],
    fairness: "No."
  },
  {
    id: "cobble",
    name: "The Cobble",
    die: "d13",
    material: "River cobble",
    weight: "6 lb",
    dims: "8 in across",
    price: 150,
    purchase: "cart",
    tagline: "A prime number of problems.",
    blurb: "Thirteen faces ground into a river cobble. Thirteen cannot be divided fairly, and neither can this rock. Popular with game masters who have stopped explaining themselves.",
    specs: [
      "Faces: 13",
      "Symmetry: none detected",
      "Divisibility: 1 and 13 only",
      "Finish: river, 4,000 years"
    ],
    fairness: "No."
  },
  {
    id: "grandfather",
    name: "The Grandfather",
    die: "d20",
    material: "Oak burl",
    weight: "14 lb",
    dims: "12 in across at the widest, which moves",
    price: 420,
    purchase: "cart",
    tagline: "Twenty faces, sized by seniority.",
    blurb: "A d20 cut from a single oak burl. The 20 face is the size of a dinner plate and the 1 is the size of a stamp, which our customers tell us is how it should have been all along. Takes up half the table and all of the conversation.",
    specs: [
      "Faces: 20, sized by seniority",
      "Face 20: 9 in across",
      "Face 1: 0.9 in across",
      "Natural 20 rate: elevated, undocumented"
    ],
    fairness: "No."
  },
  {
    id: "crowd-pleaser",
    name: "The Crowd Pleaser",
    die: "d34",
    material: "Inflatable vinyl",
    weight: "3 lb inflated",
    dims: "4 ft across",
    price: 95,
    purchase: "cart",
    tagline: "Thirty four sides. Ten thousand hands.",
    blurb: "A four foot inflatable die for stadiums, assemblies, and weddings that have gotten away from the planner. Batted between strangers until it lands somewhere with authority. Whoever it lands near reads the number aloud. That is the rule.",
    specs: [
      "Faces: 34",
      "Inflation time: 25 minutes by mouth",
      "Crowd capacity: 40,000",
      "Repair patches: 6 included"
    ],
    fairness: "No."
  },
  {
    id: "milestone",
    name: "The Milestone",
    die: "d60",
    material: "Limestone",
    weight: "22 lb",
    dims: "13 in across",
    price: 780,
    purchase: "cart",
    tagline: "Sixty faces, carved by hand. Some twice.",
    blurb: "Sixty faces chiseled into quarry limestone by a man who does not use a jig. There are two 40s and no 53, and we consider the ledger balanced. Arrives with its own hand cart.",
    specs: [
      "Faces: 60 by count, 59 by content",
      "Duplicates: 40 appears twice",
      "Missing: 53, do not write in",
      "Hand cart: included, load rated"
    ],
    fairness: "No."
  },
  {
    id: "erratic",
    name: "The Erratic",
    die: "d104",
    material: "Granite",
    weight: "40 lb",
    dims: "15 in across",
    price: 2400,
    purchase: "freight",
    tagline: "One hundred four faces. Zero apologies.",
    blurb: "Our flagship. A 40 pound granite polyhedron with 104 hand cut faces, named after the boulders glaciers abandon in strange places, which is also how it will feel in your living room. Ships freight, arrives strapped to a pallet, doubles as a doorstop for a door you no longer intend to close.",
    specs: [
      "Faces: 104",
      "Reading a result: kneeling, with the included loupe",
      "Roll surface: reinforced floor or bare earth",
      "Delivery: freight, liftgate recommended"
    ],
    fairness: "No."
  }
];

// Customer gallery. Images generated from the actual product photos.
const GALLERY = [
  {
    img: "images/gallery-erratic-gamenight.webp",
    caption: "@dungeon_dad rolled the Erratic for initiative. The table is fine. The floor is under review."
  },
  {
    img: "images/gallery-erratic-delivery.webp",
    caption: "Delivery day. The freight team asked what it was. We told them. They put it down gently."
  },
  {
    img: "images/gallery-crowdpleaser-stadium.webp",
    caption: "Section 214 got a result on the Crowd Pleaser. Nobody knows what the roll was for. It landed on 19."
  },
  {
    img: "images/gallery-stump-family.webp",
    caption: "@porchgames uses the Stump as seating between rolls. Two person roll, one person chair."
  },
  {
    img: "images/gallery-skipping-lake.webp",
    caption: "@coinflip_carl took the Skipping Stone to the lake against our written advice. Result: gone."
  },
  {
    img: "images/gallery-grandfather-dnd.webp",
    caption: "The Grandfather at game night. It was the whole game night."
  },
  {
    img: "images/gallery-fencepost-hallway.webp",
    caption: "@hallway_league rolls the Fencepost down a 40 ft corridor every Friday. League rules: the wall is final."
  },
  {
    img: "images/gallery-riverbed-desk.webp",
    caption: "@spreadsheet_greg keeps the Riverbed Three at his desk for small decisions. He is still locating the third side."
  }
];
