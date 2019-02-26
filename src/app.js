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

export default (function () {

  const all_orders = Object.values(orders);
  const columns = ["transaction_id", "user_id", "created_at", "total", "card_number", "card_type"]; //, "order_country", "order_ip"];

  all_orders.forEach(function(order, i, all_orders) {

    const tr = document.createElement('tr');
    const order_id = "order_"+order.id;
    tr.setAttribute("id", order_id);
    order["created_at"] = formatTimestamp(order["created_at"]) ;


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
