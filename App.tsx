import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import TikTokMessages from './TikTokMessages';
import { useEffect, useRef, useState } from 'react';
import { ChatItem, generateNewMessage } from './chat';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const chatSpeed = {
  slow:[1000,500],
  medium:[500,250],
  fast:[250,250],
  "insane 🚀": [50,100],
}

const renderItem = ({ item, index }: { item: ChatItem; index: number }) => (
  <View style={[styles.messageContainer]}>
    <View style={styles.userContainer}>
      <Image
        style={styles.avatar}
        source={{ uri: item.user.avatar }}
      />
      <Text style={styles.userName}>{item.user.name}</Text>
    </View>
    <Text style={styles.messageText}>{item.description}</Text>
  </View>
);

export default function App() {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [speed, setSpeed] = useState<keyof typeof chatSpeed>('slow');
  const generateData = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    const selectedSpeed = chatSpeed[speed];
    const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];
    timeout.current = setTimeout(() => {
      setMessages(prev => [generateNewMessage(),...prev]);
      generateData();
    }, timer);
  }

  useEffect(() => {
    generateData();
  }, [speed])
  return (
    <View style={styles.container}>
      <TikTokMessages
        data={messages}
        renderItem={renderItem}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={5}
      />
      <View
      style={{
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <SegmentedControl
        style={{
          width: 300,
        }}
        values={Object.keys(chatSpeed)}
          selectedIndex={Object.keys(chatSpeed).indexOf(speed)}
          onChange={(event)=>{
            setSpeed(event.nativeEvent.value as keyof typeof chatSpeed)
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    gap: 4,
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 12,
  },
  userContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    width: 16,
    aspectRatio: 1,
    borderRadius: 8,
  },
  userName: {
    fontSize: 12,
    color: '#666'
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#f0f0f0'
  }
});
