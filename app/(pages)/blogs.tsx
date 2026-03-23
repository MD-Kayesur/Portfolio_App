// app/(pages)/blogs.tsx
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
} from 'react-native';
import { useGetBlogsQuery } from '@/redux/feature/blogs/blogApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';

const { width } = Dimensions.get('window');

export default function BlogList() {
  const { data: blogs, isLoading, error } = useGetBlogsQuery();
  const router = useRouter();

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
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
          <Text style={styles.errorText}>Error loading blogs</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </SafeScreen>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <SafeScreen>
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={60} color="#9ca3af" />
          <Text style={styles.emptyText}>No blogs available</Text>
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
          <Text style={styles.headerTitle}>My Blogs</Text>
          <Text style={styles.headerSubtitle}>
            {blogs.length} {blogs.length === 1 ? 'Post' : 'Posts'}
          </Text>
        </View>

        {/* Blog List */}
        <FlatList
          data={blogs}
          renderItem={renderBlogItem}
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
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 12, // Reduced from 60 to have a normal gap with SafeScreen
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
  },
  blogCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#111827',
    marginBottom: 8,
    lineHeight: 28,
  },
  blogDescription: {
    fontSize: 14,
    color: '#6b7280',
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