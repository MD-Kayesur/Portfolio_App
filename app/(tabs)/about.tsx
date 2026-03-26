import { ScrollView, View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from 'twrnc';
import ProjectCard from "@/components/projectCard/ProjectCard";

export default function AboutPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={tw`flex-1`}>
            {/* Back Button */}
            <Pressable
                onPress={() => router.back()}
                style={tw`absolute top-12 left-6 z-10 bg-white/10 p-2 rounded-full`}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            {/* We'll use a single ScrollView for the whole page. 
                Since ProjectCard itself has a ScrollView, we should probably 
                just use the content of ProjectCard here or make ProjectCard non-scrollable.
            */}
            <ScrollView
                contentContainerStyle={tw`flex-grow px-6 pt-24 pb-12`}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <View style={tw`items-center mb-10`}>
                    <View style={tw`w-32 h-32 rounded-full border-4 border-purple-500 p-1 mb-4`}>
                        <Image
                            source={require('@/assets/images/kayes.jpg')}
                            style={tw`w-full h-full rounded-full`}
                            resizeMode="cover"
                        />
                    </View>
                    <Text style={tw`text-white text-3xl font-bold text-center`}>About Me</Text>
                    <View style={tw`h-1 w-20 bg-purple-500 mt-2 rounded-full`} />
                </View>

                {/* Content Section */}
                <View style={tw`bg-white/20 p-6 rounded-3xl border border-white/10 mb-6`}>
                    <Text style={tw`text-purple-400 text-xl font-bold mb-4`}>Who I Am</Text>
                    <Text style={tw`text-white text-lg leading-7 mb-4`}>
                        I am a dedicated <Text style={tw`text-purple-400 font-bold`}>Full Stack Developer</Text> and <Text style={tw`text-purple-400 font-bold`}>App Developer</Text> with a passion for creating high-performance, responsive, and user-centric applications.
                    </Text>
                    <Text style={tw`text-white text-base leading-6 opacity-80`}>
                        My journey in tech began with a curiosity for how things work on the web, which led me to master the MERN stack. Recently, I've expanded my expertise into mobile app development, leveraging Expo and React Native to build seamless cross-platform experiences.
                    </Text>
                </View>

                {/* Projects Section - We'll add it here */}
                <View style={tw`mt-6`}>
                    <ProjectCard />
                </View>

                {/* Experience/Education */}
                <View style={tw`bg-white/10 p-6 rounded-3xl border border-white/10 mt-6`}>
                    <Text style={tw`text-purple-400 text-xl font-bold mb-4`}>My Mission</Text>
                    <Text style={tw`text-white text-base leading-6 opacity-80`}>
                        To bridge the gap between complex backend logic and elegant frontend design, delivering products that not only work perfectly but also provide an exceptional user experience.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
