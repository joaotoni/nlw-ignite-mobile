import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBarr } from "../components/ProfressBar";
import { CheckBox } from "../components/CheckBox";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";

interface Params {
  date: string;
}

interface DayInfoProps{
  completeHabits: string[],
  possibleHabits: {
    id: string,
    title: string,
  }[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [ dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [ completeHabits, setCompleteHabits] = useState<string[]>([])

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  async function fetchHabits(){
    try{
      
      const response = await api.get('/day', { params: {date}})
      setDayInfo(response.data)
      setCompleteHabits(response.data.completeHabits)

    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
    } finally {
      setLoading(false)
    }
    if (loading){
      return (
        <Loading />
      )
    }
    useEffect(()=> {
      fetchHabits()
    }, [])
  }

  async function HandleToggleHabit(habitid: string){

  }
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3">{dayAndMonth}</Text>

        <ProgressBarr progress={40} />

        <View className="mt-6">
          {
            dayInfo?.possibleHabits &&
            dayInfo?.possibleHabits.map( habit =>(
            <CheckBox 
              key={habit.id}
              title={habit.title} 
              checked={completeHabits.includes(habit.id)} 
            />
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
}
