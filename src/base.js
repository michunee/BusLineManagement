export function getTimeDifference(startTime, endTime) {
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);

  let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());

  let days = Math.floor(timeDiff / (1000 * 3600 * 24));
  let hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
  let minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));

  let result = "";
  if (days > 0) {
    result += days + "d ";
  }
  if (hours > 0) {
    result += hours + "h ";
  }
  if (minutes > 0) {
    result += minutes + "m ";
  }
  return result.trim();
}
