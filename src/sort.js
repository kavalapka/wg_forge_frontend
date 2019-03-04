export const getUser = (user_data) => {
  return `${user_data.first_name} ${user_data.last_name}`;
};

export const ip2int = (ip) => {
  return ip.split('.').reduce((ipInt, octet) => {
      return (ipInt<<8) + parseInt(octet, 10)
    }, 0) >>> 0
};
