import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBarr } from "../components/ProfressBar";
import { CheckBox } from "../components/CheckBox";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { HabitEmpity } from "../components/HabitEmpity";
import { api } from "../lib/axios";
import { generateProgressPorcentage } from "../utils/generate-progress-percentage";
import clsx from "clsx";

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
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date())

  const habitsProgress = dayInfo?.possibleHabits.length 
    ? generateProgressPorcentage(dayInfo.possibleHabits.length, completeHabits.length) : 0

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

  async function HandleToggleHabit(habitId: string){
    try{
      await api.patch(`/habits/${habitId}/toggle`)
      if(completeHabits.includes(habitId)){
        setCompleteHabits(prevState => prevState.filter(habit => habit !== habitId))
      }else{
        setCompleteHabits(prevState => [...prevState, habitId])
      }
    }catch(error){
      console.log(error)
      Alert.alert('Ops', 'não foi possível atualizar as informações dos hábitos')
    }
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

        <ProgressBarr progress={habitsProgress} />

        <View className={clsx('mt-6', {
          ["opacity-50"]: isDateInPast
        })}>
          {
            dayInfo?.possibleHabits ?
            dayInfo?.possibleHabits.map( habit =>(
            <CheckBox 
              key={habit.id}
              title={habit.title} 
              checked={completeHabits.includes(habit.id)} 
              disabled={isDateInPast}
              onPress={() => HandleToggleHabit(habit.id)}
            />
            ))
            : <HabitEmpity />
          }
        </View>
        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar um hábitos de uma data passada
            </Text>
          )
        }
      </ScrollView>
    </View>
  );
}
