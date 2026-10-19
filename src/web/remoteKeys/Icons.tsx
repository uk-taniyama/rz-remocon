import type { RemixiconComponentType } from "@remixicon/react";

import {
  RiAddLine,
  RiAmazonLine,
  RiArrowDownSFill,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiArrowLeftSFill,
  RiArrowRightSFill,
  RiArrowUpSFill,
  RiArrowUpSLine,
  RiCheckboxMultipleBlankFill,
  RiCircleFill,
  RiClosedCaptioningLine,
  RiCloseLine,
  RiForward30Line,
  RiForwardEndFill,
  RiHashtag,
  RiHomeLine,
  RiInformationLine,
  RiInputMethodLine,
  RiListUnordered,
  RiMenuLine,
  RiNetflixLine,
  RiPauseMiniFill,
  RiPlayFill,
  RiRecordCircleLine,
  RiReplay10Line,
  RiRewindFill,
  RiRewindStartFill,
  RiSettingsLine,
  RiShutDownLine,
  RiSkipDownLine,
  RiSkipLeftLine,
  RiSkipRightLine,
  RiSkipUpLine,
  RiSpeedFill,
  RiStopFill,
  RiSubtractLine,
  RiTimerLine,
  RiTv2Line,
  RiVolumeMuteLine,
  RiVolumeUpLine,
  RiYoutubeLine,
} from "@remixicon/react";
import type { RemoteKeyName } from "../../api";

export const REMOTE_ICONS: Partial<
  Record<RemoteKeyName, RemixiconComponentType>
> = {
  // Power
  powerOn: RiShutDownLine,
  powerOff: RiShutDownLine,
  powerToggle: RiShutDownLine,
  powerSleep: RiTimerLine,

  // Volume
  volMute: RiVolumeMuteLine,
  volUp: RiAddLine,
  volDown: RiSubtractLine,

  // Channel
  chUp: RiArrowUpSLine,
  chDown: RiArrowDownSLine,
  chToggle: RiTv2Line,

  // Input
  inputToggle: RiInputMethodLine,

  // Channel information
  pgGuide: RiInformationLine,
  pgAudio: RiVolumeUpLine,
  pgDisplay: RiInformationLine,
  chNumber: RiHashtag,
  pgInfo: RiInformationLine,

  // Cursor
  keyUp: RiArrowUpSFill,
  keyDown: RiArrowDownSFill,
  keyLeft: RiArrowLeftSFill,
  keyRight: RiArrowRightSFill,
  keyEnter: RiCircleFill,
  keyBack: RiArrowGoBackLine,
  keyExit: RiCloseLine,

  // Page
  keyUp2: RiSkipUpLine,
  keyDown2: RiSkipDownLine,
  keyLeft2: RiSkipLeftLine,
  keyRight2: RiSkipRightLine,

  // Media
  mediaSceneList: RiListUnordered,
  mediaSubTitle: RiClosedCaptioningLine,
  mediaRewind: RiRewindFill,
  mediaPlay: RiPlayFill,
  mediaFastForward: RiSpeedFill,
  mediaPrev: RiRewindStartFill,
  mediaStop: RiStopFill,
  mediaPause: RiPauseMiniFill,
  mediaNext: RiForwardEndFill,
  mediaBack10s: RiReplay10Line,
  mediaSkip30s: RiForward30Line,

  // Apps
  appYoutube: RiYoutubeLine,
  appAmazonPrime: RiAmazonLine,
  appNetflix: RiNetflixLine,

  // Other
  keyHome: RiHomeLine,
  etcSetting: RiSettingsLine,
  etcSubMenu: RiMenuLine,
  mediaRecord: RiRecordCircleLine,
  etcDualScreen: RiCheckboxMultipleBlankFill,
};
