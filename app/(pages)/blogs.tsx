// app/(pages)/blogs.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useGetBlogsQuery } from '@/redux/feature/blogs/blogApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import BottomNavigation from '@/components/BottomNavigation';
import tw from 'twrnc';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function BlogList() {
  const { data: blogs, isLoading, error, refetch } = useGetBlogsQuery();
  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYClamped = Animated.diffClamp(scrollY, 0, 100);
  const tabBarTranslateY = scrollYClamped.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 100],
      extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading blogs...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen>
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-red-500/10 p-5 rounded-full border border-red-500/20 mb-4 items-center justify-center`}>
            <Ionicons name="cloud-offline-outline" size={48} color="#ef4444" />
          </View>
          <Text style={tw`text-xl font-bold text-white text-center font-mono mb-2`}>
            Database Connection Issue
          </Text>
          <Text style={tw`text-sm text-gray-400 text-center mb-6 leading-6 max-w-xs font-mono`}>
            Currently don't have data or failed to load from database. Please check your connection.
          </Text>

          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              style={tw`bg-indigo-600 px-5 py-3 rounded-xl flex-row items-center gap-2 shadow-lg`}
              onPress={() => refetch?.()}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={18} color="white" />
              <Text style={tw`text-white font-bold font-mono text-sm`}>Retry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-white/10 border border-white/10 px-5 py-3 rounded-xl flex-row items-center gap-2`}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back-outline" size={18} color="white" />
              <Text style={tw`text-white font-bold font-mono text-sm`}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeScreen>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <SafeScreen>
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-amber-500/10 p-5 rounded-full border border-amber-500/20 mb-4 items-center justify-center`}>
            <Ionicons name="document-text-outline" size={48} color="#f59e0b" />
          </View>
          <Text style={tw`text-xl font-bold text-white text-center font-mono mb-2`}>
            No Blogs Found
          </Text>
          <Text style={tw`text-sm text-gray-400 text-center mb-6 leading-6 max-w-xs font-mono`}>
            Currently don't have blog data loaded from database.
          </Text>

          <TouchableOpacity
            style={tw`bg-white/10 border border-white/10 px-5 py-3 rounded-xl flex-row items-center gap-2`}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back-outline" size={18} color="white" />
            <Text style={tw`text-white font-bold font-mono text-sm`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  const handleBlogPress = (id: string) => {
    router.push(`/(pages)/blog/${id}`);
  };

  const renderBlogItem = ({ item }: { item: any }) => (
    <View style={styles.blogCard}>
      {/* Blog Image */}
      <Image
        source={{ uri: item.media }}
        style={styles.blogImage}
        resizeMode="cover"
      />

      {/* Blog Content */}
      <View style={styles.blogContent}>
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={14} color="#6366f1" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* Blog Title */}
        <Text style={styles.blogTitle} numberOfLines={2}>
          {item.about}
        </Text>

        {/* Blog Description */}
        <Text style={styles.blogDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Author Info (if email exists) */}
        {item.email && (
          <View style={styles.authorContainer}>
            <Ionicons name="person-circle-outline" size={20} color="#6b7280" />
            <Text style={styles.authorEmail}>{item.email}</Text>
          </View>
        )}

        {/* Read More Button - ONLY CLICKABLE AREA */}
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => handleBlogPress(item._id)}
          activeOpacity={0.6}
        >
          <Text style={styles.readMoreText}>Read More</Text>
          <Ionicons name="arrow-forward" size={16} color="#6366f1" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>My Blogs</Text>
            <Text style={styles.headerSubtitle}>
              {blogs.length} {blogs.length === 1 ? 'Post' : 'Posts'}
            </Text>
          </View>
        </View>


        {/* Blog List */}
        <AnimatedFlatList
          data={blogs}
          renderItem={renderBlogItem}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: Platform.OS !== 'web' }
          )}
          scrollEventThrottle={16}
        />
      </View>
      <BottomNavigation translateY={tabBarTranslateY} />
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
    backgroundColor: 'transparent',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 16,
    paddingTop: 0,
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
    marginRight: 4,
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
  blogCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  blogImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
  },
  blogContent: {
    padding: 16,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 28,
  },
  blogDescription: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 22,
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  authorEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  separator: {
    height: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 12,
  },
});