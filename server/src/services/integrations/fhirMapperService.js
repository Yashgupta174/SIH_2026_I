class FHIRMapperService {
  toFHIRBundle(patient, session, summary) {
    return {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Patient',
            id: patient._id ? patient._id.toString() : 'PAT_001',
            identifier: [
              { system: 'https://healthid.ndhm.gov.in', value: patient.abhaId || 'ABHA_DEFAULT' },
              { system: 'https://hospital.org/patid', value: patient.hospitalId || 'HOSP_001' }
            ],
            name: [{ text: patient.fullName }],
            gender: (patient.gender || 'male').toLowerCase(),
            birthDate: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '1985-06-15',
          }
        },
        {
          resource: {
            resourceType: 'Condition',
            id: 'COND_001',
            clinicalStatus: { coding: [{ code: 'active' }] },
            code: { text: summary?.chiefComplaint || session?.chiefComplaint || 'Clinical Consultation' },
            subject: { reference: `Patient/${patient._id}` },
            note: [{ text: summary?.historyOfPresentIllness || 'HPI recorded' }]
          }
        },
        {
          resource: {
            resourceType: 'Composition',
            id: 'COMP_001',
            status: 'final',
            type: { text: 'Clinical Intake Summary' },
            date: new Date().toISOString(),
            title: 'MediKiosk Verified Clinical Intake',
            section: [
              { title: 'Chief Complaint', text: { status: 'generated', div: summary?.chiefComplaint || '' } },
              { title: 'History of Present Illness', text: { status: 'generated', div: summary?.historyOfPresentIllness || '' } },
              { title: 'Medications', text: { status: 'generated', div: summary?.currentMedications || '' } },
              { title: 'Allergies', text: { status: 'generated', div: summary?.allergies || '' } }
            ]
          }
        }
      ]
    };
  }
}

module.exports = new FHIRMapperService();
