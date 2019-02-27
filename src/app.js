const orders = require('../data/orders.json');
const users = require('../data/users.json');

const all_users = Object.values(users);
const all_orders = Object.values(orders);


const formatTimestamp = (timestamp) => {
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
const formatCard = (number) => {
  number = number.replace(/(?<=\d{2})\d(?=\d{4})/g, '*');
  return number;
};


const formatCurrency = (item) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

  return formatter.format(item);
};


const formatUser = (user_id, td) => {
  const user_data = all_users.find(user_data => user_data.id === user_id);
  var title;

  switch(user_data.gender) {
    case 'Male':
      title = 'Mr.';
      break;
    case 'Female':
      title = 'Ms.';
      break;
  }

  td.setAttribute("class", "user-id");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.text = `${title}  ${user_data.first_name} ${user_data.last_name}`;
  td.appendChild(a);
};


const formatlocation = (country, ip, td) => `${country} (${ip})`;


const showData = (fields) => fields;


const col = [
  {"formatFunction": showData, fields: ["transaction_id"]},
  {"modifyFunction": formatUser, fields: ["user_id"]},
  {"formatFunction": formatTimestamp, fields: ['created_at']},
  {"formatFunction": formatCurrency, fields: ["total"]},
  {"formatFunction": formatCard, fields: ["card_number"]},
  {"formatFunction": showData, fields: ["card_type"]},
  {"formatFunction": formatlocation, fields: ["order_country", "order_ip"]},
  ];

export default (function () {
  all_orders.forEach(function(order, i, all_orders) {
    const tr = document.createElement('tr');
    tr.setAttribute("id", "order_"+order.id);

    col.forEach(column => {
      const fields = column.fields.map(fieldName => order[fieldName]);
      const td = document.createElement("td");
      if (column.formatFunction){
        td.textContent = column.formatFunction(...fields, td);
      } else if (column.modifyFunction){
        column.modifyFunction(...fields, td);
      }
      
      tr.appendChild(td)
    });

    document.getElementById("tbody").appendChild(tr);
  });


    // next line is for example only
    document.getElementById("app");
}());
