// Transcribed from "ISSB MAT (Mechanical Aptitude Test) By DBISSB" (15 scanned pages).
// Figures are cleaned crops of the book scans (t-28 is a faithful SVG recreation: the scan was too faint).
// answerSource: "book" = from the book's answer key; "derived" = worked out because the key was missing or misprinted.

export type BookQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  answerSource: "book" | "derived";
  image: string;
  explanation?: string;
  flag?: string;
};

export const BOOK_EXAMPLE = {
  question: "Which pair of scissors will cut better, A or B?",
  image: "/images/mat/book/intro-ex.png",
  answer: "B",
};

export const BOOK_INTRO_TEXT = [
  'The word mechanical means "pertaining to machine or mechanics: constructed according to the laws of mechanics: possessing mechanical talent: done by a machine."',
  "In Mechanical Aptitude Test, a candidate has to display his mechanical worth. The candidate is given a booklet, which has got many different exercises. Usually, the candidate is asked either to write its answer or cross it in answer. Most of the questions of this test are very common which do not require any special mechanical aptitude of the candidate.",
  "In this test, also, there is a large number of questions which are to be attempted in a limited fixed time. He must, therefore, be sharp enough to finish the work in time.",
];

export const BOOK_INTRO_QUESTIONS: BookQuestion[] = [
  {
    "id": "intro-1",
    "question": "Which is heavy, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/intro-1.png",
    "explanation": "Both pans hold 1 kilo (1 kilo iron and 1 kilo ice), so they weigh the same."
  },
  {
    "id": "intro-2",
    "question": "What is the direction of wheel C?",
    "options": [
      "Same as A",
      "Opposite to A"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/intro-2.png",
    "explanation": "Gear B is between A and C. Each meshing gear turns the other way, so A and C turn the same way."
  },
  {
    "id": "intro-3",
    "question": "Do A and B work on the same principle?",
    "options": [
      "Yes",
      "No"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/intro-3.png"
  },
  {
    "id": "intro-4",
    "question": "Which is a sure test? (A) Attraction, (B) Repulsion.",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/intro-4.png",
    "explanation": "Repulsion. A magnet attracts plain iron too, so only repulsion proves both are magnets."
  },
  {
    "id": "intro-5",
    "question": "What is the charge in the clouds? (A) Positive, (B) Negative.",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/intro-5.png",
    "explanation": "Negative."
  },
  {
    "id": "intro-6",
    "question": "A metal ball is suspended by means of a string and at its lower end another string is attached. How will you pull: A, to break the upper string and, B, to break the lower string?",
    "options": [
      "A gentle pull breaks the upper string; a sharp pull breaks the lower string",
      "A sharp pull breaks the upper string; a gentle pull breaks the lower string"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/intro-6.png",
    "explanation": "A gentle pull will break the upper string and a sharp pull, the lower one."
  }
];

export const BOOK_DRILL_QUESTIONS: BookQuestion[] = [
  {
    "id": "drill-1",
    "question": "Three aeroplanes are coming. Which aeroplane is turning to its left?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/drill-1.png"
  },
  {
    "id": "drill-2",
    "question": "Which man can lift greater weight, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/drill-2.png"
  },
  {
    "id": "drill-3",
    "question": "Which wire cage weighs more? The cage with the bird outside A, or the cage with the bird flying inside B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/drill-3.png"
  },
  {
    "id": "drill-4",
    "question": "Which line is longer, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/drill-4.png"
  }
];

export const BOOK_TEST_QUESTIONS: BookQuestion[] = [
  {
    "id": "t-1",
    "question": "There are two reflected clocks. Which will strike the hour first, X or Y?",
    "options": [
      "X",
      "Y"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-1.png"
  },
  {
    "id": "t-2",
    "question": "Which watch is correct, X or Y?",
    "options": [
      "X",
      "Y"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-2.png"
  },
  {
    "id": "t-3",
    "question": "Which pair of scissors will cut better, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-3.png"
  },
  {
    "id": "t-4",
    "question": "If the big wheel turns in the direction indicated by the arrow, will the pail of water be raised or lowered?",
    "options": [
      "Raised",
      "Lowered"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-4.png"
  },
  {
    "id": "t-5",
    "question": "Which room has more of an echo, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-5.png"
  },
  {
    "id": "t-6",
    "question": "Which table is more likely to break, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-6.png"
  },
  {
    "id": "t-7",
    "question": "Which gear will take the most turns in a minute?",
    "options": [
      "Driver",
      "A",
      "B",
      "C"
    ],
    "answer": 3,
    "answerSource": "book",
    "image": "/images/mat/book/t-7.png"
  },
  {
    "id": "t-8",
    "question": "Which man is carrying the heavier load?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-8.png"
  },
  {
    "id": "t-9",
    "question": "In which of these round jars will the liquid press harder on the bottom?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-9.png"
  },
  {
    "id": "t-10",
    "question": "Three aeroplanes are coming. Which aeroplane is turning to its right?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-10.png"
  },
  {
    "id": "t-11",
    "question": "Which man can lift greater weight, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-11.png"
  },
  {
    "id": "t-12",
    "question": "Which weight must be heavier to support the 100 pounds in the position shown, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-12.png"
  },
  {
    "id": "t-13",
    "question": "Which system of pulley has better mechanical advantage, A, B or C?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-13.png"
  },
  {
    "id": "t-14",
    "question": "With which lever is it easier to lift the weight, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-14.png"
  },
  {
    "id": "t-15",
    "question": "What is the direction of wheel A, clockwise or anti-clockwise?",
    "options": [
      "Clockwise",
      "Anti-clockwise"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-15.png"
  },
  {
    "id": "t-16",
    "question": "Which bird will feel more cold during winter, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-16.png"
  },
  {
    "id": "t-17",
    "question": "Which is heavier, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-17.png",
    "flag": "The book says A (1 kilo iron), but both are 1 kilo, and the intro question with iron and ice gives 'Equal'. The book's answer is kept; check with your teacher."
  },
  {
    "id": "t-18",
    "question": "Which bottle is heavier, A (full of milk) or B (full of cream)?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-18.png"
  },
  {
    "id": "t-19",
    "question": "Which group of children is whirling fast, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-19.png"
  },
  {
    "id": "t-20",
    "question": "Three aeroplanes are going. Which aeroplane is turning to its left?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-20.png"
  },
  {
    "id": "t-21",
    "question": "When two forces are applied on P and Q, from which point will the wooden rod break, A, B or C?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-21.png"
  },
  {
    "id": "t-22",
    "question": "Which is a sure test: A, attraction or B, repulsion?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-22.png"
  },
  {
    "id": "t-23",
    "question": "Which is heavy, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-23.png"
  },
  {
    "id": "t-24",
    "question": "Which bird will weigh more, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-24.png"
  },
  {
    "id": "t-25",
    "question": "Which weight can be lifted more easily, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-25.png",
    "flag": "The answer key prints '2' for this question. It is read here as B (the second option)."
  },
  {
    "id": "t-26",
    "question": "A bus turns on a road as shown in the figure. At which point will the pressure be greater, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-26.png",
    "flag": "The book says A (inner side). In real physics the outer side (B) of a turn usually takes more pressure. The book's answer is kept."
  },
  {
    "id": "t-27",
    "question": "A man wants to crush salt in a mortar. With which pestle is it easier, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-27.png"
  },
  {
    "id": "t-28",
    "question": "There are two bottles, one (A) is full of milk and the other (B) is full of cream. Which is heavier, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-28.svg",
    "flag": "The book says B (cream), but question 18 says milk is heavier, and cream is lighter than milk. The book's answer is kept."
  },
  {
    "id": "t-29",
    "question": "Which gun will throw the bullet a longer distance, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-29.png"
  },
  {
    "id": "t-30",
    "question": "There are two jars full of water as shown by A and B. In which jar will the water press harder, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-30.png"
  },
  {
    "id": "t-31",
    "question": "There are two clocks with pendulums A and B. Which pendulum will run faster, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-31.png"
  },
  {
    "id": "t-32",
    "question": "Which piece is large, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-32.png"
  },
  {
    "id": "t-33",
    "question": "Which is longer in the following, AB or CD?",
    "options": [
      "AB",
      "CD",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-33.png"
  },
  {
    "id": "t-34",
    "question": "Which spring contains great resistance, A, B or C?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-34.png"
  },
  {
    "id": "t-35",
    "question": "There are two cages which are equal in weight. A bird flies inside a cage and a bird flies outside another cage. Which cage will weigh more, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-35.png"
  },
  {
    "id": "t-36",
    "question": "There are two nails to be pulled out. Which hammer will pull out more easily, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-36.png"
  },
  {
    "id": "t-37",
    "question": "There are two centre circles which are represented by group A and B. Is the centre circle of group A equal or unequal to the centre circle of group B?",
    "options": [
      "Equal",
      "Unequal"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-37.png"
  },
  {
    "id": "t-38",
    "question": "There are four reflected clocks A, B, C and D. Which will strike the hour first?",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": 3,
    "answerSource": "derived",
    "image": "/images/mat/book/t-38.png",
    "flag": "The answer key prints 'L', which is not an option (likely a printing error). D is worked out: D is about 10 minutes from the hour, closer than A, B or C."
  },
  {
    "id": "t-39",
    "question": "There are two pulleys A and B. With which pulley is it easier to pull the weight, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-39.png"
  },
  {
    "id": "t-40",
    "question": "There are two rockets A and B. Has any rocket zero momentum? Answer in \"Yes\" or \"No\".",
    "options": [
      "Yes",
      "No"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-40.png"
  },
  {
    "id": "t-41",
    "question": "Tell, at which point will the pressure be heavier, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-41.png"
  },
  {
    "id": "t-42",
    "question": "We have to light four bulbs. In which direction is the current passing from A to B?",
    "options": [
      "Clockwise",
      "Anti-clockwise",
      "Both"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-42.png"
  },
  {
    "id": "t-43",
    "question": "Which bulb is giving more light, a 60 watts bulb or two bulbs of 30 watts each?",
    "options": [
      "The 60 watt bulb",
      "The two 30 watt bulbs",
      "Equal",
      "Unequal"
    ],
    "answer": 3,
    "answerSource": "book",
    "image": "/images/mat/book/t-43.png",
    "flag": "The book's key says 'Unequal'. It means the light is not the same; it does not name which gives more."
  },
  {
    "id": "t-44",
    "question": "There are two wheels A and B. Which wheel runs faster, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-44.png"
  },
  {
    "id": "t-45",
    "question": "There are three glasses which have been just washed, rinsed and drained, then they are left to dry on a linoleum work-top. Which will dry first, A, B or C?",
    "options": [
      "A",
      "B",
      "C"
    ],
    "answer": 2,
    "answerSource": "book",
    "image": "/images/mat/book/t-45.png"
  },
  {
    "id": "t-46",
    "question": "If the big wheel runs in the clockwise direction, will the drum of water be raised or lowered?",
    "options": [
      "Raised",
      "Lowered"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-46.png"
  },
  {
    "id": "t-47",
    "question": "On which side is the heavier load, A or B?",
    "options": [
      "A",
      "B",
      "Equal"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-47.png"
  },
  {
    "id": "t-48",
    "question": "Which of the reflected clocks will strike the hour first, A or B?",
    "options": [
      "A",
      "B"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-48.png"
  },
  {
    "id": "t-49",
    "question": "What is the charge on the clouds: A Positive, and B Negative?",
    "options": [
      "A (Positive)",
      "B (Negative)"
    ],
    "answer": 1,
    "answerSource": "book",
    "image": "/images/mat/book/t-49.png"
  },
  {
    "id": "t-50",
    "question": "A metal ball is suspended by means of a string and at its lower end another string is attached. How shall you pull: A, to break the upper string, and B, to break the lower string?",
    "options": [
      "A gentle pull breaks the upper string; a sharp pull breaks the lower string",
      "A sharp pull breaks the upper string; a gentle pull breaks the lower string"
    ],
    "answer": 0,
    "answerSource": "book",
    "image": "/images/mat/book/t-50.png",
    "explanation": "A gentle pull will break the upper string and a sharp pull, the lower one."
  }
];

