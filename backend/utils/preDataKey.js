const getKey = (data, option) => {
  let key = "";
  for (let el of data) {
    if (
      option.replace(" ", "").replace(" ", "").toLowerCase() ===
      el.label.replace(" ", "").replace(" ", "").toLowerCase()
    ) {
      key = el.value;
    }
  }

  if (key === "") {
    console.log({ data, option });
  }

  return key;
};

module.exports = { getKey };
