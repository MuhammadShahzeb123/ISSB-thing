'use client';

import { useMemo, useState, type ReactNode } from 'react';
import DimensionNav from '../components/DimensionNav';

const STORAGE_KEY = 'issb-biodata-form-a-preview-v1';
const MAX_LEN = 4000;

const educationLevels = [
  { id: 'matric', label: 'Matric' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'degree', label: 'Degree' },
  { id: 'postgraduate', label: 'Post Graduate' },
] as const;

const educationColumns = [
  { id: 'grade', label: 'Grade' },
  { id: 'marks', label: 'Marks' },
  { id: 'year', label: 'Year' },
  { id: 'school', label: 'Name of school or college' },
  { id: 'board', label: 'Board or university (printed as U/)' },
] as const;

const events = [
  'Unforgettable incident of my life',
  'Aim of my life',
  'Depressive moment of my life',
  'Sweetest dream of my life',
  'Happiest day of my life',
  'Failure of my life',
  'Worst moment of life',
  'My ambition of my life',
  'Turning point of my life',
  'Highest achievement of my life',
  'Strange event of my life',
  'Thrilling event of my life',
  'Painful event of my life',
  'Charming period of my life',
  'Fruitful period of my life',
  'Successful moment of my life',
  'Defeat of my life',
  'Shocking news of my life',
  'Bad period of my life',
  'Worry of my life',
  'Latest dream of my life',
  'Frequent dream of my life',
  'Happiest dream of my life',
  'Pleasant dream of my life',
] as const;

type Draft = Record<string, string>;

function fieldKey(...parts: string[]) {
  return parts.join('.');
}

function clip(value: string) {
  return value.slice(0, MAX_LEN);
}

