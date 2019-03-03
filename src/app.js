import { getTotalSum, getMedian, getAverage, getCheck } from './statistic';
import { formatTimestamp, formatCurrency, formatCard, formatLocation, formatData } from './format-functions';
import { showUserDetails } from './modify-functions';
import { getCurrency, getData, getLocation, getUser } from './sort';

const orders = require('../data/orders.json');
const users = require('../data/users.json');
const companies = require('../data/companies.json');

export const all_users = Object.values(users);
export let all_orders = Object.values(orders);
export const all_companies = Object.values(companies);


const col = [
  {"formatFunction": formatData, fields: ["transaction_id"], "prepareSorting" : getData},
  {"modifyFunction": showUserDetails, fields: ["user_id"], "prepareSorting" : getUser},
  {"formatFunction": formatTimestamp, fields: ['created_at'], "prepareSorting" : getData},
  {"formatFunction": formatCurrency, fields: ["total"], "prepareSorting" : getCurrency},
  {"formatFunction": formatCard, fields: ["card_number"], },
  {"formatFunction": formatData, fields: ["card_type"], "prepareSorting" : getData},
  {"formatFunction": formatLocation, fields: ["order_country", "order_ip"], "prepareSorting" : getLocation},
  ];

const thead = document.getElementsByTagName("thead")[0];
thead.onclick = sortTable;


export default (function () {
  drawOrders();
  drawStatistics();
}());


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

  const female_check = getCheck(all_users, "Female", all_orders);
  const fc_td = document.getElementById("female-check");
  fc_td.innerText = formatCurrency(female_check);

  const male_check = getCheck(all_users, "Male", all_orders);
  const mc_td = document.getElementById("male-check");
  mc_td.innerText = formatCurrency(male_check);
}


function sortTable(event) {
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



































