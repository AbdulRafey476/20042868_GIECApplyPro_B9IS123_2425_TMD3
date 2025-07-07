export default function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";
  return `${day}${suffix} ${month} ${year}`;
};