export const WORK_ORDER_STATUS_LABELS = {
  open: 'Open',
  pending: 'Pending',
  completed: 'Completed',
};

export const WORK_ORDER_STATUS_COLORS = {
  open: 'info',
  pending: 'warning',
  completed: 'success',
};

export const WORK_ORDER_PRIORITY_LABELS = {
  scheduled: 'Scheduled',
  'non-scheduled': 'Non Scheduled',
  emergency: 'Emergency',
};

export const WORK_ORDER_PRIORITY_COLORS = {
  scheduled: 'info',
  'non-scheduled': 'default',
  emergency: 'error',
};

export const WORK_ORDER_STATUS_OPTIONS = Object.entries(WORK_ORDER_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
    color: WORK_ORDER_STATUS_COLORS[value] || 'default',
  })
);

export const WORK_ORDER_PRIORITY_OPTIONS = Object.entries(WORK_ORDER_PRIORITY_LABELS).map(
  ([value, label]) => ({
    value,
    label,
    color: WORK_ORDER_PRIORITY_COLORS[value] || 'default',
  })
);


export const WORK_ORDER_CATEGORY_OPTIONS = [
  "Inspection",
  "Upgrade",
  "On Road Breakdown",
  "Garage Work",
  "Accidental Vehicle",
  "On Route Maintenance",
  "Preventive Maintenance",
  "Others",
  "Breakdown",
  "Damage",
];
