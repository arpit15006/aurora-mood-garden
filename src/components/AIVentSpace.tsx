
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Loader2, Heart, Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isVoice?: boolean;
}

const AIVentSpace = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const groqApiKey = "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";

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initialize speech synthesis
      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const callGroqAPI = async (prompt: string, isVoiceMode = false, conversationHistory: Message[] = []) => {
    try {
      const systemContent = isVoiceMode
        ? `You are Aurora, a compassionate AI emotional support companion designed specifically for students. You are currently in voice conversation mode. Your role is to:

1. Listen without judgment in a conversational way
2. Provide emotional validation and support with a warm speaking tone
3. Help students process their feelings through dialogue
4. Offer gentle guidance when appropriate
5. Be empathetic, warm, and understanding
6. Never diagnose or provide medical advice
7. Encourage professional help when needed
8. Use a gentle, supportive tone perfect for voice interaction
9. Remember you're talking to students facing academic and life pressures
10. Reference previous parts of the conversation to show you're listening and understanding

Keep responses conversational, warm, and natural for voice interaction. Use shorter sentences and a speaking tone. Avoid complex formatting. Be supportive and empathetic as if you're having a real conversation.`
        : `You are Aurora, a compassionate AI emotional support companion designed specifically for students. Your role is to:

1. Listen without judgment
2. Provide emotional validation and support
3. Help students process their feelings
4. Offer gentle guidance when appropriate
5. Be empathetic, warm, and understanding
6. Never diagnose or provide medical advice
7. Encourage professional help when needed
8. Use a gentle, supportive tone
9. Remember you're talking to students facing academic and life pressures
10. Reference previous parts of the conversation to show you're listening and understanding

Keep responses conversational, supportive, and focused on emotional wellness. Don't try to "fix" everything - sometimes just being heard is enough.`;

      // Convert conversation history to API format, excluding the welcome message
      const conversationMessages = conversationHistory
        .filter(msg => msg.id !== 'welcome') // Exclude welcome message
        .slice(-10) // Keep only last 10 messages to avoid token limits
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: systemContent
            },
            ...conversationMessages,
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: isVoiceMode ? 400 : 800,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please know that I'm here for you, and you can try again in a moment. Your feelings are valid, and I want to support you.";
    }
  };

  // Voice-related functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      // Try to use a female voice if available
      const voices = synthRef.current.getVoices();
      const femaleVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('moira')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isVoiceMode) {
      stopListening();
      stopSpeaking();
    }
  };

  const sendMessage = async (isVoiceMessage = false) => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      isVoice: isVoiceMessage
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    // Get AI response with conversation history
    const aiResponse = await callGroqAPI(inputMessage, isVoiceMode, updatedMessages);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      isUser: false,
      timestamp: new Date(),
      isVoice: isVoiceMode
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);

    // Speak the AI response if in voice mode
    if (isVoiceMode && voiceEnabled) {
      speakText(aiResponse);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: "Hi there! I'm Aurora, your emotional support companion. This is a safe space where you can share whatever is on your mind. I'm here to listen without judgment and provide support. How are you feeling today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const quickResponses = [
    "I'm feeling overwhelmed with school",
    "I'm struggling with anxiety",
    "I need to talk about my stress",
    "I'm feeling lonely",
    "I'm having a bad day"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="aurora-text flex items-center">
                <MessageCircle className="mr-2 h-6 w-6" />
                AI Vent Space
                {isVoiceMode && (
                  <Badge className="ml-3 bg-aurora-purple text-white">
                    <Phone className="mr-1 h-3 w-3" />
                    Voice Mode
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-300">
                A safe space to express yourself with Aurora, your empathetic AI companion
              </CardDescription>
            </div>

            {/* Voice Controls */}
            {speechSupported && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`glass-effect ${voiceEnabled ? 'text-aurora-electric-blue' : 'text-gray-400'}`}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isVoiceMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleVoiceMode}
                  className={isVoiceMode ? "bg-aurora-purple hover:bg-aurora-pink" : "glass-effect"}
                >
                  {isVoiceMode ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 border border-gray-700 rounded-lg bg-gray-800/30">
              <div ref={scrollAreaRef} className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-aurora-electric-blue text-white'
                          : 'glass-effect text-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.isVoice && (
                          <div className="flex-shrink-0 mt-1">
                            <Mic className="h-3 w-3 text-aurora-purple" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            {!message.isUser && message.isVoice && voiceEnabled && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakText(message.content)}
                                className="h-6 w-6 p-0 text-aurora-electric-blue hover:text-aurora-purple"
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass-effect p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          {isVoiceMode ? "Aurora is thinking..." : "Aurora is typing..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {isSpeaking && (
                  <div className="flex justify-start">
                    <div className="glass-effect p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 animate-pulse text-aurora-purple" />
                        <span className="text-sm">Aurora is speaking...</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={stopSpeaking}
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        >
                          <VolumeX className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Responses */}
            {messages.length <= 1 && (
              <div className="my-4">
                <p className="text-sm text-gray-400 mb-2">Quick start:</p>
                <div className="flex flex-wrap gap-2">
                  {quickResponses.map((response) => (
                    <Button
                      key={response}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(response)}
                      className="glass-effect text-white hover:bg-white/20 text-xs"
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="space-y-3 mt-4">
              {/* Voice Mode Controls */}
              {isVoiceMode && speechSupported && (
                <div className="flex items-center justify-center gap-4 p-4 bg-aurora-purple/10 rounded-lg border border-aurora-purple/30">
                  <Button
                    variant={isListening ? "default" : "outline"}
                    size="lg"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isTyping || isSpeaking}
                    className={isListening
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "glass-effect hover:bg-aurora-purple/20"
                    }
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-gray-300">
                      {isListening
                        ? "Listening... Speak now"
                        : "Click the microphone to start talking"
                      }
                    </p>
                    {isListening && (
                      <p className="text-xs text-aurora-electric-blue mt-1">
                        Click again to stop listening
                      </p>
                    )}
                  </div>
                  {isSpeaking && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopSpeaking}
                      className="glass-effect text-red-400 hover:text-red-300"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* Text Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={isVoiceMode
                      ? "Voice message will appear here... or type manually"
                      : "Share what's on your mind... I'm here to listen."
                    }
                    className="min-h-[60px] max-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none pr-12"
                    disabled={isTyping || isListening}
                  />
                  {speechSupported && !isVoiceMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startListening}
                      disabled={isTyping || isListening}
                      className="absolute right-2 top-2 h-8 w-8 p-0 text-aurora-electric-blue hover:text-aurora-purple"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => sendMessage(isVoiceMode)}
                  disabled={!inputMessage.trim() || isTyping || isListening}
                  className="bg-aurora-purple hover:bg-aurora-pink self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Resources */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-aurora-pink flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Remember
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• This is a safe space for you to express yourself freely</p>
            <p>• I'm here to listen and support, not to judge</p>
            <p>• Use voice mode for a more natural, conversational experience</p>
            <p>• You can switch between text and voice at any time</p>
            <p>• If you're experiencing a crisis, please reach out to a counselor or crisis hotline</p>
            <p>• Your mental health matters, and seeking help is a sign of strength</p>
          </div>

          {!speechSupported && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-300">
                Voice features are not supported in your current browser. For the best experience, try using Chrome, Firefox, or Safari.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVentSpace;
