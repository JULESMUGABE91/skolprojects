export default function formatSelectData(data, key_label, key_value) {
  let result;

  if (Array.isArray(data)) {
    result = [];

    for (let i = 0; i < data.length; i++) {
      let extra_data = data[i];

      result.push({
        value: key_value ? data[i][key_value] : data[i],
        label: key_label ? data[i][key_label] : data[i],
        ...extra_data,
      });
    }
  } else {
    let extra_data = data;
    result = {
      value: key_value ? data[key_value] : data,
      label: key_label ? data[key_label] : data,
      ...extra_data,
    };
  }

  return result;
}
