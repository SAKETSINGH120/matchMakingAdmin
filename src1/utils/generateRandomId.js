function generateRandomId() {
  return Math.random() + "" + Date.now();
}

export default generateRandomId;
