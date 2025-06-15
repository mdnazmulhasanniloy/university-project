export const USER_ROLE = {
  super_admin: 'super_admin',
  sub_admin: 'sub_admin',
  admin: 'admin',
  service_provider: 'seller',
  user: 'customer',
};

export const gender = ['Male', 'Female', 'Others'];
export const Role = [
  'admin',
  'super_admin',
  'sub_admin',
  'seller',
  'customer',
];

export const userSearchableFields = ['name', 'email'];
export const RessearchAbleFields = ['name', 'owner'];

export const userFilterableFields = [''];

export const userExcludeFields = [
  'searchTerm',
  'page',
  'limit',
  'latitude',
  'longitude',
];
