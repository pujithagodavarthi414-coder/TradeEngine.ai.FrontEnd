import { library } from "@fortawesome/fontawesome-svg-core";
import { 
    faTimes,
    faSave,
    faPlus,
    faEdit,
    faCheck,
    faInfoCircle
} from "@fortawesome/free-solid-svg-icons";

const shareButtonsIcons = [
    faTimes,
    faSave,
    faPlus,
    faEdit,
    faCheck,
    faInfoCircle
];

library.add(...shareButtonsIcons);
