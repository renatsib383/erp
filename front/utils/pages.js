export const PAGES = [
    {
      path: '/deals',
      name: 'Объекты',
    },
    {
      path: '/deals/:id()',
      name: 'Объект',
    },    
    {
      path: '/imbox',
      name: 'Imbox',
    },    
    {
      path: '/tasks',
      name: 'Задачи',
    },    
    {
      path: '/calls',
      name: 'Звонки',
    },
    {
      path: '/profile',
      name: 'Профиль',
    },
    {
      path: '/companies',
      name: 'Компании',
    },
    {
      path: '/contacts',
      name: 'Контакты',
    },
    {
      path: '/contacts/:id()',
      name: 'Контакт',
    },
    {
      path: '/users',
      name: 'Пользователи',
    },
    {
      path: '/users/:id()',
      name: 'Пользователь',
    },
    {
      path: '/roles',
      name: 'Роли',
    },       
    {
      path: '/roles/:id()',
      name: 'Роль',
    },   
    {
      path: '/works',
      name: 'Работы',
    },       
    {
      path: '/works/:id()',
      name: 'Работа',
    },       
    {
      path: '/works-collections',
      name: 'Наборы работ',
    },       
    {
      path: '/works-collections/:id()',
      name: 'Набор работ',
    },
    {
      path: '/dds',
      name: 'ДДС',
    },
    {
      path: '/salary',
      name: 'ЗП',
    },
    {
      path: '/deductions',
      name: 'Вычеты',
    },
    {
      path: '/cash-registers',
      name: 'Кассы',
    },
  ]

  const _getPageName = (page,path,value) => {
    const pageObj = PAGES.find(item => item.path == path);
    // console.log('_getPageName page, path',page, path);
    if (pageObj) {
        if (page[0] == ':') {
            // return pageObj.name + ' ' + value; // Сделка 1
             return value; // 1, чтобы укоротить и корректно отобразить на мобиле
        }
        return pageObj.name;
    }
    return '';
  }


  export const getBreadcrumbs = (matched,path) => {
    // console.log('[pages.js] getBreadcrumbs path',matched,path);
    const crumbs =[];
    const matchedPath = matched[0].path;
    const pathArray = matchedPath.split('/').filter(Boolean);
    // console.log('pathArray',pathArray);
    const pathValuesArray = path.split('/').filter(Boolean);
    // console.log('pathValuesArray',pathValuesArray);

    pathArray.reduce((acc, matchedPath, index) => {
      const routePath = `${acc}/${matchedPath}`;
      const routePathValue = `${acc}/${pathValuesArray[index]}`
      crumbs.push({
        path: routePathValue,
        name: _getPageName(matchedPath,routePath,pathValuesArray[index]),
        last: index == pathArray.length - 1
      });
      return routePath;
    }, '');

    return crumbs;
  }