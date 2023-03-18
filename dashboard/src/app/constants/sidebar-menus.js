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
