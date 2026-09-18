import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useGetFeedbacksQuery, Feedback } from '@/redux/feature/feedback/feedbackApi';

// Fallback feedback items in case backend is loading or empty
const fallbackFeedbacks: Feedback[] = [
  {
    _id: "fb_1",
    name: "Sophia Lee",
    description: "Exceptional developer! Built a high-performance cross-platform mobile app on time and with incredible attention to detail.",
    rating: 5,
    location: "Seoul, South Korea",
    date: "Recent"
  },
  {
    _id: "fb_2",
    name: "James Anderson",
    description: "Outstanding experience working together. Strong problem-solving skills in React Native, MERN stack, and UI/UX design.",
    rating: 5,
    location: "Dubai, UAE",
    date: "Recent"
  },
  {
    _id: "fb_3",
    name: "Olivia Martinez",
    description: "Very impressed with the responsiveness, clean code architecture, and proactive communication throughout our project.",
    rating: 5,
    location: "Rome, Italy",
    date: "Recent"
  }
];

export default function FeedbackSlider() {
  const { data: apiFeedbacks, isLoading, isError } = useGetFeedbacksQuery();
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<ScrollView>(null);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Combine or prioritize API feedbacks
  const feedbacks: Feedback[] = (apiFeedbacks && apiFeedbacks.length > 0)
    ? apiFeedbacks
    : fallbackFeedbacks;

  const totalSlides = feedbacks.length;

  // Scroll to target slide index
  const scrollToSlide = useCallback((index: number, animated = true) => {
    if (containerWidth > 0 && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: index * containerWidth,
        animated,
      });
      setCurrentIndex(index);
    }
  }, [containerWidth]);

  // Handle Next Slide (with infinite loop)
  const handleNext = useCallback(() => {
    if (totalSlides === 0) return;
    const nextIdx = (currentIndex + 1) % totalSlides;
    scrollToSlide(nextIdx);
  }, [currentIndex, totalSlides, scrollToSlide]);

  // Handle Previous Slide
  const handlePrev = useCallback(() => {
    if (totalSlides === 0) return;
    const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
    scrollToSlide(prevIdx);
  }, [currentIndex, totalSlides, scrollToSlide]);

  // Auto-Slide Logic
  useEffect(() => {
    if (totalSlides <= 1 || isInteracting || containerWidth === 0) {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
        autoSlideTimerRef.current = null;
      }
      return;
    }

    autoSlideTimerRef.current = setInterval(() => {
      handleNext();
    }, 4000); // Auto-slides every 4 seconds

    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [totalSlides, isInteracting, containerWidth, handleNext]);

  // Track manual scroll position
  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (containerWidth <= 0) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIdx = Math.round(offsetX / containerWidth);
    if (newIdx >= 0 && newIdx < totalSlides) {
      setCurrentIndex(newIdx);
    }
    // Resume auto-slide after a short pause
    setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  const handleScrollBeginDrag = () => {
    setIsInteracting(true);
  };

  // Helper to render star ratings
  const renderStars = (ratingValue?: number | string) => {
    const numericRating = Math.min(5, Math.max(1, Number(ratingValue) || 5));
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= numericRating ? "star" : "star-outline"}
          size={16}
          color="#f59e0b"
          style={tw`mr-0.5`}
        />
      );
    }
    return stars;
  };

  // Helper to get initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <View 
      style={tw`w-full mt-10 mb-12`}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        if (width > 0 && width !== containerWidth) {
          setContainerWidth(width);
        }
      }}
    >
      {/* Section Header */}
      <View style={tw`flex-row items-center justify-between mb-6 px-1`}>
        <View style={tw`flex-1 pr-2`}>
          <View style={tw`flex-row items-center mb-1`}>
            <View style={tw`w-2 h-2 rounded-full bg-emerald-400 mr-2`} />
            <Text style={tw`text-purple-400 text-xs font-black uppercase tracking-widest`}>
              Client & Visitor Feedback
            </Text>
          </View>
          <Text style={tw`text-2xl font-black text-white`}>
            What People Say
          </Text>
        </View>

        {/* Manual Arrow Controls */}
        <View style={tw`flex-row items-center gap-2`}>
          <TouchableOpacity
            onPress={() => {
              setIsInteracting(true);
              handlePrev();
              setTimeout(() => setIsInteracting(false), 3000);
            }}
            style={tw`w-9 h-9 rounded-full bg-black/30 border border-white/15 items-center justify-center active:bg-white/20`}
            activeOpacity={0.7}
            accessibilityLabel="Previous feedback"
          >
            <Ionicons name="chevron-back" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsInteracting(true);
              handleNext();
              setTimeout(() => setIsInteracting(false), 3000);
            }}
            style={tw`w-9 h-9 rounded-full bg-black/30 border border-white/15 items-center justify-center active:bg-white/20`}
            activeOpacity={0.7}
            accessibilityLabel="Next feedback"
          >
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading state indicator if fetching initial data */}
      {isLoading && !feedbacks.length ? (
        <View style={tw`h-52 rounded-3xl border border-white/10 bg-white/5 items-center justify-center`}>
          <ActivityIndicator size="small" color="#c084fc" />
          <Text style={tw`text-gray-400 mt-2 font-mono text-xs`}>Loading feedback...</Text>
        </View>
      ) : (
        <>
          {/* Horizontal Slider (Auto + Manual Swipe) */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScrollBeginDrag={handleScrollBeginDrag}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            contentContainerStyle={containerWidth > 0 ? { width: containerWidth * totalSlides } : {}}
            style={tw`w-full`}
          >
            {feedbacks.map((item, index) => {
              const feedbackText = item.description || item.message || "Great work and excellent collaboration!";
              const hasValidImage = item.image && !imageErrors[item._id || index];

              return (
                <View
                  key={item._id || index}
                  style={[
                    { width: containerWidth > 0 ? containerWidth : '100%' },
                    tw`px-1`
                  ]}
                >
                  <View style={tw`rounded-3xl p-6 border border-white/10 bg-white/5 relative overflow-hidden shadow-2xl min-h-56 justify-between`}>
                    {/* Top Decorative Gradient Accent Line */}
                    <View style={tw`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500`} />

                    {/* Watermark Quote Icon */}
                    <View style={tw`absolute right-4 top-4 opacity-10 pointer-events-none`}>
                      <Ionicons name="chatbubbles-outline" size={72} color="white" />
                    </View>

                    {/* Header: Avatar, Name, Location, Rating */}
                    <View>
                      <View style={tw`flex-row items-center justify-between mb-4`}>
                        <View style={tw`flex-row items-center flex-1 pr-2`}>
                          {/* Avatar or Initial Circle */}
                          {hasValidImage ? (
                            <Image
                              source={{ uri: item.image }}
                              style={tw`w-12 h-12 rounded-full border-2 border-purple-500 mr-3.5 bg-purple-900/40`}
                              resizeMode="cover"
                              onError={() => {
                                setImageErrors((prev) => ({ ...prev, [item._id || index]: true }));
                              }}
                            />
                          ) : (
                            <View style={tw`w-12 h-12 rounded-full bg-purple-600/30 border-2 border-purple-400 items-center justify-center mr-3.5 shadow-md`}>
                              <Text style={tw`text-purple-300 font-bold text-base font-mono`}>
                                {getInitials(item.name)}
                              </Text>
                            </View>
                          )}

                          {/* Name & Location */}
                          <View style={tw`flex-1`}>
                            <Text style={tw`text-white font-bold text-lg leading-tight`} numberOfLines={1}>
                              {item.name || "Anonymous Visitor"}
                            </Text>

                            <View style={tw`flex-row items-center mt-1`}>
                              {item.location ? (
                                <View style={tw`flex-row items-center mr-2`}>
                                  <Ionicons name="location-outline" size={12} color="#a855f7" style={tw`mr-1`} />
                                  <Text style={tw`text-gray-400 text-xs`} numberOfLines={1}>
                                    {item.location}
                                  </Text>
                                </View>
                              ) : null}

                              {item.date ? (
                                <Text style={tw`text-gray-500 text-[11px]`}>
                                  • {item.date}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>

                        {/* Stars */}
                        <View style={tw`flex-row items-center bg-black/30 px-2.5 py-1 rounded-full border border-white/10`}>
                          {renderStars(item.rating)}
                        </View>
                      </View>

                      {/* Feedback Message Body */}
                      <Text style={tw`text-gray-300 text-base leading-6 italic mt-1`}>
                        "{feedbackText}"
                      </Text>
                    </View>

                    {/* Bottom Status / Slide Count */}
                    <View style={tw`flex-row items-center justify-between pt-4 mt-4 border-t border-white/10`}>
                      <View style={tw`flex-row items-center`}>
                        <Ionicons name="checkmark-circle" size={14} color="#10b981" style={tw`mr-1.5`} />
                        <Text style={tw`text-emerald-400 text-xs font-mono font-bold tracking-wide`}>
                          Verified Feedback
                        </Text>
                      </View>

                      <Text style={tw`text-gray-500 text-xs font-mono`}>
                        {index + 1} of {totalSlides}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Pagination Indicators (Dots / Pills) */}
          {/* {totalSlides > 1 && (
            <View style={tw`flex-row items-center justify-center mt-4 gap-1.5`}>
              {feedbacks.slice(0, 3).map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setIsInteracting(true);
                      scrollToSlide(idx);
                      setTimeout(() => setIsInteracting(false), 3000);
                    }}
                    style={[
                      tw`h-2 rounded-full transition-all duration-300`,
                      isActive ? tw`w-7 bg-purple-500` : tw`w-2 bg-white/20`
                    ]}
                    accessibilityLabel={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </View>
          )} */}
        </>
      )}
    </View>
  );
}
