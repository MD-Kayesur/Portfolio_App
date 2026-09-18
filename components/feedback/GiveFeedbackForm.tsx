import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAddFeedbackMutation } from '@/redux/feature/feedback/feedbackApi';
import { playTypingSound } from '@/utils/typingSound';

interface GiveFeedbackFormProps {
  onInputFocus?: (targetRef: React.RefObject<any>) => void;
}

export default function GiveFeedbackForm({ onInputFocus }: GiveFeedbackFormProps = {}) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [previewUri, setPreviewUri] = useState('');
  const [rating, setRating] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'location' | 'message' | null>(null);

  // Field & Container refs for keyboard-aware auto-scrolling
  const nameContainerRef = useRef<View>(null);
  const nameInputRef = useRef<TextInput>(null);
  const locationContainerRef = useRef<View>(null);
  const locationInputRef = useRef<TextInput>(null);
  const messageContainerRef = useRef<View>(null);
  const messageInputRef = useRef<TextInput>(null);

  const fileInputRef = useRef<any>(null);
  const [addFeedback, { isLoading }] = useAddFeedbackMutation();

  const handleFieldFocus = (
    fieldKey: 'name' | 'location' | 'message',
    containerRef: React.RefObject<any>,
    inputRef: React.RefObject<any>
  ) => {
    setFocusedField(fieldKey);

    // 1. Web / Mobile browser: smoothly scroll the active input above keyboard
    if (Platform.OS === 'web') {
      const scrollTarget = () => {
        try {
          const el = inputRef.current || containerRef.current;
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest',
            });
          }
        } catch (err) {}
      };

      // Trigger immediately and after virtual keyboard expansion delay
      setTimeout(scrollTarget, 80);
      setTimeout(scrollTarget, 280);
    }

    // 2. Native: trigger parent ScrollView scroll coordination
    if (onInputFocus) {
      onInputFocus(containerRef);
    }
  };

  const ratingDescriptions: Record<number, string> = {
    5: "Exceptional! 🌟",
    4: "Very Good ✨",
    3: "Good Experience 👍",
    2: "Fair",
    1: "Needs Improvement"
  };

  // Trigger file selection from browser or native device gallery
  const handlePickImage = async () => {
    try {
      if (Platform.OS === 'web' && fileInputRef.current) {
        fileInputRef.current.click();
        return;
      }

      // Native ImagePicker
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow access to your photo library to upload an avatar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // 1. Immediately set the local URI for guaranteed instant preview (no base64 decoding bottleneck)
        setPreviewUri(asset.uri);
        setImageError(false);

        // 2. Prepare payload for API storage
        const mime = asset.mimeType || 'image/jpeg';
        const payload = asset.base64
          ? `data:${mime};base64,${asset.base64}`
          : asset.uri;
        setImage(payload);
      }
    } catch (err) {
      console.warn("Error picking image:", err);
      if (Platform.OS === 'web' && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Handle native Web file upload
  const handleWebFileSelect = (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Alert.alert("File Too Large", "Please choose an image under 5MB.");
        return;
      }
      // Instant browser blob preview
      try {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUri(objectUrl);
        setImageError(false);
      } catch (err) {}

      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setImage(result);
          if (!previewUri) {
            setPreviewUri(result);
          }
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name.");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Required", "Please enter your feedback message.");
      return;
    }

    try {
      const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });

      await addFeedback({
        name: name.trim(),
        location: location.trim() || 'Visitor',
        description: message.trim(),
        message: message.trim(),
        image: image || previewUri || undefined,
        rating: rating,
        date: formattedDate,
      }).unwrap();

      setIsSuccess(true);
      setName('');
      setLocation('');
      setMessage('');
      setImage('');
      setPreviewUri('');
      setImageError(false);
      setRating(5);

      // Reset success banner after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      Alert.alert(
        "Submission Failed",
        "Could not save your feedback at this time. Please check your connection and try again."
      );
    }
  };

  return (
    <View style={tw`w-full mt-2 mb-10`}>
      <View style={tw`rounded-3xl p-6 border border-purple-500/30 bg-white/5 relative overflow-hidden shadow-2xl`}>
        {/* Top Accent Gradient Line */}
        <View style={tw`absolute top-0 left-0 right-0 h-1 bg-purple-500`} />

        {/* Hidden Web File Input */}
        {Platform.OS === 'web' && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleWebFileSelect}
          />
        )}

        {/* Header Badge & Title */}
        <View style={tw`mb-5`}>
          <View style={tw`flex-row items-center mb-1.5`}>
            <View style={tw`w-2 h-2 rounded-full bg-purple-400 mr-2`} />
            <Text style={tw`text-purple-400 text-xs font-mono font-bold uppercase tracking-widest`}>
              Share Your Thoughts
            </Text>
          </View>
          <Text style={tw`text-2xl font-black text-white mb-1`}>
            Leave Feedback
          </Text>
          <Text style={tw`text-gray-400 text-sm leading-5`}>
            Your review will appear live in the feedback slider above!
          </Text>
        </View>

        {/* Success Banner */}
        {isSuccess && (
          <View style={tw`bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-2xl mb-5 flex-row items-center`}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" style={tw`mr-3`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-emerald-300 font-bold text-sm font-mono`}>
                Feedback Submitted! 🎉
              </Text>
              <Text style={tw`text-emerald-200/80 text-xs mt-0.5`}>
                Thank you for your review. It has been added to the slider above!
              </Text>
            </View>
          </View>
        )}

        {/* Star Rating Selector */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-white text-sm font-bold mb-2`}>
            Rate Your Experience
          </Text>
          <View style={tw`flex-row items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/10`}>
            <View style={tw`flex-row items-center`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  style={tw`p-1`}
                  accessibilityLabel={`${star} stars`}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={28}
                    color="#f59e0b"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={tw`text-amber-400 text-xs font-mono font-bold ml-2`}>
              {ratingDescriptions[rating]}
            </Text>
          </View>
        </View>

        {/* Image Selection Field (Direct from Browser/Device - No URL input needed) */}
        <View style={tw`mb-5`}>
          <Text style={tw`text-gray-300 text-xs font-mono rounded-full font-bold uppercase mb-2 ml-1`}>
            Your Photo / Avatar (Optional)
          </Text>

          {(previewUri || image) ? (
            /* Selected Image Preview with Change & Remove options */
            <View style={tw`bg-black/40 border-2 border-purple-500/50 rounded-2xl p-4 flex-row items-center justify-between shadow-2xl`}>
              <View style={tw`flex-row items-center flex-1 pr-3`}>
                <View style={tw`relative mr-3.5`}>
                  {!imageError ? (
                    <Image
                      source={{ uri: previewUri || image }}
                      style={tw`w-14 h-14 rounded-full border-2 border-purple-400 bg-purple-950/60 shadow-lg`}
                      resizeMode="cover"
                      onError={(err) => {
                        console.warn("Avatar preview load error:", err.nativeEvent);
                        if (previewUri && image && previewUri !== image) {
                          setPreviewUri(image);
                        } else {
                          setImageError(true);
                        }
                      }}
                    />
                  ) : (
                    <View style={tw`w-14 h-14 rounded-full border-2 border-purple-400 bg-purple-950/80 items-center justify-center shadow-lg`}>
                      <Ionicons name="person" size={24} color="#c084fc" />
                    </View>
                  )}
                  {/* Verified check badge */}
                  <View style={tw`absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full items-center justify-center border-2 border-black`}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                </View>

                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center mb-0.5`}>
                    <Ionicons name="checkmark-circle" size={15} color="#10b981" style={tw`mr-1`} />
                    <Text style={tw`text-emerald-400 font-mono font-bold text-xs`}>
                      Image Cropped & Selected
                    </Text>
                  </View>
                  <Text style={tw`text-white font-bold text-sm`} numberOfLines={1}>
                    Avatar Ready
                  </Text>
                  <Text style={tw`text-purple-300/80 text-[11px] font-mono mt-0.5`}>
                    Will appear in feedback slider
                  </Text>
                </View>
              </View>

              <View style={tw`flex-row items-center gap-2`}>
                <TouchableOpacity
                  onPress={handlePickImage}
                  style={tw`bg-purple-600/30 border border-purple-400/40 px-3 py-2 rounded-xl flex-row items-center active:bg-purple-600/50`}
                  activeOpacity={0.7}
                  accessibilityLabel="Change photo"
                >
                  <Ionicons name="swap-horizontal" size={14} color="#c084fc" style={tw`mr-1`} />
                  <Text style={tw`text-purple-300 font-mono text-xs font-bold`}>
                    Change
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setImage('');
                    setPreviewUri('');
                    setImageError(false);
                  }}
                  style={tw`bg-red-500/20 border border-red-500/30 p-2 rounded-xl active:bg-red-500/40`}
                  activeOpacity={0.7}
                  accessibilityLabel="Remove photo"
                >
                  <Ionicons name="trash-outline" size={15} color="#f87171" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Upload Trigger Button */
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.8}
              style={tw`border-2 border-dashed border-purple-500/40 bg-purple-950/20 rounded-2xl p-5 items-center justify-center`}
            >
              <View style={tw`w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/40 items-center justify-center mb-2 shadow-md`}>
                <Ionicons name="cloud-upload-outline" size={24} color="#c084fc" />
              </View>
              <Text style={tw`text-white font-bold text-sm mb-1`}>
                Select Photo from Browser / Device
              </Text>
              <Text style={tw`text-gray-400 text-xs font-mono text-center`}>
                Choose any image file from your device (PNG, JPG, WEBP)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Name Field */}
        <View ref={nameContainerRef} style={tw`mb-4`}>
          <View style={tw`flex-row items-center justify-between mb-1.5 ml-1`}>
            <Text style={tw`text-gray-300 text-xs font-mono font-bold uppercase`}>
              Your Name *
            </Text>
            {focusedField === 'name' && (
              <Text style={tw`text-purple-400 font-mono text-[10px] font-bold tracking-wider uppercase`}>
                Active Field
              </Text>
            )}
          </View>
          <TextInput
            ref={nameInputRef}
            style={[
              tw`bg-black/30 border rounded-2xl px-4 py-3.5 text-white font-mono text-base`,
              focusedField === 'name'
                ? tw`border-purple-500 bg-purple-950/30 shadow-lg`
                : tw`border-white/15`,
              Platform.OS === 'web' && ({
                transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
              } as any),
            ]}
            placeholder="e.g. John Doe"
            placeholderTextColor="#9ca3af"
            value={name}
            onFocus={() => handleFieldFocus('name', nameContainerRef, nameInputRef)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(text) => {
              setName(text);
              playTypingSound();
            }}
            onKeyPress={() => {
              playTypingSound();
            }}
            autoCapitalize="words"
          />
        </View>

        {/* Location Field */}
        <View ref={locationContainerRef} style={tw`mb-4`}>
          <View style={tw`flex-row items-center justify-between mb-1.5 ml-1`}>
            <Text style={tw`text-gray-300 text-xs font-mono font-bold uppercase`}>
              Location / City (Optional)
            </Text>
            {focusedField === 'location' && (
              <Text style={tw`text-purple-400 font-mono text-[10px] font-bold tracking-wider uppercase`}>
                Active Field
              </Text>
            )}
          </View>
          <TextInput
            ref={locationInputRef}
            style={[
              tw`bg-black/30 border rounded-2xl px-4 py-3.5 text-white font-mono text-base`,
              focusedField === 'location'
                ? tw`border-purple-500 bg-purple-950/30 shadow-lg`
                : tw`border-white/15`,
              Platform.OS === 'web' && ({
                transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
              } as any),
            ]}
            placeholder="e.g. Dhaka, Bangladesh or New York, USA"
            placeholderTextColor="#9ca3af"
            value={location}
            onFocus={() => handleFieldFocus('location', locationContainerRef, locationInputRef)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(text) => {
              setLocation(text);
              playTypingSound();
            }}
            onKeyPress={() => {
              playTypingSound();
            }}
          />
        </View>

        {/* Message Field */}
        <View ref={messageContainerRef} style={tw`mb-6`}>
          <View style={tw`flex-row items-center justify-between mb-1.5 ml-1`}>
            <Text style={tw`text-gray-300 text-xs font-mono font-bold uppercase`}>
              Your Feedback *
            </Text>
            {focusedField === 'message' && (
              <Text style={tw`text-purple-400 font-mono text-[10px] font-bold tracking-wider uppercase`}>
                Active Field
              </Text>
            )}
          </View>
          <TextInput
            ref={messageInputRef}
            style={[
              tw`bg-black/30 border rounded-2xl px-4 py-3.5 text-white font-mono text-base min-h-28`,
              focusedField === 'message'
                ? tw`border-purple-500 bg-purple-950/30 shadow-lg`
                : tw`border-white/15`,
              Platform.OS === 'web' && ({
                transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
              } as any),
            ]}
            placeholder="Share your feedback, thoughts on this app, or experience working together..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            value={message}
            onFocus={() => handleFieldFocus('message', messageContainerRef, messageInputRef)}
            onBlur={() => setFocusedField(null)}
            onChangeText={(text) => {
              setMessage(text);
              playTypingSound();
            }}
            onKeyPress={() => {
              playTypingSound();
            }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
          style={[
            tw`py-4 rounded-2xl items-center justify-center flex-row shadow-xl`,
            isLoading ? tw`bg-purple-600/50` : tw`bg-purple-600 active:bg-purple-700`
          ]}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-bold font-mono text-base`}>
                Submitting Feedback...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="send" size={18} color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-bold font-mono text-base tracking-wide`}>
                Submit Feedback
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
