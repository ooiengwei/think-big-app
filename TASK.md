# THINK BIG — React Web App Build Task

## Project Overview
Build a life evaluation web application called "Think Big" using React + Vite + Supabase.

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **DB Client:** @supabase/supabase-js
- **Charts:** Recharts (radar chart)
- **Routing:** React Router v6
- **PDF:** jsPDF + html2canvas
- **Icons:** Lucide React

## Supabase Credentials (already in .env.local)
- VITE_SUPABASE_URL=https://vafwjeqiwscskabvqejo.supabase.co
- VITE_SUPABASE_ANON_KEY=sb_publishable_1CIYWu7sy9RrL-cDB72G_w_JghRjlTJ

## Pages to Build
1. `/` - Landing page (hero, CTA "Start Free Assessment", sample radar chart)
2. `/assessment` - 120-question form (6 sections, progress bar, auto-save)
3. `/results` - Scores page (radar chart, 6 domain scores, basic insights)
4. `/dashboard` - User dashboard (history, score timeline)
5. `/admin` - Admin view (all users + scores)

## Color Scheme
- Primary: Red #B40000
- Background: White #FFFFFF
- Text: Dark #191923
- Accent: Gold #A06E14
- Light gray: #F5F5F8

## The 6 Domains & Scoring

### Domain 1: IKIGAI (Weight: 25%)
Questions Q1-Q20 (scale 1-5)
- Passion: Q1-Q5, Mission: Q6-Q10, Profession: Q11-Q15, Vocation: Q16-Q20
- Circle Overlap Score: count circles with avg > 3 → 0circles=0, 1=15, 2=25, 3=35, 4=40 pts
- Meaning Depth: avg(Q1,Q6,Q10,Q20) mapped 1-5 → 0-30 pts
- Daily Ikigai: avg(Q5,Q9,Q15,Q19) mapped 1-5 → 0-30 pts
- Max: 100

### Domain 2: PERSONALITY (Weight: 10%)
Q21-Q45: Q21-Q36 are A/B choice (A=1, B=2), Q37-Q45 scale 1-5
- MBTI: E/I=(Q21+Q22+Q29+Q35)/4, S/N=(Q23+Q24+Q30+Q36)/4, T/F=(Q25+Q26+Q31+Q32)/4, J/P=(Q27+Q28+Q33+Q34)/4
  - Each axis: avg>1.5 = second letter, else first letter
- OCEAN: O=avg(Q37,Q38)*20, C=avg(Q39,Q40)*20, E=avg(Q41)*20, A=avg(Q43,Q44)*20, N=(6-avg(Q42,Q45))*20 (reversed)
- Trait Stability = (C+E+A+(100-N))/4... simplified: avg(O,C,A)*0.4 + stability*0.6
- Score = avg(O,C,E,A) scaled to 100
- Max: 100

### Domain 3: 16 PERSONALITIES (Weight: 10%)
Q46-Q60 all A/B choice
- Mind E/I: Q46, Q59 — Energy S/N: Q47,Q51,Q52 — Nature T/F: Q48,Q53 — Tactics J/P: Q49,Q54 — Identity A/T: Q50,Q60
- Each axis: majority vote → type letter
- Type = 5-letter code e.g. INFJ-A
- Role Score = % of axes with decisive majority (>66%) → scaled 0-100
- Max: 100

### Domain 4: DECISION MAKING (Weight: 20%)
Q61-Q80 scale 1-5, Q73 reverse scored (6-Q73)
- Process Score: avg(Q61-Q70) mapped → 0-35
- Style Score: avg(Q71-Q80 with Q73 reversed) mapped → 0-30
- Honesty: avg(Q63,Q65,Q66,Q67,Q68) → 0-20
- Clarity: avg(Q72,Q75,Q77) → 0-15
- Total = Process+Style+Honesty+Clarity, normalized to 100
- Max: 100

