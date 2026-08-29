import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { CollectionProvider } from '../src/contexts/CollectionContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CollectionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </CollectionProvider>
    </AuthProvider>
  );
}
