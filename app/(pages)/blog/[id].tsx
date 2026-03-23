
import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetBlogsQuery } from '@/redux/feature/blogs/blogApi';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

export default function BlogDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { data: blogs, isLoading } = useGetBlogsQuery();

    const blog = blogs?.find((b: any) => b._id === id);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    if (!blog) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Blog not found</Text>
                <TouchableOpacity
                    style={tw`mt-4 bg-indigo-600 px-6 py-2 rounded-full`}
                    onPress={() => router.back()}
                >
                    <Text style={tw`text-white font-bold`}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>Blog Detail</Text>
                    <View style={{ width: 40 }} /> {/* Spacer for centering title */}
                </View>

                {/* Hero Image */}
                <Image
                    source={{ uri: blog.media }}
                    style={styles.heroImage}
                    resizeMode="cover"
                />

                <View style={styles.content}>
                    {/* Metadata */}
                    <View style={styles.metaContainer}>
                        <View style={styles.dateBadge}>
                            <Ionicons name="calendar-outline" size={14} color="#6366f1" />
                            <Text style={styles.dateText}>{blog.date}</Text>
                        </View>
                        {blog.email && (
                            <View style={styles.authorBadge}>
                                <Ionicons name="person-outline" size={14} color="#6b7280" />
                                <Text style={styles.authorText}>{blog.email}</Text>
                            </View>
                        )}
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{blog.about}</Text>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.description}>
                        {blog.description}
                    </Text>

                    {/* Additional Content (Optional) */}
                    <View style={tw`mt-8 p-4 bg-indigo-50 rounded-2xl`}>
                        <Text style={tw`text-indigo-900 font-bold text-lg mb-2`}>
                            Key Insights
                        </Text>
                        <Text style={tw`text-indigo-700 leading-relaxed`}>
                            This blog post explores the fundamental concepts behind "{blog.about}".
                            Understanding these principles is crucial for mastering the subject and
                            implementing effective strategies in your journey.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    heroImage: {
        width: '100%',
        height: 250,
    },
    content: {
        padding: 20,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#eef2ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateText: {
        fontSize: 12,
        color: '#6366f1',
        fontWeight: '600',
    },
    authorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    authorText: {
        fontSize: 12,
        color: '#6b7280',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
        lineHeight: 34,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 26,
    },
    errorText: {
        fontSize: 18,
        color: '#6b7280',
        fontWeight: '600',
    },
});
