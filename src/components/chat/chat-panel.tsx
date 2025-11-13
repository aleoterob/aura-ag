"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Loader } from "@/components/ai-elements/loader";
import { useChat } from "@ai-sdk/react";
import { useChat as useSupabaseChat } from "@/hooks/use-chat";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useRef, useState } from "react";
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from "lucide-react";

const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];

export const ChatPanel = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);

  const { messages, sendMessage, status, regenerate } = useChat();

  const { currentConversation, createConversation, addMessage } =
    useSupabaseChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const savedMessageIdsRef = useRef<Set<string>>(new Set());
  const t = useTranslations();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    savedMessageIdsRef.current.clear();
  }, [currentConversation?.id]);

  useEffect(() => {
    if (!currentConversation) {
      return;
    }

    const saveMessages = async () => {
      for (const message of messages) {
        const messageId = message.id;
        if (!messageId || savedMessageIdsRef.current.has(messageId)) {
          continue;
        }

        if (!(message.role === "user" || message.role === "assistant")) {
          continue;
        }

        const textPart =
          message.parts?.find((part) => part.type === "text")?.text || "";

        if (message.role === "assistant") {
          const isLatestMessage = messageId === messages.at(-1)?.id;
          if (status === "streaming" && isLatestMessage) {
            continue;
          }
          if (!textPart) {
            continue;
          }
        }

        try {
          await addMessage(
            currentConversation.id,
            message.role,
            textPart,
            { parts: message.parts, messageId },
            message.role === "assistant" ? model : undefined
          );
          savedMessageIdsRef.current.add(messageId);
        } catch (error) {
          if (
            !(error instanceof Error) ||
            !error.message?.includes("duplicate")
          ) {
            console.error("Error saving message:", error);
          } else {
            savedMessageIdsRef.current.add(messageId);
          }
        }
      }
    };

    void saveMessages();
  }, [messages, currentConversation, addMessage, model, status]);

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    let conversationToUse = currentConversation;
    if (!conversationToUse && message.text) {
      try {
        conversationToUse = await createConversation(
          message.text.slice(0, 50) + (message.text.length > 50 ? "..." : ""),
          model
        );
      } catch (error) {
        console.error("Error creating conversation:", error);
        return;
      }
    }

    if (conversationToUse && message.text) {
      try {
        await addMessage(
          conversationToUse.id,
          "user",
          message.text,
          message.files ? { files: message.files } : undefined
        );
      } catch (error) {
        console.error("Error saving user message:", error);
      }
    }

    sendMessage(
      {
        text: message.text || t("chat.sentWithAttachments"),
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
        },
      }
    );
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" &&
                message.parts.filter((part) => part.type === "source-url")
                  .length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === "source-url"
                        ).length
                      }
                    />
                    {message.parts
                      .filter((part) => part.type === "source-url")
                      .map((part, i) => (
                        <SourcesContent key={`${message.id}-${i}`}>
                          <Source
                            key={`${message.id}-${i}`}
                            href={part.url}
                            title={part.url}
                          />
                        </SourcesContent>
                      ))}
                  </Sources>
                )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <MessageContent>{part.text}</MessageContent>
                          </MessageContent>
                        </Message>
                        {message.role === "assistant" &&
                          i === messages.length - 1 && (
                            <MessageActions className="mt-2">
                              <MessageAction
                                onClick={() => regenerate()}
                                label={t("chat.retry")}
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label={t("chat.copy")}
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Fragment>
                    );
                  case "reasoning":
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className="w-full"
                        isStreaming={
                          status === "streaming" &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
          {status === "submitted" && <Loader />}
          <div ref={messagesEndRef} />
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="w-full px-4 mb-2">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>{t("chat.search")}</span>
              </PromptInputButton>
              <PromptInputSelect
                onValueChange={(value: string) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((modelOption) => (
                    <PromptInputSelectItem
                      key={modelOption.value}
                      value={modelOption.value}
                    >
                      {modelOption.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatPanel;
