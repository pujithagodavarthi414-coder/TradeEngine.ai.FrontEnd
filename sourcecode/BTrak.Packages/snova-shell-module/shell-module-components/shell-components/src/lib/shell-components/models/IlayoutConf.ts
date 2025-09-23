export interface ILayoutConf {
    navigationPos?: string; // side, top
    sidebarStyle?: string; // full, compact, closed
    dir?: string; // ltr, rtl
    layoutInTransition?: boolean;
    isMobile?: boolean;
    useBreadcrumb?: boolean;
    breadcrumb?: string; // simple, title
    topbarFixed?: boolean;
}