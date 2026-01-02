import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { COLORS } from '@/lib/constants';

/**
 * 404 Not Found Screen
 */
export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>This page doesn't exist</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go back to home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: 24,
  },
  link: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
