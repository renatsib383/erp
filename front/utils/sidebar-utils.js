// Меню
export const menuItems = [
    {
        title: "Рабочий стол",
        route: "/",
        icon: "/images/menu/dashboard.svg",
        icon_active: "/images/menu/dashboard_active.svg",
        width: "32",
        height: "32",
        name: "home",
        showOnMobile: true,
        important: true,
        permission_title: "Dashboard",
    },
    {
        title: "Объекты",
        route: "/deals",
        icon: "/images/menu/deals.svg",
        icon_active: "/images/menu/deals_active.svg",
        width: "32",
        height: "32",
        name: "deals",
        important: true,
        permission_title: "Deal",
    },
    // {
    //     title: "imBox",
    //     route: "/imbox",
    //     icon: "/images/menu/imbox.svg",
    //     icon_active: "/images/menu/imbox_active.svg",
    //     width: "32",
    //     height: "32",
    //     name: "imbox",
    //     important: false,
    //     permission_title: "Imbox",
    // },
    {
        title: "Задачи",
        route: "/tasks",
        icon: "/images/menu/tasks.svg",
        icon_active: "/images/menu/tasks_active.svg",
        width: "32",
        height: "32",
        name: "tasks",
        important: false,
        permission_title: "Task",
    },
    {
        title: "Звонки",
        route: "/calls",
        icon: "/images/menu/analytics.svg",
        icon_active: "/images/menu/analytics_active.svg",
        width: "32",
        height: "32",
        name: "calls",
        important: false,
        permission_title: "Call",
    },
    {
        title: "ДДС",
        route: "/dds",
        icon: "/images/menu/dds.svg",
        icon_active: "/images/menu/dds_active.svg",
        width: "32",
        height: "32",
        name: "dds",
        important: false,
        permission_title: "Dds",
    },
    {
        title: "Зарплата",
        route: "/salary",
        icon: "/images/menu/salary.svg",
        icon_active: "/images/menu/salary_active.svg",
        width: "32",
        height: "32",
        name: "salary",
        important: false,
        permission_title: "Salary",
    },
    {
        title: "Вычеты",
        route: "/deductions",
        icon: "/images/menu/deductions.svg",
        icon_active: "/images/menu/deductions_active.svg",
        width: "32",
        height: "32",
        name: "deductions",
        important: false,
        permission_title: "Deduction",
    },
    {
        title: "Списки",
        icon: "/images/menu/list.svg",
        icon_active: "/images/menu/list_active.svg",
        width: "32",
        height: "32",
        name: "lists",
        important: false,
        permission_title: "List",
    },
    {
        title: "Статистика",
        icon: "/images/menu/statistics.svg",
        icon_active: "/images/menu/statistics_active.svg",
        width: "32",
        height: "32",
        name: "finance",
        important: false,
    },
];

export const bottomMenuItems = [
    // {
    //     title: "Профиль",
    //     route: "/profile",
    //     icon: "/images/menu/users.svg",
    //     icon_active: "/images/menu/users_active.svg",
    //     width: "32",
    //     height: "32",
    //     name: "profile",
    // },
    // {
    //     title: "Уведомления",
    //     // icon: "/images/menu/bell.svg",
    //     // icon_active: "/images/menu/bell_active.svg",
    //     svg: "bell",
    //     width: "32",
    //     height: "32",
    //     name: "notifications",
    // }
]

// Списки
export const list =  {
    groups: [
        {
            name: 'Система',
            items: [
                {
                    title: "Контакты",
                    route: "/contacts",
                    icon: "/images/menu/contact.svg",
                    icon_active: "/images/menu/contact_active.svg",
                    width: "32",
                    height: "32",
                    name: "contacts",
                    permission_title: "Contact",
                },
                {
                    title: "Компании",
                    route: "/companies",
                    icon: "/images/menu/team.svg",
                    icon_active: "/images/menu/team_active.svg",
                    width: "32",
                    height: "32",
                    name: "companies",
                    permission_title: "Company",
                },
                {
                    title: "Пользователи",
                    route: "/users",
                    icon: "/images/menu/users.svg",
                    icon_active: "/images/menu/users_active.svg",
                    width: "32",
                    height: "32",
                    name: "users",
                    permission_title: "User",
                },
                {
                    title: "Роли",
                    route: "/roles",
                    icon: "/images/menu/users.svg",
                    icon_active: "/images/menu/users_active.svg",
                    width: "32",
                    height: "32",
                    name: "role",
                    permission_title: "Role",
                },
                {
                    title: "Должности",
                    route: "/positions",
                    icon: "/images/menu/users.svg",
                    icon_active: "/images/menu/users_active.svg",
                    width: "32",
                    height: "32",
                    name: "position",
                    permission_title: "Position",
                },
            ]
        },
        {
            name: 'Работа',
            items: [
                {
                    title: "Работы",
                    route: "/works",
                    icon: "/images/menu/work.svg",
                    icon_active: "/images/menu/work_active.svg",
                    width: "32",
                    height: "32",
                    name: "works",
                    permission_title: "Work",
                },
                {
                    title: "Наборы работ",
                    route: "/works-collections",
                    icon: "/images/menu/work.svg",
                    icon_active: "/images/menu/work_active.svg",
                    width: "32",
                    height: "32",
                    name: "works-collections",
                    permission_title: "WorkCollection",
                },
                // {
                //   title: "Категории и группы",
                //   route: "works.categories.index",
                //   icon: "/images/menu/work.svg",
                //   icon_active: "/images/menu/work_active.svg",
                //   width: "35",
                //   height: "35",
                //   name: "works.categories",
                // },
            ]
        },
        {
            name: 'Тест',
            items: [
                {
                    title: "Sandbox",
                    route: "/sandbox",
                    icon: "/images/menu/dashboard.svg",
                    icon_active: "/images/menu/dashboard_active.svg",
                    width: "32",
                    height: "32",
                    name: "sandbox",
                    important: false,
                },
            ]
        }
    ],
    included: ['contacts', 'companies', 'users', 'roles', 'positions', 'works', 'works-collections', 'sandbox']
}

export const finance =  {
    groups: [
        {
            name: 'Финансы',
            items: [
                {
                    title: "Кассы",
                    route: "/cash-registers",
                    icon: "/images/menu/cash_reg.svg",
                    icon_active: "/images/menu/cash_reg_active.svg",
                    width: "32",
                    height: "32",
                    name: "cash-registers",
                },
            ]
        },
    ],
    included: ['cash-registers']
}
