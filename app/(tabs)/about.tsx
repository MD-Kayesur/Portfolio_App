import GymCard from "@/components/gymCard/GymCard";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutPage() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 items-center justify-center py-6">
                    <GymCard />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
