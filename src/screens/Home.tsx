import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";

import { generateDatesfromyearBegining } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesfromyearBegining();
const minimumSummaryDateSizes = 18 * 5;
const amaountOfDaysToFill = minimumSummaryDateSizes - datesFromYearStart.length;

export function Home() {
  const { navigate } = useNavigation();
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-06 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => (
            <HabitDay
              key={date.toISOString()}
              onPress={() => navigate("habit", { date: date.toISOString() })}
            />
          ))}
          {amaountOfDaysToFill > 0 &&
            Array.from({ length: amaountOfDaysToFill }).map((_, index) => (
              <View className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40" />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
