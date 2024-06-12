export const isHoliday = async (date: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://isdayoff.ru/${date}`);
    if (response.ok) {
      const data = await response.text();
      return data === "1";
    } else {
      console.error("Ошибка при получении статуса праздника", response.status);
      return false;
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    return false;
  }
};