export default function BiodataFormPreview() {
  const [values, setValues] = useState<Draft>({});
  const [status, setStatus] = useState('Nothing is sent to ISSB. A draft stays on this device only if you save it.');
  const allowedKeys = useMemo(() => new Set(collectKeys()), []);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setStatus('No saved draft was found on this device.');
        return;
      }
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('bad draft');
      const next: Draft = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (allowedKeys.has(key) && typeof value === 'string') next[key] = clip(value);
      }
      if (filled && !window.confirm('Replace the answers currently on this page with the saved draft?')) return;
      setValues(next);
      setStatus('Saved draft loaded. It is not an ISSB submission.');
    } catch {
      setStatus('The saved draft could not be read. Your current answers were not changed.');
    }
  }

  function setField(key: string, value: string) {
    setValues((previous) => ({ ...previous, [key]: clip(value) }));
    setStatus('Unsaved changes. Save on this device if you want to keep them.');
  }

  function save() {
    try {
      const payload: Draft = {};
      for (const key of allowedKeys) {
        const value = values[key];
        if (value) payload[key] = value;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setStatus('Draft saved in this browser only. It is not filed with ISSB.');
    } catch {
      setStatus('This browser could not save the draft.');
    }
  }

  function clearDraft() {
    if (!window.confirm('Clear the answers on this page and delete the saved bio-data draft from this device?')) return;
    setValues({});
    try {
      localStorage.removeItem(STORAGE_KEY);
      setStatus('Cleared on this page and in this browser.');
    } catch {
      setStatus('Cleared on this page, but browser storage could not be updated.');
    }
  }

  const filled = Object.values(values).filter((value) => value.trim()).length;

  return (
    <div className="neo-page neo-page--psych prep-page">
      <div className="prep-shell">
        <DimensionNav active="interview" />
        <header className="prep-header">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-800">Form A · Civilian candidates</p>
          <h1>Bio data</h1>
          <p>
            This is a readable preview of the Personal Information Questionnaire (Civilian Candidates).
            The questions are the same as the printed form, written in clear English. Fill them here only to see what you will be asked and to practise honest answers.
          </p>
        </header>

        <div className="prep-note">
          <strong>Preview only.</strong> Nothing on this page is submitted to ISSB. Do not type identity numbers, home addresses, phone numbers, or private medical detail you would not want stored in this browser. Saving is optional and stays on this device.
        </div>

        <nav className="prep-tabs" aria-label="Bio data sections">
          <a className="prep-button prep-button-secondary" href="#form-header">Header</a>
          <a className="prep-button prep-button-secondary" href="#form-page-one">Questions 1–19</a>
          <a className="prep-button prep-button-secondary" href="#form-continuation">Continuation</a>
          <a className="prep-button prep-button-secondary" href="#form-events">Events</a>
        </nav>

        <div className="prep-panel">
          <div className="prep-status">
            <p>{filled} answers on this page</p>
            <span className="prep-muted">Optional local draft</span>
          </div>
          <div className="prep-actions">
            <button className="prep-button" type="button" onClick={save}>Save on this device</button>
            <button className="prep-button prep-button-secondary" type="button" onClick={load}>Load saved draft</button>
            <button className="prep-button prep-button-secondary" type="button" onClick={clearDraft}>Clear draft</button>
          </div>
          <p className="prep-muted mt-4" role="status">{status}</p>
        </div>

        <section className="prep-panel" id="form-header" aria-labelledby="header-title">
          <h2 id="header-title">Personal Information Questionnaire</h2>
          <p className="prep-muted">Civilian candidates · Form A. Batch number and chest number sit at the top of the printed sheet.</p>
          <div className="prep-grid">
            <TextField id="bio-batch-no" label="Batch No." value={values.batchNo ?? ''} onChange={(value) => setField('batchNo', value)} />
            <TextField id="bio-chest-no" label="Chest No." value={values.chestNo ?? ''} onChange={(value) => setField('chestNo', value)} />
          </div>
        </section>

        <section id="form-page-one" aria-label="First page of the questionnaire">
          <Section number="1" title="Name">
            <TextField id="bio-full-name" label="Full name" value={values.name ?? ''} onChange={(value) => setField('name', value)} />
          </Section>

          <Section number="2" title="Age">
            <p className="prep-muted">Years, months, and days, as on the form.</p>
            <div className="prep-grid">
              <TextField id="bio-age-years" label="Years" value={values.ageYears ?? ''} onChange={(value) => setField('ageYears', value)} />
              <TextField id="bio-age-months" label="Months" value={values.ageMonths ?? ''} onChange={(value) => setField('ageMonths', value)} />
              <TextField id="bio-days" label="Days" value={values.ageDays ?? ''} onChange={(value) => setField('ageDays', value)} />
            </div>
          </Section>

          <Section number="3" title="Religion">
            <TextField id="bio-religion" label="Religion" value={values.religion ?? ''} onChange={(value) => setField('religion', value)} />
          </Section>

          <Section number="4" title="Sect">
            <TextField id="bio-sect" label="Sect" value={values.sect ?? ''} onChange={(value) => setField('sect', value)} />
          </Section>

          <Section number="5" title="Married or single">
            <Choice
              name="marital"
              label="Marital status"
              options={['Married', 'Single']}
              value={values.marital ?? ''}
              onChange={(value) => setField('marital', value)}
            />
          </Section>

          <Section number="6" title="Urban or rural">
            <Choice
              name="urbanRural"
              label="Where you live"
              options={['Urban', 'Rural']}
              value={values.urbanRural ?? ''}
              onChange={(value) => setField('urbanRural', value)}
            />
          </Section>

          <Section number="7" title="Province">
            <TextField id="bio-province" label="Province" value={values.province ?? ''} onChange={(value) => setField('province', value)} />
          </Section>

          <Section number="8" title="Education">
            <p className="prep-muted">
              For Matric, Intermediate, Degree, and Post Graduate, the form asks for grade, marks, year, and the name of the school or college.
              The last column is printed as U/. That is the board or university.
            </p>
            {educationLevels.map((level) => (
              <article key={level.id} className="prep-details">
                <h3>{level.label}</h3>
                <div className="prep-grid">
                  {educationColumns.map((column) => {
                    const key = fieldKey('edu', level.id, column.id);
                    return (
                      <TextField
                        id={key}
                        key={key}
                        label={column.label}
                        value={values[key] ?? ''}
                        onChange={(value) => setField(key, value)}
                      />
                    );
                  })}
                </div>
              </article>
            ))}
          </Section>

          <Section number="9" title="Sports">
            <Area label="Sports" value={values.sports ?? ''} onChange={(value) => setField('sports', value)} />
          </Section>

          <Section number="10" title="Hobbies">
            <Area label="Hobbies" value={values.hobbies ?? ''} onChange={(value) => setField('hobbies', value)} />
          </Section>

          <Section number="11" title="Other activities">
            <Area label="Other activities" value={values.otherActivities ?? ''} onChange={(value) => setField('otherActivities', value)} />
          </Section>

          <Section number="12" title="Present employment">
            <Area label="Present employment" value={values.presentEmployment ?? ''} onChange={(value) => setField('presentEmployment', value)} />
          </Section>

          <Section number="13" title="Previous appearance before ISSB">
            <p className="prep-muted">Yes or no. If yes, the form asks for each appearance: batch and chest number, course, date, and result.</p>
            <Choice name="prevIssb" label="Previous appearance before ISSB" options={['Yes', 'No']} value={values.prevIssb ?? ''} onChange={(value) => setField('prevIssb', value)} />
            <RowCards
              title="Previous appearances"
              rowCount={3}
              columns={[
                { id: 'batchChest', label: 'Batch and chest No.' },
                { id: 'course', label: 'Course' },
                { id: 'date', label: 'Date' },
                { id: 'result', label: 'Result' },
              ]}
              idPrefix="prev"
              values={values}
              onChange={setField}
            />
          </Section>

          <Section number="14" title="Have you travelled abroad?">
            <p className="prep-muted">Yes or no. If yes: country visited, years of travel, and reason.</p>
            <Choice name="travelled" label="Travelled abroad" options={['Yes', 'No']} value={values.travelled ?? ''} onChange={(value) => setField('travelled', value)} />
            <RowCards
              title="Travel"
              rowCount={3}
              columns={[
                { id: 'country', label: 'Country visited' },
                { id: 'years', label: 'Years of travel' },
                { id: 'reason', label: 'Reason' },
              ]}
              idPrefix="travel"
              values={values}
              onChange={setField}
            />
          </Section>

          <Section number="15" title="Is your father alive?">
            <Choice name="fatherAlive" label="Father alive" options={['Yes', 'No']} value={values.fatherAlive ?? ''} onChange={(value) => setField('fatherAlive', value)} />
          </Section>

          <Section number="16" title="Father's occupation">
            <p className="prep-muted">Designation only.</p>
            <TextField id="bio-father-s-occupation-designation-only" label="Father's occupation (designation only)" value={values.fatherOccupation ?? ''} onChange={(value) => setField('fatherOccupation', value)} />
          </Section>

          <Section number="17" title="How many brothers do you have?">
            <p className="prep-muted">Do not count yourself.</p>
            <TextField id="bio-number-of-brothers-excluding-yourself" label="Number of brothers, excluding yourself" value={values.brothersCount ?? ''} onChange={(value) => setField('brothersCount', value)} />
          </Section>

          <Section number="18" title="How many sisters do you have?">
            <TextField id="bio-number-of-sisters" label="Number of sisters" value={values.sistersCount ?? ''} onChange={(value) => setField('sistersCount', value)} />
          </Section>

          <Section number="19" title="Brothers' and sisters' occupations">
            <div className="prep-grid">
              <div>
                <h3>Brothers</h3>
                {['a', 'b', 'c', 'd', 'e'].map((letter) => {
                  const key = fieldKey('brotherOcc', letter);
                  return <TextField id={key} key={key} label={`Brother ${letter}`} value={values[key] ?? ''} onChange={(value) => setField(key, value)} />;
                })}
              </div>
              <div>
                <h3>Sisters</h3>
                {['a', 'b', 'c', 'd', 'e'].map((letter) => {
                  const key = fieldKey('sisterOcc', letter);
                  return <TextField id={key} key={key} label={`Sister ${letter}`} value={values[key] ?? ''} onChange={(value) => setField(key, value)} />;
                })}
              </div>
            </div>
          </Section>
        </section>

        <section id="form-continuation" aria-labelledby="continuation-title">
          <header className="prep-header">
            <h2 id="continuation-title">Continuation of the same form</h2>
            <p>
              The next printed sheet is still the personal information questionnaire. Its numbering starts again at 7, so these are not a second question 7 from the first page. Province stays item 7 on the first page. This item 7 is about military training.
            </p>
          </header>

          <Section number="7" title="Military training institution" continuation>
            <p>Have you been in any military training institution?</p>
            <div className="prep-grid">
              <TextField id="bio-institution" label="Institution" value={values.milInstitution ?? ''} onChange={(value) => setField('milInstitution', value)} />
              <TextField id="bio-mil-years" label="Years" value={values.milYears ?? ''} onChange={(value) => setField('milYears', value)} />
            </div>
            <Area label="Reason for leaving" value={values.milReason ?? ''} onChange={(value) => setField('milReason', value)} />
          </Section>

          <Section number="8" title="NCC, Janbaz Force, Flying Club, or Scouting" continuation>
            <p>Were you a member of any of these? If so, how long, and did you earn any distinction?</p>
            <Area label="Membership, how long, and any distinction" value={values.cadetOrgs ?? ''} onChange={(value) => setField('cadetOrgs', value)} />
          </Section>

          <Section number="9" title="Family" continuation>
            <h3>(a) Father</h3>
            <div className="prep-grid">
              <TextField id="bio-age-of-father-if-alive" label="Age of father, if alive" value={values.fatherAgeAlive ?? ''} onChange={(value) => setField('fatherAgeAlive', value)} />
              <TextField id="bio-father-age-at-death" label="If dead, age at death" value={values.fatherAgeDeath ?? ''} onChange={(value) => setField('fatherAgeDeath', value)} />
            </div>
            <h3>(b) Mother</h3>
            <div className="prep-grid">
              <TextField id="bio-age-of-mother-if-alive" label="Age of mother, if alive" value={values.motherAgeAlive ?? ''} onChange={(value) => setField('motherAgeAlive', value)} />
              <TextField id="bio-mother-age-at-death" label="If dead, age at death" value={values.motherAgeDeath ?? ''} onChange={(value) => setField('motherAgeDeath', value)} />
            </div>
            <h3>(c) Your age when a parent died</h3>
            <p className="prep-muted">The printed line repeats “your age at your father’s death” on both blanks. This preview asks for one clear pair: your age at your father’s death, and your age at your mother’s death.</p>
            <div className="prep-grid">
              <TextField id="bio-your-age-at-your-father-s-death" label="Your age at your father's death" value={values.yourAgeFatherDeath ?? ''} onChange={(value) => setField('yourAgeFatherDeath', value)} />
              <TextField id="bio-your-age-at-your-mother-s-death" label="Your age at your mother's death" value={values.yourAgeMotherDeath ?? ''} onChange={(value) => setField('yourAgeMotherDeath', value)} />
            </div>
            <h3>(d) Cause of death</h3>
            <div className="prep-grid">
              <TextField id="bio-father" label="Father" value={values.fatherCause ?? ''} onChange={(value) => setField('fatherCause', value)} />
              <TextField id="bio-mother" label="Mother" value={values.motherCause ?? ''} onChange={(value) => setField('motherCause', value)} />
            </div>
            <h3>(e) Did your father or mother remarry?</h3>
            <Area label="Father or mother remarried" value={values.remarry ?? ''} onChange={(value) => setField('remarry', value)} />
            <h3>(f) Your age when your father or mother remarried</h3>
            <TextField id="bio-your-age-at-remarriage" label="Your age at remarriage" value={values.ageAtRemarriage ?? ''} onChange={(value) => setField('ageAtRemarriage', value)} />
            <h3>(g) Were you brought up by your own parents?</h3>
            <p className="prep-muted">If not, who brought you up, and between what ages?</p>
            <Area label="Brought up by your own parents? If not, who, and between what ages" value={values.upbringing ?? ''} onChange={(value) => setField('upbringing', value)} />
          </Section>

          <Section number="10" title="School absence, surgery, and unconsciousness" continuation>
            <h3>(a) Absence from school for illness</h3>
            <p className="prep-muted">How much were you absent from school because of illness? Count periods that went on for more than two years.</p>
            <Area label="Absence from school for illness" value={values.schoolAbsence ?? ''} onChange={(value) => setField('schoolAbsence', value)} />
            <h3>(b) Surgical operations</h3>
            <Area label="Surgical operations you have undergone" value={values.surgery ?? ''} onChange={(value) => setField('surgery', value)} />
            <h3>(c) Knocked unconscious</h3>
            <p className="prep-muted">Were you ever knocked unconscious by a fall or an accident, and for how long?</p>
            <Area label="Unconscious after a fall or accident, and for how long" value={values.unconscious ?? ''} onChange={(value) => setField('unconscious', value)} />
          </Section>

          <Section number="11" title="Brothers and sisters, including yourself" continuation>
            <p>
              List brothers and sisters, including yourself, from oldest to youngest. Include those who have died. Include step brothers and step sisters. Do not include cousins.
            </p>
            <p className="prep-muted">
              In the B or S column write B for brother, S for sister, X for yourself, S/B for step brother, and S/S for step sister.
            </p>
            <RowCards
              title="Family order"
              rowCount={8}
              rowLabel={(index) => `Person ${index + 1}`}
              columns={[
                { id: 'code', label: 'B or S' },
                { id: 'age', label: 'Age' },
                { id: 'occupation', label: 'Occupation' },
              ]}
              idPrefix="sibling"
              values={values}
              onChange={setField}
            />
            <h3>(a) Unemployed</h3>
            <div className="prep-grid">
              <TextField id="bio-unemployed-years" label="Years" value={values.unemployedYears ?? ''} onChange={(value) => setField('unemployedYears', value)} />
              <TextField id="bio-unemployed-months" label="Months" value={values.unemployedMonths ?? ''} onChange={(value) => setField('unemployedMonths', value)} />
            </div>
            <h3>(b) Particulars of all civil jobs held</h3>
            <p className="prep-muted">The form asks for those particulars in the civil employment table below.</p>
          </Section>

          <Section number="12" title="Civil employment" continuation>
            <RowCards
              title="Civil jobs"
              rowCount={3}
              columns={[
                { id: 'arm', label: 'Arm or department' },
                { id: 'job', label: 'Your appointment and exact job' },
                { id: 'salary', label: 'Salary' },
                { id: 'from', label: 'Duration from' },
                { id: 'to', label: 'Duration to' },
                { id: 'reason', label: 'Reason for leaving' },
              ]}
              idPrefix="civil"
              values={values}
              onChange={setField}
            />
          </Section>

          <Section number="13" title="Services in the armed forces" continuation>
            <h3>(a) Particulars</h3>
            <div className="prep-grid">
              <TextField id="bio-service-no" label="Service No." value={values.serviceNo ?? ''} onChange={(value) => setField('serviceNo', value)} />
              <TextField id="bio-type-of-commission" label="Type of commission" value={values.commissionType ?? ''} onChange={(value) => setField('commissionType', value)} />
              <TextField id="bio-date-of-commission" label="Date of commission" value={values.dateCommission ?? ''} onChange={(value) => setField('dateCommission', value)} />
              <TextField id="bio-date-of-enlistment-in-the-ranks" label="Date of enlistment in the ranks" value={values.dateEnlistment ?? ''} onChange={(value) => setField('dateEnlistment', value)} />
              <TextField id="bio-total-service-years" label="Total service, years" value={values.totalServiceYears ?? ''} onChange={(value) => setField('totalServiceYears', value)} />
              <TextField id="bio-total-service-months" label="Total service, months" value={values.totalServiceMonths ?? ''} onChange={(value) => setField('totalServiceMonths', value)} />
              <TextField id="bio-position-of-passing-out-from-the-military-academy" label="Position of passing out from the military academy" value={values.passingOut ?? ''} onChange={(value) => setField('passingOut', value)} />
              <TextField id="bio-award-or-distinction-at-the-academy" label="Award or distinction at the academy" value={values.academyAward ?? ''} onChange={(value) => setField('academyAward', value)} />
            </div>
            <h3>(b) Appointments held</h3>
            <RowCards
              title="Appointments"
              rowCount={3}
              columns={[
                { id: 'rank', label: 'Rank' },
                { id: 'from', label: 'Time held, from' },
                { id: 'to', label: 'Time held, to' },
                { id: 'appointment', label: 'Appointment in the ranks' },
                { id: 'unit', label: 'Name of unit and arm of service' },
              ]}
              idPrefix="appointment"
              values={values}
              onChange={setField}
            />
            <h3>(c) Military courses other than pre-commission training</h3>
            <RowCards
              title="Courses"
              rowCount={3}
              columns={[
                { id: 'name', label: 'Name of course' },
                { id: 'weeks', label: 'Duration in weeks' },
                { id: 'school', label: 'School and place' },
                { id: 'result', label: 'Result' },
              ]}
              idPrefix="course"
              values={values}
              onChange={setField}
            />
            <h3>(d) Active service</h3>
            <p className="prep-muted">Have you been on active service? If yes: which company, your rank, and decorations and medals.</p>
            <Choice name="activeService" label="Active service" options={['Yes', 'No']} value={values.activeService ?? ''} onChange={(value) => setField('activeService', value)} />
            <div className="prep-grid">
              <TextField id="bio-which-company" label="Which company" value={values.activeCompany ?? ''} onChange={(value) => setField('activeCompany', value)} />
              <TextField id="bio-rank" label="Rank" value={values.activeRank ?? ''} onChange={(value) => setField('activeRank', value)} />
            </div>
            <Area label="Decorations and medals" value={values.decorations ?? ''} onChange={(value) => setField('decorations', value)} />
          </Section>

          <Section number="14" title="Career if you are not selected" continuation>
            <TextField id="bio-what-career-do-you-intend-to-adopt-if-not-selected" label="What career do you intend to adopt if not selected?" value={values.altCareer ?? ''} onChange={(value) => setField('altCareer', value)} />
            <Area label="Why?" value={values.altCareerWhy ?? ''} onChange={(value) => setField('altCareerWhy', value)} />
          </Section>

          <Section number="15" title="Most unforgettable incident of your life" continuation>
            <p>Briefly describe it. The printed form leaves a large writing space for this answer.</p>
            <Area label="Most unforgettable incident" rows={10} value={values.unforgettable ?? ''} onChange={(value) => setField('unforgettable', value)} />
          </Section>

          <Section number="16" title="Declaration" continuation>
            <p>The information given above is correct to the best of my knowledge and belief.</p>
            <label className="prep-field">
              <span>Practice acknowledgement</span>
              <span className="prep-muted">Checking this only marks your local draft. It does not sign or file the official form.</span>
              <select value={values.declaration ?? ''} onChange={(event) => setField('declaration', event.target.value)}>
                <option value="">Not marked</option>
                <option value="yes">I have read the declaration. This practice draft is correct to the best of my knowledge and belief.</option>
              </select>
            </label>
          </Section>
        </section>

        <section className="prep-panel" id="form-events" aria-labelledby="events-title">
          <h2 id="events-title">Events</h2>
          <p>
            Part of bio data from item 15. Item 15 on the form asks you to write the most unforgettable incident. Be ready to talk about these 24 prompts as well. You do not need a dramatic story for every line. A true, short account is enough.
          </p>
          <ol className="mt-4" style={{ paddingInlineStart: '1.2rem' }}>
            {events.map((prompt, index) => {
              const key = fieldKey('event', String(index + 1));
              return (
                <li key={key} className="prep-details">
                  <Area label={`${index + 1}. ${prompt}`} rows={4} value={values[key] ?? ''} onChange={(value) => setField(key, value)} />
                </li>
              );
            })}
          </ol>
        </section>

        <div className="prep-panel">
          <div className="prep-actions">
            <button className="prep-button" type="button" onClick={save}>Save on this device</button>
            <button className="prep-button prep-button-secondary" type="button" onClick={load}>Load saved draft</button>
            <button className="prep-button prep-button-secondary" type="button" onClick={clearDraft}>Clear draft</button>
          </div>
          <p className="prep-muted mt-4" role="status">{status}</p>
        </div>
      </div>
    </div>
  );
}

