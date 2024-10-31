import { View, Text, FlatListProps, ListRenderItem, FlatList } from "react-native";
import Animated, { FadeInDown, interpolate, LinearTransition, useAnimatedStyle, useDerivedValue, withSpring } from "react-native-reanimated";
import { MAX_MESSAGES } from "./chat";

type TikTokMessagesProps<T> = FlatListProps<T> & {
  renderItem: ListRenderItem<T>
}

function AnimatedItem({ children, index }: { children: React.ReactNode, index: number }) {
  const newIndex = useDerivedValue(() => {
    return withSpring(index, { damping: 80, stiffness: 200 })
  })
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(newIndex.value, [0, 1], [1, 1-1/MAX_MESSAGES])
    }
  })
  return (
    <Animated.View entering={FadeInDown.springify().damping(80).stiffness(200).withInitialValues(
        {
            opacity:0,
            transform:[{translateY:100}]
            })}>
<Animated.View style={stylez}>
      {children}
    </Animated.View>
    </Animated.View>
  )
}

export default function TikTokMessages<T>({ renderItem, ...rest }: TikTokMessagesProps<T>) {
  return (
    <Animated.FlatList
      {...rest}
      inverted
      itemLayoutAnimation={LinearTransition.springify().damping(80).stiffness(200)}
      renderItem={props => {
        return (
          <AnimatedItem index={props.index}>
            {renderItem(props)}
          </AnimatedItem>
        )
      }}
    />
  )
}
