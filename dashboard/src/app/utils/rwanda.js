import rwanda from "../assets/rwanda.json";

export const provinces = () => {
  let p_data = [],
    keys = Object.keys(rwanda);

  for (let i = 0; i < keys.length; i++) {
    p_data.push({
      label: keys[i],
      value: keys[i],
    });
  }

  return p_data;
};

export const districts = (province) => {
  let d_data = [],
    keys = Object.keys(rwanda[province]);

  for (let i = 0; i < keys.length; i++) {
    d_data.push({
      label: keys[i],
      value: keys[i],
    });
  }

  return d_data;
};
export const sectors = (province, district) => {
  let s_data = [],
    keys = Object.keys(rwanda[province][district]);

  for (let i = 0; i < keys.length; i++) {
    s_data.push({
      label: keys[i],
      value: keys[i],
    });
  }

  return s_data;
};
export const cells = (province, district, sector) => {
  let c_data = [],
    keys = Object.keys(rwanda[province][district][sector]);

  for (let i = 0; i < keys.length; i++) {
    c_data.push({
      label: keys[i],
      value: keys[i],
    });
  }

  return c_data;
};
export const villages = (province, district, sector, cell) => {
  let v_data = [],
    keys = rwanda[province][district][sector][cell];

  for (let i = 0; i < keys.length; i++) {
    v_data.push({
      label: keys[i],
      value: keys[i],
    });
  }

  return v_data;
};
