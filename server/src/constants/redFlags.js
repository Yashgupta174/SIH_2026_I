const RED_FLAG_RULES = [
  {
    id: 'RF_CARDIAC_CHEST_PAIN',
    category: 'CARDIOVASCULAR',
    severity: 'CRITICAL',
    title: 'Potential Acute Cardiac Event',
    keywords: ['chest pain', 'left arm pain', 'jaw pain', 'sweating', 'crushing chest', 'sinha dard'],
    condition: (answers) => {
      const text = JSON.stringify(answers).toLowerCase();
      return (text.includes('chest') || text.includes('dard')) && 
             (text.includes('arm') || text.includes('jaw') || text.includes('sweat') || text.includes('breath') || text.includes('saans'));
    },
    action: 'IMMEDIATE_ECG_AND_TRIAGE_EVALUATION',
    patientMessage: 'Hospital clinical staff have been alerted to evaluate your symptoms immediately.',
  },
  {
    id: 'RF_STROKE_NEURO',
    category: 'NEUROLOGICAL',
    severity: 'CRITICAL',
    title: 'Potential Stroke / Neurological Emergency',
    keywords: ['sudden weakness', 'slurred speech', 'facial drooping', 'numbness', 'fainting'],
    condition: (answers) => {
      const text = JSON.stringify(answers).toLowerCase();
      return (text.includes('weakness') || text.includes('speech') || text.includes('paralysis') || text.includes('behosh')) &&
             (text.includes('sudden') || text.includes('ekdam') || text.includes('face'));
    },
    action: 'NEURO_TRIAGE_ALERT',
    patientMessage: 'Urgent medical attention may be required. Triage nurses are attending to you.',
  },
  {
    id: 'RF_SEVERE_BLEEDING',
    category: 'TRAUMA',
    severity: 'HIGH',
    title: 'Severe Uncontrolled Bleeding or Vomiting Blood',
    keywords: ['blood', 'vomiting blood', 'severe bleeding', 'khoon'],
    condition: (answers) => {
      const text = JSON.stringify(answers).toLowerCase();
      return text.includes('vomit blood') || text.includes('khoon ki ulti') || text.includes('heavy bleed');
    },
    action: 'NURSE_IMMEDIATE_ASSIST',
    patientMessage: 'Staff notified for urgent assistance.',
  },
  {
    id: 'RF_ACUTE_RESPIRATORY_DISTRESS',
    category: 'RESPIRATORY',
    severity: 'CRITICAL',
    title: 'Severe Respiratory Distress / Asthma Attack',
    keywords: ['cannot breathe', 'saans nahi aara', 'gasping', 'cyanosis', 'choking'],
    condition: (answers) => {
      const text = JSON.stringify(answers).toLowerCase();
      return text.includes('saans nahi') || text.includes('gasping') || text.includes('severe breathlessness');
    },
    action: 'OXYGEN_AND_TRIAGE_ALERT',
    patientMessage: 'Respiratory assistance requested.',
  }
];

module.exports = { RED_FLAG_RULES };
