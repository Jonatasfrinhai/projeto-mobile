import { Slot, usePathname, router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

const ITENS = [
  { href: '/(tabs)/colecao', label: 'Coleção' },
  { href: '/(tabs)/escalar', label: 'Escalar' },
  { href: '/(tabs)/partida', label: 'Partida' },
  { href: '/(tabs)/perfil', label: 'Perfil' },
] as const;

// No mobile a navegação é por tabs embaixo (ver _layout.tsx).
// Na web fica mais natural ter uma navbar fixa no topo, como um site normal.
export default function TabsLayoutWeb() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.logo}>⚽ Futebol Cards</Text>
        <View style={styles.links}>
          {ITENS.map((item) => {
            const ativo = pathname.startsWith(item.href.replace('/(tabs)', ''));
            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href)}
                style={[styles.link, ativo && styles.linkAtivo]}
              >
                <Text style={[styles.linkTexto, ativo && styles.linkTextoAtivo]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
        <Slot />
      </ScrollView>
    </View>
  );
}

const VERDE = '#1b7a3d';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: { fontSize: 18, fontWeight: '700' },
  links: { flexDirection: 'row', gap: 8 },
  link: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  linkAtivo: { backgroundColor: '#eafaf0' },
  linkTexto: { color: '#555', fontWeight: '500' },
  linkTextoAtivo: { color: VERDE, fontWeight: '700' },
  conteudo: {
    width: '100%',
    maxWidth: 1000,
    marginHorizontal: 'auto',
    padding: 24,
  },
  scroll: {
    flex: 1,
  },
});
