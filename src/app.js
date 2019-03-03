const orders = require('../data/orders.json');
const users = require('../data/users.json');
const companies = require('../data/companies.json');

const all_users = Object.values(users);
let all_orders = Object.values(orders);
const all_companies = Object.values(companies);


const formatTimestamp = (timestamp) => {
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


const formatUser = (user_id) => {
  const user_data = all_users.find(user_data => user_data.id === user_id);
  let title;

  switch(user_data.gender) {
    case 'Male':
      title = 'Mr.';
      break;
    case 'Female':
      title = 'Ms.';
      break;
  }

  return `${title}  ${user_data.first_name} ${user_data.last_name}`;
};


const showUserDetails = (user_id, td) => {
  const user_name = formatUser(user_id);

  td.setAttribute("class", "user-id");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.setAttribute("class", "user-click");
  a.text = user_name;
  td.appendChild(a);

  const user_data = all_users.find(user_data => user_data.id === user_id);
  const company_data = all_companies.filter((item) => {
      return item.id === user_data["company_id"];
    })[0] || {};

  const div  = document.createElement("div");
  div.setAttribute("class", "user-details");
  div.setAttribute("style", "display: none");

  const birthday  = document.createElement("p");
  birthday.innerText = "Birthday: " + formatTimestamp(user_data["birthday"]).slice(0, 10);
  div.appendChild(birthday);

  const img  = document.createElement("img");
  img.setAttribute("src", user_data["avatar"]);
  img.setAttribute("width", "100px");
  div.appendChild(img);

  const company_p  = document.createElement("p");
  company_p.innerText = "Company: ";
  const company_a  = document.createElement("a");

  if(company_data.url){
    company_a.setAttribute("href", company_data.url || "");
    company_a.setAttribute("target", "_blank");
    company_a.text = company_data.title;
  }

  company_p.appendChild(company_a);
  div.appendChild(company_p);

  const industry = document.createElement("p");
  industry.innerText = "Industry: " + company_data["industry"];
  div.appendChild(industry);

  td.appendChild(div);
};

const ip2int = (ip) => {
  return ip.split('.').reduce((ipInt, octet) => {
    return (ipInt<<8) + parseInt(octet, 10)
  }, 0) >>> 0
};

const formatLocation = (country, ip) => `${country} (${ip})`;


const showData = (fields) => fields;

const getData = (fields) => fields;

const getCurrency = (fields) => [parseFloat(fields)];

const getUser = (user_id) => {
  const user_data = all_users.find(user_data => user_data.id === user_id[0]);
  return [user_data.first_name, user_data.last_name];
};

const getLocation = (fields) => {
  fields[1] = ip2int(fields[1]);
  return  fields
};


const col = [
  {"formatFunction": showData, fields: ["transaction_id"], "prepareSorting" : getData},
  {"modifyFunction": showUserDetails, fields: ["user_id"], "prepareSorting" : getUser},
  {"formatFunction": formatTimestamp, fields: ['created_at'], "prepareSorting" : getData},
  {"formatFunction": formatCurrency, fields: ["total"], "prepareSorting" : getCurrency},
  {"formatFunction": formatCard, fields: ["card_number"], },
  {"formatFunction": showData, fields: ["card_type"], "prepareSorting" : getData},
  {"formatFunction": formatLocation, fields: ["order_country", "order_ip"], "prepareSorting" : getLocation},
  ];

function drawOrders() {
  all_orders.forEach(function(order, i, all_orders) {
    const tr = document.createElement('tr');
    tr.setAttribute("id", "order_"+order.id);

    col.forEach(column => {
      const fields = column.fields.map(fieldName => order[fieldName]);
      const td = document.createElement("td");
      if (column.formatFunction){
        td.textContent = column.formatFunction(...fields);
      } else if (column.modifyFunction){
        column.modifyFunction(...fields, td);
      }
      tr.appendChild(td)
    });

    document.getElementById("tbody").appendChild(tr);
  });
  $('.user-click').click(function () {
    // .next() selects the A tag next sibling;
    $(this).next().slideToggle(200);
  });
  $('.user-details').slideUp(200);
}

const getTotalSum = (data) => {
  const sum = data.map(item => parseFloat(item["total"]));
  const total = sum.reduce((partial_sum, a) => partial_sum + a).toFixed(2);
  return total
};

const getMedian = (data) => {
  const values = data.map(item => parseFloat(item["total"]));
  values.sort((a, b) => a - b);
  let median = (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;
  return median
};

const getAverage = (data) => getTotalSum(data) / data.length;

const getCheck = (data, gender) => {
  const gender_users = data.filter( item => {
    return item.gender === gender;
  });

  const gender_total = gender_users.map(user => {
    let order = all_orders.find(item => item.user_id === user.id);
    return {"total": order.total}
  });

  return getAverage(gender_total);
};


function drawStatistics() {
  const oc_td = document.getElementById("order-count");
  oc_td.innerText = all_orders.length;

  const order_total = getTotalSum(all_orders);
  const ot_td = document.getElementById("order-total");
  ot_td.innerText = formatCurrency(order_total);

  const order_median = getMedian(all_orders);
  const om_td = document.getElementById("median");
  om_td.innerText = formatCurrency(order_median);

  const average_check = getAverage(all_orders);
  const ac_td = document.getElementById("average-check");
  ac_td.innerText = formatCurrency(average_check);

  const female_check = getCheck(all_users, "Female");
  const fc_td = document.getElementById("female-check");
  fc_td.innerText = formatCurrency(female_check);

  const male_check = getCheck(all_users, "Male");
  const mc_td = document.getElementById("male-check");
  mc_td.innerText = formatCurrency(male_check);


}

export default (function () {

  drawOrders();
  drawStatistics();

}());


const sortTable = (event) => {
  const target = event.target;

  if (target.tagName != 'TH') return;

  const header_num = target.cellIndex;
  const header_fields = col[header_num];

  if( !header_fields.prepareSorting) return;

  highlight(target);

  const fields = col[header_num].fields;

  const getText = (order_row) => {
    let row_value = fields.map(fieldName => order_row[fieldName]);

    if( header_fields.prepareSorting) {
      return header_fields.prepareSorting(row_value);
    }

  };

  all_orders.forEach(order_row => { order_row.value = getText(order_row)});
  all_orders = _.sortBy(all_orders, ['value.0', 'value.1']);

  const tbody = document.getElementById("tbody");
  tbody.innerHTML = '';
  drawOrders();

};

let selectedTh, cur_selector;

function highlight(node) {

  if (selectedTh) {
    selectedTh.removeChild(cur_selector);
  }
  selectedTh = node;
  const span = document.createElement("span");
  span.innerHTML = '&#8595';
  cur_selector = selectedTh.appendChild(span);
}


const thead = document.getElementsByTagName("thead")[0];
thead.onclick = sortTable;



































