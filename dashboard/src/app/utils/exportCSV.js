export default (headers, data) => {
  let _headers = headers.map((elt) => elt.title);
  let keys = headers.map((elt) => elt.key);

  const body = data.map((elt) => keys.map((key) => elt[key]));

  _headers.push(...body);

  return data;
};
