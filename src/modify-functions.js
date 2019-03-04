import { all_companies } from './app';
import { formatUser, formatTimestamp } from './format-functions';

export const showUserDetails = (order, td) => {
  const {user_data} = order
  const user_name = formatUser(order);

  td.setAttribute("class", "user-id");
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.setAttribute("class", "user-click");
  a.text = user_name;
  td.appendChild(a);

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