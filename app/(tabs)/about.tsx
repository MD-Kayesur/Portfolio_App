import GymCard from "@/components/gymCard/GymCard";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutPage() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center">
                <GymCard />
            </View>
        </SafeAreaView>
    );
}
