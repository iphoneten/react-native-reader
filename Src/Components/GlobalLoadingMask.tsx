import { FC } from "react";
import useUIStore from "../Store/UIStore";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const GlobalLoadingMask: FC = () => {
  const { showLoading } = useUIStore();
  if (!showLoading) return null;
  return (
    <View style={styles.mask}>
      <View style={styles.view}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  view: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10
  }
})

export default GlobalLoadingMask;