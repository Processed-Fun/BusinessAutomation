// Twig & Perch Realty: the current portfolio.
// Prices are in seed. Square inchage is measured to MLS-B (Multiple Listing Service, Birdhouse) standards.
var TP_LISTINGS = [
  {
    id: 'painted-lady',
    name: 'The Painted Lady on Larkspur Lane',
    style: 'Victorian',
    price: 2400000,
    status: 'For Sale',
    sqin: 96,
    perches: 3,
    sun: 'Southern, full morning sun',
    height: '9 ft on ornate iron post',
    openHouse: 'Saturday, dawn',
    agent: 'meredith',
    photos: ['listing-victorian', 'listing-victorian-turret', 'listing-victorian-perch'],
    blurb: 'A turreted trophy roost with a wraparound perch rail and gaslight-warm interior glow.',
    description: 'The crown of our portfolio. This meticulously maintained Victorian offers a full turret, original gingerbread trim, and a wraparound perch rail with turned balusters, all commanding views of a formal hedge garden. The entry hole was recently recalibrated to 1.25 inches, welcoming bluebirds while remaining firmly aspirational for starlings. Interiors feature untreated pine throughout, a generous nesting chamber, and the kind of morning light that makes a clutch of eggs look like a magazine spread.',
    disclosures: [
      'The HOA has an ongoing matter with the neighborhood cat. Counsel is engaged and optimistic.',
      'Gingerbread trim is original. Please do not let the name raise your expectations. It is wood.'
    ]
  },
  {
    id: 'case-study-4',
    name: 'Case Study No. 4',
    style: 'Midcentury Modern',
    price: 1850000,
    status: 'For Sale',
    sqin: 72,
    perches: 2,
    sun: 'Western, dramatic sunsets',
    height: '7 ft on slender steel post',
    openHouse: 'Sunday, dawn',
    agent: 'theodore',
    photos: ['listing-midcentury'],
    blurb: 'A pedigreed teak and walnut flat-roof classic with clerestory light and a cantilevered perch.',
    description: 'An icon of the post-and-birdhouse movement. Case Study No. 4 pairs warm teak and walnut panels with a daring cantilevered perch and a clerestory slit that washes the nesting chamber in evening light. The open plan flows seamlessly from entry hole to chamber, because it is one room. Offered with original documentation and a letter from the architect that no one has finished reading.',
    disclosures: [
      'The flat roof pools rainwater after storms. The architect maintains this is a reflecting pool.',
      'Previous tenant was a house finch with strong opinions on the cantilever. They have moved on.'
    ]
  },
  {
    id: 'gourd-willow-hollow',
    name: 'The Gourd at Willow Hollow',
    style: 'Rustic Gourd',
    price: 985000,
    status: 'For Sale',
    sqin: 48,
    perches: 1,
    sun: 'Dappled southern light',
    height: '11 ft, suspended from mature willow',
    openHouse: 'Saturday, dawn',
    agent: 'constance',
    photos: ['listing-gourd'],
    blurb: 'A single-family heirloom gourd in the coveted Willow Hollow canopy, sold fully cured.',
    description: 'They are not growing any more of these. Well, they are, but not like this. Cured for two full seasons and hand-polished, this heirloom gourd offers organic curves no builder can replicate, gentle sway in a breeze, and a canopy address in Willow Hollow that purple martins have waitlisted for years. An honest, warm, move-in-ready home for the buyer who values provenance over right angles.',
    disclosures: [
      'The previous occupant departed in a hurry. Approximately one tablespoon of millet conveys.',
      'The home sways. Buyers from rigid construction should tour on a windy day before making an offer.'
    ]
  },
  {
    id: 'chalet-ptarmigan',
    name: 'Chalet Ptarmigan',
    style: 'Alpine Chalet',
    price: 1275000,
    status: 'For Sale',
    sqin: 60,
    perches: 2,
    sun: 'Eastern, crisp alpine mornings',
    height: '8 ft on cedar post',
    openHouse: 'Saturday, first light',
    agent: 'theodore',
    photos: ['listing-aframe'],
    blurb: 'A ski-in, fly-in A-frame with a dramatic shingled roofline and mountain-grade insulation.',
    description: 'Apres-forage living at its finest. This A-frame chalet brings the drama of the mountains to the back garden: a steep shingled roofline that sheds snow beautifully, a round entry tucked under the gable, and insulation rated for climates this garden does not technically have. The interior chamber is snug in the way expensive things are snug, on purpose.',
    disclosures: [
      'Roof pitch exceeds anything required by code. Ground feeders should look elsewhere and know their limits.',
      'Snow shown in listing photography is seasonal and is not included in the sale.'
    ]
  },
  {
    id: 'beton-brut',
    name: 'Béton Brut',
    style: 'Brutalist',
    price: 1600000,
    status: 'Pending',
    sqin: 88,
    perches: 1,
    sun: 'Northern, consistent, honest',
    height: '5 ft on concrete plinth',
    openHouse: 'By appointment only',
    agent: 'meredith',
    photos: ['listing-brutalist'],
    blurb: 'An award-winning cast-concrete statement piece with board-formed texture and a single steel perch.',
    description: 'Architecture, unapologetically. Béton Brut is a sculptural cast-concrete residence with board-formed texture, a perfect circular aperture, and a single steel perch that says everything that needs to be said. Thermal mass keeps the chamber cool at noon and warm at dusk. This is a home for a bird who has stopped explaining itself.',
    disclosures: [
      'Winner of two design awards. No bird was consulted for either.',
      'The concrete is load-bearing, visually and emotionally. Softening the exterior would require HOA review and a different buyer.'
    ]
  },
  {
    id: 'wren-hall',
    name: 'Wren Hall',
    style: 'Tudor Revival',
    price: 2100000,
    status: 'For Sale',
    sqin: 84,
    perches: 2,
    sun: 'Southern, through leaded glass',
    height: '8 ft on timber post',
    openHouse: 'Sunday, dawn',
    agent: 'meredith',
    photos: ['listing-tudor'],
    blurb: 'A half-timbered estate residence with slate-look roofing, ivy frontage, and considerable gravitas.',
    description: 'Some homes have history. Wren Hall has the look of history, which the market values similarly. Miniature half-timbering, a steep slate-look roof, a leaded-glass detail window, and established ivy give this residence the bearing of a country manor at one two-hundredth the acreage. The nesting chamber is paneled, generous, and quiet, the kind of quiet money used to buy.',
    disclosures: [
      'The leaded window is decorative. Entry remains the hole, as is traditional.',
      'The ivy is winning. A landscaping plan is available on request.'
    ]
  },
  {
    id: 'fjellhus',
    name: 'Fjellhus',
    style: 'Scandinavian Modern',
    price: 1150000,
    status: 'For Sale',
    sqin: 66,
    perches: 1,
    sun: 'Nordic, six months at a time',
    height: '7 ft on white post',
    openHouse: 'Saturday, dawn',
    agent: 'constance',
    photos: ['listing-scandi'],
    blurb: 'A pale ash gable of uncompromising simplicity, precision-drilled and lagom in every dimension.',
    description: 'Nothing here is extra. Fjellhus is a study in pale ash and restraint: one clean gable, one precise 1.5 inch entry, one slender dowel perch. The chamber is bright, calm, and exactly the size a chamber should be, a number the builder will not disclose but insists is correct. For the bird who finds other birdhouses a little much.',
    disclosures: [
      'Some assembly was required. Some assembly remains. An allen key conveys.',
      'The white post shows everything. The seller suggests making peace with this before closing.'
    ]
  },
  {
    id: 'the-knothole',
    name: 'The Knothole',
    style: 'Log Cabin',
    price: 725000,
    status: 'Sold',
    sqin: 58,
    perches: 1,
    sun: 'Filtered woodland',
    height: '6 ft at the treeline',
    openHouse: 'Concluded',
    agent: 'theodore',
    photos: ['listing-cabin'],
    blurb: 'A hand-notched log cabin with moss roof and stone-look chimney, sold in fourteen minutes at dawn.',
    description: 'Sold, and we understand why. This hand-notched cabin with its mossy cedar-shake roof and stone-look chimney drew nine offers before sunrise, eight of them in seed and one in an interesting button the sellers ultimately declined. Pictured for portfolio purposes and to encourage sellers of comparable cabins to call us immediately.',
    disclosures: [
      'The rustic knothole may admit a second, uninvited wren. The buyers were made aware and said that sounded fine.',
      'Sold as is, where is, which is a tree.'
    ]
  }
];

var TP_AGENTS = {
  meredith: {
    name: 'Meredith Larkspur',
    title: 'Principal Broker',
    photo: 'agent-meredith',
    phone: '1-800-TWIG (ext. 1)',
    bio: 'Sixteen years placing discerning cavity-nesters in the region’s finest addresses. Meredith closed the record-setting sale of the Dovecote at Quail Ridge and has personally walked every canopy she represents. She is committed to finding the right fit for you and your flock.'
  },
  theodore: {
    name: 'Theodore Finch',
    title: 'Senior Associate, Alpine & Woodland',
    photo: 'agent-theodore',
    phone: '1-800-TWIG (ext. 2)',
    bio: 'A former field ornithologist, Theodore left academia when he realized birds needed representation more than they needed observation. He specializes in high-altitude and treeline properties, and remains committed to finding the right fit for you and your flock.'
  },
  constance: {
    name: 'Constance Dove',
    title: 'Associate, Heritage & Gourd',
    photo: 'agent-constance',
    phone: '1-800-TWIG (ext. 3)',
    bio: 'Constance leads our heritage practice, covering cured gourds, estate hollows, and homes of unusual provenance. Her staging work with fresh moss is quietly famous. She is, above all, committed to finding the right fit for you and your flock.'
  }
};
