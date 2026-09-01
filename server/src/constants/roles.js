const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  KIOSK_ADMIN: 'KIOSK_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

const PERMISSIONS = {
  [ROLES.PATIENT]: ['view_own_data', 'complete_intake', 'upload_docs'],
  [ROLES.DOCTOR]: ['view_assigned_patients', 'edit_clinical_summary', 'approve_clinical_summary', 'create_referral', 'set_followup'],
  [ROLES.NURSE]: ['view_triage_dashboard', 'acknowledge_red_flag', 'escalate_alert', 'manage_queue'],
  [ROLES.RECEPTIONIST]: ['register_patient', 'manage_queue', 'assign_doctor'],
  [ROLES.HOSPITAL_ADMIN]: ['view_analytics', 'manage_users', 'manage_doctors', 'manage_departments', 'configure_rules'],
  [ROLES.KIOSK_ADMIN]: ['view_kiosks', 'manage_kiosk_health', 'restart_kiosk', 'configure_kiosk'],
  [ROLES.SUPER_ADMIN]: ['manage_all', 'system_audit', 'abdm_config'],
};

module.exports = { ROLES, PERMISSIONS };
