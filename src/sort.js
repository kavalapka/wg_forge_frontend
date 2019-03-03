import {all_users} from './app';


export const getData = (fields) => fields;

export const getCurrency = (fields) => [parseFloat(fields)];

export const getUser = (user_id) => {
  const user_data = all_users.find(user_data => user_data.id === user_id[0]);
  return [user_data.first_name, user_data.last_name];
};

const ip2int = (ip) => {
  return ip.split('.').reduce((ipInt, octet) => {
      return (ipInt<<8) + parseInt(octet, 10)
    }, 0) >>> 0
};

export const getLocation = (fields) => {
  fields[1] = ip2int(fields[1]);
  return  fields
};