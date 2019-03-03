export  const getTotalSum = (data) => {
    const sum = data.map(item => parseFloat(item["total"]));
    const total = sum.reduce((partial_sum, a) => partial_sum + a).toFixed(2);
    return total
  };

export const getMedian = (data) => {
    const values = data.map(item => parseFloat(item["total"]));
    values.sort((a, b) => a - b);
    let median = (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;
    return median
  };

export const getAverage = (data) => getTotalSum(data) / data.length;

export const getCheck = (users, gender, orders) => {
    const gender_users = users.filter( item => {
      return item.gender === gender;
    });

   const gender_total = gender_users.map(user => {
      let order = orders.find(item => item.user_id === user.id);
      return {"total": order.total}
    });

    return getAverage(gender_total);
  };


