import { menus } from "../constants/sidebar-menus";

export default (pathname) => {
  let sub_menus = [],
    pathname_array = pathname ? pathname.split("/") : [],
    title = "";
  for (let i = 0; i < menus.length; i++) {
    sub_menus.push(...menus[i].menus);
  }

  for (let i = 0; i < sub_menus.length; i++) {
    if (pathname && pathname === sub_menus[i].route) {
      title = sub_menus[i].title;
    }
  }

  return title
    ? title
    : pathname_array.length > 0 && pathname_array[pathname_array.length - 1];
};
