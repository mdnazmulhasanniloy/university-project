export enum CONTRACT_STATUS {
  requested = 'requested',
  approved = 'approved',
  declined = 'declined',
  accepted = 'accepted',
  completed = 'completed',
  cancelled = 'cancelled',
}

export enum CONTRACT_TYPE {
  Hourly = 'Hourly',
  ProjectBased = 'Project Based',
}

export const contractStatusType = [
  CONTRACT_STATUS.requested,
  CONTRACT_STATUS.approved,
  CONTRACT_STATUS.declined,
  CONTRACT_STATUS.accepted,
  CONTRACT_STATUS.completed,
  CONTRACT_STATUS.cancelled,
];