import { library } from "@fortawesome/fontawesome-svg-core";
import { faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
// tslint:disable-next-line: max-line-length
import { faCalendarWeek, faChartArea, faChartPie, faFileContract, faFileUpload, faLockOpen, faStore, faTable, faTag, faTrashAlt, faFileSignature, faSortDown, faUnlink, faForward, faCheckCircle, faStamp, faHome, faLeaf, faSackDollar, faReceipt, faCircleChevronRight, faCircleChevronLeft, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
// tslint:disable-next-line: max-line-length
import { faAddressCard, faCalendar, faCalendarAlt, faCalendarDay, faCaretDown, faCaretRight, faCaretSquareRight, faClipboard, faClone, faCloudUploadAlt, faCoffee, faCompress, faEllipsisH, faEllipsisV, faEnvelope, faEnvelopeOpenText, faEnvelopeSquare, faEyeSlash, faFileCsv, faFileExcel, faFileExport, faFileImport, faFileInvoice, faFilePdf, faHistory, faPaperclip, faParking, faPhoneAlt, faPlusSquare, faQuestionCircle, faShareSquare, faSort, faUserTimes } from "@fortawesome/free-solid-svg-icons";
import { faFastBackward, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { faCaretSquareDown,faArrowCircleLeft,faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faFastForward } from "@fortawesome/free-solid-svg-icons";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faLandmark } from "@fortawesome/free-solid-svg-icons";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faBatteryThreeQuarters } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { faBroom } from "@fortawesome/free-solid-svg-icons";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { faMouse } from "@fortawesome/free-solid-svg-icons";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { faUserCog } from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faCity } from "@fortawesome/free-solid-svg-icons";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { faStreetView } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { faThList } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { faHouseDamage } from "@fortawesome/free-solid-svg-icons";
import { faCog, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faBinoculars, faCircleNotch, faDesktop, faRedoAlt, faSmile, faSyncAlt, faTasks, faUserTie, faPager, faArrowCircleUp, faChalkboard, faShare, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import {faReply} from "@fortawesome/free-solid-svg-icons";

const shareButtonsIcons: any = [
    faBox, faMapMarker, faKey, faGraduationCap, faBriefcase,
    faLanguage, faCoffee, faFilter, faCamera, faCheck, faSave,
    faTimes, faTrash, faSpinner, faComment, faEdit, faPlus, faPen,
    faLandmark, faSmile, faArchive, faLock, faThumbsUp, faEye,
    faUpload, faPause, faArrowRight, faArrowLeft, faBars, faThLarge,
    faMinus, faUser, faClock, faBatteryThreeQuarters, faSquare,
    faSearch, faSync, faTasks, faInfoCircle, faPaperPlane, faRedo,
    faCopy, faArrowUp, faArrowDown, faWrench, faExternalLinkAlt,
    faUndo, faCreditCard, faMoneyBillAlt, faUtensils, faPlay, faLockOpen,
    faExclamationTriangle, faBookmark, faCogs, faAngleDoubleLeft,
    faChevronLeft, faAngleDoubleRight, faChevronRight, faChevronUp, faChevronDown, faFolder, faFileSignature,
    faAngleLeft, faAngleRight, faSignal, faBug, faGripLinesVertical,
    faThumbsDown, faWindowClose, faTimesCircle, faCircle, faFastBackward,faPager,
    faCaretSquareDown, faEnvelopeOpenText, faEnvelope, faFastForward,
    faCartArrowDown, faArrowsAlt, faPlusCircle, faMinusCircle, faShareSquare,
    faFastBackward, faFastForward, faUsers, faPrint, faDownload, faClipboard,
    faCaretDown, faCaretRight, faPlusSquare, faChartLine, faSort, faCaretSquareRight,
    faUserTimes, faEyeSlash, faCalendar, faCalendarAlt, faCalendarDay, faUserPlus,
    faChartBar, faCompress, faBroom, faSlidersH, faFilePdf, faFileExcel, faEllipsisH,
    faImage, faEnvelopeSquare, faFileImport, faFileExport, faFileCsv, faQuestionCircle,
    faFile, faDollarSign, faCity, faBuilding, faStickyNote, faStreetView, faFlag,
    faAddressCard, faGlobe, faKeyboard, faMouse, faEnvelopeOpen, faPhoneAlt, faSmile,
    faFilePdf, faFileExcel, faImage, faThumbtack, faUserCog, faFileInvoice, faBullseye,
    faUserFriends, faPuzzlePiece, faCodeBranch, faThList, faFileAlt, faChartLine,
    faHistory, faClone, faEllipsisV, faTwitter, faInstagram, faLinkedin, faYoutube,
    faFacebookF, faDesktop, faRedoAlt, faParking, faTag, faTasks, faCircleNotch, faSyncAlt,
    faFrown, faChartPie, faTable, faChartArea, faStore, faHouseDamage, faCloudUploadAlt,faFileContract,faShare,faUserCheck,faReply,
    faBinoculars, faCog, faPaperclip, faCalendarWeek, faTrashAlt, faFileUpload, faPlusCircle,faSortDown,faUserTie,faArrowCircleUp,faChalkboard,faFileDownload,
    faUnlink,faCheckCircle,faStamp, faHome, faLeaf,faArrowCircleLeft,faArrowCircleRight,faSackDollar, faClipboard,faReceipt,faCircleChevronRight,faCircleChevronLeft]

library.add(...shareButtonsIcons);