function collectKeys() {
  const keys = [
    'batchNo', 'chestNo', 'name', 'ageYears', 'ageMonths', 'ageDays', 'religion', 'sect', 'marital', 'urbanRural', 'province',
    'sports', 'hobbies', 'otherActivities', 'presentEmployment', 'prevIssb', 'travelled', 'fatherAlive', 'fatherOccupation',
    'brothersCount', 'sistersCount', 'milInstitution', 'milYears', 'milReason', 'cadetOrgs',
    'fatherAgeAlive', 'fatherAgeDeath', 'motherAgeAlive', 'motherAgeDeath', 'yourAgeFatherDeath', 'yourAgeMotherDeath',
    'fatherCause', 'motherCause', 'remarry', 'ageAtRemarriage', 'upbringing',
    'schoolAbsence', 'surgery', 'unconscious', 'unemployedYears', 'unemployedMonths',
    'serviceNo', 'commissionType', 'dateCommission', 'dateEnlistment', 'totalServiceYears', 'totalServiceMonths',
    'passingOut', 'academyAward', 'activeService', 'activeCompany', 'activeRank', 'decorations',
    'altCareer', 'altCareerWhy', 'unforgettable', 'declaration',
  ];
  for (const level of educationLevels) {
    for (const column of educationColumns) keys.push(fieldKey('edu', level.id, column.id));
  }
  for (const letter of ['a', 'b', 'c', 'd', 'e']) {
    keys.push(fieldKey('brotherOcc', letter), fieldKey('sisterOcc', letter));
  }
  pushRows(keys, 'prev', 3, ['batchChest', 'course', 'date', 'result']);
  pushRows(keys, 'travel', 3, ['country', 'years', 'reason']);
  pushRows(keys, 'sibling', 8, ['code', 'age', 'occupation']);
  pushRows(keys, 'civil', 3, ['arm', 'job', 'salary', 'from', 'to', 'reason']);
  pushRows(keys, 'appointment', 3, ['rank', 'from', 'to', 'appointment', 'unit']);
  pushRows(keys, 'course', 3, ['name', 'weeks', 'school', 'result']);
  for (let index = 1; index <= events.length; index += 1) keys.push(fieldKey('event', String(index)));
  return keys;
}

