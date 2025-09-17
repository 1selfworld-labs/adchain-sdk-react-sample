import { Image, StyleSheet, TouchableOpacity } from "react-native";
import AdchainSdk from "../../index";
import { BannerInfo } from "../../interface/banner";

interface BannerProps {
  bannerInfo: BannerInfo;
}

const Banner = ({ bannerInfo }: BannerProps) => {
  const handleBannerPress = () => {
    if (bannerInfo.linkType === "internal") {
      console.log("Internal link:", bannerInfo.internalLinkUrl);
      AdchainSdk.openOfferwall();
    } else {
      console.log("External link:", bannerInfo.externalLinkUrl);
      AdchainSdk.openOfferwall();
    }
  };

  return (
    <TouchableOpacity style={styles.banner} onPress={handleBannerPress}>
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
