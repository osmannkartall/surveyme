export default function setMessageByCount(message, count) {
  let resultMessage = `${count} ${message}`;
  if (count > 1)
    resultMessage += 's';
  return resultMessage;
}
