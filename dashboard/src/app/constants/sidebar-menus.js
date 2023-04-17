export const menus = [
  {
    group: "Home",
    icon: "bx-home",
    route: "/dashboard/home",
  },
  {
    group: "Organizations",
    icon: "bxs-buildings",
    route: "/dashboard/home/organizations",
  },
  {
    group: "Live Map",
    icon: "bxs-map",
    route: "/dashboard/home/map",
  },
  {
    group: "Surveys",
    icon: "bx-time-five",
    access: [{ isOrgRequired: true }],
    items: [
      {
        name: "All Surveys",
        access: [{ isOrgRequired: true }, { isSurveyRequired: true }],
        group: "Surveys",
      },
      {
        name: "Questions",
        route: "/dashboard/home/questions",
        access: [{ isOrgRequired: true }, { isSurveyRequired: true }],
        group: "Surveys",
      },
      {
        name: "Answers",
        route: "/dashboard/answers",
        access: [{ isOrgRequired: true }, { isSurveyRequired: true }],
        group: "Surveys",
      },
    ],
    show: true,
  },
  {
    group: "Report",
    icon: "bx-file",
    route: "/dashboard/home/report",
  },
  // {
  //   group: "Performance",
  //   icon: "bx-user-check",
  //   route: "/dashboard/home/performance",
  // },
  {
    group: "Accounts",
    icon: "bx-group",
    route: "/dashboard/accounts",
  },
  {
    group: "Settings",
    route: "/dashboard/settings",
    icon: "bx-cog",
  },
];
