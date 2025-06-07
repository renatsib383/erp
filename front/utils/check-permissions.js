export const checkPermission = (section, action, roleId = null) => {
  const user = useSanctumUser()

  // Если админ то доступ сразу
  const root = user.value.roles.find(r => r.id === 1);
  if(root) return true;
  // Проверяем, есть ли указанная роль,
  if (roleId !== null) {
    const hasRole = user.value.roles.some(role => role.id === roleId);
    if (!hasRole) {
      return false;
    }
  }

  // Проверяем наличие раздела и действия в permissions
  const permissions = user.value.permissions.permissions;
  if (!permissions[section] || !permissions[section][action]) {
    return false;
  }

  return permissions[section][action] === 1;
}