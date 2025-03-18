import React from "react";
import { Tabs } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";

// Custom tab bar component that only shows the tabs we want
function CustomTabBar({ state, descriptors, navigation }) {
  // We only want to show these three tabs
  const visibleRoutes = ["home", "mosques", "settings"];

  return (
    <View style={styles.tabBar}>
      {visibleRoutes.map((route, index) => {
        const isFocused =
          state.routes.findIndex((r) => r.name === route) === state.index;
        const { options } =
          descriptors[state.routes.find((r) => r.name === route).key];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route);
          }
        };

        // Render the appropriate icon based on the route
        let icon;
        if (route === "home") {
          icon = (
            <Ionicons
              name="home"
              size={24}
              color={isFocused ? "#00a86b" : "#888"}
            />
          );
        } else if (route === "mosques") {
          icon = (
            <FontAwesome5
              name="mosque"
              size={22}
              color={isFocused ? "#00a86b" : "#888"}
            />
          );
        } else if (route === "settings") {
          icon = (
            <Ionicons
              name="settings"
              size={24}
              color={isFocused ? "#00a86b" : "#888"}
            />
          );
        }

        return (
          <TouchableOpacity
            key={route}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {icon}
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? "#00a86b" : "#888" },
              ]}
            >
              {options.title || route}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Index",
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="mosques"
        options={{
          title: "Mosques",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />

      <Tabs.Screen
        name="mosque-search"
        options={{
          title: "Search",
          // Hide this screen from the tab bar
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});
