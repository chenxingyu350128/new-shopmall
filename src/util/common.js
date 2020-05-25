
export default {
  // 获取
  getLocal (key) {
    const res = JSON.stringify(localStorage.getItem(key))
    console.log(key)
    console.log(res)
    console.log(typeof res)
    return res ? JSON.parse(res) : ''
  },
  // 设置用
  setLocal (key, res) {
    localStorage.setItem(key, JSON.stringify(res))
  },
  clearLocal (key) {
    localStorage.removeItem(key)
  }
}
