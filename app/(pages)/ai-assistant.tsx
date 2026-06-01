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
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSendMessageMutation } from '@/redux/feature/chat/chatApi';
import Markdown from 'react-native-markdown-display';
import { BlurView } from 'expo-blur';

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
            text: "Hello! I'm MD Kayesur's AI assistant. You can ask me about MD Kayesur ?",
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
                {item.sender === 'ai' ? (
                    <Markdown 
                        style={markdownStyles}
                        onLinkPress={(url) => {
                            Linking.openURL(url);
                            return true;
                        }}
                    >
                        {item.text}
                    </Markdown>
                ) : (
                    <Text
                        style={[
                            styles.messageText,
                            styles.userText,
                        ]}
                    >
                        {item.text}
                    </Text>
                )}
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
                    <Ionicons name="arrow-back" size={24} color="white" />
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
                ListFooterComponent={isLoading ? (
                    <View style={[styles.messageContainer, styles.aiMessage]}>
                        <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                            <View style={styles.typingDots}>
                                <View style={styles.dot} />
                                <View style={[styles.dot, styles.dot2]} />
                                <View style={[styles.dot, styles.dot3]} />
                            </View>
                        </View>
                    </View>
                ) : null}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <BlurView
                    intensity={90}
                    tint="light"
                    style={styles.inputContainer}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me anything..."
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
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
                </BlurView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingTop: 40,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
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
        color: '#fff',
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
        color: '#9ca3af',
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
        backgroundColor: 'rgba(243, 244, 246, 0.85)',
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
        borderTopColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#fff',
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
    typingBubble: {
        width: 60,
        paddingVertical: 8,
    },
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#9ca3af',
    },
    dot2: {
        opacity: 0.6,
    },
    dot3: {
        opacity: 0.3,
    },
});

const markdownStyles: any = {
    body: {
        color: '#1f2937',
        fontSize: 14,
        lineHeight: 25,
    },
    paragraph: {
        marginVertical: 4,
        lineHeight: 25,
    },
    code_inline: {
        color: '#1f2937',
        fontSize: 14,
        fontWeight: 'bold',
    },
    heading1: {
        color: '#111827',
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 10,
    },
    heading2: {
        color: '#111827',
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 8,
    },
    bullet_list: {
        marginVertical: 10,
    },
    list_item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    strong: {
        fontWeight: 'bold',
    },
    link: {
        color: '#4f46e5',
        textDecorationLine: 'underline',
    },
    table: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 4,
        marginVertical: 10,
    },
    tr: {
        borderBottomWidth: 1,
        borderColor: '#d1d5db',
        flexDirection: 'row',
    },
    th: {
        flex: 1,
        padding: 5,
        fontWeight: 'bold',
        backgroundColor: '#f3f4f6',
    },
    td: {
        flex: 1,
        padding: 5,
    },
};
