export interface TrainingScenario {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'scenario' | 'practice' | 'roleplay' | 'assessment';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  question: string;
  context?: string;
  options?: string[];
  correctAnswer?: number;
  feedback: {
    correct: string;
    incorrect: string;
  };
  tips?: string[];
  hint?: string;
  followUp?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  points: number;
  tags: string[];
  timeLimit?: number;
  prerequisites?: string[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  scenarios: TrainingScenario[];
  category: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites?: string[];
  learningObjectives: string[];
  skillsAssessed: string[];
}

export const trainingModules: Record<string, TrainingModule> = {
  'question-mastery': {
    id: 'question-mastery',
    title: 'Advanced Question Mastery',
    description: 'Master the art of asking powerful, insightful questions that reveal true candidate potential',
    category: 'Core Skills',
    estimatedTime: 90,
    difficulty: 'intermediate',
    learningObjectives: [
      'Craft behavioral questions using STAR methodology',
      'Ask follow-up questions that dig deeper',
      'Avoid leading or biased questions',
      'Adapt questioning style to candidate personality'
    ],
    skillsAssessed: ['questioning', 'active-listening', 'adaptability'],
    scenarios: [
      {
        id: 'behavioral-star-1',
        title: 'STAR Method Implementation',
        description: 'Practice structuring behavioral questions using the STAR methodology',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        context: 'You\'re interviewing a senior developer for a team lead position. They mentioned having experience with conflict resolution.',
        question: 'Which follow-up question best uses the STAR method to explore their conflict resolution skills?',
        options: [
          'Can you tell me about a time you resolved a conflict? What was the situation, what did you do, and what happened?',
          'Tell me about a specific situation where you had to resolve a team conflict. What was your role, what actions did you take, and what was the outcome?',
          'How do you usually handle conflicts in your team?',
          'What\'s the most difficult conflict you\'ve resolved and how did you do it?'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This question clearly prompts for Situation, Task, Action, and Result, while being specific about the context.',
          incorrect: 'This question lacks the specific structure that helps candidates provide complete STAR responses. Try prompting for each element explicitly.'
        },
        hint: 'Look for the option that explicitly guides the candidate through each element of STAR: Situation, Task, Action, and Result.',
        tips: [
          'Always prompt for specific examples rather than general approaches',
          'Guide candidates through each STAR element if they miss any',
          'Follow up on vague responses with "Can you be more specific about..."'
        ],
        points: 15,
        tags: ['behavioral', 'star-method', 'leadership'],
        timeLimit: 90
      },
      {
        id: 'probing-questions-1',
        title: 'Effective Probing Techniques',
        description: 'Learn when and how to dig deeper with follow-up questions',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'A candidate just said: "I improved the team\'s productivity by implementing better processes." This is quite vague.',
        question: 'What\'s your best follow-up question to get specific, actionable details?',
        options: [
          'That sounds great! What kind of processes did you implement?',
          'Can you walk me through exactly what these processes were and how you measured the productivity improvement?',
          'How much did productivity improve?',
          'What was the team\'s reaction to these changes?'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This question asks for both specific details and measurable outcomes, which are crucial for evaluation.',
          incorrect: 'While this touches on important aspects, it doesn\'t probe for both the specific actions taken AND the measurable impact.'
        },
        hint: 'The best follow-up should ask for both the specific actions taken AND measurable results.',
        followUp: {
          question: 'The candidate provides good details but seems nervous. How do you help them feel more comfortable while maintaining interview rigor?',
          options: [
            'Acknowledge their nervousness and take a break',
            'Say "You\'re doing great, these details are exactly what I\'m looking for. Can you tell me more about..."',
            'Move to easier questions',
            'Ignore the nervousness and continue with hard questions'
          ],
          correctAnswer: 1
        },
        tips: [
          'Always probe for measurable outcomes when candidates mention improvements',
          'Use phrases like "walk me through" to encourage detailed responses',
          'Acknowledge good answers to build candidate confidence'
        ],
        points: 20,
        tags: ['probing', 'measurement', 'candidate-comfort'],
        timeLimit: 120
      },
      {
        id: 'bias-avoidance-1',
        title: 'Eliminating Question Bias',
        description: 'Identify and avoid questions that reveal your preferred answers',
        type: 'assessment',
        difficulty: 'advanced',
        context: 'You\'re interviewing for a role that requires someone who can work independently. You want to assess this skill.',
        question: 'Which question is MOST likely to lead the candidate toward your preferred answer?',
        options: [
          'Tell me about a time you had to work with minimal supervision.',
          'How do you handle situations where you don\'t have clear direction from your manager?',
          'We need someone who can work independently here. Can you give an example of when you\'ve done that successfully?',
          'Describe your ideal level of management oversight.'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Correct! This question literally tells the candidate what you want to hear before asking for an example.',
          incorrect: 'While this question has some issues, option C is the most leading because it explicitly states what you\'re looking for.'
        },
        hint: 'Look for the question that reveals what you want to hear before asking the example.',
        tips: [
          'Never reveal what you\'re looking for before asking the question',
          'Use neutral language that doesn\'t suggest a preferred answer',
          'Ask about experiences first, then probe for specific skills'
        ],
        points: 25,
        tags: ['bias-avoidance', 'independence', 'neutral-questioning'],
        timeLimit: 90
      },
      {
        id: 'technical-depth-1',
        title: 'Technical Question Depth',
        description: 'Learn to ask technical questions that reveal true understanding',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        context: 'A software engineer candidate mentions they "know React well" on their resume.',
        question: 'Which follow-up question best assesses their actual React knowledge depth?',
        options: [
          'How long have you been using React?',
          'What do you like most about React?',
          'Can you explain the difference between controlled and uncontrolled components, and when you\'d use each?',
          'What React projects have you worked on?'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This question tests specific technical knowledge and practical application understanding.',
          incorrect: 'This question doesn\'t effectively test their technical depth or practical understanding of React concepts.'
        },
        hint: 'Look for questions that test specific technical concepts rather than general experience.',
        tips: [
          'Ask about specific concepts, not just experience duration',
          'Include "when would you use" scenarios to test practical application',
          'Follow up vague answers with concrete examples'
        ],
        points: 20,
        tags: ['technical', 'react', 'depth-assessment'],
        timeLimit: 75
      },
      {
        id: 'cultural-fit-1',
        title: 'Cultural Fit Assessment',
        description: 'Ask questions that reveal cultural alignment without bias',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'Your company values collaboration and transparency. You want to assess if a candidate shares these values.',
        question: 'Which approach best evaluates cultural fit while avoiding bias?',
        options: [
          'Ask directly: "Do you value collaboration and transparency?"',
          'Present a scenario: "Describe a time when you had to share difficult news with your team. How did you approach it?"',
          'Ask: "What kind of work environment do you thrive in?"',
          'Say: "We value collaboration here. Can you give an example of when you\'ve collaborated effectively?"'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This scenario-based approach reveals actual behavior that demonstrates your values without telegraphing what you want to hear.',
          incorrect: 'This approach either reveals your preferred answer or doesn\'t effectively test the specific behaviors that demonstrate cultural fit.'
        },
        hint: 'Use scenarios that would naturally reveal the behaviors you\'re looking for.',
        tips: [
          'Create scenarios that naturally reveal cultural behaviors',
          'Avoid revealing your company values before asking questions',
          'Look for stories that show alignment through actions, not words'
        ],
        points: 25,
        tags: ['cultural-fit', 'scenario-based', 'behavioral'],
        timeLimit: 120
      },
      {
        id: 'weakness-exploration-1',
        title: 'Exploring Weaknesses Effectively',
        description: 'Learn to uncover genuine development areas',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        context: 'A candidate gives the classic answer: "My weakness is that I\'m a perfectionist."',
        question: 'What\'s your best follow-up to get a more honest, useful response?',
        options: [
          '"That\'s actually a strength! What\'s a real weakness?"',
          '"Can you give me a specific example of when perfectionism negatively impacted your work or team?"',
          '"What are you doing to improve on that?"',
          '"What would your previous manager say is an area you could improve?"'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This forces them to provide concrete evidence and shows the real impact of their supposed weakness.',
          incorrect: 'While this might get additional information, it doesn\'t effectively challenge the superficial answer or get to genuine development areas.'
        },
        hint: 'Look for the response that requires concrete evidence of the weakness\'s impact.',
        tips: [
          'Always ask for specific examples when candidates give generic weaknesses',
          'Look for evidence of self-awareness and growth mindset',
          'Challenge answers that sound rehearsed or too positive'
        ],
        points: 20,
        tags: ['weakness-assessment', 'self-awareness', 'development'],
        timeLimit: 90
      },
      {
        id: 'pressure-handling-1',
        title: 'Assessing Pressure Handling',
        description: 'Evaluate how candidates perform under stress',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'You want to understand how a candidate handles pressure and tight deadlines.',
        question: 'Which questioning approach best reveals their pressure-handling abilities?',
        options: [
          '"How do you handle stress and pressure?"',
          '"Tell me about a time when you had multiple urgent deadlines. Walk me through how you prioritized and what the outcomes were."',
          '"Do you work well under pressure?"',
          '"What\'s the most stressful situation you\'ve been in at work?"'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This gets specific examples of their decision-making process and actual results under pressure.',
          incorrect: 'This question is too general and won\'t reveal their actual thought process or effectiveness under pressure.'
        },
        hint: 'Focus on getting specific examples that show their decision-making process under pressure.',
        tips: [
          'Ask for specific examples of high-pressure situations',
          'Probe for their thought process and prioritization methods',
          'Look for evidence of maintaining quality under pressure'
        ],
        points: 25,
        tags: ['pressure-handling', 'prioritization', 'decision-making'],
        timeLimit: 120
      },
      {
        id: 'leadership-assessment-1',
        title: 'Leadership Potential Evaluation',
        description: 'Assess leadership capabilities in non-managers',
        type: 'scenario',
        difficulty: 'intermediate',
        context: 'You\'re interviewing an individual contributor for a role that may involve future leadership opportunities.',
        question: 'Which question best assesses leadership potential without requiring management experience?',
        options: [
          '"Do you see yourself as a leader?"',
          '"Tell me about a time you influenced others to achieve a goal when you had no formal authority."',
          '"How would you handle managing people?"',
          '"What\'s your leadership style?"'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This reveals actual leadership behaviors like influence, initiative, and goal achievement without requiring formal management experience.',
          incorrect: 'This question either requires management experience they may not have or asks for theoretical responses rather than demonstrated behavior.'
        },
        hint: 'Look for questions that reveal leadership behaviors that don\'t require formal authority.',
        tips: [
          'Focus on influence and initiative rather than formal management',
          'Look for examples of taking ownership beyond their job description',
          'Assess their ability to motivate and guide others informally'
        ],
        points: 20,
        tags: ['leadership', 'influence', 'potential'],
        timeLimit: 100
      },
      {
        id: 'innovation-thinking-1',
        title: 'Creative Problem-Solving Assessment',
        description: 'Evaluate innovative thinking and problem-solving approaches',
        type: 'multiple-choice',
        difficulty: 'advanced',
        context: 'You want to assess a candidate\'s ability to think creatively and solve complex problems.',
        question: 'Which approach best evaluates innovative thinking?',
        options: [
          '"Are you a creative person?"',
          '"Describe a time when you had to solve a problem that had no obvious solution. What was your approach?"',
          '"How do you come up with new ideas?"',
          '"What\'s the most innovative thing you\'ve done?"'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This reveals their actual problem-solving methodology and creative thinking process through a specific example.',
          incorrect: 'This question is too general and won\'t reveal their actual creative problem-solving process or methodology.'
        },
        hint: 'Look for questions that reveal their problem-solving methodology through specific examples.',
        tips: [
          'Ask for specific examples of creative problem-solving',
          'Probe for their thought process and methodology',
          'Look for evidence of considering multiple solutions'
        ],
        points: 25,
        tags: ['innovation', 'problem-solving', 'creativity'],
        timeLimit: 150
      },
      {
        id: 'communication-assessment-1',
        title: 'Communication Skills Evaluation',
        description: 'Assess both verbal and written communication abilities',
        type: 'assessment',
        difficulty: 'intermediate',
        context: 'The role requires excellent communication with both technical and non-technical stakeholders.',
        question: 'Which question best assesses their ability to communicate complex ideas simply?',
        options: [
          '"Are you good at explaining complex concepts?"',
          '"Explain a complex technical concept you\'ve worked with to someone who has no technical background."',
          '"How do you communicate with non-technical people?"',
          '"Give me an example of when you had to present technical information."'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This directly tests their ability to simplify complex information in real-time.',
          incorrect: 'While this might provide some insight, it doesn\'t directly test their communication ability in the moment.'
        },
        hint: 'Look for the option that actually tests their communication skill during the interview.',
        tips: [
          'Have them demonstrate communication skills during the interview',
          'Ask them to explain complex concepts simply',
          'Observe their ability to adapt their communication style'
        ],
        points: 20,
        tags: ['communication', 'technical-explanation', 'stakeholder-management'],
        timeLimit: 120
      }
    ]
  },
  'bias-detection': {
    id: 'bias-detection',
    title: 'Advanced Bias Detection & Mitigation',
    description: 'Develop sophisticated awareness of unconscious bias and learn evidence-based mitigation strategies',
    category: 'Bias & Fairness',
    estimatedTime: 80,
    difficulty: 'advanced',
    learningObjectives: [
      'Recognize 12+ types of unconscious bias in interview settings',
      'Implement structured evaluation techniques',
      'Use bias interruption strategies in real-time',
      'Design bias-resistant interview processes'
    ],
    skillsAssessed: ['bias-awareness', 'structured-evaluation', 'fairness'],
    scenarios: [
      {
        id: 'halo-effect-1',
        title: 'Recognizing Halo Effect',
        description: 'Learn to identify when one positive trait influences your entire assessment',
        type: 'roleplay',
        difficulty: 'intermediate',
        context: 'You\'ve just finished interviewing two candidates. Candidate A went to your alma mater and gave an excellent answer to your first question. Candidate B went to a less prestigious school but gave consistently good answers throughout.',
        question: 'You find yourself leaning toward Candidate A. What bias might be affecting your judgment?',
        options: [
          'Confirmation bias - you\'re looking for reasons to hire them',
          'Halo effect - their strong first impression and shared background are influencing your overall assessment',
          'Recency bias - you remember their answers better',
          'Affinity bias - you like people similar to yourself'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Exactly! The halo effect occurs when one positive trait (great first answer + shared school) creates an overall positive impression that overshadows objective evaluation.',
          incorrect: 'While multiple biases could be at play, the halo effect specifically describes how one strong positive impression influences your entire assessment.'
        },
        hint: 'Think about how one strong positive impression can influence your overall judgment of a person.',
        followUp: {
          question: 'What\'s the best strategy to counteract this bias right now?',
          options: [
            'Trust your gut feeling about Candidate A',
            'Review your notes and score each competency area separately for both candidates',
            'Interview more candidates to get a better comparison',
            'Ask a colleague what they think'
          ],
          correctAnswer: 1
        },
        tips: [
          'Score each competency area immediately after discussing it',
          'Use structured evaluation rubrics to maintain objectivity',
          'Be especially careful when candidates share your background'
        ],
        points: 20,
        tags: ['halo-effect', 'structured-evaluation', 'alma-mater-bias'],
        timeLimit: 150
      },
      {
        id: 'attribution-bias-1',
        title: 'Attribution Bias in Performance Evaluation',
        description: 'Understand how we attribute candidate successes and failures',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'A candidate mentions they led a project that failed to meet its deadline. They explain it was due to unexpected technical challenges and changing requirements from stakeholders.',
        question: 'How should you evaluate this information to avoid attribution bias?',
        options: [
          'Focus on how they handled the challenges rather than the outcome',
          'Consider this a red flag - good leaders deliver on time',
          'Ask what they would do differently next time',
          'Probe for both external factors and their specific contributions to the delay'
        ],
        correctAnswer: 3,
        feedback: {
          correct: 'Perfect! This approach avoids fundamental attribution error by exploring both situational factors and personal accountability.',
          incorrect: 'This approach may lead to attribution bias by either over-focusing on external factors or over-attributing the failure to personal shortcomings.'
        },
        hint: 'Consider both situational factors and personal responsibility when evaluating performance.',
        tips: [
          'Always explore both situational and personal factors in failure scenarios',
          'Ask "What was within your control?" and "What was outside your control?"',
          'Look for evidence of learning and adaptation, not just outcomes'
        ],
        points: 25,
        tags: ['attribution-bias', 'failure-analysis', 'accountability'],
        timeLimit: 120
      },
      {
        id: 'confirmation-bias-1',
        title: 'Overcoming Confirmation Bias',
        description: 'Learn to seek disconfirming evidence in your evaluations',
        type: 'multiple-choice',
        difficulty: 'advanced',
        context: 'You have a strong positive first impression of a candidate and find yourself asking questions that confirm your positive view.',
        question: 'What\'s the best strategy to counteract confirmation bias?',
        options: [
          'Trust your instincts - first impressions are usually accurate',
          'Deliberately ask questions designed to uncover potential weaknesses or gaps',
          'Ask neutral questions and let the candidate guide the conversation',
          'Focus only on technical skills to avoid personality bias'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! Actively seeking disconfirming evidence helps you maintain objectivity and get a complete picture.',
          incorrect: 'This approach doesn\'t effectively counter confirmation bias and may lead to incomplete or skewed evaluation.'
        },
        hint: 'Think about actively seeking information that might contradict your initial impression.',
        tips: [
          'Deliberately ask questions that could reveal weaknesses',
          'Prepare challenging scenarios that test areas of concern',
          'Ask yourself "What evidence would change my mind?"'
        ],
        points: 25,
        tags: ['confirmation-bias', 'disconfirming-evidence', 'objectivity'],
        timeLimit: 120
      },
      {
        id: 'anchoring-bias-1',
        title: 'Avoiding Anchoring Bias',
        description: 'Recognize how first information influences subsequent judgments',
        type: 'scenario',
        difficulty: 'intermediate',
        context: 'You notice the candidate\'s current salary is much lower than your budget. This information is affecting how you view their responses.',
        question: 'How does anchoring bias manifest in this situation?',
        options: [
          'You assume they must not be very skilled because of their low salary',
          'You think they\'ll be grateful for any offer',
          'You expect them to accept a lower offer than planned',
          'All of the above'
        ],
        correctAnswer: 3,
        feedback: {
          correct: 'Correct! Anchoring bias can manifest in multiple ways, affecting your assessment of their skills, expectations, and negotiation approach.',
          incorrect: 'While this is one way anchoring bias can manifest, it\'s not the only way the salary information might influence your judgment.'
        },
        hint: 'Consider all the ways that salary information might influence your thinking about this candidate.',
        tips: [
          'Evaluate skills independently of current compensation',
          'Don\'t assume salary reflects capability or market value',
          'Make offers based on role value, not candidate\'s current situation'
        ],
        points: 20,
        tags: ['anchoring-bias', 'salary-bias', 'fair-evaluation'],
        timeLimit: 90
      },
      {
        id: 'recency-bias-1',
        title: 'Managing Recency Bias',
        description: 'Learn how recent information disproportionately influences decisions',
        type: 'assessment',
        difficulty: 'intermediate',
        context: 'You interviewed 5 candidates this week. The last candidate had a great closing question and left a strong final impression.',
        question: 'What\'s the best way to minimize recency bias in your evaluation?',
        options: [
          'Make decisions quickly while the last interview is fresh',
          'Review detailed notes from all candidates before making any decisions',
          'Weight the closing moments more heavily since they show motivation',
          'Trust your immediate reaction to each candidate'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! Reviewing structured notes helps you evaluate all candidates fairly rather than being swayed by what happened most recently.',
          incorrect: 'This approach may amplify recency bias by giving too much weight to recent information or immediate impressions.'
        },
        hint: 'Think about how to give equal consideration to all the information you gathered, not just the most recent.',
        tips: [
          'Take detailed notes during each interview',
          'Use structured evaluation forms',
          'Review all candidates together before making decisions'
        ],
        points: 20,
        tags: ['recency-bias', 'structured-evaluation', 'note-taking'],
        timeLimit: 100
      },
      {
        id: 'stereotyping-bias-1',
        title: 'Recognizing Stereotyping',
        description: 'Identify and counter unconscious stereotypes',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'You\'re interviewing candidates for a leadership role. You notice you\'re asking different types of questions to male and female candidates.',
        question: 'Which scenario most likely indicates gender stereotyping in your questioning?',
        options: [
          'Asking female candidates more about work-life balance',
          'Asking male candidates more technical questions',
          'Asking female candidates how they handle difficult team members',
          'All of the above could indicate stereotyping'
        ],
        correctAnswer: 3,
        feedback: {
          correct: 'Exactly! All of these could reflect unconscious stereotypes about gender roles and capabilities.',
          incorrect: 'While this could indicate stereotyping, it\'s not the only example. Multiple patterns could reveal unconscious bias.'
        },
        hint: 'Consider whether you\'re making assumptions about capabilities or concerns based on gender.',
        tips: [
          'Use the same core questions for all candidates',
          'Be aware of assumptions about different groups',
          'Focus on job-relevant competencies for everyone'
        ],
        points: 25,
        tags: ['stereotyping', 'gender-bias', 'consistent-questioning'],
        timeLimit: 150
      },
      {
        id: 'beauty-bias-1',
        title: 'Physical Appearance Bias',
        description: 'Recognize how appearance affects evaluation',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        context: 'You notice you consistently rate more attractive candidates higher on "cultural fit" even when their answers are similar to others.',
        question: 'What\'s the best strategy to counter appearance bias?',
        options: [
          'Conduct phone interviews first',
          'Focus only on technical skills',
          'Use structured interviews with specific criteria',
          'Have multiple interviewers to balance perspectives'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! Structured interviews with specific, job-relevant criteria help you focus on what actually matters for performance.',
          incorrect: 'While this might help somewhat, structured evaluation criteria is the most effective way to counter appearance bias.'
        },
        hint: 'Think about what approach most directly addresses the tendency to be influenced by appearance.',
        tips: [
          'Define specific criteria for cultural fit',
          'Use behavioral examples rather than impressions',
          'Focus on job-relevant competencies'
        ],
        points: 20,
        tags: ['appearance-bias', 'structured-interviews', 'cultural-fit'],
        timeLimit: 90
      },
      {
        id: 'contrast-effect-1',
        title: 'Avoiding Contrast Effect',
        description: 'Learn how previous candidates influence current evaluations',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'You just interviewed an exceptional candidate. The next candidate seems mediocre in comparison, even though they meet all job requirements.',
        question: 'How should you handle this contrast effect?',
        options: [
          'Trust your comparative judgment - the second candidate is clearly weaker',
          'Evaluate the current candidate against job requirements, not the previous candidate',
          'Take a break between interviews to reset your perspective',
          'Interview more candidates to get a better comparison baseline'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! Each candidate should be evaluated against job requirements and success criteria, not against other candidates.',
          incorrect: 'While this might help somewhat, the key is to evaluate each candidate against objective job requirements, not relative comparisons.'
        },
        hint: 'Think about what standard each candidate should be measured against.',
        tips: [
          'Evaluate each candidate against job requirements',
          'Use consistent scoring rubrics',
          'Take notes immediately after each interview'
        ],
        points: 25,
        tags: ['contrast-effect', 'objective-evaluation', 'job-requirements'],
        timeLimit: 120
      },
      {
        id: 'name-bias-1',
        title: 'Name and Background Bias',
        description: 'Recognize bias based on names and backgrounds',
        type: 'assessment',
        difficulty: 'advanced',
        context: 'Research shows resumes with certain names get fewer callbacks. You want to ensure your process is fair.',
        question: 'What\'s the most effective way to minimize name bias in your hiring process?',
        options: [
          'Be extra conscious of name bias when reviewing resumes',
          'Implement blind resume reviews where names are removed',
          'Ensure diverse interview panels',
          'Focus on skills and experience sections only'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! Blind resume reviews remove the opportunity for name bias to influence initial screening decisions.',
          incorrect: 'While this approach has merit, systematic removal of identifying information is more effective than relying on conscious bias awareness.'
        },
        hint: 'Think about which approach most completely eliminates the opportunity for name bias to occur.',
        tips: [
          'Use structured resume review processes',
          'Focus on skills and achievements',
          'Implement systematic bias reduction techniques'
        ],
        points: 25,
        tags: ['name-bias', 'blind-review', 'systematic-fairness'],
        timeLimit: 120
      },
      {
        id: 'age-bias-1',
        title: 'Age-Related Bias Recognition',
        description: 'Identify and counter age-based assumptions',
        type: 'roleplay',
        difficulty: 'intermediate',
        context: 'You\'re interviewing candidates of different ages for a tech role. You notice different assumptions creeping into your evaluations.',
        question: 'Which assumption most likely indicates age bias?',
        options: [
          'Assuming older candidates are less adaptable to new technologies',
          'Assuming younger candidates lack experience',
          'Assuming mid-career candidates are more stable',
          'All of these assumptions could indicate age bias'
        ],
        correctAnswer: 3,
        feedback: {
          correct: 'Correct! All of these are age-based assumptions that should be evaluated through specific examples and evidence, not assumptions.',
          incorrect: 'While this could indicate age bias, it\'s not the only assumption that could affect fair evaluation based on age.'
        },
        hint: 'Consider whether any age-based assumptions might affect fair evaluation.',
        tips: [
          'Evaluate adaptability through specific examples',
          'Assess experience based on actual accomplishments',
          'Focus on individual capabilities, not age-based stereotypes'
        ],
        points: 20,
        tags: ['age-bias', 'adaptability', 'experience-assessment'],
        timeLimit: 110
      }
    ]
  },
  'difficult-candidate': {
    id: 'difficult-candidate',
    title: 'Mastering Difficult Candidate Scenarios',
    description: 'Advanced techniques for handling challenging candidate behaviors while maintaining professionalism and gathering accurate assessments',
    category: 'Advanced Techniques',
    estimatedTime: 100,
    difficulty: 'expert',
    prerequisites: ['question-mastery', 'bias-detection'],
    learningObjectives: [
      'De-escalate tense interview situations',
      'Maintain assessment accuracy with difficult personalities',
      'Adapt communication styles to candidate needs',
      'Handle inappropriate candidate behavior professionally'
    ],
    skillsAssessed: ['conflict-resolution', 'adaptability', 'emotional-intelligence', 'professionalism'],
    scenarios: [
      {
        id: 'overconfident-candidate-1',
        title: 'The Overconfident Expert',
        description: 'Handle candidates who dismiss your questions or claim superiority',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'A senior candidate interrupts your technical question, saying "That\'s a junior-level question. I\'ve been doing this for 15 years. Do you have anything more challenging?" Their tone is dismissive.',
        question: 'What\'s your best response to maintain control while respecting their experience?',
        options: [
          '"I understand you have extensive experience. This question helps me understand your problem-solving approach. Could you walk me through how you\'d handle this scenario?"',
          '"These are the questions I ask everyone. Please just answer what I\'ve asked."',
          '"You\'re right, let me ask you something harder." Then skip to advanced questions.',
          '"I appreciate your experience. However, how you approach fundamental concepts tells me a lot about how you\'d mentor junior developers."'
        ],
        correctAnswer: 3,
        feedback: {
          correct: 'Excellent! This reframes the question\'s purpose, acknowledges their experience, and maintains your interview structure.',
          incorrect: 'While this shows some respect for their experience, it doesn\'t effectively reframe why the question is valuable or maintain interview control.'
        },
        hint: 'Look for a response that reframes the question\'s value while acknowledging their experience.',
        followUp: {
          question: 'They respond well to your reframing. How do you continue to assess their collaborative skills?',
          options: [
            'Ask directly: "How do you work with less experienced team members?"',
            'Present a scenario: "Imagine a junior developer on your team is struggling with a concept you find basic. Walk me through how you\'d help them."',
            'Ask about their management style',
            'Move on to technical questions'
          ],
          correctAnswer: 1
        },
        tips: [
          'Reframe questions in terms of leadership and mentoring for senior candidates',
          'Use their experience as a reason why your questions are valuable',
          'Stay calm and professional even when candidates are dismissive'
        ],
        points: 30,
        tags: ['overconfidence', 'senior-candidates', 'reframing', 'leadership-assessment'],
        timeLimit: 180
      },
      {
        id: 'nervous-candidate-1',
        title: 'The Extremely Nervous Candidate',
        description: 'Help anxious candidates perform their best while still evaluating accurately',
        type: 'scenario',
        difficulty: 'intermediate',
        context: 'A candidate is visibly shaking, stumbling over words, and giving very short answers despite having strong qualifications on paper.',
        question: 'What\'s your best approach to help them while maintaining evaluation standards?',
        options: [
          'Tell them to relax and that interviews aren\'t that scary',
          'Offer water, acknowledge that interviews can be stressful, and start with easier questions to build confidence',
          'Continue with your planned questions - their anxiety might reveal how they handle pressure',
          'End the interview early and suggest they reapply when they\'re more prepared'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach shows empathy while creating conditions for them to demonstrate their actual capabilities.',
          incorrect: 'This approach either dismisses their anxiety, unfairly evaluates them under extreme stress, or doesn\'t give them a fair chance to demonstrate their abilities.'
        },
        hint: 'Think about how to create the best conditions for evaluating their actual capabilities.',
        tips: [
          'Acknowledge anxiety without making it a bigger deal',
          'Start with questions they\'re likely to succeed at',
          'Give them time to settle in before harder questions'
        ],
        points: 25,
        tags: ['anxiety-management', 'candidate-comfort', 'fair-evaluation'],
        timeLimit: 150
      },
      {
        id: 'argumentative-candidate-1',
        title: 'The Argumentative Candidate',
        description: 'Handle candidates who challenge your questions or argue with your assessments',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'A candidate disagrees with your technical question, saying "That\'s not how it works in the real world" and begins arguing about the premise.',
        question: 'How do you handle this while maintaining interview control?',
        options: [
          '"Let\'s agree to disagree and move on to the next question."',
          '"I understand you have experience with this. Can you walk me through how you\'d approach it in your preferred way?"',
          '"This is how we do it here, so please answer the question as asked."',
          '"You might be right, but for this role, we need someone who can work within our established frameworks."'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This acknowledges their perspective while redirecting them to demonstrate their knowledge and approach.',
          incorrect: 'This approach either shuts down dialogue, creates conflict, or doesn\'t effectively gather the information you need for evaluation.'
        },
        hint: 'Look for the response that redirects their argumentative energy into demonstrating their knowledge.',
        tips: [
          'Acknowledge their perspective without agreeing or disagreeing',
          'Redirect arguments into opportunities to show knowledge',
          'Stay curious about their reasoning rather than defensive'
        ],
        points: 30,
        tags: ['argumentative-behavior', 'conflict-management', 'redirection'],
        timeLimit: 180
      },
      {
        id: 'unprepared-candidate-1',
        title: 'The Completely Unprepared Candidate',
        description: 'Handle candidates who clearly haven\'t prepared or researched the role',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        context: 'A candidate admits they don\'t know what the company does and haven\'t looked at the job description since applying.',
        question: 'What\'s your best approach to this situation?',
        options: [
          'End the interview immediately - they\'re clearly not interested',
          'Spend time explaining the role and company, then continue with assessment',
          'Ask why they applied and what interests them about the role, then decide how to proceed',
          'Continue with standard questions to see their raw potential'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Good approach! Understanding their motivation helps you determine if this is disinterest or circumstances (like a recruiter submission).',
          incorrect: 'This approach either wastes your time, makes unfair assumptions, or doesn\'t gather enough information to make a fair assessment.'
        },
        hint: 'Try to understand their motivation before deciding how to proceed.',
        tips: [
          'Understand why they\'re there before making judgments',
          'Some great candidates apply through recruiters without full context',
          'Focus on potential and interest, not just preparation'
        ],
        points: 20,
        tags: ['unprepared-candidate', 'motivation-assessment', 'fair-evaluation'],
        timeLimit: 120
      },
      {
        id: 'oversharing-candidate-1',
        title: 'The Oversharing Candidate',
        description: 'Handle candidates who share inappropriate personal information',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'A candidate begins sharing very personal details about their divorce, financial struggles, and health issues when answering a simple question about their career goals.',
        question: 'How do you professionally redirect this conversation?',
        options: [
          'Listen politely and wait for them to finish',
          '"I appreciate you sharing this with me. Let\'s focus on your professional experiences and goals for this role."',
          '"That sounds challenging. How did it affect your work performance?"',
          'Interrupt immediately: "Let\'s keep this professional."'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This shows empathy while professionally redirecting to job-relevant topics.',
          incorrect: 'This approach either encourages more oversharing, could lead to discrimination issues, or is too abrupt and potentially hurtful.'
        },
        hint: 'Look for a response that\'s kind but clearly redirects to professional topics.',
        tips: [
          'Acknowledge their sharing without encouraging more',
          'Redirect firmly but kindly to professional topics',
          'Don\'t probe into personal details that could affect hiring decisions'
        ],
        points: 25,
        tags: ['oversharing', 'professional-boundaries', 'redirection'],
        timeLimit: 150
      },
      {
        id: 'dishonest-candidate-1',
        title: 'Suspected Dishonesty',
        description: 'Handle situations where you suspect a candidate is being dishonest',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A candidate\'s answers about their previous role don\'t align with what\'s on their resume, and their technical knowledge seems inconsistent with their claimed experience.',
        question: 'What\'s your best approach to investigate this professionally?',
        options: [
          'Confront them directly about the inconsistencies',
          'Ask increasingly detailed follow-up questions about their claimed experience',
          'Note the concerns and verify with references later',
          'Give them a practical test to verify their technical skills'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! Detailed follow-ups allow honest candidates to clarify while making it difficult for dishonest ones to maintain false claims.',
          incorrect: 'While this approach has merit, detailed questioning during the interview is more effective for gathering accurate information.'
        },
        hint: 'Think about what approach best reveals the truth during the interview itself.',
        tips: [
          'Ask for specific examples and details',
          'Probe deeper when answers seem vague or inconsistent',
          'Use follow-up questions to verify claimed experience'
        ],
        points: 30,
        tags: ['dishonesty', 'verification', 'detailed-questioning'],
        timeLimit: 180
      },
      {
        id: 'inappropriate-questions-1',
        title: 'Candidate Asks Inappropriate Questions',
        description: 'Handle when candidates ask inappropriate or illegal questions',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'During the "questions for us" portion, a candidate asks about the demographics of your team and whether you hire many people "like them."',
        question: 'How do you handle this appropriately?',
        options: [
          'Answer their question directly to be transparent',
          '"I can\'t discuss team demographics, but I can tell you about our inclusive culture and diversity initiatives."',
          '"That\'s not an appropriate question to ask."',
          'Redirect: "What aspects of team culture are most important to you?"'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This sets appropriate boundaries while redirecting to information you can share about your inclusive environment.',
          incorrect: 'This approach either shares inappropriate information, is too blunt, or doesn\'t address their underlying concerns about inclusion.'
        },
        hint: 'Look for a response that sets boundaries while addressing their likely underlying concerns.',
        tips: [
          'Set clear boundaries about what you can discuss',
          'Redirect to information about inclusive culture',
          'Address underlying concerns about belonging professionally'
        ],
        points: 25,
        tags: ['inappropriate-questions', 'boundaries', 'inclusion'],
        timeLimit: 150
      },
      {
        id: 'time-management-difficult-1',
        title: 'The Rambling Candidate',
        description: 'Manage candidates who give extremely long, unfocused answers',
        type: 'multiple-choice',
        difficulty: 'intermediate',
        context: 'A candidate has been answering a simple question about their background for 10 minutes with no sign of stopping, covering irrelevant details.',
        question: 'What\'s your best approach to regain control of the time?',
        options: [
          'Let them finish to be polite, then rush through remaining questions',
          'Interrupt: "That\'s great detail. Let me ask you specifically about..."',
          'Point to your watch and say you need to move on',
          'Wait for a breath and say: "Thank you for that context. I\'d like to focus on..." and ask a specific follow-up'
        ],
        correctAnswer: 3,
        feedback: {
          correct: 'Excellent! This politely acknowledges their answer while redirecting to specific information you need.',
          incorrect: 'This approach either wastes valuable interview time, is too abrupt, or doesn\'t effectively redirect the conversation.'
        },
        hint: 'Look for the approach that\'s polite but effectively redirects to specific information.',
        tips: [
          'Acknowledge their input before redirecting',
          'Ask specific follow-up questions to focus their answers',
          'Manage time professionally without being rude'
        ],
        points: 20,
        tags: ['time-management', 'rambling', 'interview-control'],
        timeLimit: 120
      },
      {
        id: 'hostile-candidate-1',
        title: 'Dealing with Hostility',
        description: 'Handle candidates who become hostile or aggressive',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A candidate becomes hostile when you ask about a gap in their employment, accusing you of discrimination and raising their voice.',
        question: 'What\'s your immediate priority in this situation?',
        options: [
          'Defend yourself and explain that the question is standard',
          'Remain calm, acknowledge their concern, and explain that you ask all candidates about their timeline',
          'End the interview immediately',
          'Ask them to calm down and continue'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! Staying calm and explaining your standard process helps de-escalate while maintaining professionalism.',
          incorrect: 'This approach either escalates the conflict, might be premature, or doesn\'t address their concern about discrimination.'
        },
        hint: 'Focus on de-escalation while explaining your standard, fair process.',
        tips: [
          'Stay calm and speak in a measured tone',
          'Acknowledge their concern without admitting wrongdoing',
          'Explain your standard process applies to all candidates'
        ],
        points: 30,
        tags: ['hostility', 'de-escalation', 'professionalism'],
        timeLimit: 180
      },
      {
        id: 'celebrity-candidate-1',
        title: 'The "Celebrity" Candidate',
        description: 'Handle well-known candidates or those with impressive backgrounds who expect special treatment',
        type: 'assessment',
        difficulty: 'advanced',
        context: 'You\'re interviewing someone with a very impressive background who clearly expects the interview to be a formality and seems surprised by your thorough questions.',
        question: 'How do you ensure fair evaluation while respecting their accomplishments?',
        options: [
          'Acknowledge their impressive background and ask easier questions',
          'Treat them exactly like any other candidate with no special acknowledgment',
          'Acknowledge their achievements briefly, then explain that you ask everyone the same thorough questions to ensure the best fit',
          'Focus mainly on cultural fit since their skills are obviously strong'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This shows respect for their achievements while maintaining your evaluation standards and process fairness.',
          incorrect: 'This approach either compromises your evaluation standards or fails to acknowledge their legitimate accomplishments appropriately.'
        },
        hint: 'Look for the approach that balances respect with consistent evaluation standards.',
        tips: [
          'Acknowledge achievements without lowering standards',
          'Explain that thorough evaluation ensures good mutual fit',
          'Maintain consistent process regardless of candidate profile'
        ],
        points: 25,
        tags: ['high-profile-candidate', 'consistent-standards', 'fair-evaluation'],
        timeLimit: 150
      }
    ]
  },
  'salary-negotiation': {
    id: 'salary-negotiation',
    title: 'Advanced Salary Negotiation Mastery',
    description: 'Master complex salary negotiations, equity discussions, and total compensation strategies',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Navigate complex compensation structures including equity and bonuses',
      'Handle multi-party negotiations with competing interests',
      'Develop creative compensation solutions for unique situations',
      'Manage expectations across different compensation philosophies'
    ],
    skillsAssessed: ['negotiation', 'strategic-thinking', 'compensation-analysis'],
    scenarios: [
      {
        id: 'equity-negotiation-1',
        title: 'Complex Equity Negotiation',
        description: 'Handle a senior candidate requesting significant equity while maintaining internal equity',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A senior engineering candidate with competing offers is requesting 2% equity, which is significantly higher than your current equity bands. They have unique expertise in a critical area, but granting this would create internal equity issues with existing senior engineers.',
        question: 'How do you approach this complex negotiation while maintaining both internal equity and attracting the candidate?',
        options: [
          'Match the equity request to secure the candidate',
          'Explain the internal equity constraints and offer a lower equity percentage',
          'Propose a tiered equity structure with performance milestones and additional RSUs',
          'Focus on cash compensation instead of equity'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach balances the candidate\'s value with internal equity concerns while providing upside potential.',
          incorrect: 'This approach either compromises internal equity or doesn\'t effectively address the candidate\'s value proposition.'
        },
        hint: 'Consider how to structure equity to recognize value while maintaining internal equity.',
        tips: [
          'Understand the full value of the candidate\'s expertise',
          'Consider performance-based equity components',
          'Balance immediate and long-term incentives',
          'Maintain internal equity principles'
        ],
        points: 30,
        tags: ['equity', 'internal-equity', 'performance-based', 'senior-hiring'],
        timeLimit: 180
      },
      {
        id: 'multi-party-negotiation-1',
        title: 'Multi-Party Compensation Negotiation',
        description: 'Navigate negotiations involving multiple stakeholders with competing interests',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'You\'re negotiating with a candidate who has received approval for a higher salary band from the CTO, but the CFO is concerned about budget impact. Meanwhile, the candidate has a competing offer with a different compensation structure. The hiring manager is pushing for a quick resolution.',
        question: 'How do you navigate this multi-party negotiation while maintaining professional relationships and securing the candidate?',
        options: [
          'Present the competing offer to force a quick decision',
          'Work with the CTO to restructure the offer to meet budget constraints while maintaining value',
          'Ask the candidate to wait while you resolve internal conflicts',
          'Propose a compromise that might not satisfy any party'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach addresses budget concerns while maintaining the offer\'s value proposition.',
          incorrect: 'This approach either creates unnecessary pressure, delays the process, or compromises the negotiation position.'
        },
        hint: 'Think about how to restructure the offer to meet multiple objectives.',
        tips: [
          'Understand each stakeholder\'s priorities',
          'Look for creative compensation structures',
          'Maintain communication with all parties',
          'Focus on total value proposition'
        ],
        points: 35,
        tags: ['stakeholder-management', 'budget-constraints', 'offer-restructuring', 'value-proposition'],
        timeLimit: 240
      },
      {
        id: 'international-compensation-1',
        title: 'International Compensation Strategy',
        description: 'Handle complex international compensation negotiations with different market rates and tax implications',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A candidate is relocating from a high-cost market to a lower-cost market but expects to maintain their current compensation level. They have unique skills, but local market rates are significantly lower. Additionally, there are complex tax implications and cost-of-living differences to consider.',
        question: 'How do you structure a fair and competitive offer that considers all these factors?',
        options: [
          'Match their current compensation exactly',
          'Offer the local market rate with a one-time relocation bonus',
          'Create a hybrid compensation structure that considers market rates, cost of living, and their unique value',
          'Focus on non-monetary benefits to bridge the gap'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach balances market realities with the candidate\'s value while considering all relevant factors.',
          incorrect: 'This approach either ignores market realities, doesn\'t fully address the candidate\'s value, or relies too heavily on non-monetary benefits.'
        },
        hint: 'Consider how to balance multiple factors in international compensation.',
        tips: [
          'Research local market conditions thoroughly',
          'Consider tax implications and cost of living',
          'Evaluate the candidate\'s unique value proposition',
          'Structure compensation to be competitive in both markets'
        ],
        points: 30,
        tags: ['international-compensation', 'market-rates', 'tax-implications', 'relocation'],
        timeLimit: 180
      },
      {
        id: 'compensation-philosophy-1',
        title: 'Compensation Philosophy Alignment',
        description: 'Align candidate expectations with company compensation philosophy while maintaining competitiveness',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'A candidate expects a compensation structure focused on high base salary with minimal variable components, but your company philosophy emphasizes performance-based compensation with a significant bonus component. The candidate has concerns about the reliability of bonus payments.',
        question: 'How do you address this fundamental difference in compensation philosophy?',
        options: [
          'Adjust the company\'s compensation structure for this candidate',
          'Explain the philosophy and provide data on bonus payment history and performance metrics',
          'Focus on the base salary and downplay the bonus component',
          'Suggest they might not be a good fit for the company culture'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach maintains the company\'s philosophy while addressing the candidate\'s concerns with data.',
          incorrect: 'This approach either compromises company principles, doesn\'t address concerns, or suggests cultural incompatibility.'
        },
        hint: 'Think about how to bridge the gap between different compensation philosophies.',
        tips: [
          'Understand the company\'s compensation philosophy deeply',
          'Prepare data to support the philosophy',
          'Address concerns with specific examples',
          'Maintain transparency about expectations'
        ],
        points: 25,
        tags: ['compensation-philosophy', 'performance-based', 'transparency', 'data-driven'],
        timeLimit: 150
      },
      {
        id: 'competing-offers-1',
        title: 'Complex Competing Offers',
        description: 'Handle situations with multiple competing offers with different compensation structures',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A candidate has received three competing offers with different compensation structures: one with high equity and lower cash, one with high cash and minimal equity, and one with a balanced approach but lower total value. Your offer needs to be competitive while maintaining internal equity and budget constraints.',
        question: 'How do you analyze and respond to this complex competing offer situation?',
        options: [
          'Match the highest total value offer',
          'Analyze the different structures and propose a competitive package that aligns with your company\'s philosophy',
          'Focus on non-monetary benefits to differentiate your offer',
          'Ask the candidate to share all offer details before responding'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach considers all factors while maintaining company principles.',
          incorrect: 'This approach either ignores company constraints, doesn\'t fully analyze the situation, or relies too heavily on non-monetary aspects.'
        },
        hint: 'Consider how to analyze and respond to complex competing offers.',
        tips: [
          'Analyze total compensation value',
          'Consider company philosophy and constraints',
          'Evaluate different compensation structures',
          'Maintain competitive positioning'
        ],
        points: 35,
        tags: ['competing-offers', 'compensation-analysis', 'offer-strategy', 'total-rewards'],
        timeLimit: 240
      }
    ]
  },
  'candidate-psychology': {
    id: 'candidate-psychology',
    title: 'Advanced Candidate Psychology',
    description: 'Master the psychological aspects of interviewing, including complex behavioral patterns and decision-making processes',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Analyze complex behavioral patterns and decision-making processes',
      'Identify and manage psychological defense mechanisms',
      'Understand and navigate power dynamics in interviews',
      'Handle complex emotional and psychological situations'
    ],
    skillsAssessed: ['psychological-analysis', 'behavioral-assessment', 'emotional-intelligence'],
    scenarios: [
      {
        id: 'defense-mechanisms-1',
        title: 'Identifying Defense Mechanisms',
        description: 'Recognize and handle complex psychological defense mechanisms in interviews',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A senior candidate consistently deflects questions about their previous role\'s challenges, using humor and changing the subject. When pressed, they become slightly defensive and start questioning the relevance of your questions. Their body language suggests underlying anxiety about discussing certain topics.',
        question: 'How do you navigate this situation while gathering necessary information?',
        options: [
          'Continue pressing for specific examples',
          'Acknowledge their discomfort and reframe the questions to focus on learning and growth',
          'Move on to other topics to avoid conflict',
          'Confront them about their defensiveness'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach acknowledges the psychological barriers while maintaining the interview\'s purpose.',
          incorrect: 'This approach either escalates defensiveness, avoids necessary information, or creates unnecessary conflict.'
        },
        hint: 'Consider how to address psychological barriers while gathering information.',
        tips: [
          'Recognize defense mechanisms',
          'Create psychological safety',
          'Reframe questions positively',
          'Maintain professional boundaries'
        ],
        points: 30,
        tags: ['defense-mechanisms', 'psychological-safety', 'reframing', 'senior-candidates'],
        timeLimit: 180
      },
      {
        id: 'power-dynamics-1',
        title: 'Managing Power Dynamics',
        description: 'Handle complex power dynamics in interviews with senior candidates',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'You\'re interviewing a candidate who was previously a C-level executive. They subtly challenge your authority by questioning your experience and the interview process. They frequently reference their seniority and seem to be testing your confidence.',
        question: 'How do you maintain control of the interview while respecting their experience?',
        options: [
          'Assert your authority more strongly',
          'Acknowledge their experience while maintaining professional boundaries and interview structure',
          'Defer to their seniority and let them guide the conversation',
          'End the interview early'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach maintains professional control while respecting their experience.',
          incorrect: 'This approach either creates unnecessary conflict, gives up control, or ends the process prematurely.'
        },
        hint: 'Think about how to balance respect with professional control.',
        tips: [
          'Maintain professional boundaries',
          'Acknowledge experience appropriately',
          'Stay focused on interview objectives',
          'Use confident but respectful communication'
        ],
        points: 35,
        tags: ['power-dynamics', 'senior-candidates', 'professional-boundaries', 'confidence'],
        timeLimit: 240
      },
      {
        id: 'emotional-triggers-1',
        title: 'Identifying Emotional Triggers',
        description: 'Recognize and manage emotional triggers in interviews',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'A candidate becomes visibly emotional when discussing their previous role. Their voice trembles, they become defensive, and they start sharing personal details about conflicts with their former manager. The conversation is becoming increasingly emotional and unprofessional.',
        question: 'How do you handle this emotional situation while maintaining the interview\'s purpose?',
        options: [
          'Allow them to continue sharing to show empathy',
          'Acknowledge their emotions, redirect to professional aspects, and maintain boundaries',
          'End the interview and suggest they reapply when they\'re more composed',
          'Focus on technical questions only'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach shows empathy while maintaining professional boundaries.',
          incorrect: 'This approach either encourages inappropriate sharing, ends the process prematurely, or ignores important information.'
        },
        hint: 'Consider how to show empathy while maintaining professionalism.',
        tips: [
          'Recognize emotional triggers',
          'Show appropriate empathy',
          'Maintain professional boundaries',
          'Redirect to relevant information'
        ],
        points: 30,
        tags: ['emotional-triggers', 'empathy', 'professional-boundaries', 'redirection'],
        timeLimit: 180
      },
      {
        id: 'decision-making-1',
        title: 'Analyzing Decision-Making Patterns',
        description: 'Evaluate complex decision-making patterns and risk assessment abilities',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A candidate describes a situation where they made a high-stakes decision that had both positive and negative outcomes. Their explanation focuses heavily on the positive results while minimizing the negative impacts. They seem to be presenting a carefully crafted narrative rather than a balanced analysis.',
        question: 'How do you assess their decision-making process and risk assessment abilities?',
        options: [
          'Accept their narrative at face value',
          'Probe deeper into their decision-making process and risk assessment methodology',
          'Focus on the positive outcomes they achieved',
          'Challenge their narrative directly'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach gathers deeper insights into their decision-making process.',
          incorrect: 'This approach either accepts a potentially biased narrative, focuses too narrowly, or creates unnecessary conflict.'
        },
        hint: 'Think about how to evaluate decision-making processes objectively.',
        tips: [
          'Look for balanced analysis',
          'Evaluate risk assessment methodology',
          'Consider decision-making patterns',
          'Maintain objective evaluation'
        ],
        points: 35,
        tags: ['decision-making', 'risk-assessment', 'narrative-analysis', 'objective-evaluation'],
        timeLimit: 240
      },
      {
        id: 'psychological-safety-1',
        title: 'Creating Psychological Safety',
        description: 'Establish and maintain psychological safety in challenging interview situations',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'You\'re interviewing a candidate who has experienced significant career setbacks. They seem guarded and hesitant to share details. The role requires someone who can handle failure and learn from it, but the candidate is clearly uncomfortable discussing these experiences.',
        question: 'How do you create an environment where they can share these experiences productively?',
        options: [
          'Share your own failures to make them comfortable',
          'Create a structured framework for discussing challenges and learning',
          'Skip the difficult questions and focus on successes',
          'Tell them they need to be more open'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach creates a safe structure for discussing challenges.',
          incorrect: 'This approach either crosses professional boundaries, avoids necessary information, or creates pressure.'
        },
        hint: 'Consider how to create a safe structure for discussing challenges.',
        tips: [
          'Create clear discussion frameworks',
          'Maintain professional boundaries',
          'Focus on learning and growth',
          'Build trust gradually'
        ],
        points: 30,
        tags: ['psychological-safety', 'trust-building', 'structured-discussion', 'professional-boundaries'],
        timeLimit: 180
      }
    ]
  },
  'technical-interview': {
    id: 'technical-interview',
    title: 'Advanced Technical Interview Mastery',
    description: 'Master complex technical interviews, system design evaluations, and technical leadership assessment',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Evaluate complex technical architectures and system designs',
      'Assess technical leadership and decision-making capabilities',
      'Identify technical red flags and risk factors',
      'Conduct effective technical deep-dives across multiple domains'
    ],
    skillsAssessed: ['technical-assessment', 'system-design', 'leadership-evaluation'],
    scenarios: [
      {
        id: 'system-design-1',
        title: 'Complex System Architecture Evaluation',
        description: 'Evaluate a candidate\'s approach to designing a large-scale distributed system',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A senior engineering candidate is designing a real-time analytics platform that needs to process 1M events/second with 99.99% uptime. They propose a solution, but you notice potential scalability issues and single points of failure. The candidate is confident in their approach and has implemented similar systems before.',
        question: 'How do you effectively evaluate their system design while maintaining a constructive dialogue?',
        options: [
          'Accept their experience and move on',
          'Point out the flaws directly and ask for alternatives',
          'Guide them through a systematic evaluation of their design\'s limitations and trade-offs',
          'Focus on their past implementations instead'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach maintains professionalism while thoroughly evaluating their technical capabilities.',
          incorrect: 'This approach either misses critical evaluation points or creates unnecessary conflict.'
        },
        hint: 'Consider how to evaluate complex technical decisions systematically.',
        tips: [
          'Evaluate scalability considerations',
          'Assess failure scenarios',
          'Consider operational complexity',
          'Maintain technical dialogue'
        ],
        points: 35,
        tags: ['system-design', 'scalability', 'reliability', 'technical-evaluation'],
        timeLimit: 240
      },
      {
        id: 'technical-leadership-1',
        title: 'Technical Leadership Assessment',
        description: 'Evaluate a candidate\'s technical leadership and decision-making capabilities',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'A candidate for a technical leadership role describes a situation where they had to make a critical technical decision that affected multiple teams. Their decision was technically sound but caused significant friction with other teams. They seem to prioritize technical excellence over team collaboration.',
        question: 'How do you assess their technical leadership approach and potential impact on the organization?',
        options: [
          'Focus only on the technical aspects of their decision',
          'Evaluate their decision-making process, stakeholder management, and organizational impact',
          'Suggest they need to improve their collaboration skills',
          'Move on to other technical topics'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach provides a comprehensive evaluation of their leadership capabilities.',
          incorrect: 'This approach either misses important leadership aspects or doesn\'t gather necessary information.'
        },
        hint: 'Consider how to evaluate both technical and leadership capabilities.',
        tips: [
          'Assess decision-making process',
          'Evaluate stakeholder management',
          'Consider organizational impact',
          'Balance technical and leadership aspects'
        ],
        points: 30,
        tags: ['technical-leadership', 'decision-making', 'stakeholder-management', 'organizational-impact'],
        timeLimit: 180
      },
      {
        id: 'technical-red-flags-1',
        title: 'Identifying Technical Red Flags',
        description: 'Recognize and evaluate potential technical red flags in senior candidates',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A senior candidate demonstrates strong technical knowledge but shows concerning patterns: they dismiss modern development practices, resist code reviews, and have a history of leaving projects before completion. They justify these as "pragmatic decisions" based on their experience.',
        question: 'How do you assess these patterns and their potential impact on the team?',
        options: [
          'Focus on their technical knowledge only',
          'Probe deeper into their development philosophy and team collaboration approach',
          'Accept their experience as justification',
          'End the interview process'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach thoroughly evaluates potential risks while gathering necessary information.',
          incorrect: 'This approach either misses important red flags or doesn\'t gather enough information.'
        },
        hint: 'Consider how to evaluate technical practices and team impact.',
        tips: [
          'Evaluate development practices',
          'Assess team collaboration',
          'Consider long-term impact',
          'Maintain objective evaluation'
        ],
        points: 35,
        tags: ['technical-practices', 'team-collaboration', 'risk-assessment', 'senior-hiring'],
        timeLimit: 240
      },
      {
        id: 'cross-domain-1',
        title: 'Cross-Domain Technical Evaluation',
        description: 'Conduct effective technical deep-dives across multiple domains',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A candidate claims expertise in multiple technical domains (frontend, backend, DevOps). They provide high-level answers but struggle with specific technical details. You need to assess their actual depth of knowledge across these domains.',
        question: 'How do you effectively evaluate their technical expertise across multiple domains?',
        options: [
          'Focus on their strongest domain only',
          'Conduct systematic deep-dives into each domain with specific technical questions',
          'Accept their high-level understanding',
          'Ask them to choose their strongest area'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach provides a thorough evaluation of their technical capabilities.',
          incorrect: 'This approach either doesn\'t gather enough information or doesn\'t evaluate all relevant domains.'
        },
        hint: 'Consider how to evaluate technical depth across multiple domains.',
        tips: [
          'Evaluate technical depth',
          'Assess domain knowledge',
          'Consider practical experience',
          'Maintain systematic evaluation'
        ],
        points: 30,
        tags: ['technical-depth', 'domain-knowledge', 'cross-functional', 'expertise-evaluation'],
        timeLimit: 180
      },
      {
        id: 'technical-communication-1',
        title: 'Technical Communication Assessment',
        description: 'Evaluate a candidate\'s ability to communicate complex technical concepts',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'A candidate needs to explain a complex technical concept to a non-technical stakeholder. They use technical jargon and assume prior knowledge, making it difficult for others to understand. The role requires strong technical communication skills.',
        question: 'How do you assess and evaluate their technical communication abilities?',
        options: [
          'Focus on their technical knowledge only',
          'Evaluate their ability to adapt communication style and explain complex concepts clearly',
          'Accept their technical expertise as sufficient',
          'Suggest they need communication training'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach evaluates their ability to communicate effectively.',
          incorrect: 'This approach either misses important communication aspects or doesn\'t gather necessary information.'
        },
        hint: 'Consider how to evaluate technical communication skills.',
        tips: [
          'Assess communication clarity',
          'Evaluate audience adaptation',
          'Consider explanation effectiveness',
          'Maintain professional evaluation'
        ],
        points: 25,
        tags: ['technical-communication', 'stakeholder-management', 'clarity', 'adaptation'],
        timeLimit: 150
      }
    ]
  },
  'rejection-delivery': {
    id: 'rejection-delivery',
    title: 'Advanced Rejection Delivery Mastery',
    description: 'Master complex rejection scenarios, feedback delivery, and relationship management',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Handle complex rejection scenarios with multiple stakeholders',
      'Deliver constructive feedback that maintains professional relationships',
      'Manage emotional responses and maintain company reputation',
      'Document and learn from rejection processes'
    ],
    skillsAssessed: ['communication', 'emotional-intelligence', 'professionalism'],
    scenarios: [
      {
        id: 'stakeholder-rejection-1',
        title: 'Multi-Stakeholder Rejection',
        description: 'Handle rejection scenarios involving multiple stakeholders with competing interests',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A senior candidate was recommended by a key client and had strong internal support from the technical team. However, after a thorough assessment, you need to reject them due to significant technical gaps. The client is expecting their recommendation to be hired, and the technical team is disappointed.',
        question: 'How do you handle this complex rejection while maintaining all relationships?',
        options: [
          'Blame the technical assessment process',
          'Deliver the rejection directly to the candidate only',
          'Coordinate a comprehensive communication plan addressing all stakeholders professionally',
          'Delay the rejection to avoid conflict'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach maintains professionalism while addressing all stakeholders.',
          incorrect: 'This approach either damages relationships or doesn\'t handle the situation effectively.'
        },
        hint: 'Consider how to maintain relationships while delivering difficult news.',
        tips: [
          'Address all stakeholders',
          'Maintain professionalism',
          'Provide clear rationale',
          'Preserve relationships'
        ],
        points: 35,
        tags: ['stakeholder-management', 'professional-communication', 'relationship-preservation', 'difficult-conversations'],
        timeLimit: 240
      },
      {
        id: 'constructive-feedback-1',
        title: 'Delivering Constructive Feedback',
        description: 'Provide detailed, actionable feedback that helps candidates improve',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'A candidate performed well in most areas but had significant gaps in critical skills. They are likely to reapply in the future, and you want to provide feedback that helps them improve while maintaining a positive relationship.',
        question: 'How do you deliver detailed, constructive feedback that encourages growth?',
        options: [
          'Provide vague, positive feedback only',
          'Deliver specific, actionable feedback with examples and improvement suggestions',
          'Focus only on their strengths',
          'List all their weaknesses directly'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach provides valuable feedback while maintaining a positive relationship.',
          incorrect: 'This approach either doesn\'t provide useful feedback or damages the relationship.'
        },
        hint: 'Consider how to provide specific, actionable feedback.',
        tips: [
          'Provide specific examples',
          'Suggest improvements',
          'Maintain professionalism',
          'Focus on growth'
        ],
        points: 30,
        tags: ['constructive-feedback', 'growth-mindset', 'professional-development', 'relationship-building'],
        timeLimit: 180
      },
      {
        id: 'emotional-response-1',
        title: 'Managing Emotional Responses',
        description: 'Handle strong emotional reactions to rejection professionally',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A candidate becomes visibly upset upon receiving the rejection, questioning the decision and becoming confrontational. They have invested significant time in the process and had high expectations. The conversation is becoming increasingly emotional.',
        question: 'How do you handle this emotional situation while maintaining professionalism?',
        options: [
          'End the conversation immediately',
          'Acknowledge their feelings, maintain boundaries, and provide clear rationale',
          'Apologize and reconsider the decision',
          'Defend the decision more strongly'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach shows empathy while maintaining professional boundaries.',
          incorrect: 'This approach either escalates the situation or compromises the decision.'
        },
        hint: 'Consider how to show empathy while maintaining professionalism.',
        tips: [
          'Acknowledge emotions',
          'Maintain boundaries',
          'Provide clear rationale',
          'Stay professional'
        ],
        points: 35,
        tags: ['emotional-intelligence', 'professional-boundaries', 'conflict-management', 'empathy'],
        timeLimit: 240
      },
      {
        id: 'reputation-management-1',
        title: 'Reputation Management',
        description: 'Handle rejection scenarios that could impact company reputation',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A well-connected candidate in your industry is being rejected after a lengthy process. They have a strong social media presence and could potentially impact your company\'s reputation. The rejection is based on legitimate concerns, but the candidate might not understand or accept the rationale.',
        question: 'How do you handle this rejection while protecting company reputation?',
        options: [
          'Delay the rejection to avoid negative publicity',
          'Deliver the rejection professionally with clear rationale and maintain open communication',
          'Offer a different role to avoid rejection',
          'Blame the process or other factors'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach maintains professionalism while protecting company reputation.',
          incorrect: 'This approach either compromises the decision or doesn\'t protect company reputation.'
        },
        hint: 'Consider how to maintain professionalism while protecting reputation.',
        tips: [
          'Maintain professionalism',
          'Provide clear rationale',
          'Keep communication open',
          'Protect company reputation'
        ],
        points: 30,
        tags: ['reputation-management', 'professional-communication', 'stakeholder-management', 'brand-protection'],
        timeLimit: 180
      },
      {
        id: 'process-improvement-1',
        title: 'Rejection Process Improvement',
        description: 'Learn from rejection scenarios to improve the hiring process',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'After rejecting a candidate, you realize there were gaps in your assessment process that could have been identified earlier. The candidate invested significant time, and the rejection could have been handled more efficiently.',
        question: 'How do you use this experience to improve the hiring process?',
        options: [
          'Move on to the next candidate',
          'Document the experience, identify process improvements, and implement changes',
          'Blame the candidate for the time investment',
          'Ignore the process gaps'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach uses the experience to improve future processes.',
          incorrect: 'This approach either misses learning opportunities or doesn\'t improve the process.'
        },
        hint: 'Consider how to learn from rejection experiences.',
        tips: [
          'Document the experience',
          'Identify improvements',
          'Implement changes',
          'Maintain professionalism'
        ],
        points: 25,
        tags: ['process-improvement', 'learning-organization', 'efficiency', 'professional-development'],
        timeLimit: 150
      }
    ]
  },
  'time-management': {
    id: 'time-management',
    title: 'Advanced Interview Time Management',
    description: 'Master complex interview scheduling, time optimization, and multi-stakeholder coordination',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Optimize interview processes for maximum efficiency',
      'Handle complex scheduling scenarios with multiple stakeholders',
      'Manage time-sensitive hiring decisions',
      'Balance thorough assessment with time constraints'
    ],
    skillsAssessed: ['process-optimization', 'stakeholder-management', 'decision-making'],
    scenarios: [
      {
        id: 'process-optimization-1',
        title: 'Interview Process Optimization',
        description: 'Optimize complex interview processes while maintaining assessment quality',
        type: 'scenario',
        difficulty: 'expert',
        context: 'Your company is experiencing rapid growth and needs to hire 50 engineers in 3 months. The current interview process takes 2 weeks per candidate, but you need to reduce this while maintaining assessment quality. Multiple teams are involved, and each has different priorities and concerns.',
        question: 'How do you optimize the interview process while ensuring quality and stakeholder buy-in?',
        options: [
          'Rush through interviews to meet the deadline',
          'Maintain the current process and miss the hiring target',
          'Analyze the process, identify bottlenecks, and implement efficient changes with stakeholder alignment',
          'Outsource the hiring process'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach balances efficiency with quality while maintaining stakeholder alignment.',
          incorrect: 'This approach either compromises quality, misses targets, or doesn\'t address the core issues.'
        },
        hint: 'Consider how to optimize while maintaining quality and stakeholder alignment.',
        tips: [
          'Identify process bottlenecks',
          'Engage stakeholders early',
          'Implement efficient changes',
          'Maintain assessment quality'
        ],
        points: 35,
        tags: ['process-optimization', 'stakeholder-management', 'quality-assurance', 'efficiency'],
        timeLimit: 240
      },
      {
        id: 'stakeholder-scheduling-1',
        title: 'Complex Stakeholder Scheduling',
        description: 'Coordinate interviews with multiple stakeholders across different time zones',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'You need to schedule a final round interview for a senior candidate with 5 stakeholders across 3 different time zones. The candidate is considering multiple offers and needs a decision within 48 hours. Some stakeholders have limited availability, and the candidate has specific time constraints.',
        question: 'How do you coordinate this complex scheduling scenario effectively?',
        options: [
          'Ask the candidate to be flexible with their schedule',
          'Prioritize certain stakeholders and skip others',
          'Create a structured scheduling plan with clear communication and backup options',
          'Extend the decision timeline'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Perfect! This approach ensures all stakeholders are involved while meeting time constraints.',
          incorrect: 'This approach either compromises the assessment, misses key stakeholders, or doesn\'t meet time requirements.'
        },
        hint: 'Consider how to coordinate multiple stakeholders efficiently.',
        tips: [
          'Plan ahead',
          'Communicate clearly',
          'Have backup options',
          'Maintain stakeholder alignment'
        ],
        points: 30,
        tags: ['scheduling', 'stakeholder-management', 'time-zones', 'coordination'],
        timeLimit: 180
      },
      {
        id: 'time-sensitive-decision-1',
        title: 'Time-Sensitive Hiring Decisions',
        description: 'Make informed hiring decisions under significant time pressure',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A critical role needs to be filled within 72 hours due to a departing employee. The candidate pool is limited, and the best candidate has some concerns but is the strongest option. Multiple stakeholders have different opinions, and the candidate has other offers pending.',
        question: 'How do you make a thorough yet timely decision in this high-pressure situation?',
        options: [
          'Hire the candidate immediately to meet the deadline',
          'Take the time needed for a thorough assessment, even if it means missing the deadline',
          'Conduct a focused, accelerated assessment while addressing key concerns',
          'Extend the current employee\'s notice period'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach balances thoroughness with time constraints.',
          incorrect: 'This approach either compromises the assessment or doesn\'t meet time requirements.'
        },
        hint: 'Consider how to make informed decisions under time pressure.',
        tips: [
          'Focus on critical factors',
          'Address key concerns',
          'Maintain assessment quality',
          'Communicate clearly'
        ],
        points: 35,
        tags: ['decision-making', 'time-pressure', 'stakeholder-management', 'quality-assurance'],
        timeLimit: 240
      },
      {
        id: 'assessment-balance-1',
        title: 'Balancing Assessment Depth',
        description: 'Balance thorough assessment with time constraints',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'A candidate shows strong potential but has some gaps in their experience. The role requires specific skills that are hard to assess quickly. The hiring manager wants a thorough assessment, but the candidate has limited availability and other opportunities.',
        question: 'How do you balance thorough assessment with time constraints?',
        options: [
          'Focus on the most critical skills only',
          'Extend the assessment period',
          'Design a focused assessment that efficiently evaluates key competencies',
          'Rely on past experience only'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Perfect! This approach efficiently assesses critical competencies.',
          incorrect: 'This approach either misses important assessment points or doesn\'t meet time requirements.'
        },
        hint: 'Consider how to assess critical competencies efficiently.',
        tips: [
          'Identify key competencies',
          'Design focused assessments',
          'Use time efficiently',
          'Maintain assessment quality'
        ],
        points: 30,
        tags: ['assessment-design', 'time-management', 'competency-evaluation', 'efficiency'],
        timeLimit: 180
      },
      {
        id: 'process-documentation-1',
        title: 'Process Documentation and Analysis',
        description: 'Document and analyze interview processes for continuous improvement',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'Your team has completed a complex hiring process with multiple candidates and stakeholders. The process revealed several inefficiencies and areas for improvement. You need to document the process and propose improvements while maintaining stakeholder buy-in.',
        question: 'How do you document and improve the process effectively?',
        options: [
          'Document everything in detail',
          'Focus on the successful outcomes only',
          'Analyze the process, identify improvements, and create an actionable improvement plan',
          'Start fresh with a new process'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach leads to meaningful process improvements.',
          incorrect: 'This approach either doesn\'t capture key learnings or doesn\'t lead to improvements.'
        },
        hint: 'Consider how to document and improve processes effectively.',
        tips: [
          'Document key learnings',
          'Identify improvements',
          'Create action plans',
          'Maintain stakeholder alignment'
        ],
        points: 25,
        tags: ['process-improvement', 'documentation', 'analysis', 'stakeholder-management'],
        timeLimit: 150
      }
    ]
  },
  'remote-interview': {
    id: 'remote-interview',
    title: 'Advanced Remote Interview Mastery',
    description: 'Master complex remote interviewing techniques, technical setup, and engagement strategies',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Handle complex technical and engagement challenges in remote interviews',
      'Assess candidates effectively in virtual environments',
      'Manage multi-stakeholder remote interview processes',
      'Ensure fair and consistent remote assessments'
    ],
    skillsAssessed: ['technical-setup', 'virtual-engagement', 'remote-assessment'],
    scenarios: [
      {
        id: 'technical-challenges-1',
        title: 'Complex Technical Challenges',
        description: 'Handle sophisticated technical issues during remote interviews',
        type: 'scenario',
        difficulty: 'expert',
        context: 'During a critical remote interview, multiple technical issues occur: the candidate\'s video is unstable, audio quality is poor, and the screen sharing tool isn\'t working properly. The candidate is in a different time zone with limited technical support, and the interview is time-sensitive.',
        question: 'How do you handle these technical challenges while maintaining a professional assessment?',
        options: [
          'Reschedule the interview',
          'Continue with the issues and make do',
          'Implement a structured troubleshooting approach while maintaining candidate experience',
          'Switch to a phone interview'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach addresses technical issues while maintaining professionalism.',
          incorrect: 'This approach either compromises the assessment or doesn\'t handle the issues effectively.'
        },
        hint: 'Consider how to handle technical issues professionally.',
        tips: [
          'Have backup plans',
          'Maintain professionalism',
          'Address issues systematically',
          'Preserve candidate experience'
        ],
        points: 35,
        tags: ['technical-troubleshooting', 'candidate-experience', 'professionalism', 'remote-setup'],
        timeLimit: 240
      },
      {
        id: 'virtual-engagement-1',
        title: 'Advanced Virtual Engagement',
        description: 'Maintain engagement and assess candidates effectively in virtual environments',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'You\'re conducting a remote interview with a candidate who seems disengaged and distracted. The role requires strong communication and engagement skills, but it\'s difficult to assess these in a virtual environment. The candidate has limited experience with remote work.',
        question: 'How do you assess their engagement and communication skills effectively?',
        options: [
          'Focus on technical skills only',
          'End the interview early',
          'Implement engagement strategies and structured assessment methods',
          'Assume they\'re not a good fit'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Perfect! This approach effectively assesses engagement in a virtual environment.',
          incorrect: 'This approach either misses important assessment points or doesn\'t gather necessary information.'
        },
        hint: 'Consider how to assess engagement in virtual environments.',
        tips: [
          'Use engagement strategies',
          'Implement structured assessment',
          'Consider virtual context',
          'Maintain professional evaluation'
        ],
        points: 30,
        tags: ['virtual-engagement', 'communication-assessment', 'remote-evaluation', 'candidate-experience'],
        timeLimit: 180
      },
      {
        id: 'multi-stakeholder-remote-1',
        title: 'Multi-Stakeholder Remote Process',
        description: 'Coordinate complex remote interviews with multiple stakeholders',
        type: 'assessment',
        difficulty: 'expert',
        context: 'You need to coordinate a remote interview process involving 5 stakeholders across different time zones. The process includes technical assessments, team interviews, and a final presentation. The candidate has limited availability, and some stakeholders have technical limitations.',
        question: 'How do you coordinate this complex remote process effectively?',
        options: [
          'Simplify the process to accommodate limitations',
          'Conduct all interviews in one day',
          'Design a structured remote process with clear communication and technical support',
          'Reschedule for in-person interviews'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach ensures a thorough remote assessment process.',
          incorrect: 'This approach either compromises the assessment or doesn\'t address all requirements.'
        },
        hint: 'Consider how to coordinate complex remote processes.',
        tips: [
          'Plan thoroughly',
          'Communicate clearly',
          'Provide technical support',
          'Maintain process quality'
        ],
        points: 35,
        tags: ['process-coordination', 'stakeholder-management', 'remote-assessment', 'technical-support'],
        timeLimit: 240
      },
      {
        id: 'fair-assessment-1',
        title: 'Ensuring Fair Remote Assessment',
        description: 'Maintain fairness and consistency in remote assessments',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'You\'re conducting remote interviews for a role that requires strong problem-solving skills. Some candidates have better technical setups and more remote interview experience than others. You need to ensure a fair and consistent assessment across all candidates.',
        question: 'How do you ensure fair assessment despite varying technical conditions?',
        options: [
          'Focus on candidates with better setups',
          'Standardize the assessment process and provide equal support',
          'Adjust expectations based on technical conditions',
          'Conduct additional in-person interviews'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Perfect! This approach ensures fair assessment across different conditions.',
          incorrect: 'This approach either creates bias or doesn\'t ensure consistent assessment.'
        },
        hint: 'Consider how to maintain fairness in remote assessments.',
        tips: [
          'Standardize the process',
          'Provide equal support',
          'Maintain consistency',
          'Ensure fairness'
        ],
        points: 30,
        tags: ['fair-assessment', 'process-standardization', 'equity', 'remote-evaluation'],
        timeLimit: 180
      },
      {
        id: 'technical-setup-1',
        title: 'Advanced Technical Setup',
        description: 'Implement and maintain sophisticated remote interview setups',
        type: 'roleplay',
        difficulty: 'advanced',
        context: 'Your company is transitioning to fully remote interviews. You need to design and implement a technical setup that supports various interview types (technical assessments, presentations, team interviews) while ensuring security and reliability.',
        question: 'How do you implement a comprehensive remote interview setup?',
        options: [
          'Use basic video conferencing only',
          'Implement a comprehensive technical solution with backup options',
          'Rely on candidates\' existing setups',
          'Conduct hybrid interviews'
        ],
        correctAnswer: 1,
        feedback: {
          correct: 'Excellent! This approach ensures reliable remote interviews.',
          incorrect: 'This approach either doesn\'t meet requirements or doesn\'t ensure reliability.'
        },
        hint: 'Consider how to implement a comprehensive remote setup.',
        tips: [
          'Plan thoroughly',
          'Include backup options',
          'Ensure security',
          'Maintain reliability'
        ],
        points: 25,
        tags: ['technical-setup', 'remote-infrastructure', 'security', 'reliability'],
        timeLimit: 150
      }
    ]
  },
  'cultural-fit': {
    id: 'cultural-fit',
    title: 'Advanced Cultural Fit Assessment',
    description: 'Master complex cultural assessment, diversity integration, and organizational alignment',
    category: 'Advanced Skills',
    estimatedTime: 120,
    difficulty: 'expert',
    learningObjectives: [
      'Evaluate complex cultural dynamics and team integration',
      'Assess alignment with organizational values and mission',
      'Balance cultural fit with diversity and inclusion',
      'Identify and manage cultural red flags'
    ],
    skillsAssessed: ['cultural-assessment', 'diversity-inclusion', 'organizational-alignment'],
    scenarios: [
      {
        id: 'cultural-dynamics-1',
        title: 'Complex Cultural Dynamics',
        description: 'Evaluate cultural fit in complex organizational contexts',
        type: 'scenario',
        difficulty: 'expert',
        context: 'A senior candidate has a strong track record but comes from a company with a very different culture. Your organization values collaboration and work-life balance, while their previous company emphasized individual achievement and long hours. The candidate shows potential but has concerns about adapting to your culture.',
        question: 'How do you assess their cultural adaptability while maintaining your organization\'s values?',
        options: [
          'Focus on their achievements only',
          'Accept their experience as sufficient',
          'Evaluate their understanding and adaptability to different cultural contexts',
          'Assume they won\'t fit in'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach thoroughly evaluates cultural adaptability.',
          incorrect: 'This approach either misses important cultural aspects or makes assumptions.'
        },
        hint: 'Consider how to evaluate cultural adaptability effectively.',
        tips: [
          'Assess cultural awareness',
          'Evaluate adaptability',
          'Consider organizational values',
          'Maintain objective evaluation'
        ],
        points: 35,
        tags: ['cultural-adaptability', 'organizational-values', 'senior-hiring', 'cultural-assessment'],
        timeLimit: 240
      },
      {
        id: 'diversity-balance-1',
        title: 'Diversity and Cultural Fit',
        description: 'Balance cultural fit assessment with diversity and inclusion goals',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'Your organization is working to increase diversity while maintaining cultural cohesion. A candidate from an underrepresented background shows strong potential but has different communication and work styles. Some team members express concerns about cultural fit, while others emphasize the importance of diversity.',
        question: 'How do you assess this candidate while balancing cultural fit and diversity goals?',
        options: [
          'Prioritize cultural fit over diversity',
          'Focus on diversity goals only',
          'Evaluate how their unique perspective could enhance the team while maintaining core values',
          'Extend the interview process'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Perfect! This approach balances diversity with organizational needs.',
          incorrect: 'This approach either compromises diversity goals or organizational needs.'
        },
        hint: 'Consider how to balance diversity with cultural alignment.',
        tips: [
          'Evaluate unique contributions',
          'Assess core value alignment',
          'Consider team dynamics',
          'Maintain inclusive perspective'
        ],
        points: 30,
        tags: ['diversity-inclusion', 'cultural-balance', 'team-dynamics', 'value-alignment'],
        timeLimit: 180
      },
      {
        id: 'value-alignment-1',
        title: 'Organizational Value Alignment',
        description: 'Assess alignment with organizational values and mission',
        type: 'assessment',
        difficulty: 'expert',
        context: 'A candidate demonstrates strong technical skills but shows different approaches to key organizational values. They question some of your company\'s practices and suggest alternative approaches. The role requires strong alignment with company values while driving innovation.',
        question: 'How do you evaluate their potential to align with organizational values while contributing to growth?',
        options: [
          'Focus on technical skills only',
          'Reject them based on value differences',
          'Assess their understanding of values and potential for constructive contribution',
          'Ask them to conform to existing practices'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach evaluates both alignment and growth potential.',
          incorrect: 'This approach either misses value alignment or doesn\'t consider growth potential.'
        },
        hint: 'Consider how to evaluate value alignment and growth potential.',
        tips: [
          'Assess value understanding',
          'Evaluate growth potential',
          'Consider constructive contribution',
          'Maintain organizational integrity'
        ],
        points: 35,
        tags: ['value-alignment', 'organizational-growth', 'innovation', 'cultural-assessment'],
        timeLimit: 240
      },
      {
        id: 'team-integration-1',
        title: 'Team Integration Assessment',
        description: 'Evaluate potential impact on team dynamics and culture',
        type: 'scenario',
        difficulty: 'advanced',
        context: 'A candidate has a strong personality and leadership style that differs from your current team dynamics. They have a history of driving change but also of creating friction in previous roles. The team needs new perspectives but also values harmony and collaboration.',
        question: 'How do you assess their potential impact on team dynamics?',
        options: [
          'Focus on their achievements only',
          'Prioritize team harmony over change',
          'Evaluate their ability to drive positive change while maintaining team cohesion',
          'Assume they\'ll disrupt the team'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Perfect! This approach evaluates both change potential and team impact.',
          incorrect: 'This approach either misses team dynamics or doesn\'t consider growth potential.'
        },
        hint: 'Consider how to evaluate team impact and change potential.',
        tips: [
          'Assess team impact',
          'Evaluate change potential',
          'Consider collaboration style',
          'Maintain team harmony'
        ],
        points: 30,
        tags: ['team-dynamics', 'change-management', 'collaboration', 'cultural-impact'],
        timeLimit: 180
      },
      {
        id: 'cultural-red-flags-1',
        title: 'Identifying Cultural Red Flags',
        description: 'Recognize and evaluate potential cultural concerns',
        type: 'roleplay',
        difficulty: 'expert',
        context: 'A candidate demonstrates concerning patterns: they dismiss team feedback, resist collaborative approaches, and show signs of potential cultural misalignment. However, they have strong technical skills and industry experience. The role requires both technical expertise and cultural alignment.',
        question: 'How do you assess these cultural concerns while considering their technical value?',
        options: [
          'Focus on technical skills only',
          'Reject them based on cultural concerns',
          'Evaluate the severity of concerns and potential for cultural adaptation',
          'Assume they\'ll adapt to the culture'
        ],
        correctAnswer: 2,
        feedback: {
          correct: 'Excellent! This approach thoroughly evaluates cultural concerns and potential.',
          incorrect: 'This approach either misses important concerns or doesn\'t consider potential.'
        },
        hint: 'Consider how to evaluate cultural concerns and adaptation potential.',
        tips: [
          'Assess concern severity',
          'Evaluate adaptation potential',
          'Consider team impact',
          'Maintain cultural standards'
        ],
        points: 35,
        tags: ['cultural-red-flags', 'risk-assessment', 'adaptation-potential', 'team-impact'],
        timeLimit: 240
      }
    ]
  }
};

export const getModuleById = (moduleId: string): TrainingModule | undefined => {
  return trainingModules[moduleId];
};

export const getScenarioById = (moduleId: string, scenarioId: string): TrainingScenario | undefined => {
  const module = trainingModules[moduleId];
  return module?.scenarios.find(s => s.id === scenarioId);
};

export const calculateModuleProgress = (moduleId: string, completedScenarios: string[]): number => {
  const module = trainingModules[moduleId];
  if (!module) return 0;
  
  const completed = module.scenarios.filter(s => completedScenarios.includes(s.id)).length;
  return (completed / module.scenarios.length) * 100;
};
