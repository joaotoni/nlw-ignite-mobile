import dayjs from "dayjs";

export function generateDatesfromyearBegining() {
  const firstDayOfTheYear = dayjs().startOf("year");
  const today = new Date();

  const dates = [];

  let compareDate = firstDayOfTheYear;

  while (compareDate.isBefore(today)) {
    //enquanto for anterior a hoje, o while ira continuar funcionando
    dates.push(compareDate.toDate()); //ira ficar comparando as datas e somando uma após a outra
    compareDate = compareDate.add(1, "day");
  }

  return dates;
}
