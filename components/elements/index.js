import Vue from "vue";

/**
 * import all the components that needs to be loaded as global
 */
import FleetToggle from "./FleetToggle.vue";
import FleetProfileUploader from "./FleetProfileUploader.vue";
import FleetColorPicker from "./FleetColorPicker.vue";
import FleetSwitch from "./FleetSwitch.vue";
import FleetAxle from "./axle/FleetAxle.vue";
import StatsCard from "./StatsCard.vue";
import NamePhoto from "./NamePhoto.vue";
import ProfileChip from "./ProfileChip.vue";
import FleetTab from "./FleetTab.vue";
import FleetImageCard from "./FleetImageCard.vue";
import FleetEditCard from "./editCard/FleetEditCard.vue";
import FleetTag from "./FleetTag.vue";
import FleetConfirmationPopup from "./FleetConfirmationPopup.vue";
import FleetActionDropDown from "./FleetActionDropDown.vue";
import FleetTimer from "./FleetTimer.vue";
import FleetDateDisplay from "./FleetDateDisplay.vue";
import FleetTimeDisplay from "./FleetTimeDisplay.vue";
import FleetPlayer from "./FleetPlayer.vue";
import FleetTimePicker from "./FleetTimePicker.vue";
import FleetDatePicker from "./FleetDatePicker.vue";
import FleetTelInput from "./FleetTelInput.vue";
import FleetSeating from "./seating/FleetSeating.vue";
import FleetStatus from './FleetStatus.vue'
import FleetDuration from './FleetDuration.vue'
import FleetLocaleDisplay from './FleetLocaleDisplay.vue'
import FuelGuage from './FuelGuage.vue'
import EmiratesIdDisplay from './EmiratesIdDisplay.vue'
import FleetLangBadge from './FleetLangBadge.vue'
import FleetProfileBadge from './FleetProfileBadge.vue'
import FleetProfile from './FleetProfile.vue'
import FleetNamePhoto from './FleetNamePhoto.vue'
import {
  AnimatedIcon as FleetAnimatedIcon,
  AnimatedIconWrapper as FleetAnimatedIconWrapper,
} from './AnimatedIcon/index'
import {
  DetailedDirectionalItem as FleetDetailedDirectionalItem,
  DirectionalItem as FleetDirectionalItem,
} from './Directional/index'
import FleetContact from './FleetContact.vue'
import FleetListingCards from './FleetListingCards.vue'
import FleetShadowCard from './FleetShadowCard.vue'
import FleetChipIcon from './FleetChipIcon.vue'
import FleetPlateNumber from './FleetPlateNumber.vue'
import FleetAvatar from './FleetAvatar.vue'
import FleetBasicInfoCard from './FleetBasicInfoCard.vue'
import FleetRouteMap from './FleetRouteMap.vue'
import FleetLabelItem from './FleetLabelItem.vue'
import FleetIconCard from './FleetIconCard.vue'
import FleetNotes from './notes/Main.vue'
import FleetIconLabel from './FleetIconLabel.vue'
import FleetProfileBadgeAdvanced from './FleetProfileBadgeAdvanced.vue'
import FleetMailDisplay from './MailDisplay.vue'
import FleetChatDisplay from './ChatDisplay.vue'
import FleetPhoneDisplay from './PhoneDisplay.vue'

// specify the components to an object for quick iteration
const exports = {
  FleetToggle,
  FleetProfileUploader,
  FleetColorPicker,
  FleetSwitch,
  FleetAxle,
  StatsCard,
  NamePhoto,
  ProfileChip,
  FleetTab,
  FleetImageCard,
  FleetEditCard,
  FleetTag,
  FleetConfirmationPopup,
  FleetActionDropDown,
  FleetTimer,
  FleetDateDisplay,
  FleetTimeDisplay,
  FleetPlayer,
  FleetTimePicker,
  FleetDatePicker,
  FleetTelInput,
  FleetSeating,
  FleetStatus,
  FleetDuration,
  FleetLocaleDisplay,
  FuelGuage,
  EmiratesIdDisplay,
  FleetLangBadge,
  FleetProfileBadge,
  FleetAnimatedIcon,
  FleetAnimatedIconWrapper,
  FleetContact,
  FleetListingCards,
  FleetShadowCard,
  FleetChipIcon,
  FleetPlateNumber,
  FleetNamePhoto,
  FleetProfile,
  FleetAvatar,
  FleetBasicInfoCard,
  FleetDetailedDirectionalItem,
  FleetDirectionalItem,
  FleetRouteMap,
  FleetLabelItem,
  FleetIconCard,
  FleetNotes,
  FleetIconLabel,
  FleetProfileBadgeAdvanced,
  FleetMailDisplay,
  FleetChatDisplay,
  FleetPhoneDisplay,
};

// loop over each components
for (let key in exports) {
  // get component config
  const componentConfig = exports[key];

  // register component globally
  Vue.component(key, componentConfig.default || componentConfig);
}
