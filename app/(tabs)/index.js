import { Redirect } from "expo-router";

// This file redirects to the home tab but doesn't show in the tab bar
export default function TabsIndex() {
  return <Redirect href="/(tabs)/home" />;
}
