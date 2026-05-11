import React, { useState } from 'react';
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
    ScrollView,
} from 'react-native';
import projectsData from '@/utils/projectsData.json';
import { useGetProjectsQuery, Project } from '@/redux/feature/projects/projectApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

// Project interface is imported from projectApi

export default function ProjectList() {
    const router = useRouter();
    const { data: projects, isLoading, isError } = useGetProjectsQuery();
    const [activeTab, setActiveTab] = useState('All');

    const openLink = async (url: string) => {
        try {
            if (url) await Linking.openURL(url);
        } catch (err) {
            console.error("Failed to open link:", err);
        }
    };

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
                    {item.skills.map((skill, i) => (
                        <View key={i} style={tw`bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-500/20`}>
                            <Text style={tw`text-purple-700 dark:text-purple-400 text-[10px] font-bold uppercase`}>{skill}</Text>
                        </View>
                    ))}
                </View>

                {/* Action Buttons Row */}
                <View style={tw`flex-col gap-2`}>
                    <View style={tw`flex-row gap-2`}>
                        <TouchableOpacity
                            style={[styles.actionButton, tw`bg-purple-600 flex-1`]}
                            onPress={() => router.push(`/projects/${item._id}`)}
                        >
                            <Text style={styles.actionButtonText}>View Details</Text>
                            <Ionicons name="arrow-forward" size={16} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row gap-2`}>
                        {item.liveLink && (
                            <TouchableOpacity
                                style={[styles.actionButton, tw`bg-emerald-600 flex-1`]}
                                onPress={() => openLink(item.liveLink)}
                            >
                                <Ionicons name="globe-outline" size={14} color="white" />
                                <Text style={tw`text-white text-[12px] font-bold`}>Live</Text>
                            </TouchableOpacity>
                        )}
                        {item.codeLink && (
                            <TouchableOpacity
                                style={[styles.actionButton, tw`bg-gray-800 flex-1`]}
                                onPress={() => openLink(item.codeLink)}
                            >
                                <Ionicons name="logo-github" size={14} color="white" />
                                <Text style={tw`text-white text-[12px] font-bold`}>Client Code</Text>
                            </TouchableOpacity>
                        )}
                        {item.serverCodeLink && (
                            <TouchableOpacity
                                style={[styles.actionButton, tw`bg-slate-700 flex-1`]}
                                onPress={() => openLink(item.serverCodeLink)}
                            >
                                <Ionicons name="server-outline" size={14} color="white" />
                                <Text style={tw`text-white text-[12px] font-bold`}>Server Code</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <SafeScreen>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#9333ea" />
                    <Text style={styles.loadingText}>Loading Projects...</Text>
                </View>
            </SafeScreen>
        );
    }

    if (isError || !projects) {
        return (
            <SafeScreen>
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text style={styles.errorText}>Oops! Failed to load projects</Text>
                    <TouchableOpacity
                        style={[styles.actionButton, tw`mt-6 px-8 bg-purple-600`]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.actionButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeScreen>
        );
    }

    const filteredProjects = projects?.filter(project => {
        if (activeTab === 'All') return true;
        
        // Map "Costome code" tab back to "custom code" implementation status
        const filterVal = activeTab === 'Costome code' ? 'custom code' : activeTab.toLowerCase();
        return project.implementation?.toLowerCase() === filterVal;
    }) || [];

    return (
        <SafeScreen>
            <View style={styles.container}>
                <View style={tw`flex flex-col justify-center items-center`}>

{/* Fixed Back Button - Absolute Position */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`absolute top-12 left-6 z-50 bg-white/10 p-3 rounded-full border border-white/5`}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                {/* Header */}
                <View style={tw`px-6 pt-12 pb-4`}>
                    <Text style={styles.headerTitle}>My Projects</Text>
                    <Text style={styles.headerSubtitle}>
                        Featured {filteredProjects.length} Works
                    </Text>
                </View>
                </View>
                

                {/* Tabs */}
                <View style={tw`px-6 pb-6`}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`flex-row gap-3`}>
                        {['All', 'Costome code', 'webflow', 'Wordpress'].map(tab => (
                            <TouchableOpacity 
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[
                                    tw`px-5 py-2.5 rounded-full border`,
                                    activeTab === tab 
                                        ? tw`bg-purple-600 border-purple-600` 
                                        : tw`bg-transparent border-white/20`
                                ]}
                            >
                                <Text style={[
                                    tw`text-sm font-semibold font-mono`,
                                    activeTab === tab ? tw`text-white` : tw`text-gray-400`
                                ]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Project List */}
                <FlatList
                    data={filteredProjects}
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
