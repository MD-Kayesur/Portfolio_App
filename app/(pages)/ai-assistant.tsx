import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSendMessageMutation } from '@/redux/feature/chat/chatApi';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function AIAssistant() {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm MD's AI assistant. How can I help you today?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [sendMessage, { isLoading }] = useSendMessageMutation();
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');

        try {
            const response = await sendMessage({ message: userMessage.text }).unwrap();
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.reply,
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    item.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        item.sender === 'user' ? styles.userText : styles.aiText,
                    ]}
                >
                    {item.text}
                </Text>
            </View>
            <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#dc2626" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                    <View style={styles.statusContainer}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Online</Text>
                    </View>
                </View>
            </View>

            {/* Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me anything..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!inputText.trim() || isLoading}
                        style={[
                            styles.sendButton,
                            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={20} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#dc2626',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#6b7280',
    },
    messageList: {
        padding: 16,
        paddingBottom: 32,
    },
    messageContainer: {
        marginBottom: 20,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: '#4f46e5',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#f3f4f6',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: '#fff',
    },
    aiText: {
        color: '#1f2937',
    },
    timestamp: {
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 4,
        marginHorizontal: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#111827',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    sendButtonDisabled: {
        backgroundColor: '#a5b4fc',
    },
});
