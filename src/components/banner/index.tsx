import { Image, StyleSheet, TouchableOpacity } from "react-native";

interface BannerProps {
  imageUrl?: string;
  onOpenBanner: () => void;
}

const Banner = ({ imageUrl, onOpenBanner }: BannerProps) => {
  return (
    <TouchableOpacity style={styles.banner} onPress={onOpenBanner}>
      <Image
        source={imageUrl ? { uri: imageUrl } : require("../../assets/images/img_empty_quiz.png")}
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
