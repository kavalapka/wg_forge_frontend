const orders = require('../data/orders.json');


function formatTimestamp(timestamp){
  const ms = new Date(timestamp*1000);
  const date = ms.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: true,
    hour: "2-digit",
    minute:"2-digit",
    second: "2-digit",
  });

  return date;
}

/**
 * 1234756756777890 => 12**********7890
 */
function formatCard(number) {
  number = number.replace(/(?<=\d{2})\d(?=\d{4})/g, '*');
  return number;
}

function formatCurrency(item) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

  return formatter.format(item);
}

export default (function () {

  const all_orders = Object.values(orders);
  const columns = ["transaction_id", "user_id", "created_at", "total", "card_number", "card_type"]; //, "order_country", "order_ip"];

  all_orders.forEach(function(order, i, all_orders) {

    const tr = document.createElement('tr');
    tr.setAttribute("id", "order_"+order.id);

    order["created_at"] = formatTimestamp(order["created_at"]);
    order["card_number"] = formatCard(order["card_number"]);
    order["total"] = formatCurrency(order["total"]);

    for(const key in columns) {
      const td = document.createElement("td");
      td.textContent = order[columns[key]];
      tr.appendChild(td);
    };

    const td = document.createElement("td");
    td.textContent = `${order["order_country"]} (${order["order_ip"]})`;
    tr.appendChild(td);

    document.getElementById("tbody").appendChild(tr);
  });


    // next line is for example only
    document.getElementById("app");
}());
