import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="colecao" options={{ title: 'Coleção' }} />
      <Tabs.Screen name="escalar" options={{ title: 'Escalar' }} />
      <Tabs.Screen name="partida" options={{ title: 'Partida' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
