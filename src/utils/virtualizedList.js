import React from "react";
import { SafeAreaView, FlatList } from "react-native";

const VirtualizedList = ({ style, children }) => {
  return (
    <SafeAreaView style={style}>
      <FlatList
        style={style}
        data={[]}
        keyExtractor={() => "key"}
        renderItem={null}
        ListHeaderComponent={<>{children}</>}
      />
    </SafeAreaView>
  );
};

export default VirtualizedList;
