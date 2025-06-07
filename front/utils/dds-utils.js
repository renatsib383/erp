export const getDDSDuplicates = (ddsList) => {
  const operationMap = new Map();

  ddsList.forEach((operation, index) => {
    const dealId = operation.deal?.id ?? 'null';
    const prorab = operation.prorab ?? 'null';
    const date = operation.date_transaction ? new Date(operation.date_transaction).toDateString() : null;

    // Создание уникального ключа на основе нижеукзанных полей
    const key = `${date}|${operation.type}|${prorab}|${dealId}|${operation.total}`;

    if (operationMap.has(key)) {
      operation.isDuplicate = true;

      const originalIndex = operationMap.get(key);
      ddsList[originalIndex].isDuplicate = true;

    } else {
      operationMap.set(key, index);
      operation.isDuplicate = false;
    }
  });
  return ddsList
}