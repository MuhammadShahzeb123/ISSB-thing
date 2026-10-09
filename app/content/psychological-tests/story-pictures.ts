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
];

/** Pictures drawn for each session, as in the ISSB format of four picture stories. */
export const PICTURES_PER_SESSION = 4;
