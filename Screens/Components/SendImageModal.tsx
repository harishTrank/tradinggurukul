import React from "react";
import {
  View,
  Text,
  Modal,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import theme from "../../utils/theme";
import { getImage, takePicture } from "../../utils/extra/ImagePicker";

const { width, height }: any = Dimensions.get("window");
const SendImageModal = ({
  sendImageOption,
  setSendImageOption,
  setSendImageMessage,
}: any) => {
  return (
    <Modal animationType="fade" transparent={true} visible={sendImageOption}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            alignItems: "flex-end",
            width: "85%",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            backgroundColor: "#FFF",
          }}
        >
          <TouchableOpacity onPress={() => setSendImageOption(false)}>
            <Text
              style={{
                ...theme.font.fontSemiBold,
                fontSize: 18,
                color: "#D1D0D0",
                paddingRight: 15,
                paddingTop: 10,
              }}
            >
              X
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            paddingTop: 10,
            paddingHorizontal: 20,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-end",
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{
              width: width * 0.355,
              height: width * 0.4,
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 15,
              marginBottom: 10,
            }}
            onPress={() => {
              takePicture(setSendImageMessage);
              setSendImageOption(false);
            }}
          >
            <View
              style={{
                height: width * 0.2,
                width: width * 0.2,
                backgroundColor: "#D1D0D0",
                borderRadius: width * 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../../../assets/Chat/camera-icon.png")}
                style={{
                  height: height * 0.05,
                  width: height * 0.05,
                  resizeMode: "contain",
                  tintColor: "#574C4D",
                }}
              />
            </View>
            <Text
              style={{
                ...theme.font.fontRegular,
                marginTop: 10,
              }}
            >
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: width * 0.355,
              height: width * 0.4,
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 15,
              marginBottom: 10,
            }}
            onPress={() => {
              getImage(setSendImageMessage);
              setSendImageOption(false);
            }}
          >
            <View
              style={{
                height: width * 0.2,
                width: width * 0.2,
                backgroundColor: "#D1D0D0",
                borderRadius: width * 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../../../assets/Chat/galleryIcon.png")}
                style={{
                  height: height * 0.05,
                  width: height * 0.05,
                  resizeMode: "contain",
                }}
              />
            </View>
            <Text
              style={{
                ...theme.font.fontRegular,
                marginTop: 10,
              }}
            >
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SendImageModal;
