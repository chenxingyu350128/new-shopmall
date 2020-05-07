
export default {
  // 获取
  getLocal (key) {
    const res = localStorage.getItem(key)
    return res !== null ? JSON.parse(localStorage.getItem(key)) : res
  },
  // 设置用
  setLocal (key, res) {
    localStorage.setItem(key, JSON.stringify(res))
  },
  clearLocal (key) {
    localStorage.removeItem(key)
  }
}
