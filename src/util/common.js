export default {
  setLocal(key, val) {
    localStorage.setItem(
      key,
      typeof val !== "string" ? JSON.stringify(val) : val
    );
  },
  getLocal(key) {
    const res = localStorage.getItem(key);
    try {
      const x = JSON.parse(res);
      return x;
    } catch (e) {
      return res;
    }
  },
  clearLocal(key) {
    localStorage.removeItem(key);
  }
};
