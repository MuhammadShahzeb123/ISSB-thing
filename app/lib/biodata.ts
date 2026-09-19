export interface BiodataSection {
  id: string;
  title: string;
  sourceImage: string;
  sourcePage: string;
  fields?: string[];
  columns?: string[];
  rows?: string[];
}

export const biodataSections: BiodataSection[] = [
  {
    id: 'relations', title: 'Relatives in the defence forces', sourceImage: 'IMG20260919120118.jpg', sourcePage: '50 (form page 7)',
    columns: ['Rank', 'Name (practice value)', 'Service address (practice value)'],
    rows: ['Father', 'Grandfather', 'Brother', 'Sister', 'Uncle', 'Brother-in-law', 'Cousin'],
  },
  {
    id: 'personal-summary', title: 'Personal information questionnaire, forms A and B', sourceImage: 'IMG20260919120116.jpg', sourcePage: '48, 49 (form pages 5 and 6)',
    fields: ['Batch number', 'Chest number', 'Name', 'Age (years, months, days)', 'Religion', 'Sect', 'Married / single', 'Present address (use a practice value)', 'Province', 'Sports', 'Hobbies', 'Other activities', 'Present employment', 'Previous appearance before ISSB: yes / no', 'Travelled abroad: yes / no', "Father's name", "Father's occupation", 'Number of brothers, excluding yourself', 'Number of sisters', "Brothers' occupations", "Sisters' occupations"],
  },
  {
    id: 'summary-education', title: 'Questionnaire education summary', sourceImage: 'IMG20260919120116.jpg', sourcePage: '48, 49',
    columns: ['Grade', 'Marks', 'Passing year'], rows: ['Matric', 'Intermediate', 'Degree', 'Postgraduate'],
  },
  {
    id: 'summary-appearances', title: 'Questionnaire previous appearances', sourceImage: 'IMG20260919120116.jpg', sourcePage: '48, 49',
    columns: ['Batch', 'Chest number', 'Course', 'Dates', 'Result'], rows: ['Appearance 1', 'Appearance 2'],
  },
  {
    id: 'travel', title: 'Travel abroad', sourceImage: 'IMG20260919120116.jpg', sourcePage: '48, 49',
    columns: ['Country visited', 'Year of travel', 'Reason', 'Length of stay'], rows: ['Visit 1', 'Visit 2', 'Visit 3'],
  },
  {
    id: 'identity', title: 'Identity and family', sourceImage: 'IMG20260919120111.jpg', sourcePage: '44 (form page 1)',
    fields: [
      'Height', 'Weight', 'Identification mark', 'Batch / identity number', 'Course', 'Date', 'Station',
      'Full name (capital letters)', "Father's name", 'Date of birth', 'Age in years, months and days',
      "Father's occupation and exact designation", "Father's income", 'Total family income',
      'Number of brothers and sisters (including deceased)', 'Your position in order of birth', "Brothers' occupations",
      'Religion', 'Sect', 'Caste', 'Sub-caste', 'Mother tongue', 'Marital status', 'Years of married life',
      'Name of spouse', 'Occupation of spouse', 'Number of children', 'Favourite personality', 'Why you admire this person',
    ],
  },
  {
    id: 'appearances', title: 'Previous ISSB / GHQ selection-board appearances', sourceImage: 'IMG20260919120111.jpg', sourcePage: '44',
    columns: ['Batch / identity number', 'Course', 'Date', 'Result', 'Medical result'], rows: ['Appearance 1', 'Appearance 2', 'Appearance 3'],
  },
  {
    id: 'education', title: 'Education', sourceImage: 'IMG20260919120111.jpg', sourcePage: '44',
    columns: ['School / college and place', 'Year', 'Certificate / degree', 'Grade / marks / percentage', 'Scholarships and prizes'],
    rows: ['Matric', 'Junior Cambridge', 'Senior Cambridge', 'F.A. / F.Sc.', 'B.A. / B.Sc.', 'M.A. / M.Sc.', 'Other'],
  },
  {
    id: 'social', title: 'Social activities', sourceImage: 'IMG20260919120111.jpg', sourcePage: '45 (form page 2)',
    columns: ['Institution / literary, debating, drama society or magazine', 'Position (chair, secretary, editor or member)', 'Prize', 'From year', 'To year'],
    rows: ['Activity 1', 'Activity 2', 'Activity 3'],
  },
  {
    id: 'sports', title: 'Games and sports', sourceImage: 'IMG20260919120111.jpg', sourcePage: '45',
    columns: ['Sport (in order of skill)', 'Team level (school, college or university)', 'Position in team', 'Years played', 'Prize / championship'],
    rows: ['Sport 1', 'Sport 2', 'Sport 3'],
  },
  {
    id: 'background', title: 'Interests and upbringing', sourceImage: 'IMG20260919120111.jpg', sourcePage: '45',
    fields: [
      'Did you live in a hostel while studying?', 'Hostel duration and ages', 'Travel abroad: country and duration',
      'What type of friends do you like to have?', 'Interests and hobbies', 'Where were you brought up: village or town?',
      'Place of birth and district', 'Military training institution and year, if any', 'Reason for leaving',
      'Membership of NCC, Janbaz Force, Flying Club or Scouting', 'Membership duration and distinctions',
      "Father's age if alive, or age at death", "Mother's age if alive, or age at death",
      "Your age at your father's death", "Your age at your mother's death", "Father's cause of death, if applicable", "Mother's cause of death, if applicable",
      'Did either parent remarry?', 'Your age when a parent remarried', 'Were you brought up by your own parents?',
      'If not, who brought you up and between what ages?', 'School absence due to illness (periods exceeding two weeks)',
    ],
  },
  {
    id: 'health', title: 'Health history (optional practice)', sourceImage: 'IMG20260919120113.jpg', sourcePage: '46 (form page 3)',
    fields: ['Surgical operations', 'Unconsciousness after a fall or accident and duration', 'Breathlessness', 'Frequent headaches', 'Sleeplessness', 'Muscular pain', 'Muscular trembling', 'Palpitations', 'Sensitive skin', 'Tiredness', 'Nausea or vomiting when travelling'],
  },
  {
    id: 'siblings', title: 'Siblings, including yourself, from oldest to youngest', sourceImage: 'IMG20260919120113.jpg', sourcePage: '46',
    columns: ['Relationship (B, S, X for self, SB or SS)', 'Age', 'Occupation'], rows: ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5', 'Person 6'],
  },
  {
    id: 'unemployment', title: 'Civil employment background', sourceImage: 'IMG20260919120113.jpg', sourcePage: '46',
    fields: ['Unemployed for more than six months: years and months'],
  },
  {
    id: 'employment', title: 'Civil jobs held', sourceImage: 'IMG20260919120113.jpg', sourcePage: '46',
    columns: ['Firm / department', 'Appointment / exact job', 'Salary', 'Duration (years and months)', 'Reason for leaving'], rows: ['Job 1', 'Job 2', 'Job 3'],
  },
  {
    id: 'service', title: 'Service in the armed forces, if applicable', sourceImage: 'IMG20260919120113.jpg', sourcePage: '46',
    fields: ['Service number (use a practice value)', 'Type of commission', 'Date of commission', 'Date of enlistment in ranks', 'Total service (years and months)', 'Passing-out position at training academy', 'Academy awards or distinctions'],
  },
  {
    id: 'appointments', title: 'Military appointments held', sourceImage: 'IMG20260919120113.jpg', sourcePage: '46',
    columns: ['Rank', 'Time held (years and months)', 'Appointment in rank', 'Unit and arm / service'], rows: ['Appointment 1', 'Appointment 2'],
  },
  {
    id: 'courses', title: 'Military courses other than pre-commission training', sourceImage: 'IMG20260919120113.jpg', sourcePage: '47 (form page 4)',
    columns: ['Course', 'Duration in weeks', 'School and place', 'Remarks'], rows: ['Course 1', 'Course 2'],
  },
  {
    id: 'reflection', title: 'Service, alternative career and life experience', sourceImage: 'IMG20260919120113.jpg', sourcePage: '47',
    fields: ['Active service: campaign and rank', 'Decorations and medals', 'Career you intend to adopt if not selected', 'Why that alternative career?', 'Briefly describe the most unforgettable incident of your life', 'Permanent address (use a practice value)', 'Phone number (use a practice value)'],
  },
];
