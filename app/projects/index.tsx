import React from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking,
} from 'react-native';
import { useGetProjectsQuery, Project } from '@/redux/feature/projects/projectApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

export default function ProjectList() {
    const { data: projects, isLoading, error } = useGetProjectsQuery();
    const router = useRouter();

    const openLink = async (url: string) => {
        try {
            if (url) await Linking.openURL(url);
        } catch (err) {
            console.error("Failed to open link:", err);
        }
    };

    if (isLoading) {
        return (
            <SafeScreen>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#9333ea" />
                    <Text style={styles.loadingText}>Loading projects...</Text>
                </View>
            </SafeScreen>
        );
    }

    if (error) {
        return (
            <SafeScreen>
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
                    <Text style={styles.errorText}>Error loading projects</Text>
                    <Text style={styles.errorSubtext}>Please try again later</Text>
                </View>
            </SafeScreen>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <SafeScreen>
                <View style={styles.centerContainer}>
                    <Ionicons name="grid-outline" size={60} color="#9ca3af" />
                    <Text style={styles.emptyText}>No projects found</Text>
                </View>
            </SafeScreen>
        );
    }

    const renderProjectItem = ({ item }: { item: Project }) => (
        <View style={styles.projectCard}>
            {/* Project Image */}
            <Image
                source={{ uri: item.image }}
                style={styles.projectImage}
                resizeMode="cover"
            />

            {/* Project Content */}
            <View style={styles.projectContent}>
                <Text style={styles.projectTitle}>{item.name}</Text>
                <Text style={styles.projectDescription} numberOfLines={3}>
                    {item.description}
                </Text>

                {/* Tech Stack */}
                <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
                    {item.techStack.map((tech, i) => (
                        <View key={i} style={tw`bg-purple-100 px-2.5 py-1 rounded-md`}>
                            <Text style={tw`text-purple-700 text-[10px] font-bold uppercase`}>{tech}</Text>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push(`/projects/${item._id}`)}
                    >
                        <Text style={styles.actionButtonText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>

                    {item.link && (
                        <TouchableOpacity
                            style={[styles.actionButton, tw`bg-gray-800`]}
                            onPress={() => openLink(item.link)}
                        >
                            <Ionicons name="logo-github" size={16} color="white" />
                            <Text style={styles.actionButtonText}>Live Link</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <SafeScreen>
            <View style={styles.container}>
                {/* Fixed Back Button - Absolute Position */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`absolute top-12 left-6 z-50 bg-white/10 p-3 rounded-full border border-white/5`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Header */}
                <View style={tw`px-6 pt-32 pb-6`}>
                    <Text style={styles.headerTitle}>My Projects</Text>
                    <Text style={styles.headerSubtitle}>
                        Featured {projects.length} Works
                    </Text>
                </View>

                {/* Project List */}
                <FlatList
                    data={projects}
                    renderItem={renderProjectItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#9ca3af',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    projectCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    projectImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#333',
    },
    projectContent: {
        padding: 20,
    },
    projectTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    projectDescription: {
        fontSize: 14,
        color: '#d1d5db',
        lineHeight: 22,
        marginBottom: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#9333ea',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    separator: {
        height: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#fff',
    },
    errorText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 4,
    },
    emptyText: {
        fontSize: 18,
        color: '#9ca3af',
        marginTop: 12,
    },
});
