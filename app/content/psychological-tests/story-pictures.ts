// The picture pool for Picture Story Writing. One entry per picture.
//
// To add a picture: drop the file in public/story-pictures/ and add an entry
// here. `description` is a short, neutral, factual account of what is visibly
// in the picture (no story, no guessed feelings or causes). It is used as the
// image alt text and sent to Gemma so it can judge whether a story fits the
// picture. Bump `contentVersion` in story-writing.ts when the pool changes.

export type StoryPictureAsset = {
  id: `story-picture-${string}`;
  src: string;
  width: number;
  height: number;
  description: string;
  source: "user-supplied-pdf" | "ai-generated";
};

export const storyPictures: readonly StoryPictureAsset[] = [
  {
    id: "story-picture-ppdt-01",
    src: "/story-pictures/ppdt-01.jpg",
    width: 655,
    height: 534,
    description:
      "Charcoal sketch of a room. A woman stands half inside an open doorway on the left, one hand on the door handle, looking into the room. Inside are a small wooden cabinet with a few books on top, a wall shelf of books, and a table with a vase of flowers and a lamp.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-02",
    src: "/story-pictures/ppdt-02.jpg",
    width: 447,
    height: 442,
    description:
      "A person with short dark hair sits on the floor, slumped against a couch or bench, with their head resting on their arm so the face is hidden. A small object lies on the floor near their feet.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-03",
    src: "/story-pictures/ppdt-03.jpg",
    width: 320,
    height: 240,
    description:
      "Hazy pencil sketch of a road. A person lies stretched out on the road surface. A car is behind them at the roadside. A couple of small objects lie on the road near the person.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-04",
    src: "/story-pictures/ppdt-04.jpg",
    width: 449,
    height: 337,
    description:
      "Line drawing of a girl with short hair in a patterned top on the ground at the foot of outdoor steps with a handrail, one arm raised and legs stretched out. A house with an open doorway and some plants are behind her.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-05",
    src: "/story-pictures/ppdt-05.jpg",
    width: 642,
    height: 482,
    description:
      "Street scene. A man sits on a parked scooter at the roadside. A young woman stands a few steps in front of him with one arm stretched out towards him. Street lamps, a railing and buildings are in the background.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-06",
    src: "/story-pictures/ppdt-06.jpg",
    width: 642,
    height: 482,
    description:
      "Three people sit around a table indoors. A young man on the left has his hands on an open box or case on the table. A man in a jacket and a young woman sit opposite, facing him. A small packet lies near the woman.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-07",
    src: "/story-pictures/ppdt-07.jpg",
    width: 642,
    height: 482,
    description:
      "On a pavement beside a fence, a man stands looking down at a young girl who is sitting or crouching on the ground with one hand at her face and her mouth open. A tree and a lamp post are behind them.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-08",
    src: "/story-pictures/ppdt-08.jpg",
    width: 642,
    height: 482,
    description:
      "Line drawing of a man with a moustache leaning over the open bonnet of an old car with his hands on the engine. A man in a uniform and peaked cap stands at the front of the car facing him.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-09",
    src: "/story-pictures/ppdt-09.jpg",
    width: 642,
    height: 482,
    description:
      "Pencil sketch of a street. A group of children crowd around a man standing in front of a stopped truck; some children raise their arms. A man and a woman stand further back on the left.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-10",
    src: "/story-pictures/ppdt-10.jpg",
    width: 500,
    height: 332,
    description:
      "Soft grey wash painting of a young person with short dark hair, probably a girl, sitting with her chin resting on her hand and her eyes lowered, near a window. A glass stands on the table in front of her.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-11",
    src: "/story-pictures/ppdt-11.jpg",
    width: 430,
    height: 293,
    description:
      "Two men shake hands in the front of the picture; one wears glasses. A crowd of men, several in suits, stands behind them watching. A small framed picture or board is at the bottom between them.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-12",
    src: "/story-pictures/ppdt-12.jpg",
    width: 642,
    height: 482,
    description:
      "Outdoors, a young woman and a young man sit close together on a bench. The woman has a hand over her face and her head bowed. The man sits beside her, turned towards her. Trees are behind them.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-13",
    src: "/story-pictures/ppdt-13.jpg",
    width: 587,
    height: 730,
    description:
      "A young woman in a striped dress sits on a chair, turned round with her lips slightly parted, looking up at an older man standing behind her. The man has grey hair and a pipe in his mouth and looks down at her.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-14",
    src: "/story-pictures/ppdt-14.jpg",
    width: 840,
    height: 516,
    description:
      "Farm scene. In front, a young woman holding books stands looking to one side. Behind her a man with a bare back works a ploughed field with a horse. On the right an older woman leans against a tree looking into the distance. Barns stand in the background.",
    source: "user-supplied-pdf",
  },
  {
    id: "story-picture-ppdt-15",
    src: "/story-pictures/ppdt-15.jpg",
    width: 544,
    height: 676,
    description:
      "Close-up charcoal drawing of two men's faces. An older man with grey hair and a moustache looks downward. A younger man in a shirt and tie is in front of him, looking straight ahead.",
    source: "user-supplied-pdf",
  },
  // AI-generated pictures in the same hazy pencil style.
  {
    id: "story-picture-ai-01",
    src: "/story-pictures/ai-01.webp",
    width: 1200,
    height: 900,
    description:
      "Rainy street seen from under a building. A man in the foreground looks back over his shoulder at a young woman standing against a pillar, holding a handbag and looking down. On the wet pavement a third man walks away towards a parked car.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-02",
    src: "/story-pictures/ai-02.webp",
    width: 1200,
    height: 900,
    description:
      "Village road with huts and trees. A bicycle with a bent front wheel lies on the ground. A young man stands beside it looking at an older man in a turban and shawl who is walking towards him with a stick.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-03",
    src: "/story-pictures/ai-03.webp",
    width: 1200,
    height: 900,
    description:
      "Two boys at a river bank. One stands and points out at the water, where a small dark shape breaks the surface; the other crouches beside him. Trees line the far bank.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-04",
    src: "/story-pictures/ai-04.webp",
    width: 1200,
    height: 900,
    description:
      "Hospital corridor. A woman sits alone on a bench, turned to look down the corridor, where a doctor in a white coat carrying a file walks away. A trolley bed stands against the wall.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-05",
    src: "/story-pictures/ai-05.webp",
    width: 1200,
    height: 900,
    description:
      "Crowded market street with fruit and vegetable stalls under awnings. A man crouches on the ground in the middle while several men and women stand around him looking down.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-06",
    src: "/story-pictures/ai-06.webp",
    width: 1200,
    height: 900,
    description:
      "Railway platform in the rain beside a train. A young man in a uniform and peaked cap, with a kitbag on his back and a suitcase in his hand, stands facing an older woman in a shawl. Other travellers walk on the platform behind.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-07",
    src: "/story-pictures/ai-07.webp",
    width: 1200,
    height: 900,
    description:
      "A room with a window. A young man sits at a desk with books and papers, holding a pen and looking round at an open door, where a man in a suit and tie stands in the doorway.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-08",
    src: "/story-pictures/ai-08.webp",
    width: 1200,
    height: 900,
    description:
      "Roadside with an old car parked further up the road. A man on the edge of a ditch holds the hand of another man who is down in the ditch, pulling him up. A milestone stands by the road.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-09",
    src: "/story-pictures/ai-09.webp",
    width: 1200,
    height: 900,
    description:
      "Three people around a table with a map spread on it. A man standing points at the map, another man leans over it, and a young woman sits with her chin on her hand. A lantern and a bag are nearby; a window shows hills.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-10",
    src: "/story-pictures/ai-10.webp",
    width: 1200,
    height: 900,
    description:
      "A young woman holding an envelope stands at an open window, looking out at a garden gate, where a man with a small bag stands with his back to her. A house is beyond the gate.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-11",
    src: "/story-pictures/ai-11.webp",
    width: 1200,
    height: 900,
    description:
      "A farmer in a turban and shawl leans on a stick at the edge of a dry, cracked field with a few dead plants. A hut and a tree are behind him. Far across the field a lone figure walks away.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-12",
    src: "/story-pictures/ai-12.webp",
    width: 1200,
    height: 900,
    description:
      "Two men stand facing each other on a dirt road beside a parked truck. One holds out an open hand towards the other; the other has a hand on his hip. Bushes and hills are behind them.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-13",
    src: "/story-pictures/ai-13.webp",
    width: 1200,
    height: 900,
    description:
      "Heavy rain on a muddy path. A boy carries an old man on his back, walking towards the viewer. A fence, water and a small hut are in the background.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-14",
    src: "/story-pictures/ai-14.webp",
    width: 1200,
    height: 900,
    description:
      "Four young men with backpacks on a grassy hilltop overlooking a valley with a river. Three stand or sit together; one has stepped a little away and looks down the slope.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-15",
    src: "/story-pictures/ai-15.webp",
    width: 1200,
    height: 900,
    description:
      "A woman with her hand on a small boy's shoulder stands outside a cottage, both looking towards a column of dark smoke rising from buildings in the distance. A wooden gate is in front of them.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-16",
    src: "/story-pictures/ai-16.webp",
    width: 1200,
    height: 900,
    description:
      "A man sits on outdoor stone steps with his head in his hands. At the top of the steps another person stands with their back half turned, walking away.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-17",
    src: "/story-pictures/ai-17.webp",
    width: 1200,
    height: 900,
    description:
      "Classroom. A teacher holding chalk or paper and a boy stand at a blackboard. Other students sit at desks in the foreground, watching them.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-18",
    src: "/story-pictures/ai-18.webp",
    width: 1200,
    height: 900,
    description:
      "A house with flames and smoke coming from its roof. A young man runs towards it while several men and women stand back watching.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-19",
    src: "/story-pictures/ai-19.webp",
    width: 1200,
    height: 900,
    description:
      "A rowing boat on a calm lake. One person holds an oar and looks at the other, who leans over the side with a hand in the water. Hills and pine trees are in the background.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-20",
    src: "/story-pictures/ai-20.webp",
    width: 1200,
    height: 900,
    description:
      "An office with a desk, filing cabinet, telephone and window. Two men in suits sit at the desk; under the desk one passes an envelope or paper to the other's hand.",
    source: "ai-generated",
  },
  {
    id: "story-picture-ai-21",
    src: "/story-pictures/ai-21.webp",
    width: 1200,
    height: 900,
    description:
      "Night camp under a moon. A soldier in a helmet sits alone on a box beside a tent, looking at a photograph in his hands. A rifle leans against the tent; other tents and a small fire are in the distance.",
    source: "ai-generated",
  },
];

/** Pictures drawn for each session, as in the ISSB format of four picture stories. */
export const PICTURES_PER_SESSION = 4;
