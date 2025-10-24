import { Image, StyleSheet, TouchableOpacity } from "react-native";
import AdchainSdk from "@1selfworld/adchain-sdk-react-native";
import { BannerInfo } from "../../interface/banner";

interface BannerProps {
  bannerInfo: BannerInfo;
  placementId?: string;
}

const Banner = ({ bannerInfo, placementId }: BannerProps) => {
  const handleBannerPress = () => {
    if (bannerInfo.linkType === "internal") {
      AdchainSdk.openOfferwallWithUrl(bannerInfo.internalLinkUrl, placementId);
    } else {
      AdchainSdk.openExternalBrowser(bannerInfo.externalLinkUrl, placementId);
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
