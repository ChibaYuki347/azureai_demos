interface SubSidebarLink {
  route: string;
  label: string;
}

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
  subSidebarLinks?: SubSidebarLink[];
}
