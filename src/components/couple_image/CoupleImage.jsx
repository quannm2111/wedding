import useMediaQuery from "../../hooks/useMediaQuery";
import DesktopView from "./DesktopView";
import MobieView from "./MobieView";

const CoupleImage = () => {
  const isMobile = useMediaQuery("(max-width: 727px)");
  return isMobile ? <MobieView /> : <DesktopView />;
};

export default CoupleImage;
