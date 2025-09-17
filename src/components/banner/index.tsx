import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { BannerInfo } from "../../interface/banner";

interface BannerProps {
  bannerInfo: BannerInfo;
}

const Banner = ({ bannerInfo }: BannerProps) => {
  return (
    <TouchableOpacity style={styles.banner} onPress={() => {}}>
      <Image
        source={bannerInfo?.imageUrl ? { uri: bannerInfo.imageUrl } : require("../../assets/images/img_empty_quiz.png")}
        style={styles.bannerImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    aspectRatio: 327 / 80,
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
});

export default Banner;
