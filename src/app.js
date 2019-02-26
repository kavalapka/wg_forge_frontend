const orders = require('../data/orders.json');


export default (function () {

  const all_orders = Object.values(orders);
  const columns = ["transaction_id", "user_id", "created_at", "total", "card_number", "card_type"]; //, "order_country", "order_ip"];

  all_orders.forEach(function(order, i, all_orders) {

    const tr = document.createElement('tr');
    const order_id = "order_"+order.id;
    tr.setAttribute("id", order_id);

    for(const key in columns) {
      const td = document.createElement("td");
      console.log(key, columns, order[columns[key]]);
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
