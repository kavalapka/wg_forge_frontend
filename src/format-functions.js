export const formatTimestamp = (timestamp) => {
  if(!timestamp){return "-"}
  const ms = new Date(timestamp*1000);
  return ms.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: true,
    hour: "2-digit",
    minute:"2-digit",
    second: "2-digit",
  });
};


/**
 * 1234756756777890 => 12**********7890
 */
export const formatCard = (number) => {
  number = number.replace(/(?<=\d{2})\d(?=\d{4})/g, '*');
  return number;
};


export const formatCurrency = (item) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

  return formatter.format(item);
};


export const formatUser = (order) => {
  const {format_user_id, user_data} = order;
  let title;

  switch(user_data.gender) {
    case 'Male':
      title = 'Mr.';
      break;
    case 'Female':
      title = 'Ms.';
      break;
  }

  return `${title}  ${format_user_id}`;
};

export const formatLocation = (country, ip) => `${country} (${ip})`;