### Domain 5: FINANCIAL DECISION (Weight: 20%)
Q81-Q100 scale 1-5, Q81-Q86 reverse scored
- Bias Score: avg(reversed Q81-Q86, Q87-Q90) → 0-40
- Behaviour Score: avg(Q91-Q100) → 0-35
- Risk Calibration: avg(Q87-Q90,Q97,Q98) → 0-25
- Total normalized to 100
- Max: 100

### Domain 6: CHANGE DIRECTION (Weight: 15%)
Q101-Q120 scale 1-5
- Transition Score: avg(Q101-Q110) → 0-30
- Letting Go: avg(Q101,Q102,Q107,Q108) → 0-25
- Mindset Score: avg(Q111-Q120) → 0-30
- Resilience: avg(Q103,Q104,Q118,Q119) → 0-15
- Total normalized to 100
- Max: 100

### Composite Score
Score = Ikigai*0.25 + Personality*0.10 + 16P*0.10 + Decision*0.20 + Financial*0.20 + Change*0.15

### Score Bands
- < 40: Drifting
- 40-59: Awakening
- 60-74: Aligned
- 75-89: Flourishing
- 90-100: Integrated

## Sample Questions (use these for all 120, generate realistic ones)

### IKIGAI (Q1-Q20) - scale 1-5 (Strongly Disagree → Strongly Agree)
Q1: I wake up most mornings feeling excited about my day
Q2: I have a clear sense of what I am passionate about
Q3: I regularly engage in activities that make time feel like it flies
Q4: My hobbies and interests energise rather than drain me
Q5: I find joy in the small moments of my daily routine
Q6: I believe my life has a deeper purpose beyond just survival
Q7: I feel I am contributing something meaningful to others
Q8: The world would be slightly different if I had not existed
Q9: I act on my values even when it is difficult
Q10: I can articulate why my life matters in a few sentences
Q11: I am being paid (or could be paid) to do what I am good at
Q12: My core skills are recognised and valued by others
Q13: I invest time in developing my professional competencies
Q14: My career aligns with my natural strengths
Q15: I feel confident in my ability to create economic value
Q16: What I do serves a genuine need in the world
Q17: People come to me because of a specific value I provide
Q18: I feel my work makes others' lives better
Q19: I can see how my efforts create impact beyond myself
Q20: My daily work contributes to something larger than me

### PERSONALITY (Q21-Q36) - A or B choice
Q21: A) I feel energised after spending time alone | B) I feel energised after spending time with others
Q22: A) I prefer small, deep conversations | B) I enjoy large group interactions
Q23: A) I trust facts and concrete details | B) I trust patterns and future possibilities
Q24: A) I prefer step-by-step instructions | B) I prefer to figure things out as I go
Q25: A) I make decisions based on logic | B) I make decisions based on how people feel
Q26: A) I value truth over tact | B) I value harmony over being right
Q27: A) I like to have plans and stick to them | B) I like to stay flexible and adapt
Q28: A) I feel stressed leaving things unfinished | B) I feel energised by open possibilities
Q29: A) I prefer working independently | B) I prefer collaborating with others
Q30: A) I prefer realistic and practical ideas | B) I prefer creative and abstract ideas
Q31: A) I stay objective even in emotional situations | B) I naturally empathise in emotional situations
Q32: A) I find it easy to give critical feedback | B) I find it hard to say something that might upset others
Q33: A) I usually follow a schedule | B) I usually go with the flow
Q34: A) I like to decide things quickly | B) I prefer to keep options open
Q35: A) I need alone time to recharge after social events | B) Social events leave me wanting more interaction
Q36: A) I notice details before seeing the big picture | B) I see patterns and connections before details

### PERSONALITY OCEAN (Q37-Q45) - scale 1-5
Q37: I enjoy trying new and unfamiliar experiences
Q38: I am drawn to creative, artistic, or philosophical ideas
Q39: I complete tasks thoroughly and on time
Q40: I am organised and keep things in order
Q41: I feel comfortable in social situations and enjoy meeting new people
Q42: I often worry about things going wrong (reverse scored)
Q43: I genuinely care about others' wellbeing
Q44: I try to understand other people's perspective before judging
Q45: I get stressed easily in difficult situations (reverse scored)

