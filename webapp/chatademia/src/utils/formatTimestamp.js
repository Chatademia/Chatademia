export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const todaysDate = new Date();

  const isToday =
    date.getDate() === todaysDate.getDate() &&
    date.getMonth() === todaysDate.getMonth() &&
    date.getFullYear() === todaysDate.getFullYear();

  const HH = String(date.getHours()).padStart(2, "0");
  const MM = String(date.getMinutes()).padStart(2, "0");

  if (isToday) {
    return `${HH}:${MM}`;
  } else {
    const DD = String(date.getDate()).padStart(2, "0");
    const MM2 = String(date.getMonth() + 1).padStart(2, "0");
    const YYYY = date.getFullYear();

    return `${HH}:${MM} ${DD}.${MM2}.${YYYY}`;
  }
};
