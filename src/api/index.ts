// Central API barrel - re-export existing API helpers
// Use `import { apiServices, getGroups, getProperties, getUser, postUser } from '@/api'`

import { apiServices } from "./apiServices";
import getGroups from "./getGroups";
import getProperties from "./getProperties";
import fetchAllHobbies from "./getHobbies";

export { apiServices, getGroups, getProperties, fetchAllHobbies };
export * from "./getUser";
export * from "./postUser";

// Default convenience export
const api = { apiServices, getGroups, getProperties, fetchAllHobbies };
export default api;
