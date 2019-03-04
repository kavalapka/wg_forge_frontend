require('./styles/style.css');
import { getTotalSum, getMedian, getAverage, getCheck } from './statistic';
import { formatTimestamp, formatCurrency, formatCard, formatLocation } from './format-functions';
import { showUserDetails } from './modify-functions';
import { getUser, ip2int } from './sort';

const orders = require('../data/orders.json');
const users = require('../data/users.json');
const companies = require('../data/companies.json');

export const all_users = {};
users.forEach(user_data => all_users[user_data.id] = user_data);

export let all_orders = orders.map(formatOrder);

export const all_companies = Object.values(companies);

let col_num, search_value;
const store = {"order_by": col_num,
               "search_by": search_value};


const col = [
  {fields: ["transaction_id"]},
  {"modifyFunction": showUserDetails, "prepareSorting" : ['format_user_id']},
  {fields: ['created_at']},
  {fields: ["total"], prepareSorting: ['total_float']},
  {fields: ["card_number"], noSort: true},
  {fields: ["card_type"]},
  {fields: ["order_country", "order_ip"], "prepareSorting" : ['order_country', 'ip_as_number']},
];


function formatOrder(order) {
  const {transaction_id, created_at, total, card_number, card_type, order_country, order_ip, user_id} = order;
  order.user_data = all_users[user_id];
  order.total_float = parseFloat(order.total);
  order.ip_as_number = ip2int(order.order_ip);

  order.format_transaction_id = transaction_id;
  order.format_created_at = formatTimestamp(created_at);
  order.format_total = formatCurrency(total);
  order.format_card_number = formatCard(card_number);
  order.format_card_type = card_type;
  order.format_order_country = formatLocation(order_country, order_ip);
  order.format_user_id = getUser(order.user_data);

  const search_keys = ["format_transaction_id", "format_total", "format_card_type",
    "format_order_country", "format_user_id"];
  order.search_string = search_keys.map(key => order[key]).join(' ').toLowerCase();
  return order
}

export default (function () {
  drawOrders(all_orders);
  drawStatistics(all_orders);
}());


function draw() {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = '';
  let orders_filtered = searchTable(all_orders);
  let orders_ordered = sortTable(orders_filtered, store.order_by);

  if (!orders_filtered.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute("colspan", "7");
    td.setAttribute("class", "nothing-found");
    td.innerText = "Nothing found";
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  drawOrders(orders_ordered);
  drawStatistics(orders_ordered);
}


function sortTable(orders, header_num) {
  if (!header_num) {
    return orders
  }
  const header_fields = col[header_num];
  const sorted = _.sortBy(orders, header_fields.prepareSorting || header_fields.fields);
  return sorted
}


const thead = document.getElementsByTagName("thead")[0].childNodes[3];
thead.onclick = function (event) {
  if (event.target.tagName != 'TH') return;
  if(col[event.target.cellIndex].noSort){
    return
  }
  store.order_by = event.target.cellIndex;
  highlight(event.target);
  draw();
};

const search  = document.getElementById('search');
search.onkeyup = _.debounce(draw, 350);


const searchTable = (orders) => {
  const input = document.getElementById("search");
  store.search_by = input.value;
  const orders_found = orders.filter(order => order.search_string.indexOf(store.search_by.toLowerCase()) > -1);
  return orders_found
};


function drawOrders(orders) {
  orders.forEach(function(order) {
    const tr = document.createElement('tr');
    tr.setAttribute("id", "order_"+order.id);

    col.forEach(column => {
      const td = document.createElement("td");
      if (column.modifyFunction){
        column.modifyFunction(order, td);
      } else {
        let fieldName = `format_${column.fields[0]}`;
        td.textContent = order[fieldName]
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


function drawStatistics(orders) {
  const oc_td = document.getElementById("order-count");
  oc_td.innerText = orders.length;

  const order_total = getTotalSum(orders);
  const ot_td = document.getElementById("order-total");
  ot_td.innerText = formatCurrency(order_total);

  const order_median = getMedian(orders);
  const om_td = document.getElementById("median");
  om_td.innerText = order_median;

  const average_check = getAverage(orders);
  const ac_td = document.getElementById("average-check");
  ac_td.innerText = average_check;

  const female_check = getCheck("Female", orders);
  const fc_td = document.getElementById("female-check");
  fc_td.innerText = female_check;

  const male_check = getCheck("Male", orders);
  const mc_td = document.getElementById("male-check");
  mc_td.innerText = male_check;
}


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



































