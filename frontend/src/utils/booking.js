function getNowLocal() {
  const now = new Date();
  return now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
}

function getMaxLocal() {
  const max = new Date();
  // 2 hr window -- 2 hrs from now
  max.setHours(max.getHours() + 2);
  return max.toISOString().slice(0, 16);
}

export { getNowLocal, getMaxLocal }
