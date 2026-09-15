import type { DimensionContent, OpiStatement } from './model';

export const GENERATED_CONTENT_VERSION = 'opi-practice-1.0.0';

export const AUTHORSHIP_NOTE =
  'Original practice content authored for this project from general work-behavior concepts. It is not copied or adapted from a proprietary inventory.';

export const CONTEXTS = [
  'During day-to-day work',
  'When work becomes busy',
  'On a new or unfamiliar assignment',
  'When supervision is limited',
  'During a group assignment',
  'When people disagree about how to proceed',
  'After priorities change',
  'Following a setback',
  'While working toward a tight deadline',
  'With a routine responsibility',
] as const;

export const DIMENSION_CONTENT: readonly DimensionContent[] = [
  {
    id: 'responsibility',
    label: 'Responsibility',
    description: 'How you describe ownership, follow-through, and attention to commitments.',
    direct: [
      'keep ownership of my commitments until they are complete',
      'follow through without needing repeated reminders',
      'raise delays early so others can adjust',
      'check that my work meets the standard I agreed to',
      'take responsibility for correcting mistakes I make',
    ],
    reverse: [
      'leave unfinished commitments for someone else to notice',
      'need repeated reminders before I follow through',
      'avoid mentioning delays until someone asks',
      'treat small mistakes as someone else’s problem',
      'lose track of tasks once the immediate pressure has passed',
    ],
  },
  {
    id: 'initiative',
    label: 'Initiative',
    description: 'How you describe getting started, noticing useful work, and acting within sensible limits.',
    direct: [
      'look for a useful first step instead of waiting passively',
      'offer practical help when I notice an unmet need',
      'begin with the information available while clarifying what is missing',
      'suggest a workable improvement when I see one',
      'take appropriate action without waiting for every detail to be assigned',
    ],
    reverse: [
      'wait for someone else to make the first move',
      'ignore useful work that was not assigned directly to me',
      'delay starting until every uncertainty has disappeared',
      'keep improvement ideas to myself even when they could help',
      'avoid acting unless each step has been spelled out for me',
    ],
  },
  {
    id: 'teamwork',
    label: 'Teamwork',
    description: 'How you describe contributing, coordinating, and sharing space with other people.',
    direct: [
      'adjust my contribution to what the group needs',
      'share relevant information so others can do their part',
      'make room for quieter people to contribute',
      'support a group decision once concerns have been discussed',
      'offer help without taking over another person’s role',
    ],
    reverse: [
      'focus on my own part even when coordination is needed',
      'hold back information that would help others contribute',
      'let the most vocal people dominate the discussion',
      'continue resisting a group decision after concerns were fairly heard',
      'take control of other people’s tasks rather than supporting them',
    ],
  },
  {
    id: 'composure',
    label: 'Composure under pressure',
    description: 'How you describe regulating your pace and attention when demands increase.',
    direct: [
      'slow down enough to choose my next action deliberately',
      'keep my attention on the immediate problem',
      'notice tension without letting it control my response',
      'speak in a measured way even when urgency rises',
      'separate what I can act on from what I cannot control',
    ],
    reverse: [
      'react before I have understood what is happening',
      'lose focus because I keep thinking about everything at once',
      'let tension dictate how I respond to people',
      'speak more sharply as urgency rises',
      'spend most of my attention on things I cannot influence',
    ],
  },
  {
    id: 'adaptability',
    label: 'Adaptability',
    description: 'How you describe learning, adjusting, and continuing when conditions change.',
    direct: [
      'revise my approach when new information makes that sensible',
      'learn the new process before judging whether it will work',
      'find another route when the original plan is blocked',
      'ask what has changed before deciding what to do next',
      'carry useful lessons from one situation into the next',
    ],
    reverse: [
      'stick with my first approach even when evidence points elsewhere',
      'dismiss a new process before learning how it works',
      'stop making progress when the original plan is blocked',
      'continue as before without checking what has changed',
      'treat each situation as unrelated to anything I learned earlier',
    ],
  },
  {
    id: 'planning',
    label: 'Planning',
    description: 'How you describe priorities, sequencing, resources, and preparation.',
    direct: [
      'identify the most important outcome before choosing tasks',
      'break the work into clear next steps',
      'allow time for checks and likely interruptions',
      'confirm which resources or decisions are needed early',
      'update my plan when progress shows that assumptions were wrong',
    ],
    reverse: [
      'start with whichever task is easiest to notice',
      'keep the whole assignment in my head without defining next steps',
      'assume nothing will interrupt the time available',
      'wait until late to discover which resources or decisions are needed',
      'keep following the original plan after its assumptions have changed',
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'How you describe listening, clarity, questions, and timely information-sharing.',
    direct: [
      'state the main point clearly before adding detail',
      'listen for the other person’s meaning before replying',
      'ask a focused question when something is unclear',
      'adapt my explanation to what the listener already knows',
      'share important updates while there is still time to act on them',
    ],
    reverse: [
      'add so much detail that the main point becomes hard to find',
      'prepare my reply instead of listening to the other person',
      'pretend I understand rather than asking a focused question',
      'use the same explanation regardless of what the listener knows',
      'hold important updates until they are no longer useful',
    ],
  },
  {
    id: 'persistence',
    label: 'Persistence',
    description: 'How you describe sustained effort, recovery, and knowing when to change tactics.',
    direct: [
      'continue with steady effort after the first difficulty',
      'return to the task after a discouraging result',
      'try a different method when effort alone is not working',
      'keep track of small gains during a long assignment',
      'seek useful support before deciding that progress is impossible',
    ],
    reverse: [
      'reduce my effort as soon as the task becomes difficult',
      'avoid returning to the task after a discouraging result',
      'repeat the same method even when it is not working',
      'overlook small gains and assume a long assignment is going nowhere',
      'decide progress is impossible before seeking useful support',
    ],
  },
  {
    id: 'integrity',
    label: 'Integrity',
    description: 'How you describe honesty, consistency, credit, and handling competing interests.',
    direct: [
      'describe the situation accurately even when the facts are inconvenient',
      'apply the same standard to my own work that I expect from others',
      'give credit to the people whose work contributed',
      'say when I do not know rather than inventing certainty',
      'raise a competing interest before it can distort a decision',
    ],
    reverse: [
      'leave out inconvenient facts to make my position look better',
      'excuse behavior in myself that I criticize in others',
      'accept credit without mentioning who contributed',
      'sound certain even when I do not know',
      'keep a competing interest private while decisions are being made',
    ],
  },
  {
    id: 'judgment',
    label: 'Practical judgment',
    description: 'How you describe weighing evidence, consequences, trade-offs, and escalation.',
    direct: [
      'compare the likely consequences before choosing an option',
      'distinguish an urgent issue from one that can wait',
      'use available evidence while noting what remains uncertain',
      'choose a proportionate response rather than the most dramatic one',
      'involve the right person when a decision exceeds my authority',
    ],
    reverse: [
      'choose the first option without comparing likely consequences',
      'treat every issue as equally urgent',
      'ignore uncertainty and act as though the evidence is complete',
      'choose the most dramatic response even when a smaller one would work',
      'make decisions beyond my authority without involving the right person',
    ],
  },
] as const;

function padStatementNumber(value: number) {
  return String(value).padStart(3, '0');
}

export function generateOpiBank(): OpiStatement[] {
  return DIMENSION_CONTENT.flatMap((dimension) => {
    const keyedClauses = [
      ...dimension.direct.map((clause) => ({ clause, polarity: 'direct' as const })),
      ...dimension.reverse.map((clause) => ({ clause, polarity: 'reverse' as const })),
    ];

    return CONTEXTS.flatMap((context, contextIndex) =>
      keyedClauses.map(({ clause, polarity }, clauseIndex) => {
        const statementNumber = contextIndex * keyedClauses.length + clauseIndex + 1;
        return {
          id: `opi-${dimension.id}-${padStatementNumber(statementNumber)}`,
          text: `${context}, I ${clause}.`,
          dimension: dimension.id,
          polarity,
          context,
          contentVersion: GENERATED_CONTENT_VERSION,
        };
      }),
    );
  });
}
