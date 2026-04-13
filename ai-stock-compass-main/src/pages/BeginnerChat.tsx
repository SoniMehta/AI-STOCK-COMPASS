import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, BookOpen, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { beginnerGuide } from "@/lib/api";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  relatedTopics?: string[];
}

const suggestedQuestions = [
  "What is a stock and how does it work?",
  "How do I start investing as a beginner?",
  "What's the difference between stocks and bonds?",
  "How do I read a stock chart?",
  "What is diversification and why is it important?",
  "What are the risks of investing in stocks?",
];

export default function BeginnerChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I'm your AI stock market guide. Ask me anything about investing, stocks, or the market. I'm here to help beginners learn!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await beginnerGuide.chat(input);

      const aiMessage: Message = {
        role: "ai",
        content: response.message,
        timestamp: new Date(),
        relatedTopics: response.related_topics,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Beginner's Guide Chat</h1>
          </div>
          <p className="text-muted-foreground">
            Learn about stocks and investing with AI-powered guidance
          </p>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Try asking:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Chat Messages */}
        <Card className="h-[500px] flex flex-col">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "ai" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      {message.relatedTopics && message.relatedTopics.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Related Topics:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {message.relatedTopics.map((topic, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded bg-background/50 cursor-pointer hover:bg-background"
                                onClick={() => handleSuggestedQuestion(`Tell me about ${topic}`)}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about investing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="gradient-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 bg-secondary/50">
          <p className="text-sm text-muted-foreground text-center">
            💡 This AI assistant provides educational information only and should not be considered as financial advice.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