function pushRows(keys: string[], prefix: string, count: number, columns: string[]) {
  for (let row = 1; row <= count; row += 1) {
    for (const column of columns) keys.push(fieldKey(prefix, String(row), column));
  }
}

function Section({
  number,
  title,
  continuation = false,
  children,
}: {
  number: string;
  title: string;
  continuation?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="prep-panel" aria-labelledby={`q-${continuation ? 'c' : 'a'}-${number}`}>
      <h2 id={`q-${continuation ? 'c' : 'a'}-${number}`}>
        <span className="prep-muted">{continuation ? 'Continuation ' : ''}</span>
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}

function TextField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="prep-field" htmlFor={id}>
      {label}
      <input id={id} type="text" autoComplete="off" maxLength={MAX_LEN} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="prep-field">
      {label}
      <textarea autoComplete="off" rows={rows} maxLength={MAX_LEN} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Choice({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="prep-field">
      <legend>{label}</legend>
      <div className="prep-actions">
        {options.map((option) => (
          <label key={option} className="prep-button prep-button-secondary" style={{ gap: '0.45rem' }}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RowCards({
  title,
  rowCount,
  rowLabel,
  columns,
  idPrefix,
  values,
  onChange,
}: {
  title: string;
  rowCount: number;
  rowLabel?: (index: number) => string;
  columns: { id: string; label: string }[];
  idPrefix: string;
  values: Draft;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div>
      <h3 className="prep-muted">{title}</h3>
      {Array.from({ length: rowCount }, (_, index) => (
        <article key={`${idPrefix}-${index + 1}`} className="prep-details">
          <h3>{rowLabel ? rowLabel(index) : `Row ${index + 1}`}</h3>
          <div className="prep-grid">
            {columns.map((column) => {
              const key = fieldKey(idPrefix, String(index + 1), column.id);
              return (
                <TextField
                  id={key}
                  key={key}
                  label={column.label}
                  value={values[key] ?? ''}
                  onChange={(value) => onChange(key, value)}
                />
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