### 16 PERSONALITIES (Q46-Q60) - A or B choice
Q46: A) You prefer to stay in the background | B) You enjoy being the centre of attention
Q47: A) You trust what you can see and measure | B) You trust your instincts and gut feelings
Q48: A) You think with your head, not your heart | B) You lead with empathy and feelings
Q49: A) You prefer having clear plans and routines | B) You prefer being spontaneous and flexible
Q50: A) You rarely second-guess yourself | B) You often review and reflect on your decisions
Q51: A) You prefer working with established methods | B) You prefer trying new approaches
Q52: A) You like things to be concrete and specific | B) You think in metaphors and abstract concepts
Q53: A) You value logic even when it leads to hard truths | B) You value relationships even over being right
Q54: A) You make to-do lists and stick to them | B) You work best without a fixed plan
Q55: A) You recharge better alone | B) You recharge better with people
Q56: A) You prefer practical solutions to big-picture thinking | B) You prefer vision and strategy over details
Q57: A) You analyse before you feel | B) You feel before you analyse
Q58: A) You prefer closure and resolution | B) You prefer keeping things open
Q59: A) You think out loud with others | B) You think inside your own head first
Q60: A) You are confident in most of your life decisions | B) You frequently wonder if you made the right choice

### DECISION MAKING (Q61-Q80) - scale 1-5
Q61: Before making a major decision, I clearly define what I am trying to achieve
Q62: I gather enough information before committing to a choice
Q63: I am honest with myself when a decision is not working out
Q64: I consider multiple options before choosing
Q65: I can admit when I am wrong and change course
Q66: I acknowledge when emotions are driving a decision
Q67: I seek feedback from others before important choices
Q68: I reflect on past decisions to learn from them
Q69: I can separate the quality of a decision from its outcome
Q70: I have a consistent process I use for important decisions
Q71: I am comfortable making decisions with incomplete information
Q72: I can articulate the reasoning behind my decisions clearly
Q73: I often second-guess my decisions after making them (reverse)
Q74: I manage uncertainty without becoming paralysed
Q75: I know when I am the right person to make a decision
Q76: I set time limits on deliberation to avoid overthinking
Q77: I know which factors matter most in a decision before I start
Q78: I distinguish between reversible and irreversible decisions
Q79: I check my assumptions before committing to a course
Q80: I stay decisive even when facing significant pressure

### FINANCIAL DECISION (Q81-Q100) - scale 1-5, Q81-Q86 reversed
Q81: I sometimes hold on to losing investments because I hate realising a loss (reverse)
Q82: I make financial decisions differently when markets are volatile (reverse)
Q83: I sometimes make purchases to impress others (reverse)
Q84: My financial mood is heavily affected by short-term price movements (reverse)
Q85: I sometimes follow the crowd in financial decisions even if I am unsure (reverse)
Q86: I feel more pain from losing money than pleasure from gaining the same amount (reverse)
Q87: I can stay calm and rational during financial downturns
Q88: I distinguish between a bad decision and a bad outcome
Q89: I regularly review my financial decisions to improve
Q90: I set predetermined exit points before entering investments
Q91: I have a clear savings rate that I stick to each month
Q92: I invest according to a long-term plan, not short-term emotion
Q93: I know my net worth and track it regularly
Q94: I understand the difference between assets and liabilities
Q95: I make financial decisions based on evidence, not tips
Q96: I maintain an emergency fund for unexpected expenses
Q97: I understand my own risk tolerance and invest accordingly
Q98: I can calculate the true cost of borrowing before taking debt
Q99: I review my financial plan at least once a year
Q100: I have a written financial goal with a specific timeline

