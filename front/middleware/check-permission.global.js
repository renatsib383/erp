export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSanctumUser();
  // Чтобы не сломать мидлвар от sanctum не будет проводить проверку до того как пользователь не пройдет авторизацию
  if (!user.value) {
    return
  }

  // Для админа никаких проверок
  const root = user.value.roles.find(r => r.id === 1);
  if(root) return;

  // Пропускаем маршруты, где проверка не нужна
  const excludedRoutes = [
    '/account',
    '/403',
    '/',
    '/profile',
    '',
  ];

  if (excludedRoutes.includes(to.path) || to.path.startsWith('/account')) {
    return; // Пропускаем middleware для этих маршрутов
  }
  // Функция для проверки разрешения
  const checkPermission = (user, permission) => {
    if (!user || !user.permissions || !user.permissions.permissions) {
      return false;
    }

    const [resource, action] = permission.split('.');
    return user.permissions.permissions[resource]?.[action] === 1;
  }

  // На странице указывается, что нужно для доступа к этой странице
  const requiredPermission = to.meta.permission;

  if (!requiredPermission) {
    return;
  }

  const hasPermission = checkPermission(user.value, requiredPermission);

  if (!hasPermission) {
    return navigateTo('/403', { replace: true });
  }
});
