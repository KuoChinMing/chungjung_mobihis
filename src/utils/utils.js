// @param {string} [patientsGender] - format: 0 || 1
const gender = function(patientsGender) {
  switch (patientsGender) {
    case "0":
      return "女";
    case "1":
      return "男";
    default:
      return "--";
  }
};

// @param {string} [age] - format: 07411
// @returns {string} - format: '74Y11M'
const fullAge = function(age) {
  if (!age) return "--";

  return `${+age.slice(0, 3)}Y${age.slice(3, 5)}M`;
};

// @param {string} [time] - format: 1091105 || 1091105000000
// @returns {string} - format: '2020/11/05'
const RocToBc = function(time) {
  if (!time) return "--";

  const year = +time.slice(0, 3) + 1911;
  const month = time.slice(3, 5);
  const date = time.slice(5, 7);

  return `${year}/${month}/${date}`;
};

// @param {string} date - format: 2020-11-09
// @returns {string} - format: '2020年11月9日'
const formatDate = function(date) {
  const dateFormat = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleString("zh-TW", dateFormat);
};

export { gender, fullAge, RocToBc, formatDate };
export default { gender, fullAge, RocToBc, formatDate };