### CHANGE DIRECTION (Q101-Q120) - scale 1-5
Q101: I find it easy to let go of roles or identities that no longer serve me
Q102: When something ends in my life, I process the loss before moving on
Q103: I can stay resilient through prolonged periods of uncertainty
Q104: I bounce back from setbacks faster than most people
Q105: I am currently in a period of meaningful personal transition
Q106: I have a clear vision of what I am moving toward
Q107: I have acknowledged what I am leaving behind in my current transition
Q108: I have grieved or processed the ending of a previous chapter
Q109: I am taking concrete steps toward my new beginning
Q110: I feel more excited than anxious about the changes ahead
Q111: I believe my intelligence and abilities can grow with effort
Q112: I view failure as feedback, not evidence of fixed limitations
Q113: I seek out challenges that push me beyond my comfort zone
Q114: I invest time in learning things that are difficult
Q115: When I encounter a setback, I analyse it before reacting
Q116: I believe people can change their fundamental traits
Q117: I surround myself with people who challenge my thinking
Q118: I recover from criticism without becoming defensive
Q119: I persist through difficult problems rather than avoiding them
Q120: I actively seek feedback to improve my blind spots

## Supabase Schema to Create

Run this SQL in Supabase SQL editor:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  email text,
  name text,
  created_at timestamptz default now()
);

-- Assessments
create table public.assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  session_id text, -- for guest users
  created_at timestamptz default now(),
  completed_at timestamptz,
  composite_score numeric(5,2),
  composite_band text,
  status text default 'in_progress'
);

-- Individual responses
create table public.responses (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid references public.assessments(id) on delete cascade,
  question_id integer not null,
  answer_value text not null -- '1'-'5' for scale, 'A'/'B' for choice
);

-- Domain scores
create table public.scores (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid references public.assessments(id) on delete cascade,
  domain text not null, -- 'ikigai','personality','16p','decision','financial','change'
  raw_score numeric(5,2),
  weighted_score numeric(5,2),
  band text,
  mbti_type text -- only for personality/16p domains
);

-- Paid reports
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid references public.assessments(id),
  user_id uuid references public.profiles(id),
  report_type text default 'coaching',
  created_at timestamptz default now(),
  paid boolean default false,
  amount_paid numeric(8,2)
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.responses enable row level security;
alter table public.scores enable row level security;
alter table public.reports enable row level security;

create policy "Users see own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users see own assessments" on public.assessments for all using (auth.uid() = user_id or user_id is null);
create policy "Users see own responses" on public.responses for all using (
  assessment_id in (select id from public.assessments where user_id = auth.uid() or user_id is null)
);
create policy "Users see own scores" on public.scores for all using (
  assessment_id in (select id from public.assessments where user_id = auth.uid() or user_id is null)
);
create policy "Users see own reports" on public.reports for all using (auth.uid() = user_id);
```

## Build Instructions

1. Create React + Vite project in current directory (.)
2. Install dependencies: @supabase/supabase-js recharts react-router-dom lucide-react jspdf html2canvas
3. Configure Tailwind CSS
4. Create src/lib/supabase.js with client config
5. Create src/lib/scoring.js with the full scoring engine
6. Create src/lib/questions.js with all 120 questions
7. Build all pages as described above

## Design Requirements
- Clean, professional design
- Red (#B40000) primary color
- Mobile responsive
- Landing page should have a preview radar chart with sample scores
- Assessment should show section progress (e.g. "Section 2 of 6 - Personality")
- Results page: prominent composite score, radar chart, 6 domain cards with band badges
- Use Tailwind classes throughout

## Key UX Rules
- Guest mode: allow completing assessment WITHOUT login
- After completing assessment → prompt "Save your results" → Supabase auth email signup
- 90-day re-evaluation CTA visible on dashboard
- Share button on results page (copy link)
- Results page shareable via URL parameter

When completely finished, run this command to notify:
openclaw system event --text "Done: Think Big React app built - ready for review" --mode now
