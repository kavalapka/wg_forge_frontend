import { formatCurrency } from './format-functions';


export  const getTotalSum = (data) => {
    const sum = data.map(item => item.total_float);
    const total = sum.reduce((partial_sum, a) => partial_sum + a, 0).toFixed(2);
    return total
  };

export const getMedian = (data) => {
    const values = data.map(item => item.total_float);
    values.sort((a, b) => a - b);
    let median = (values[(values.length - 1) >> 1] + values[values.length >> 1]) / 2;
    if (isNaN(median)){
      return 'n/a'
    } else {
      return formatCurrency(median)
    }
  };

export const getAverage = (data) => {
  const average = getTotalSum(data) / data.length;
  if (isNaN(average)){
    return 'n/a'
  } else {
    return formatCurrency(average)
  }
};

export const getCheck = (gender, orders) => {
  const gender_total = orders
    .filter(order => order.user_data && order.user_data.gender == gender)
    .map(order => {return {total_float: order.total_float}});
  return getAverage(gender_total);
  };


